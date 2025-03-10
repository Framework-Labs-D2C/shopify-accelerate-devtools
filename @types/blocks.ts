import { _Image_liquid, _Color_liquid, _BlockTag, _Linklist_liquid, _Product_liquid, _Video_liquid, _Blog_liquid, _Collection_liquid } from "./shopify";

export type AppBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "app";
};

export type BackgroundImageBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    preload: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: number */
    max_width?: number;
    /** Input type: text */
    sizes?: string;
    /** Input type: text */
    title?: string;
  };
  type: "background_image";
};

export type BreadcrumbsBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: checkbox */
    product_vendor_collection: boolean;
    /** Input type: checkbox */
    show_all_collections_step: boolean;
    /** Input type: text */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    divider_color?: _Color_liquid | string;
    /** Input type: text */
    icon?: string;
    /** Input type: color */
    inactive_text_color?: _Color_liquid | string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
    /** Input type: url */
    url?: string;
  };
  type: "breadcrumbs";
};

export type ButtonBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    show_active_state: boolean;
    /** Input type: select */
    type: "button" | "submit" | "reset";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
    /** Input type: url */
    url?: string;
  };
  type: "button";
};

export type CollapsibleBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    default_state: "show" | "hide";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
  };
  type: "collapsible";
};

export type CustomLiquidBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: liquid */
    custom_liquid?: string;
    /** Input type: text */
    title?: string;
  };
  type: "custom_liquid";
};

export type ImageBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    preload: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: number */
    max_width?: number;
    /** Input type: text */
    sizes?: string;
    /** Input type: text */
    title?: string;
    /** Input type: url */
    url?: string;
  };
  type: "image";
};

export type ImageWithCaptionBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: richtext */
    caption?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    caption_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "image_with_caption";
};

export type MenuBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    link_class?: string;
    /** Input type: link_list */
    menu?: _Linklist_liquid;
  };
  type: "menu";
};

export type PaymentTypesBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "payment_types";
};

export type RichtextBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "richtext";
};

export type RichtextInlineBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "richtext_inline";
};

export type SocialIconsIconButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: range */
    size: number;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
    /** Input type: url */
    url?: string;
  };
  type: "_social_icons__icon_button";
};

export type SocialIconsBlock = {
  blocks: SocialIconsBlocks[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "social_icons";
};

export type SocialIconsBlocks = Extract<ThemeBlocks, { type: "_social_icons__icon_button" }>;

export type StarRatingBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: range */
    rating: number;
    /** Input type: number */
    count?: number;
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: number */
    hide_zero_reviews?: number;
    /** Input type: text */
    icon?: string;
    /** Input type: color */
    icon_active_color?: _Color_liquid | string;
    /** Input type: color */
    icon_base_color?: _Color_liquid | string;
    /** Input type: product */
    product?: _Product_liquid;
    /** Input type: inline_richtext */
    reviews_heading?: string;
    /** Input type: text */
    title?: string;
  };
  type: "star_rating";
};

export type VideoPlayButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_video__play_button";
};

export type VideoPauseButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_video__pause_button";
};

export type VideoBlock = {
  blocks: VideoBlocks[];
  id: string;
  settings: {
    /** Input type: checkbox */
    autoplay: boolean;
    /** Input type: checkbox */
    controls: boolean;
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    loop: boolean;
    /** Input type: checkbox */
    muted: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    preview_image?: _Image_liquid | string;
    /** Input type: text */
    title?: string;
    /** Input type: video */
    video?: _Video_liquid;
    /** Input type: video_url */
    video_url?: `${string}youtube${string}` | `${string}vimeo${string}`;
  };
  type: "video";
};

export type VideoBlocks =
  | Extract<ThemeBlocks, { type: "_video__play_button" }>
  | Extract<ThemeBlocks, { type: "_video__pause_button" }>;

export type VideoButtonBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
    /** Input type: video */
    video?: _Video_liquid;
    /** Input type: video_url */
    video_url?: `${string}youtube${string}` | `${string}vimeo${string}`;
  };
  type: "video_button";
};

export type ArticleCardsBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: text */
    article_card_class?: string;
    /** Input type: blog */
    blog?: _Blog_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    display_limit?: string;
    /** Input type: text */
    filter_by_tag?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_article_cards";
};

export type CardButtonBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
    /** Input type: text */
    url?: string;
  };
  type: "_card_button";
};

export type CardContainerBlock = {
  blocks: CardContainerBlocks[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_card_container";
};

export type CardContainerBlocks =
  | Extract<ThemeBlocks, { type: "_card_container" }>
  | Extract<ThemeBlocks, { type: "_card_image" }>
  | Extract<ThemeBlocks, { type: "_card_button" }>
  | Extract<ThemeBlocks, { type: "_card_text" }>
  | Extract<ThemeBlocks, { type: "_card_labels" }>;

export type CardImageBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: checkbox */
    show_secondary_image: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    primary_image?: string;
    /** Input type: text */
    secondary_image?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_image";
};

export type CardLabelsBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: text */
    content_source?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label_class__content?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_labels";
};

export type CardTextBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_text";
};

export type CartCheckoutButtonBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_cart_checkout_button";
};

export type CartDiscountCodeInputBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    button_label?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    input_label?: string;
    /** Input type: text */
    input_placeholder?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_cart_discount_code_input";
};

export type CartDiscountDetailsBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: checkbox */
    show_cart_discounts: boolean;
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: checkbox */
    show_line_item_discounts: boolean;
    /** Input type: checkbox */
    show_selling_plan_discounts: boolean;
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    price_class?: string;
    /** Input type: text */
    text_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_cart_discount_details";
};

export type CartDynamicProductCardsBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    fallback_source: "complementary" | "related" | "recently_viewed" | "manual";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    hide_out_of_stock: boolean;
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: range */
    limit: number;
    /** Input type: select */
    primary_source: "complementary" | "related" | "recently_viewed" | "manual";
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: select */
    target_product: "ai" | "most_expensive" | "least_expensive" | "recently_added";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: collection */
    fallback_collection?: _Collection_liquid;
    /** Input type: product_list */
    fallback_products?: _Product_liquid[];
    /** Input type: richtext */
    legend?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    product_card_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_cart_dynamic_product_cards";
};

export type CartDynamicRichtextBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_cart_dynamic_richtext";
};

export type CartGiftWithPurchaseBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: checkbox */
    allow_duplicates: boolean;
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    hide_out_of_stock: boolean;
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: range */
    receives_quantity: number;
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: select */
    target_type: "total_price" | "item_count";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: richtext */
    legend?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    product_card_class?: string;
    /** Input type: product_list */
    products?: _Product_liquid[];
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: number */
    target?: number;
    /** Input type: text */
    title?: string;
  };
  type: "_cart_gift_with_purchase";
};

export type CartLineItemsBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: text */
    compare_at_price_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    price_class?: string;
    /** Input type: text */
    quantity_class?: string;
    /** Input type: text */
    remove_icon?: string;
    /** Input type: text */
    title?: string;
    /** Input type: text */
    title_class?: string;
    /** Input type: text */
    variant_title_class?: string;
  };
  type: "_cart_line_items";
};

export type CartNoteBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    checkbox_default_state: "unchecked" | "checked";
    /** Input type: checkbox */
    checkbox_enabled: boolean;
    /** Input type: select */
    dynamic_display: "show_always" | "show_checkbox_checked";
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: inline_richtext */
    checkbox_label?: string;
    /** Input type: text */
    checkbox_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: number */
    limit_characters?: number;
    /** Input type: text */
    textarea_class?: string;
    /** Input type: text */
    textarea_label?: string;
    /** Input type: text */
    textarea_placeholder?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_cart_note";
};

