import type { APIRoute } from 'astro';
import {
  getToken,
  vendureQuery,
  buildResponse,
  ORDER_FRAGMENT,
} from '@/lib/vendure-api';
import { isRateLimited } from '@/lib/rate-limit';

const GET_ACTIVE_ORDER = `query { activeOrder { ${ORDER_FRAGMENT} } }`;

const ADD_TO_CART = `mutation AddToCart($variantId: ID!, $quantity: Int!) {
  addItemToOrder(productVariantId: $variantId, quantity: $quantity) {
    __typename
    ... on Order { ${ORDER_FRAGMENT} }
    ... on ErrorResult { errorCode message }
  }
}`;

export const GET: APIRoute = async ({ request }) => {
  try {
    const token = getToken(request);
    const { data, newToken } = await vendureQuery(GET_ACTIVE_ORDER, {}, token);
    return buildResponse({ order: data?.activeOrder || null }, newToken);
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack?.split('\n').slice(0, 3) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (isRateLimited(ip, 'cart-add', 30, 60_000)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
  }
  const token = getToken(request);
  let body: any;
  try {
    body = await request.json();
  } catch {
    return buildResponse({ order: null, error: 'Invalid request body' });
  }
  const { variantId, quantity = 1 } = body;

  // H5: Input validation
  if (!variantId || typeof variantId !== 'string') {
    return buildResponse({ order: null, error: 'Invalid variantId' });
  }
  if (variantId.length > 50) {
    return buildResponse({ order: null, error: 'Invalid variantId' });
  }
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
    return buildResponse({ order: null, error: 'Quantity must be between 1 and 99' });
  }

  try {
    const { data, newToken } = await vendureQuery(
      ADD_TO_CART,
      { variantId, quantity: qty },
      token,
    );

    const result = data?.addItemToOrder;
    if (result?.__typename === 'Order') {
      return buildResponse({ order: result }, newToken);
    }
    return buildResponse({ order: null, error: result?.message }, newToken);
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
