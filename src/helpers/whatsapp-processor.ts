import type { Message } from "@models/Message";
import chatExport from "../data/WhatsApp Chat with Memes.txt?raw";

export const processWhatsAppData = () => {
  return parseWhatsAppExportToMemes(chatExport);
};

/**
 * Parse a full WhatsApp `.txt` export into `Meme` rows (attachment messages
 * only).
 */
const parseWhatsAppExportToMemes = (whatsAppMessagesText: string) => {
  const messages = getMessagesFromText(whatsAppMessagesText);
  return messages.map((message) => parseDataFromMessage(message));
};

const MESSAGE_HEADER_SPLIT =
  /(?=^\d{1,2}\/\d{1,2}\/\d{2,4},\s*\d{1,2}:\d{2}\s*(?:am|pm)\s+-\s+)/gim;

const getMessagesFromText = (whatsAppMessagesText: string): string[] => {
  const normalized = whatsAppMessagesText.replace(/\u202f/g, " ");
  return normalized
    .split(MESSAGE_HEADER_SPLIT)
    .filter((chunk) => chunk.length > 0);
};

const DATE_PART = "\\d{1,2}/\\d{1,2}/\\d{2,4}";
const TIME_PART = "\\d{1,2}:\\d{2}";
const AM_PM_PART = "(?:am|pm)";
const POSTED_AT_GROUP = `(${DATE_PART},\\s*${TIME_PART}\\s*${AM_PM_PART})`;

const AUTHOR_GROUP = `(?:([^:\\n]+):\\s*)?`;
const ATTACHMENT_GROUP = `(?:(.+?)\\s*\\(file attached\\)\\s*)?`;
const REST_GROUP = `([\\s\\S]*)`;

const MESSAGE_REGEX = new RegExp(
  `^${POSTED_AT_GROUP}\\s+-\\s*${AUTHOR_GROUP}${ATTACHMENT_GROUP}${REST_GROUP}$`,
  "im"
);

const parseDataFromMessage = (message: string): Message | null => {
  const normalisedMessage = message.replace(/\u202f/g, " ").trim();
  const match = MESSAGE_REGEX.exec(normalisedMessage);
  if (!match) return null;
  const postedAtRaw = match[1];
  if (!postedAtRaw) return null;

  let postedAt: Date;
  try {
    postedAt = parsePostedAt(postedAtRaw);
  } catch {
    return null;
  }

  const author = match[2];
  const attachment = match[3];
  const rest = match[4];

  const parsedMessage: Message = {
    postedAt,
    postedBy: author ?? null,
    meme: attachment ? { url: attachment, kind: "image" } : null,
    data: rest ?? null,
  };

  return parsedMessage;
};

  const DATE_PART_CAPTURED = DATE_PART.replace(
    /\\d\{1,2\}/g,
    "(\\d{1,2})"
  ).replace(/\\d\{2,4\}/, "(\\d{2,4})");
  const TIME_PART_CAPTURED = TIME_PART.replace(
    "\\d{1,2}:",
    "(\\d{1,2}):"
  ).replace(":\\d{2}", ":(\\d{2})");
  const AM_PM_CAPTURED = AM_PM_PART.replace("(?:am|pm)", "(am|pm)");

const POSTED_AT_REGEX = new RegExp(
  `^${DATE_PART_CAPTURED},\\s*${TIME_PART_CAPTURED}\\s*${AM_PM_CAPTURED}$`,
  "i"
);

const parsePostedAt = (postedAtString: string): Date => {
  const m = POSTED_AT_REGEX.exec(postedAtString.trim());
  if (!m) throw new Error(`Unrecognised postedAt: ${postedAtString}`);
  const day = parseInt(m[1] ?? "", 10);
  const month = parseInt(m[2] ?? "", 10);
  let year = parseInt(m[3] ?? "", 10);
  if (year < 100) year += 2000;
  let hours = parseInt(m[4] ?? "", 10);
  const minutes = parseInt(m[5] ?? "", 10);
  const ap = (m[6] ?? "").toLowerCase();
  if (ap === "pm" && hours < 12) hours += 12;
  if (ap === "am" && hours === 12) hours = 0;
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};
