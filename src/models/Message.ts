import type { Meme } from "./Meme";

export interface Message {
  postedAt: Date;
  postedBy: string | null;
  meme: Meme | null;
  data: string | null;
}