export type CartProgressBarTargetBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    content_class?: string;
    /** Input type: richtext */
    incentive_message?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: richtext */
    success_message?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: number */
    target?: number;
    /** Input type: text */
    title?: string;
  };
  type: "_cart_progress_bar__target";
};

export type CartProgressBarBlock = {
  blocks: CartProgressBarBlocks[];
  id: string;
  settings: {
    /** Input type: select */
    incentive_type: "total_price" | "item_count";
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: color */
    base_bg_color?: _Color_liquid | string;
    /** Input type: color */
    base_border_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    success_bg_color?: _Color_liquid | string;
    /** Input type: color */
    success_border_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_cart_progress_bar";
};

export type CartProgressBarBlocks = Extract<ThemeBlocks, { type: "_cart_progress_bar__target" }>;

export type CartProgressBarStackedTargetBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    content_class?: string;
    /** Input type: product */
    gift_product?: _Product_liquid;
    /** Input type: image_picker */
    icon?: _Image_liquid | string;
    /** Input type: richtext */
    incentive_message?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: image_picker */
    success_icon?: _Image_liquid | string;
    /** Input type: richtext */
    success_message?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: number */
    target?: number;
    /** Input type: text */
    title?: string;
  };
  type: "_cart_progress_bar_stacked__target";
};

export type CartProgressBarStackedBlock = {
  blocks: CartProgressBarStackedBlocks[];
  id: string;
  settings: {
    /** Input type: select */
    incentive_type: "total_price" | "item_count";
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: color */
    base_bg_color?: _Color_liquid | string;
    /** Input type: color */
    base_border_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    success_bg_color?: _Color_liquid | string;
    /** Input type: color */
    success_border_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_cart_progress_bar_stacked";
};

export type CartProgressBarStackedBlocks = Extract<ThemeBlocks, { type: "_cart_progress_bar_stacked__target" }>;

export type CartTotalBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: text */
    compare_at_price_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    price_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_cart_total";
};

export type CollectionCardsBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: text */
    collection_card_class?: string;
    /** Input type: collection_list */
    collections?: _Collection_liquid[];
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    display_limit?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_collection_cards";
};

export type FilterTagsBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_filter_tags";
};

export type LanguageSelectorBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_language_selector";
};

export type LocationSelectorBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_location_selector";
};

export type NewsletterSignupBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    style: "inline_button" | "input_and_button";
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    button_content?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    placeholder?: string;
    /** Input type: text */
    tag?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_newsletter_signup";
};

export type ProductCardsBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    fallback_source: "complementary" | "related" | "recently_viewed" | "manual";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    hide_out_of_stock: boolean;
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: select */
    primary_source: "complementary" | "related" | "recently_viewed" | "manual";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    display_limit?: string;
    /** Input type: collection */
    fallback_collection?: _Collection_liquid;
    /** Input type: product_list */
    fallback_products?: _Product_liquid[];
    /** Input type: text */
    product_card_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: product */
    target_product?: _Product_liquid;
    /** Input type: text */
    title?: string;
  };
  type: "_product_cards";
};

export type ScrollbarBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_scrollbar";
};

export type ShareFacebookBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    facebook_icon?: string;
    /** Input type: text */
    title?: string;
    /** Input type: url */
    url?: string;
  };
  type: "_share__facebook";
};

export type ShareTwitterBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    share_title?: string;
    /** Input type: text */
    title?: string;
    /** Input type: text */
    twitter_icon?: string;
    /** Input type: url */
    url?: string;
  };
  type: "_share__twitter";
};

export type SharePinterestBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    description?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: text */
    pinterest_icon?: string;
    /** Input type: text */
    title?: string;
    /** Input type: url */
    url?: string;
  };
  type: "_share__pinterest";
};

export type ShareLinkedinBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    linkedin_icon?: string;
    /** Input type: text */
    title?: string;
    /** Input type: url */
    url?: string;
  };
  type: "_share__linkedin";
};

export type ShareEmailBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    email_icon?: string;
    /** Input type: text */
    share_title?: string;
    /** Input type: text */
    title?: string;
    /** Input type: url */
    url?: string;
  };
  type: "_share__email";
};

export type ShareBlock = {
  blocks: ShareBlocks[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_share";
};

export type ShareBlocks =
  | Extract<ThemeBlocks, { type: "_share__facebook" }>
  | Extract<ThemeBlocks, { type: "_share__twitter" }>
  | Extract<ThemeBlocks, { type: "_share__pinterest" }>
  | Extract<ThemeBlocks, { type: "_share__linkedin" }>
  | Extract<ThemeBlocks, { type: "_share__email" }>;

export type AppsContainerBlock = {
  blocks: AppsContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_apps__container";
};

export type AppsContainerBlocks =
  | Extract<ThemeBlocks, { type: "app" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "star_rating" }>
  | Extract<ThemeBlocks, { type: "menu" }>
  | Extract<ThemeBlocks, { type: "social_icons" }>
  | Extract<ThemeBlocks, { type: "breadcrumbs" }>
  | Extract<ThemeBlocks, { type: "custom_liquid" }>
  | Extract<ThemeBlocks, { type: "_apps__container" }>;

export type CollectionDropdownCollectionsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: collection_list */
    collections?: _Collection_liquid[];
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_collection_dropdown__collections";
};

export type CollectionDropdownScentCollectionsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: collection_list */
    collections?: _Collection_liquid[];
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_collection_dropdown__scent_collections";
};

export type CustomBundleTabNavigationBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_custom_bundle__tab_navigation";
};

export type CustomBundleTabItemsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  type: "_custom_bundle__tab_items";
};

export type CustomBundleBundleTabBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    category_1_class?: string;
    /** Input type: richtext */
    category_1_heading?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: product_list */
    category_1_products?: _Product_liquid[];
    /** Input type: text */
    category_2_class?: string;
    /** Input type: richtext */
    category_2_heading?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: product_list */
    category_2_products?: _Product_liquid[];
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: product */
    primary_product?: _Product_liquid;
    /** Input type: text */
    quantity_class?: string;
    /** Input type: text */
    tab_name?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_custom_bundle__bundle_tab";
};

export type FeatureIconsContainerBlock = {
  blocks: FeatureIconsContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_feature_icons__container";
};

export type FeatureIconsContainerBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "image_with_caption" }>
  | Extract<ThemeBlocks, { type: "background_image" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "_feature_icons__container" }>;

export type FooterInternationalStoreSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label?: string;
    /** Input type: link_list */
    menu?: _Linklist_liquid;
    /** Input type: text */
    select_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_footer__international_store_select";
};

export type FooterContainerBlock = {
  blocks: FooterContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_footer__container";
};

export type FooterContainerBlocks =
  | Extract<ThemeBlocks, { type: "_newsletter_signup" }>
  | Extract<ThemeBlocks, { type: "custom_liquid" }>
  | Extract<ThemeBlocks, { type: "menu" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "social_icons" }>
  | Extract<ThemeBlocks, { type: "_footer__international_store_select" }>
  | Extract<ThemeBlocks, { type: "_footer__container" }>;

export type ImageWithFeaturesContainerBlock = {
  blocks: ImageWithFeaturesContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_image_with_features__container";
};

export type ImageWithFeaturesContainerBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "image_with_caption" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "_image_with_features__container" }>;

export type ImageWithTextContainerBlock = {
  blocks: ImageWithTextContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_image_with_text__container";
};

