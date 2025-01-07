export type AppBlock = {
  id: string;
  type: "app";
};

export type ContainerBlock = {
  id: string;
  type: "container";
};

export type ThemeBlocks = AppBlock | ContainerBlock;
