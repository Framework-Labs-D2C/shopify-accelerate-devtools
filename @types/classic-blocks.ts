import type { _Article_liquid, _Video_liquid, _BlockTag, _Product_liquid, _Image_liquid, _Color_liquid } from "./shopify";

export type ArticleContentBlock = {
  id: string;
  settings: {
    /** Input type: checkbox */
    blog_navigation: boolean;
    /** Input type: text */
    blog_navigation_class?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: article */
    default_article?: _Article_liquid | string;
    /** Input type: inline_richtext */
    next_button?: string;
    /** Input type: inline_richtext */
    prev_button?: string;
    /** Input type: text */
    title?: string;
  };
  type: "article_content";
};

export type BackgroundVideoBlock = {
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
    /** Input type: select */
    object_fit: "object-cover" | "object-contain";
    /** Input type: select */
    responsive_visibility: "" | "mobile-only" | "desktop-tablet-only";
    /** Input type: color_background */
    background_gradient?: string;
    /** Input type: video */
    desktop_video?: _Video_liquid;
    /** Input type: text */
    desktop_video_id?: string;
    /** Input type: video */
    mobile_video?: _Video_liquid;
    /** Input type: text */
    mobile_video_id?: string;
    /** Input type: number */
    z_index?: number;
  };
  type: "background_video";
};

export type BackgroundVideoControlsBlock = {
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    paused_button_class?: string;
    /** Input type: inline_richtext */
    paused_label?: string;
    /** Input type: text */
    playing_button_class?: string;
    /** Input type: inline_richtext */
    playing_label?: string;
    /** Input type: text */
    target_id?: string;
    /** Input type: text */
    title?: string;
  };
  type: "background_video_controls";
};

export type BeforeAndAfterBlock = {
  id: string;
  settings: {
    /** Input type: image_picker */
    after_image?: _Image_liquid | string;
    /** Input type: inline_richtext */
    after_label?: string;
    /** Input type: color_background */
    background_gradient?: string;
    /** Input type: image_picker */
    before_image?: _Image_liquid | string;
    /** Input type: inline_richtext */
    before_label?: string;
    /** Input type: color */
    border_color?: _Color_liquid | string;
    /** Input type: text */
    border_width_radius?: string;
    /** Input type: inline_richtext */
    caption?: string;
    /** Input type: text */
    caption_class?: string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: product_list */
    products?: _Product_liquid[];
    /** Input type: inline_richtext */
    subtitle?: string;
    /** Input type: text */
    subtitle_class?: string;
    /** Input type: text */
    title?: string;
    /** Input type: text */
    width_height_aspect_object_fit?: string;
  };
  type: "before_and_after";
};

export type ImageWithContentBlock = {
  id: string;
  settings: {
    /** Input type: richtext */
    additional_content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    additional_content_class?: string;
    /** Input type: color_background */
    background_gradient?: string;
    /** Input type: color */
    border_color?: _Color_liquid | string;
    /** Input type: text */
    border_width_radius?: string;
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    flex_direction_align_x_align_y_gap_wrap?: string;
    /** Input type: text */
    flex_row_wrap_align_x_align_y_gap?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: text */
    margin_top_bottom_left_right_align?: string;
    /** Input type: text */
    padding_top_bottom_left_right?: string;
    /** Input type: text */
    title?: string;
    /** Input type: url */
    url?: string;
    /** Input type: text */
    width_height_aspect_object_fit?: string;
  };
  type: "image_with_content";
};

export type ListItemsBlock = {
  id: string;
  settings: {
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    content_list?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    flex_direction_align_x_align_y_gap_wrap?: string;
    /** Input type: text */
    title?: string;
  };
  type: "list_items";
};

export type SearchInputBlock = {
  id: string;
  settings: {
    /** Input type: checkbox */
    allow_autocomplete: boolean;
    /** Input type: checkbox */
    include_articles: boolean;
    /** Input type: checkbox */
    include_pages: boolean;
    /** Input type: checkbox */
    include_products: boolean;
    /** Input type: text */
    content?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_value?: string;
    /** Input type: text */
    flex_direction_align_x_align_y_gap_wrap?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    name?: string;
    /** Input type: text */
    placeholder?: string;
    /** Input type: inline_richtext */
    prefix?: string;
    /** Input type: inline_richtext */
    suffix?: string;
    /** Input type: text */
    title?: string;
  };
  type: "search_input";
};

export type SelectInputBlock = {
  id: string;
  settings: {
    /** Input type: text */
    content?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    name?: string;
    /** Input type: textarea */
    options?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "select_input";
};

export type TestimonialCardBlock = {
  id: string;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: color */
    border_color?: _Color_liquid | string;
    /** Input type: text */
    border_width_radius?: string;
    /** Input type: color */
    color_override?: _Color_liquid | string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    flex_direction_align_x_align_y_gap_wrap?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: text */
    padding_top_bottom_left_right?: string;
    /** Input type: text */
    title?: string;
    /** Input type: text */
    width_height_aspect_object_fit?: string;
  };
  type: "testimonial_card";
};

export type TestimonialCollageBlock = {
  id: string;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: color */
    background_color_products?: _Color_liquid | string;
    /** Input type: color */
    border_color?: _Color_liquid | string;
    /** Input type: text */
    border_width_radius?: string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    grid_cols_align_x_align_y_gap?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: product_list */
    products?: _Product_liquid[];
    /** Input type: text */
    scroll_button_class?: string;
    /** Input type: text */
    title?: string;
    /** Input type: video */
    video?: _Video_liquid;
    /** Input type: richtext */
    video_caption?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    video_caption_class?: string;
    /** Input type: text */
    width_height_aspect_object_fit?: string;
  };
  type: "testimonial_collage";
};

export type TextCardBlock = {
  id: string;
  settings: {
    /** Input type: color_background */
    background_gradient?: string;
    /** Input type: color */
    border_color?: _Color_liquid | string;
    /** Input type: text */
    border_width_radius?: string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    flex_row_wrap_align_x_align_y_gap?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: text */
    padding_top_bottom_left_right?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
    /** Input type: url */
    url?: string;
    /** Input type: text */
    width_height_aspect?: string;
  };
  type: "text_card";
};

export type TextInputBlock = {
  id: string;
  settings: {
    /** Input type: select */
    type: "text" | "textarea" | "email" | "password" | "url";
    /** Input type: text */
    autocomplete?: string;
    /** Input type: text */
    content?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_value?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    name?: string;
    /** Input type: text */
    placeholder?: string;
    /** Input type: inline_richtext */
    prefix?: string;
    /** Input type: inline_richtext */
    suffix?: string;
    /** Input type: text */
    title?: string;
  };
  type: "text_input";
};

export type ClassicThemeBlocks =
  | ArticleContentBlock
  | BackgroundVideoBlock
  | BackgroundVideoControlsBlock
  | BeforeAndAfterBlock
  | ImageWithContentBlock
  | ListItemsBlock
  | SearchInputBlock
  | SelectInputBlock
  | TestimonialCardBlock
  | TestimonialCollageBlock
  | TextCardBlock
  | TextInputBlock;
