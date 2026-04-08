import type { Meme, MemeMediaType } from "@models/Meme";
import type { Message } from "@models/Message";
import chatExport from "../data/WhatsApp Chat with Memes.txt?raw";

export const processWhatsAppData = () => {
  return parseWhatsAppExportToMemes(chatExport);
};

const parseWhatsAppExportToMemes = (whatsAppMessagesText: string) => {
  const messages = getMessagesFromText(whatsAppMessagesText);
  const parsedMessages = messages.map((message) =>
    parseDataFromMessage(message)
  );
  return parsedMessages.filter((message) => message !== null);
};

const MESSAGE_HEADER_SPLIT =
  /(?=^\d{1,2}\/\d{1,2}\/\d{2,4},\s*\d{1,2}:\d{2}\s*(?:am|pm)\s+-\s+)/gim;

const getMessagesFromText = (whatsAppMessagesText: string): string[] => {
  const normalized = whatsAppMessagesText.replace(/\u202f/g, " ");
  return normalized
    .split(MESSAGE_HEADER_SPLIT)
    .filter((chunk) => chunk.length > 0);
};

const DAY_PART = "\\d{1,2}";
const MONTH_PART = "\\d{1,2}";
const YEAR_PART = "\\d{2,4}";
const DATE_PART = `${DAY_PART}/${MONTH_PART}/${YEAR_PART}`;

const HOUR_PART = "\\d{1,2}";
const MINUTE_PART = "\\d{2}";
const TIME_PART = `${HOUR_PART}:${MINUTE_PART}`;

const AM_PM_PART = "am|pm";
const POSTED_AT_GROUP = `(${DATE_PART},\\s*${TIME_PART}\\s*(?:${AM_PM_PART}))`;

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
  if (!match) {
    console.error(`Unrecognised message: ${normalisedMessage}`);
    return null;
  }

  const postedAtRaw = match[1];
  if (!postedAtRaw) {
    console.error(`Unrecognised postedAt: ${normalisedMessage}`);
    return null;
  }

  const postedAt = parsePostedAt(postedAtRaw);
  if (!postedAt) return null;

  const author = match[2];
  const attachment = match[3];
  const rest = match[4];

  const parsedMessage: Message = {
    postedAt,
    postedBy: author ?? null,
    meme: attachment ? parseAttachment(attachment) : null,
    data: rest ?? null,
  };

  return parsedMessage;
};

const DATE_GROUP = `(${DAY_PART})/(${MONTH_PART})/(${YEAR_PART})`;
const TIME_GROUP = `(${HOUR_PART}):(${MINUTE_PART})`;
const AM_PM_GROUP = `(${AM_PM_PART})`;

const POSTED_AT_REGEX = new RegExp(
  `^${DATE_GROUP},\\s*${TIME_GROUP}\\s*${AM_PM_GROUP}$`,
  "i"
);

const parsePostedAt = (postedAtString: string) => {
  const m = POSTED_AT_REGEX.exec(postedAtString);
  if (!m) {
    console.error(`Unrecognised postedAt: ${postedAtString}`);
    return null;
  }

  const day = parseInt(m[1] ?? "", 10);
  const month = parseInt(m[2] ?? "", 10);
  let year = parseInt(m[3] ?? "", 10);
  if (year < 100) year += 2000;

  let hours = parseInt(m[4] ?? "", 10);
  const minutes = parseInt(m[5] ?? "", 10);

  const amOrPm = (m[6] ?? "").toLowerCase();
  if (amOrPm !== "am" && amOrPm !== "pm") {
    console.error(`Unrecognised postedAt amOrPm: ${postedAtString}`);
    return null;
  }
  if (amOrPm === "pm" && hours < 12) hours += 12;
  if (amOrPm === "am" && hours === 12) hours = 0;
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};

const parseAttachment = (attachment: string): Meme | null => {
  const type = parseFileExtension(attachment);
  if (!type) return null;
  return {
    url: attachment,
    type,
  };
};

const parseFileExtension = (fileName: string): MemeMediaType | null => {
  const extension = fileName.split(".").pop();
  if (!extension) {
    console.error(`Unrecognised file extension: ${fileName}`);
    return null;
  }
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) return "image";
  if (["mp4", "mov", "avi", "webm"].includes(extension)) return "video";
  if (["mp3", "wav", "ogg", "m4a"].includes(extension)) return "audio";

  console.error(`Unrecognised file extension: ${fileName}`);
  return null;
};
