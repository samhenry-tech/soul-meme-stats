import type { Meme } from "~/models/Meme";

export interface Message {
  postedAt: Date;
  postedBy: string | null;
  meme: Meme | null;
  data: string | null;
}

export interface MessageWithMeme extends Message {
  meme: Meme;
}
