import { processWhatsAppData } from "@helpers/whatsapp-processor";

const memes = processWhatsAppData();

export const getMemes = () => {
  return memes;
};
