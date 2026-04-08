export type MemeMediaType = "image" | "video" | "audio";

export interface Meme {
  url: string;
  type: MemeMediaType;
}