export type ImageWithTextContainerBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "star_rating" }>
  | Extract<ThemeBlocks, { type: "_image_with_text__container" }>;

export type MarqueeItemBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  type: "_marquee__Item";
};

export type MulticolumnContainerBlock = {
  blocks: MulticolumnContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_multicolumn__container";
};

export type MulticolumnContainerBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "image_with_caption" }>
  | Extract<ThemeBlocks, { type: "_multicolumn__container" }>;

export type ProductDetailTabsContainerBlock = {
  blocks: ProductDetailTabsContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_product_detail_tabs__container";
};

export type ProductDetailTabsContainerBlocks =
  | Extract<ThemeBlocks, { type: "background_image" }>
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "collapsible" }>
  | Extract<ThemeBlocks, { type: "_product_detail_tabs__container" }>
  | Extract<ThemeBlocks, { type: "_product_detail_tabs__tab_navigation" }>
  | Extract<ThemeBlocks, { type: "_product_detail_tabs__dynamic_features" }>
  | Extract<ThemeBlocks, { type: "_product_detail_tabs__dynamic_button_to_file" }>;

export type ProductDetailTabsTabContentBlock = {
  blocks: ProductDetailTabsTabContentBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hash_target?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    mobile_accordion_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_product_detail_tabs__tab_content";
};

export type ProductDetailTabsTabContentBlocks =
  | Extract<ThemeBlocks, { type: "background_image" }>
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "collapsible" }>
  | Extract<ThemeBlocks, { type: "_product_detail_tabs__container" }>
  | Extract<ThemeBlocks, { type: "_product_detail_tabs__dynamic_features" }>
  | Extract<ThemeBlocks, { type: "_product_detail_tabs__dynamic_button_to_file" }>;

export type ProductDetailTabsTabNavigationBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_product_detail_tabs__tab_navigation";
};

export type ProductDetailTabsDynamicFeaturesBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_product_detail_tabs__dynamic_features";
};

export type ProductDetailTabsDynamicButtonToFileBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    file?: _Image_liquid | string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_product_detail_tabs__dynamic_button_to_file";
};

export type VideoGridContainerBlock = {
  blocks: VideoGridContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_video_grid__container";
};

export type VideoGridContainerBlocks =
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_video_grid__container" }>
  | Extract<ThemeBlocks, { type: "_video_grid__video_card" }>;

export type VideoGridVideoCardBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    autoplay: boolean;
    /** Input type: checkbox */
    controls: boolean;
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    loop: boolean;
    /** Input type: checkbox */
    muted: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    play_icon?: string;
    /** Input type: image_picker */
    preview_image?: _Image_liquid | string;
    /** Input type: text */
    title?: string;
    /** Input type: video */
    video?: _Video_liquid;
    /** Input type: richtext */
    video_annotation?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: video_url */
    video_url?: `${string}youtube${string}` | `${string}vimeo${string}`;
  };
  type: "_video_grid__video_card";
};

export type VideoWithTextContainerBlock = {
  blocks: VideoWithTextContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_video_with_text__container";
};

export type VideoWithTextContainerBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "video" }>
  | Extract<ThemeBlocks, { type: "video_button" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_video_with_text__container" }>;

export type HeaderAnnouncementBarAnnouncementBlock = {
  blocks: HeaderAnnouncementBarAnnouncementBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    container_spacing:
      | "px-container-xs"
      | "px-container-sm"
      | "px-container-md"
      | "px-container-lg"
      | "px-container-gutter"
      | "px-container-fullwidth";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: url */
    url?: string;
  };
  type: "_header_announcement_bar__announcement";
};

export type HeaderAnnouncementBarAnnouncementBlocks =
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_header_announcement_bar__close_button" }>;

export type HeaderAnnouncementBarCloseButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: range */
    keep_closed_for: number;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
  };
  type: "_header_announcement_bar__close_button";
};

export type HeaderMobileNavBarAccountButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    active_icon?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
  };
  type: "_header_mobile_nav_bar__account_button";
};

export type HeaderMobileNavBarSearchButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    active_icon?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
  };
  type: "_header_mobile_nav_bar__search_button";
};

export type HeaderMobileNavBarHomeButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    active_icon?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
  };
  type: "_header_mobile_nav_bar__home_button";
};

export type HeaderNavigationBarBurgerMenuButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    url?: string;
  };
  type: "_header_navigation_bar__burger_menu_button";
};

export type HeaderNavigationBarMegamenuButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: textarea */
    hover_svg_icon?: string;
    /** Input type: textarea */
    primary_svg_icon?: string;
    /** Input type: text */
    title?: string;
    /** Input type: text */
    title_class?: string;
    /** Input type: url */
    url?: string;
  };
  type: "_header_navigation_bar__megamenu_button";
};

export type HeaderNavigationBarSearchButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    placeholder?: string;
  };
  type: "_header_navigation_bar__search_button";
};

export type HeaderNavigationBarCartButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    show_cart_quantity: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
  };
  type: "_header_navigation_bar__cart_button";
};

export type HeaderNavigationBarAccountButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
  };
  type: "_header_navigation_bar__account_button";
};

export type HeaderNavigationBarContainerBlock = {
  blocks: HeaderNavigationBarContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_header_navigation_bar__container";
};

export type HeaderNavigationBarContainerBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__burger_menu_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__megamenu_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__search_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__cart_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__account_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__container" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__dynamic_display_container" }>;

export type HeaderNavigationBarDynamicDisplayContainerBlock = {
  blocks: HeaderNavigationBarDynamicDisplayContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    hide_if_set_paths: boolean;
    /** Input type: checkbox */
    hide_if_set_templates: boolean;
    /** Input type: checkbox */
    required_paths: boolean;
    /** Input type: checkbox */
    required_templates: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: textarea */
    match_paths?: string;
    /** Input type: textarea */
    match_templates?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_header_navigation_bar__dynamic_display_container";
};

export type HeaderNavigationBarDynamicDisplayContainerBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__burger_menu_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__megamenu_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__search_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__cart_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__account_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__container" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__dynamic_display_container" }>;

export type MainBlogContainerBlock = {
  blocks: MainBlogContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_blog__container";
};

export type MainBlogContainerBlocks =
  | Extract<ThemeBlocks, { type: "breadcrumbs" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_filter_tags" }>
  | Extract<ThemeBlocks, { type: "_main_blog__container" }>
  | Extract<ThemeBlocks, { type: "_main_blog__filters" }>
  | Extract<ThemeBlocks, { type: "_main_blog__article_cards" }>
  | Extract<ThemeBlocks, { type: "_main_blog__filter_button" }>
  | Extract<ThemeBlocks, { type: "_main_blog__empty_state" }>;

export type MainBlogFiltersBlock = {
  blocks: MainBlogFiltersBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    style: "checkbox" | "radio_button";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    button_class?: string;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    submit_button_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_blog__filters";
};

export type MainBlogFiltersBlocks = Extract<ThemeBlocks, { type: "_main_blog__applied_filters" }>;

export type MainBlogAppliedFiltersBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: text */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    no_filter_content?: string;
    /** Input type: text */
    no_filter_content_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_blog__applied_filters";
};

export type MainBlogArticleCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: range */
    pagination_size: number;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: text */
    article_card_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    pagination_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_blog__article_cards";
};

export type MainBlogFilterButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_blog__filter_button";
};

export type MainBlogEmptyStateBlock = {
  blocks: MainBlogEmptyStateBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_blog__empty_state";
};

