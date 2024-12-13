declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Process {
      cwd?: () => string;
    }
  }
}
interface ProcessEnv {
  SHOPIFY_ACCELERATE_DELETE_EXTERNAL_LAYOUTS?: string;
  SHOPIFY_ACCELERATE_DELETE_EXTERNAL_SECTIONS?: string;
  SHOPIFY_ACCELERATE_DELETE_EXTERNAL_SNIPPETS?: string;
  SHOPIFY_ACCELERATE_DELETE_EXTERNAL_BLOCKS?: string;
  SHOPIFY_ACCELERATE_DELETE_EXTERNAL_ASSETS?: string;
  SHOPIFY_ACCELERATE_ROOT?: string;
  SHOPIFY_ACCELERATE_SECTIONS?: string;
  SHOPIFY_ACCELERATE_BLOCKS?: string;
  SHOPIFY_ACCELERATE_CLASSIC_BLOCKS?: string;
  SHOPIFY_ACCELERATE_TYPES?: string;
}
