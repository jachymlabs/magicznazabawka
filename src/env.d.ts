/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VENDURE_API_URL: string;
  readonly VENDURE_CHANNEL_TOKEN: string;
  readonly PUBLIC_META_PIXEL_ID: string;
  readonly META_CAPI_ACCESS_TOKEN: string;
  readonly META_DATASET_ID: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_INPOST_GEOWIDGET_TOKEN: string;
  readonly DATABASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