export type MainBlogEmptyStateBlocks = Extract<ThemeBlocks, { type: "image" }> | Extract<ThemeBlocks, { type: "richtext" }>;

export type MainCartCollapsibleBlock = {
  blocks: MainCartCollapsibleBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    default_state: "show" | "hide";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_cart__collapsible";
};

export type MainCartCollapsibleBlocks =
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "_cart_checkout_button" }>
  | Extract<ThemeBlocks, { type: "_cart_discount_details" }>
  | Extract<ThemeBlocks, { type: "_cart_dynamic_richtext" }>
  | Extract<ThemeBlocks, { type: "_cart_gift_with_purchase" }>
  | Extract<ThemeBlocks, { type: "_cart_note" }>
  | Extract<ThemeBlocks, { type: "_cart_total" }>
  | Extract<ThemeBlocks, { type: "_cart_dynamic_product_cards" }>
  | Extract<ThemeBlocks, { type: "_cart_discount_code_input" }>;

export type MainCartContainerBlock = {
  blocks: MainCartContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_cart__container";
};

export type MainCartContainerBlocks =
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

export type MainCartLineItemsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: text */
    compare_at_price_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    price_class?: string;
    /** Input type: text */
    quantity_class?: string;
    /** Input type: text */
    remove_icon?: string;
    /** Input type: text */
    table_header_class?: string;
    /** Input type: text */
    title?: string;
    /** Input type: text */
    title_class?: string;
    /** Input type: text */
    variant_title_class?: string;
  };
  type: "_main_cart__line_items";
};

export type MainCollectionContainerBlock = {
  blocks: MainCollectionContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_collection__container";
};

export type MainCollectionContainerBlocks =
  | Extract<ThemeBlocks, { type: "breadcrumbs" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_product_cards" }>
  | Extract<ThemeBlocks, { type: "_filter_tags" }>
  | Extract<ThemeBlocks, { type: "_main_collection__container" }>
  | Extract<ThemeBlocks, { type: "_main_collection__collapsible" }>
  | Extract<ThemeBlocks, { type: "_main_collection__filters" }>
  | Extract<ThemeBlocks, { type: "_main_collection__sort" }>
  | Extract<ThemeBlocks, { type: "_main_collection__product_cards" }>
  | Extract<ThemeBlocks, { type: "_main_collection__filter_sort_buttons" }>
  | Extract<ThemeBlocks, { type: "_main_collection__empty_state" }>;

export type MainCollectionCollapsibleBlock = {
  blocks: MainCollectionCollapsibleBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accordion_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_collection__collapsible";
};

export type MainCollectionCollapsibleBlocks =
  | Extract<ThemeBlocks, { type: "breadcrumbs" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_product_cards" }>
  | Extract<ThemeBlocks, { type: "_filter_tags" }>
  | Extract<ThemeBlocks, { type: "_main_collection__container" }>
  | Extract<ThemeBlocks, { type: "_main_collection__collapsible" }>
  | Extract<ThemeBlocks, { type: "_main_collection__filters" }>
  | Extract<ThemeBlocks, { type: "_main_collection__sort" }>
  | Extract<ThemeBlocks, { type: "_main_collection__product_cards" }>
  | Extract<ThemeBlocks, { type: "_main_collection__filter_sort_buttons" }>
  | Extract<ThemeBlocks, { type: "_main_collection__empty_state" }>
  | Extract<ThemeBlocks, { type: "_main_collection__sibling_collections" }>;

export type MainCollectionSiblingCollectionsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: collection_list */
    collections?: _Collection_liquid[];
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_collection__sibling_collections";
};

export type MainCollectionFiltersBlock = {
  blocks: MainCollectionFiltersBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    default_state: "show_first" | "show" | "hide";
    /** Input type: checkbox */
    filters_show_count: boolean;
    /** Input type: text */
    accordion_class?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    submit_button_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_collection__filters";
};

export type MainCollectionFiltersBlocks =
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_main_collection__container" }>
  | Extract<ThemeBlocks, { type: "_main_collection__collapsible" }>
  | Extract<ThemeBlocks, { type: "_main_collection__applied_filters" }>
  | Extract<ThemeBlocks, { type: "_main_collection__color_override" }>
  | Extract<ThemeBlocks, { type: "_main_collection__radio_button_override" }>
  | Extract<ThemeBlocks, { type: "_main_collection__checkbox_override" }>;

export type MainCollectionAppliedFiltersBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: text */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    no_filter_content?: string;
    /** Input type: text */
    no_filter_content_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_collection__applied_filters";
};

export type MainCollectionColorOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_collection__color_override";
};

export type MainCollectionRadioButtonOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    filters_show_count: boolean;
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_collection__radio_button_override";
};

export type MainCollectionCheckboxOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    filters_show_count: boolean;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_collection__checkbox_override";
};

export type MainCollectionSortBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_collection__sort";
};

export type MainCollectionProductCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: range */
    pagination_size: number;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    pagination_class?: string;
    /** Input type: text */
    product_card_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_collection__product_cards";
};

export type MainCollectionFilterSortButtonsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_collection__filter_sort_buttons";
};

export type MainCollectionEmptyStateBlock = {
  blocks: MainCollectionEmptyStateBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_collection__empty_state";
};

export type MainCollectionEmptyStateBlocks = Extract<ThemeBlocks, { type: "image" }> | Extract<ThemeBlocks, { type: "richtext" }>;

export type MainListCollectionsContainerBlock = {
  blocks: MainListCollectionsContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_list_collections__container";
};

export type MainListCollectionsContainerBlocks =
  | Extract<ThemeBlocks, { type: "breadcrumbs" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_main_list_collections__container" }>
  | Extract<ThemeBlocks, { type: "_main_list_collections__collection_cards" }>
  | Extract<ThemeBlocks, { type: "_main_list_collections__empty_state" }>;

export type MainListCollectionsCollectionCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: range */
    pagination_size: number;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: text */
    collection_card_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    pagination_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_list_collections__collection_cards";
};

export type MainListCollectionsEmptyStateBlock = {
  blocks: MainListCollectionsEmptyStateBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_list_collections__empty_state";
};

export type MainListCollectionsEmptyStateBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "richtext" }>;

export type MainProductContainerBlock = {
  blocks: MainProductContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__container";
};

export type MainProductContainerBlocks =
  | Extract<ThemeBlocks, { type: "_main_product__container" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "richtext_inline" }>
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "custom_liquid" }>
  | Extract<ThemeBlocks, { type: "_product_cards" }>
  | Extract<ThemeBlocks, { type: "_main_product__availability" }>
  | Extract<ThemeBlocks, { type: "_main_product__gallery" }>
  | Extract<ThemeBlocks, { type: "_main_product__thumbnails" }>
  | Extract<ThemeBlocks, { type: "_main_product__price" }>
  | Extract<ThemeBlocks, { type: "_main_product__rating" }>
  | Extract<ThemeBlocks, { type: "_main_product__quantity_selector" }>
  | Extract<ThemeBlocks, { type: "_main_product__add_to_cart_button" }>
  | Extract<ThemeBlocks, { type: "_main_product__description" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__color" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__color_w_caption" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__radio" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__radio_detailed" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__select" }>
  | Extract<ThemeBlocks, { type: "_main_product__variant_selector__color" }>
  | Extract<ThemeBlocks, { type: "_main_product__variant_selector__radio" }>
  | Extract<ThemeBlocks, { type: "_main_product__variant_selector__select" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__color" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__radio" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__select" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__color_select" }>
  | Extract<ThemeBlocks, { type: "_main_product__subscribe__button_select" }>
  | Extract<ThemeBlocks, { type: "_main_product__subscribe__button_card" }>
  | Extract<ThemeBlocks, { type: "_main_product__subscribe__button_switch" }>
  | Extract<ThemeBlocks, { type: "_main_product__payment_terms" }>
  | Extract<ThemeBlocks, { type: "_main_product__dynamic_buy_button" }>
  | Extract<ThemeBlocks, { type: "_main_product__dynamic_text" }>
  | Extract<ThemeBlocks, { type: "_main_product__image" }>
  | Extract<ThemeBlocks, { type: "_main_product__labels" }>
  | Extract<ThemeBlocks, { type: "_main_product__bundle_card" }>
  | Extract<ThemeBlocks, { type: "_main_product__dynamic_feature" }>;

export type MainProductAvailabilityBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: inline_richtext */
    content_available?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: inline_richtext */
    content_sold_out?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__availability";
};

