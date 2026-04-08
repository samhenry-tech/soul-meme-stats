import { processWhatsAppData } from "@helpers/whatsapp-processor";
import type { MessageWithMeme } from "@models/Message";

const messages = await processWhatsAppData();

const messagesWithMemes: MessageWithMeme[] = messages
  .filter(
    (message) =>
      message.meme !== null && message.postedAt > new Date("2026-01-01")
  )
  .map((message) => ({
    ...message,
    meme: message.meme!,
  }));

export const getMemes = () => {
  return messagesWithMemes;
};
