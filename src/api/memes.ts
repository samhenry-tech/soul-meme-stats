import { processWhatsAppData } from "@helpers/whatsapp-processor";

const messages = processWhatsAppData();

const messagesWithMemes = messages.filter((message) => message.meme !== null);

export const getMemes = () => {
  return messagesWithMemes;
};
