import { _Color_liquid, _Collection_liquid, _BlockTag, _Image_liquid, _Product_liquid, _Linklist_liquid, _Video_liquid, _Article_liquid, _Blog_liquid, _Page_liquid, _Font_liquid, _Font_options } from "./shopify";
import { ThemeBlocks } from "./blocks";
import { ClassicThemeBlocks } from "./classic-blocks";

export type MainCartSection = {
  blocks: MainCartBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing:
      | "px-container-xs"
      | "px-container-sm"
      | "px-container-md"
      | "px-container-lg"
      | "px-container-gutter"
      | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "development";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_cart";
};

export type MainCartBlocks =
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "_cart_checkout_button" }>
  | Extract<ThemeBlocks, { type: "_cart_discount_details" }>
  | Extract<ThemeBlocks, { type: "_cart_dynamic_richtext" }>
  | Extract<ThemeBlocks, { type: "_cart_gift_with_purchase" }>
  | Extract<ThemeBlocks, { type: "_cart_note" }>
  | Extract<ThemeBlocks, { type: "_cart_progress_bar" }>
  | Extract<ThemeBlocks, { type: "_cart_progress_bar_stacked" }>
  | Extract<ThemeBlocks, { type: "_cart_total" }>
  | Extract<ThemeBlocks, { type: "_cart_dynamic_product_cards" }>
  | Extract<ThemeBlocks, { type: "_cart_discount_code_input" }>
  | Extract<ThemeBlocks, { type: "_main_cart__collapsible" }>
  | Extract<ThemeBlocks, { type: "_main_cart__container" }>
  | Extract<ThemeBlocks, { type: "_main_cart__line_items" }>;

export type ModalCartDrawerSection = {
  blocks: ModalCartDrawerBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing:
      | "px-container-xs"
      | "px-container-sm"
      | "px-container-md"
      | "px-container-lg"
      | "px-container-gutter"
      | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "development";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_modal_cart_drawer";
};

export type ModalCartDrawerBlocks =
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "collapsible" }>
  | Extract<ThemeBlocks, { type: "_product_cards" }>
  | Extract<ThemeBlocks, { type: "_collection_cards" }>
  | Extract<ThemeBlocks, { type: "_scrollbar" }>
  | Extract<ThemeBlocks, { type: "_cart_checkout_button" }>
  | Extract<ThemeBlocks, { type: "_cart_discount_details" }>
  | Extract<ThemeBlocks, { type: "_cart_dynamic_richtext" }>
  | Extract<ThemeBlocks, { type: "_cart_gift_with_purchase" }>
  | Extract<ThemeBlocks, { type: "_cart_line_items" }>
  | Extract<ThemeBlocks, { type: "_cart_note" }>
  | Extract<ThemeBlocks, { type: "_cart_progress_bar" }>
  | Extract<ThemeBlocks, { type: "_cart_progress_bar_stacked" }>
  | Extract<ThemeBlocks, { type: "_cart_total" }>
  | Extract<ThemeBlocks, { type: "_cart_dynamic_product_cards" }>
  | Extract<ThemeBlocks, { type: "_modal_cart_drawer__container" }>
  | Extract<ThemeBlocks, { type: "_modal_cart_drawer__close_button" }>
  | Extract<ThemeBlocks, { type: "_modal_cart_drawer__promo_card" }>
  | Extract<ThemeBlocks, { type: "_modal_cart_drawer__announcements" }>;

export type Sections = MainCartSection | ModalCartDrawerSection;
