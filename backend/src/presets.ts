export type ComicFamily = "american" | "asian" | "european";
export type ComicColor = "color" | "grayscale" | "monochrome";

export interface Preset {
  id: string;
  label: string;
  family: ComicFamily;
  color: ComicColor;
  llmPrompt: string;
  imagePrompt: (prompt: string) => string[];
  negativePrompt: (prompt: string) => string[];
}

export const presets: Record<string, Preset> = {
  neutral: {
    id: "neutral",
    label: "Neutral (no style)",
    family: "american",
    color: "color",
    llmPrompt: "",
    imagePrompt: (prompt: string) => [prompt],
    negativePrompt: () => [],
  },
  japanese_manga: {
    id: "japanese_manga",
    label: "Japanese",
    family: "asian",
    color: "grayscale",
    llmPrompt: "japanese manga",
    imagePrompt: (prompt: string) => [
      `grayscale`,
      `detailed drawing`,
      `japanese manga`,
      prompt,
    ],
    negativePrompt: () => [
      "franco-belgian comic",
      "color album",
      "color",
      "american comic",
      "photo",
      "painting",
      "3D render"
    ],
  },
  american_comic_50: {
    id: "american_comic_50",
    label: "American (1950)",
    family: "american",
    color: "color",
    llmPrompt: "american comic",
    imagePrompt: (prompt: string) => [
      "1950",
      "50s",
      `vintage american color comic`,
      prompt,
      "detailed drawing"
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "action",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },
  humanoid: {
    id: "humanoid",
    label: "Humanoid",
    family: "european",
    color: "color",
    llmPrompt: "comic books by Moebius",
    imagePrompt: (prompt: string) => [
      `color comic panel`,
      "style of Moebius",
      `${prompt}`,
      "detailed drawing",
      "french comic panel",
      "franco-belgian style",
      "bande dessinée",
      "single panel",
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },
};

export type PresetName = keyof typeof presets;

export const defaultPreset: PresetName = "american_comic_50";

export const getPreset = (preset?: PresetName): Preset => 
  presets[preset || defaultPreset] || presets[defaultPreset];