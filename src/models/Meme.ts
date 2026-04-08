export type MemeMediaType = "image" | "video" | "audio";

export interface Meme {
  src: string;
  type: MemeMediaType;
  width: number;
  height: number;
}
