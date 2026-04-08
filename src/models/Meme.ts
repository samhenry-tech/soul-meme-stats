export type MemeMediaKind = "image" | "video" | "sticker" | "audio";

export interface Meme {
  url: string;
  kind: MemeMediaKind;
}