export type MainProductGalleryBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    additional_view: "disabled" | "media_gallery";
    /** Input type: select */
    desktop_layout: "col" | "grid" | "hero_grid" | "slider";
    /** Input type: radio */
    filter_images:
      | "show_all"
      | "selected_variant"
      | "variant_images_by_order"
      | "variant_images_by_metafield"
      | "variant_images_and_unassigned"
      | "only_unassigned"
      | "first_or_selected_image";
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: checkbox */
    scroll_to_selected_variant_image: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hide_image_alt?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__gallery";
};

export type MainProductThumbnailsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    select_variant_on_click: boolean;
    /** Input type: radio */
    thumbnail_filter_images:
      | "show_all"
      | "show_all_variants"
      | "selected_variant"
      | "variant_images_by_order"
      | "variant_images_by_metafield"
      | "variant_images_and_unassigned"
      | "only_unassigned";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hide_image_alt?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__thumbnails";
};

export type MainProductPriceBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    currency_display: "amount" | "amount_no_decimals";
    /** Input type: select */
    price_calculation: "normal" | "quantity_multiplied";
    /** Input type: checkbox */
    show_compare_as_price: boolean;
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    discount_css_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__price";
};

export type MainProductRatingBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: number */
    hide_zero_reviews?: number;
    /** Input type: text */
    icon?: string;
    /** Input type: color */
    icon_active_color?: _Color_liquid | string;
    /** Input type: color */
    icon_base_color?: _Color_liquid | string;
    /** Input type: inline_richtext */
    reviews_heading?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__rating";
};

export type MainProductQuantitySelectorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    quantity_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__quantity_selector";
};

export type MainProductAddToCartButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_back_in_stock_notifications: boolean;
    /** Input type: checkbox */
    quantity_price: boolean;
    /** Input type: text */
    add_to_cart_class?: string;
    /** Input type: inline_richtext */
    add_to_cart_content?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    out_of_stock_class?: string;
    /** Input type: inline_richtext */
    out_of_stock_content?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__add_to_cart_button";
};

export type MainProductDescriptionBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    open_accordions: "" | "first" | "all";
    /** Input type: select */
    style: "plain" | "accordion_plain" | "accordion_h1";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__description";
};

export type MainProductOptionColorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: select */
    fallback_source: "title" | "image" | "metafield";
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: select */
    primary_source: "title" | "image" | "metafield";
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__option__color";
};

export type MainProductOptionColorWCaptionBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: select */
    fallback_source: "title" | "image" | "metafield";
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: select */
    primary_source: "title" | "image" | "metafield";
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: inline_richtext */
    caption?: string;
    /** Input type: text */
    caption_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__option__color_w_caption";
};

export type MainProductOptionRadioBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    radio_button_class?: string;
    /** Input type: inline_richtext */
    radio_button_content?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__option__radio";
};

export type MainProductOptionRadioDetailedBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: color_background */
    background_gradient?: string;
    /** Input type: color */
    border_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: richtext */
    dynamic_content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    dynamic_content_class?: string;
    /** Input type: inline_richtext */
    footnote_caption?: string;
    /** Input type: text */
    footnote_caption_class?: string;
    /** Input type: color */
    hover_background_color?: _Color_liquid | string;
    /** Input type: color */
    hover_text_color?: _Color_liquid | string;
    /** Input type: text */
    image_metafield?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    label_metafield?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__option__radio_detailed";
};

export type MainProductOptionSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__option__select";
};

export type MainProductVariantSelectorColorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: select */
    fallback_source: "title" | "image" | "metafield";
    /** Input type: select */
    primary_source: "title" | "image" | "metafield";
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    hover_border_color?: _Color_liquid | string;
    /** Input type: color */
    hover_outline_color?: _Color_liquid | string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__variant_selector__color";
};

export type MainProductVariantSelectorRadioBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    label_metafield?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    radio_button_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__variant_selector__radio";
};

export type MainProductVariantSelectorSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__variant_selector__select";
};

export type MainProductSiblingColorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: select */
    fallback_source: "title" | "image" | "metafield";
    /** Input type: select */
    primary_source: "title" | "image" | "metafield";
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    hover_border_color?: _Color_liquid | string;
    /** Input type: color */
    hover_outline_color?: _Color_liquid | string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    metafield?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__sibling__color";
};

export type MainProductSiblingRadioBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    label_metafield?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    metafield?: string;
    /** Input type: text */
    radio_button_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__sibling__radio";
};

export type MainProductSiblingSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    metafield?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__sibling__select";
};

export type MainProductSiblingColorSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    metafield?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__sibling__color_select";
};

export type MainProductSubscribeButtonSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    default_selection: "one_time" | "subscription";
    /** Input type: select */
    layout_order: "order-1" | "-order-1";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: inline_richtext */
    legend_label?: string;
    /** Input type: inline_richtext */
    one_time_content?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: inline_richtext */
    subscription_content?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__subscribe__button_select";
};

export type MainProductSubscribeButtonCardBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    currency_display: "amount" | "amount_no_decimals";
    /** Input type: select */
    default_selection: "subscription" | "one_time";
    /** Input type: range */
    discount_percentage_override: number;
    /** Input type: select */
    price_calculation: "normal" | "quantity_multiplied" | "no_discount";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: inline_richtext */
    legend_label?: string;
    /** Input type: inline_richtext */
    one_time_content?: string;
    /** Input type: text */
    price_class?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: inline_richtext */
    subscription_content?: string;
    /** Input type: richtext */
    subscription_highlights?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__subscribe__button_card";
};

export type MainProductSubscribeButtonSwitchBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    currency_display: "amount" | "amount_no_decimals";
    /** Input type: select */
    default_selection: "subscription" | "one_time";
    /** Input type: range */
    discount_percentage_override: number;
    /** Input type: select */
    layout_order: "-order-1" | "order-1";
    /** Input type: select */
    price_calculation: "normal" | "quantity_multiplied" | "no_discount";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: inline_richtext */
    legend_label?: string;
    /** Input type: inline_richtext */
    one_time_content?: string;
    /** Input type: richtext */
    one_time_highlights?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    price_class?: string;
    /** Input type: text */
    savings_highlight_class?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: inline_richtext */
    subscription_content?: string;
    /** Input type: richtext */
    subscription_highlights?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__subscribe__button_switch";
};

export type MainProductPaymentTermsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__payment_terms";
};

export type MainProductDynamicBuyButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    out_of_stock_content?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__dynamic_buy_button";
};

export type MainProductDynamicTextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    link_to_product: boolean;
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
    /** Input type: text */
    type_richtext_metafield?: string;
  };
  type: "_main_product__dynamic_text";
};

