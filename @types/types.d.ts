declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv {
      SHOPIFY_ACCELERATE_DELETE_EXTERNAL_LAYOUTS?: string;
      SHOPIFY_ACCELERATE_DELETE_EXTERNAL_SECTIONS?: string;
      SHOPIFY_ACCELERATE_DELETE_EXTERNAL_SNIPPETS?: string;
      SHOPIFY_ACCELERATE_DELETE_EXTERNAL_BLOCKS?: string;
      SHOPIFY_ACCELERATE_DELETE_EXTERNAL_ASSETS?: string;
      SHOPIFY_ACCELERATE_DISABLED_LOCALES?: string;
      SHOPIFY_ACCELERATE_DISABLE_THEME_BLOCKS?: string;
    }
    interface Process {
      cwd?: () => string;
    }
  }
}