export type MainProductImageBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    link_to_product: boolean;
    /** Input type: select */
    primary_image: "product_image" | "variant_image" | "metafield_image";
    /** Input type: checkbox */
    show_secondary_image: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    metafield_image?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__image";
};

export type MainProductLabelsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    label_type__discounts: "sale" | "percentage" | "value" | "";
    /** Input type: select */
    label_type__out_of_stock: "show" | "hide";
    /** Input type: text */
    content_source?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_content__out_of_stock?: string;
    /** Input type: text */
    label_class__content?: string;
    /** Input type: text */
    label_class__discount?: string;
    /** Input type: text */
    label_class__out_of_stock?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__labels";
};

export type MainProductBundleCardBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: text */
    button_class_1?: string;
    /** Input type: text */
    button_class_2?: string;
    /** Input type: inline_richtext */
    button_content_1?: string;
    /** Input type: inline_richtext */
    button_content_2?: string;
    /** Input type: url */
    button_url_1?: string;
    /** Input type: url */
    button_url_2?: string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__bundle_card";
};

export type MainProductDynamicFeatureBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__dynamic_feature";
};

export type MainSearchDynamicTextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_search__dynamic_text";
};

export type MainSearchContainerBlock = {
  blocks: MainSearchContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_search__container";
};

export type MainSearchContainerBlocks =
  | Extract<ThemeBlocks, { type: "breadcrumbs" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_product_cards" }>
  | Extract<ThemeBlocks, { type: "_filter_tags" }>
  | Extract<ThemeBlocks, { type: "_main_search__dynamic_text" }>
  | Extract<ThemeBlocks, { type: "_main_search__container" }>
  | Extract<ThemeBlocks, { type: "_main_search__filters" }>
  | Extract<ThemeBlocks, { type: "_main_search__sort" }>
  | Extract<ThemeBlocks, { type: "_main_search__mixed_cards" }>
  | Extract<ThemeBlocks, { type: "_main_search__filter_sort_buttons" }>
  | Extract<ThemeBlocks, { type: "_main_search__empty_state" }>
  | Extract<ThemeBlocks, { type: "_main_search__search_input" }>;

export type MainSearchFiltersBlock = {
  blocks: MainSearchFiltersBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    default_state: "show_first" | "show" | "hide";
    /** Input type: checkbox */
    filters_show_count: boolean;
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    submit_button_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_search__filters";
};

export type MainSearchFiltersBlocks =
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_main_search__container" }>
  | Extract<ThemeBlocks, { type: "_main_search__search_input" }>
  | Extract<ThemeBlocks, { type: "_main_search__applied_filters" }>
  | Extract<ThemeBlocks, { type: "_main_search__color_override" }>
  | Extract<ThemeBlocks, { type: "_main_search__radio_button_override" }>
  | Extract<ThemeBlocks, { type: "_main_search__checkbox_override" }>
  | Extract<ThemeBlocks, { type: "_main_search__search_type_filter" }>;

export type MainSearchAppliedFiltersBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: text */
    button_class?: string;
    /** Input type: text */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    no_filter_content?: string;
    /** Input type: text */
    no_filter_content_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_search__applied_filters";
};

export type MainSearchColorOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_search__color_override";
};

export type MainSearchRadioButtonOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    filters_show_count: boolean;
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_search__radio_button_override";
};

export type MainSearchCheckboxOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    filters_show_count: boolean;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_search__checkbox_override";
};

export type MainSearchSearchTypeFilterBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    default_state: "show" | "hide";
    /** Input type: checkbox */
    show_article: boolean;
    /** Input type: checkbox */
    show_page: boolean;
    /** Input type: checkbox */
    show_product: boolean;
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    style: "checkbox" | "radio_button";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    radio_button_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_search__search_type_filter";
};

export type MainSearchSortBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_search__sort";
};

export type MainSearchMixedCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: range */
    pagination_size: number;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: text */
    article_card_class?: string;
    /** Input type: text */
    collection_card_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    page_card_class?: string;
    /** Input type: text */
    pagination_class?: string;
    /** Input type: text */
    product_card_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_search__mixed_cards";
};

export type MainSearchFilterSortButtonsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_search__filter_sort_buttons";
};

export type MainSearchEmptyStateBlock = {
  blocks: MainSearchEmptyStateBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_search__empty_state";
};

export type MainSearchEmptyStateBlocks = Extract<ThemeBlocks, { type: "image" }> | Extract<ThemeBlocks, { type: "richtext" }>;

export type MainSearchSearchInputBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    placeholder?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_search__search_input";
};

export type ModalAccountMenuContainerBlock = {
  blocks: ModalAccountMenuContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_account_menu__container";
};

export type ModalAccountMenuContainerBlocks =
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "_modal_account_menu__container" }>;

export type ModalCartDrawerContainerBlock = {
  blocks: ModalCartDrawerContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_cart_drawer__container";
};

export type ModalCartDrawerContainerBlocks =
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

export type ModalCartDrawerCloseButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_cart_drawer__close_button";
};

export type ModalCartDrawerPromoCardBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    button_class_1?: string;
    /** Input type: text */
    button_class_2?: string;
    /** Input type: inline_richtext */
    button_content_1?: string;
    /** Input type: inline_richtext */
    button_content_2?: string;
    /** Input type: url */
    button_url_1?: string;
    /** Input type: url */
    button_url_2?: string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_cart_drawer__promo_card";
};

export type ModalCartDrawerAnnouncementsBlock = {
  blocks: ModalCartDrawerAnnouncementsBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: range */
    display_duration: number;
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_modal_cart_drawer__announcements";
};

export type ModalCartDrawerAnnouncementsBlocks = Extract<ThemeBlocks, { type: "_modal_cart_drawer__announcement" }>;

export type ModalCartDrawerAnnouncementBlock = {
  blocks: ModalCartDrawerAnnouncementBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    container_spacing:
      | "px-container-xs"
      | "px-container-sm"
      | "px-container-md"
      | "px-container-lg"
      | "px-container-gutter"
      | "px-container-fullwidth";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: url */
    url?: string;
  };
  type: "_modal_cart_drawer__announcement";
};

export type ModalCartDrawerAnnouncementBlocks =
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_modal_cart_drawer__announcement_close_button" }>;

export type ModalCartDrawerAnnouncementCloseButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: range */
    keep_closed_for: number;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
  };
  type: "_modal_cart_drawer__announcement_close_button";
};

export type ModalMegamenuContainerBlock = {
  blocks: ModalMegamenuContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_megamenu__container";
};

export type ModalMegamenuContainerBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "menu" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "background_image" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "_modal_megamenu__container" }>
  | Extract<ThemeBlocks, { type: "_modal_megamenu__international_store_select" }>;

export type ModalMegamenuInternationalStoreSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label?: string;
    /** Input type: link_list */
    menu?: _Linklist_liquid;
    /** Input type: text */
    select_class?: string;
  };
  type: "_modal_megamenu__international_store_select";
};

export type ModalMegamenuCollectionsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: collection_list */
    collections?: _Collection_liquid[];
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_modal_megamenu__collections";
};

export type ModalSearchDynamicTextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_search__dynamic_text";
};

export type ModalSearchStaticSearchSuggestionBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_search__static_search_suggestion";
};

export type ModalSearchDynamicSearchSuggestionsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_search__dynamic_search_suggestions";
};

export type ModalSearchProductResultCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    product_card_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_search__product_result_cards";
};

export type ModalSearchCollectionResultCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: text */
    collection_card_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_search__collection_result_cards";
};

export type ModalSearchPageResultCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    page_card_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_search__page_result_cards";
};

export type ModalSearchArticleResultCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    infinite_scroll: boolean;
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start";
    /** Input type: text */
    article_card_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_search__article_result_cards";
};

export type ModalSearchSearchInputBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    placeholder?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_search__search_input";
};

export type ModalSearchContainerBlock = {
  blocks: ModalSearchContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "search_empty" | "items_found";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_search__container";
};

export type ModalSearchContainerBlocks =
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_modal_search__dynamic_text" }>
  | Extract<ThemeBlocks, { type: "_modal_search__static_search_suggestion" }>
  | Extract<ThemeBlocks, { type: "_modal_search__dynamic_search_suggestions" }>
  | Extract<ThemeBlocks, { type: "_modal_search__product_result_cards" }>
  | Extract<ThemeBlocks, { type: "_modal_search__collection_result_cards" }>
  | Extract<ThemeBlocks, { type: "_modal_search__page_result_cards" }>
  | Extract<ThemeBlocks, { type: "_modal_search__article_result_cards" }>
  | Extract<ThemeBlocks, { type: "_modal_search__search_input" }>
  | Extract<ThemeBlocks, { type: "_modal_search__container" }>
  | Extract<ThemeBlocks, { type: "_modal_search__loading_overlay" }>;

export type ModalSearchLoadingOverlayBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_search__loading_overlay";
};

export type ModalSidebarMenuCloseButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_sidebar_menu__close_button";
};

export type ModalSidebarMenuContainerBlock = {
  blocks: ModalSidebarMenuContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_sidebar_menu__container";
};

export type ModalSidebarMenuContainerBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "menu" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "background_image" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "_modal_sidebar_menu__collapsible" }>
  | Extract<ThemeBlocks, { type: "_modal_sidebar_menu__container" }>
  | Extract<ThemeBlocks, { type: "_modal_megamenu__international_store_select" }>;

export type ModalSidebarMenuCollapsibleBlock = {
  blocks: ModalSidebarMenuCollapsibleBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accordion_class?: string;
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_modal_sidebar_menu__collapsible";
};

export type ModalSidebarMenuCollapsibleBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "menu" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "background_image" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "_modal_sidebar_menu__collapsible" }>
  | Extract<ThemeBlocks, { type: "_modal_sidebar_menu__collections" }>
  | Extract<ThemeBlocks, { type: "_modal_sidebar_menu__container" }>
  | Extract<ThemeBlocks, { type: "_modal_megamenu__international_store_select" }>;

export type ModalSidebarMenuCollectionsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: collection_list */
    collections?: _Collection_liquid[];
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_modal_sidebar_menu__collections";
};

export type CardProductCardContainerBlock = {
  blocks: CardProductCardContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__container";
};

export type CardProductCardContainerBlocks =
  | Extract<ThemeBlocks, { type: "custom_liquid" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__container" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__image" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__richtext" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__button" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__price" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__labels" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__rating" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__accent_line" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__quick_view_button" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__bundle_button" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__drawer_button" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__variant_selector__select" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__variant_selector__radio" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__variant_selector__color" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__option__color" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__option__radio" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__option__select" }>;

export type CardProductCardImageBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: checkbox */
    show_secondary_image: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    primary_image?: string;
    /** Input type: text */
    secondary_image?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__image";
};

export type CardProductCardRichtextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    link_to_product: boolean;
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__richtext";
};

export type CardProductCardButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
    /** Input type: text */
    url?: string;
  };
  type: "_card_product_card__button";
};

export type CardProductCardPriceBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    currency_display: "amount" | "amount_no_decimals";
    /** Input type: select */
    price_calculation: "normal" | "quantity_multiplied";
    /** Input type: checkbox */
    show_compare_as_price: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    discount_css_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__price";
};

export type CardProductCardLabelsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    label_type__discounts: "sale" | "percentage" | "value" | "";
    /** Input type: select */
    label_type__out_of_stock: "show" | "hide";
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions";
    /** Input type: text */
    content_source?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_content__out_of_stock?: string;
    /** Input type: text */
    label_class__content?: string;
    /** Input type: text */
    label_class__discount?: string;
    /** Input type: text */
    label_class__out_of_stock?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__labels";
};

export type CardProductCardRatingBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions";
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: number */
    hide_zero_reviews?: number;
    /** Input type: text */
    icon?: string;
    /** Input type: color */
    icon_active_color?: _Color_liquid | string;
    /** Input type: color */
    icon_base_color?: _Color_liquid | string;
    /** Input type: inline_richtext */
    reviews_heading?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__rating";
};

export type CardProductCardAccentLineBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: range */
    height: number;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions";
    /** Input type: select */
    style: "solid" | "dashed" | "dotted";
    /** Input type: color */
    border_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__accent_line";
};

export type CardProductCardQuickViewButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_back_in_stock_notifications: boolean;
    /** Input type: select */
    quick_view_visibility: "all" | "only_variants" | "never";
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions";
    /** Input type: text */
    add_to_cart_class?: string;
    /** Input type: inline_richtext */
    add_to_cart_content?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    out_of_stock_class?: string;
    /** Input type: inline_richtext */
    out_of_stock_content?: string;
    /** Input type: text */
    quick_view_class?: string;
    /** Input type: inline_richtext */
    quick_view_content?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__quick_view_button";
};

export type CardProductCardBundleButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions";
    /** Input type: text */
    add_to_bundle_class?: string;
    /** Input type: inline_richtext */
    add_to_bundle_content?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    out_of_stock_class?: string;
    /** Input type: inline_richtext */
    out_of_stock_content?: string;
    /** Input type: text */
    quantity_class?: string;
    /** Input type: inline_richtext */
    quantity_content?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__bundle_button";
};

export type CardProductCardDrawerButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "variants_only";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__drawer_button";
};

export type CardProductCardVariantSelectorSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__variant_selector__select";
};

export type CardProductCardVariantSelectorRadioBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    label_metafield?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    radio_button_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__variant_selector__radio";
};

export type CardProductCardVariantSelectorColorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: select */
    fallback_source: "title" | "image" | "metafield";
    /** Input type: select */
    primary_source: "title" | "image" | "metafield";
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions";
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    hover_border_color?: _Color_liquid | string;
    /** Input type: color */
    hover_outline_color?: _Color_liquid | string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__variant_selector__color";
};

export type CardProductCardOptionColorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: select */
    fallback_source: "title" | "image" | "metafield";
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: select */
    primary_source: "title" | "image" | "metafield";
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions";
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    hover_border_color?: _Color_liquid | string;
    /** Input type: color */
    hover_outline_color?: _Color_liquid | string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__option__color";
};

export type CardProductCardOptionRadioBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    radio_button_class?: string;
    /** Input type: inline_richtext */
    radio_button_content?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__option__radio";
};

export type CardProductCardOptionSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_card_product_card__option__select";
};

export type ThemeBlocks =
  | AppBlock
  | BackgroundImageBlock
  | BreadcrumbsBlock
  | ButtonBlock
  | CollapsibleBlock
  | CustomLiquidBlock
  | ImageBlock
  | ImageWithCaptionBlock
  | MenuBlock
  | PaymentTypesBlock
  | RichtextBlock
  | RichtextInlineBlock
  | SocialIconsIconButtonBlock
  | SocialIconsBlock
  | StarRatingBlock
  | VideoPlayButtonBlock
  | VideoPauseButtonBlock
  | VideoBlock
  | VideoButtonBlock
  | ArticleCardsBlock
  | CardButtonBlock
  | CardContainerBlock
  | CardImageBlock
  | CardLabelsBlock
  | CardTextBlock
  | CartCheckoutButtonBlock
  | CartDiscountCodeInputBlock
  | CartDiscountDetailsBlock
  | CartDynamicProductCardsBlock
  | CartDynamicRichtextBlock
  | CartGiftWithPurchaseBlock
  | CartLineItemsBlock
  | CartNoteBlock
  | CartProgressBarTargetBlock
  | CartProgressBarBlock
  | CartProgressBarStackedTargetBlock
  | CartProgressBarStackedBlock
  | CartTotalBlock
  | CollectionCardsBlock
  | FilterTagsBlock
  | LanguageSelectorBlock
  | LocationSelectorBlock
  | NewsletterSignupBlock
  | ProductCardsBlock
  | ScrollbarBlock
  | ShareFacebookBlock
  | ShareTwitterBlock
  | SharePinterestBlock
  | ShareLinkedinBlock
  | ShareEmailBlock
  | ShareBlock
  | AppsContainerBlock
  | CollectionDropdownCollectionsBlock
  | CollectionDropdownScentCollectionsBlock
  | CustomBundleTabNavigationBlock
  | CustomBundleTabItemsBlock
  | CustomBundleBundleTabBlock
  | FeatureIconsContainerBlock
  | FooterInternationalStoreSelectBlock
  | FooterContainerBlock
  | ImageWithFeaturesContainerBlock
  | ImageWithTextContainerBlock
  | MarqueeItemBlock
  | MulticolumnContainerBlock
  | ProductDetailTabsContainerBlock
  | ProductDetailTabsTabContentBlock
  | ProductDetailTabsTabNavigationBlock
  | ProductDetailTabsDynamicFeaturesBlock
  | ProductDetailTabsDynamicButtonToFileBlock
  | VideoGridContainerBlock
  | VideoGridVideoCardBlock
  | VideoWithTextContainerBlock
  | HeaderAnnouncementBarAnnouncementBlock
  | HeaderAnnouncementBarCloseButtonBlock
  | HeaderMobileNavBarAccountButtonBlock
  | HeaderMobileNavBarSearchButtonBlock
  | HeaderMobileNavBarHomeButtonBlock
  | HeaderNavigationBarBurgerMenuButtonBlock
  | HeaderNavigationBarMegamenuButtonBlock
  | HeaderNavigationBarSearchButtonBlock
  | HeaderNavigationBarCartButtonBlock
  | HeaderNavigationBarAccountButtonBlock
  | HeaderNavigationBarContainerBlock
  | HeaderNavigationBarDynamicDisplayContainerBlock
  | MainBlogContainerBlock
  | MainBlogFiltersBlock
  | MainBlogAppliedFiltersBlock
  | MainBlogArticleCardsBlock
  | MainBlogFilterButtonBlock
  | MainBlogEmptyStateBlock
  | MainCartCollapsibleBlock
  | MainCartContainerBlock
  | MainCartLineItemsBlock
  | MainCollectionContainerBlock
  | MainCollectionCollapsibleBlock
  | MainCollectionSiblingCollectionsBlock
  | MainCollectionFiltersBlock
  | MainCollectionAppliedFiltersBlock
  | MainCollectionColorOverrideBlock
  | MainCollectionRadioButtonOverrideBlock
  | MainCollectionCheckboxOverrideBlock
  | MainCollectionSortBlock
  | MainCollectionProductCardsBlock
  | MainCollectionFilterSortButtonsBlock
  | MainCollectionEmptyStateBlock
  | MainListCollectionsContainerBlock
  | MainListCollectionsCollectionCardsBlock
  | MainListCollectionsEmptyStateBlock
  | MainProductContainerBlock
  | MainProductAvailabilityBlock
  | MainProductGalleryBlock
  | MainProductThumbnailsBlock
  | MainProductPriceBlock
  | MainProductRatingBlock
  | MainProductQuantitySelectorBlock
  | MainProductAddToCartButtonBlock
  | MainProductDescriptionBlock
  | MainProductOptionColorBlock
  | MainProductOptionColorWCaptionBlock
  | MainProductOptionRadioBlock
  | MainProductOptionRadioDetailedBlock
  | MainProductOptionSelectBlock
  | MainProductVariantSelectorColorBlock
  | MainProductVariantSelectorRadioBlock
  | MainProductVariantSelectorSelectBlock
  | MainProductSiblingColorBlock
  | MainProductSiblingRadioBlock
  | MainProductSiblingSelectBlock
  | MainProductSiblingColorSelectBlock
  | MainProductSubscribeButtonSelectBlock
  | MainProductSubscribeButtonCardBlock
  | MainProductSubscribeButtonSwitchBlock
  | MainProductPaymentTermsBlock
  | MainProductDynamicBuyButtonBlock
  | MainProductDynamicTextBlock
  | MainProductImageBlock
  | MainProductLabelsBlock
  | MainProductBundleCardBlock
  | MainProductDynamicFeatureBlock
  | MainSearchDynamicTextBlock
  | MainSearchContainerBlock
  | MainSearchFiltersBlock
  | MainSearchAppliedFiltersBlock
  | MainSearchColorOverrideBlock
  | MainSearchRadioButtonOverrideBlock
  | MainSearchCheckboxOverrideBlock
  | MainSearchSearchTypeFilterBlock
  | MainSearchSortBlock
  | MainSearchMixedCardsBlock
  | MainSearchFilterSortButtonsBlock
  | MainSearchEmptyStateBlock
  | MainSearchSearchInputBlock
  | ModalAccountMenuContainerBlock
  | ModalCartDrawerContainerBlock
  | ModalCartDrawerCloseButtonBlock
  | ModalCartDrawerPromoCardBlock
  | ModalCartDrawerAnnouncementsBlock
  | ModalCartDrawerAnnouncementBlock
  | ModalCartDrawerAnnouncementCloseButtonBlock
  | ModalMegamenuContainerBlock
  | ModalMegamenuInternationalStoreSelectBlock
  | ModalMegamenuCollectionsBlock
  | ModalSearchDynamicTextBlock
  | ModalSearchStaticSearchSuggestionBlock
  | ModalSearchDynamicSearchSuggestionsBlock
  | ModalSearchProductResultCardsBlock
  | ModalSearchCollectionResultCardsBlock
  | ModalSearchPageResultCardsBlock
  | ModalSearchArticleResultCardsBlock
  | ModalSearchSearchInputBlock
  | ModalSearchContainerBlock
  | ModalSearchLoadingOverlayBlock
  | ModalSidebarMenuCloseButtonBlock
  | ModalSidebarMenuContainerBlock
  | ModalSidebarMenuCollapsibleBlock
  | ModalSidebarMenuCollectionsBlock
  | CardProductCardContainerBlock
  | CardProductCardImageBlock
  | CardProductCardRichtextBlock
  | CardProductCardButtonBlock
  | CardProductCardPriceBlock
  | CardProductCardLabelsBlock
  | CardProductCardRatingBlock
  | CardProductCardAccentLineBlock
  | CardProductCardQuickViewButtonBlock
  | CardProductCardBundleButtonBlock
  | CardProductCardDrawerButtonBlock
  | CardProductCardVariantSelectorSelectBlock
  | CardProductCardVariantSelectorRadioBlock
  | CardProductCardVariantSelectorColorBlock
  | CardProductCardOptionColorBlock
  | CardProductCardOptionRadioBlock
  | CardProductCardOptionSelectBlock;
