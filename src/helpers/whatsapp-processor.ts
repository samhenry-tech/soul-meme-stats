import type { Meme, MemeMediaType } from "~/models/Meme";
import type { Message } from "~/models/Message";
import chatExport from "~/data/_chat.txt?raw";

export const processWhatsAppData = async (): Promise<Message[]> => {
  return parseWhatsAppExportToMemes(chatExport);
};

const parseWhatsAppExportToMemes = async (
  whatsAppMessagesText: string
): Promise<Message[]> => {
  const withoutBidiMarks = whatsAppMessagesText.replace(/[\u200e\u200f]/g, "");
  const messages = getMessagesFromText(withoutBidiMarks);
  console.log(messages);
  const parsedMessages = await Promise.all(
    messages.map((message) => parseDataFromMessage(message))
  );
  return parsedMessages.filter((message) => message !== null);
};

const MESSAGE_HEADER_SPLIT =
  /\r?\n(?=\s*\[\d{1,2}\/\d{1,2}\/\d{2,4},\s*\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm)\s*\])/gi;

const getMessagesFromText = (whatsAppMessagesText: string): string[] => {
  const normalized = whatsAppMessagesText.replace(/\u202f/g, " ");
  return normalized
    .split(MESSAGE_HEADER_SPLIT)
    .filter((chunk) => chunk.trim().length > 0);
};

const DAY_PART = "\\d{1,2}";
const MONTH_PART = "\\d{1,2}";
const YEAR_PART = "\\d{2,4}";
const DATE_PART = `${DAY_PART}/${MONTH_PART}/${YEAR_PART}`;

const HOUR_PART = "\\d{1,2}";
const MINUTE_PART = "\\d{2}";
const SECOND_PART = "\\d{2}";
const TIME_PART = `${HOUR_PART}:${MINUTE_PART}:${SECOND_PART}`;
const AM_PM_PART = "am|pm";
const POSTED_AT_GROUP = `\\[(${DATE_PART},\\s*${TIME_PART}\\s*(?:${AM_PM_PART}))\\]`;

const AUTHOR_GROUP = `([^:\\n]+):\\s*`;

const DATA_GROUP = `([\\s\\S]*?)`;
const ATTACHMENT_GROUP = `(?:\\s*<attached:\\s*([^>]+)>\\s*)?`;

const MESSAGE_REGEX = new RegExp(
  `^\\s*${POSTED_AT_GROUP}\\s+${AUTHOR_GROUP}${DATA_GROUP}${ATTACHMENT_GROUP}$`,
  "im"
);

const parseDataFromMessage = async (
  message: string
): Promise<Message | null> => {
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

  const data = match[3]?.trim() ?? "";

  const authorRaw = match[2]?.trim();
  const author = authorRaw ? parseAuthor(authorRaw, data) : null;

  const attachment = match[4]?.trim() ? match[4] : null;

  const parsedMessage: Message = {
    postedAt,
    postedBy: author ?? null,
    meme: attachment ? await parseAttachment(attachment) : null,
    data: data ?? null,
  };

  return parsedMessage;
};

const DATE_GROUP = `(${DAY_PART})/(${MONTH_PART})/(${YEAR_PART})`;
const TIME_GROUP = `(${HOUR_PART}):(${MINUTE_PART}):(${SECOND_PART})`;
const AM_PM_GROUP = `(${AM_PM_PART})`;

const POSTED_AT_REGEX = new RegExp(
  `^${DATE_GROUP},\\s*${TIME_GROUP}\\s*${AM_PM_GROUP}$`,
  "i"
);

const parsePostedAt = (postedAtString: string) => {
  const m = POSTED_AT_REGEX.exec(postedAtString.trim());
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
  const seconds = m[6] ? parseInt(m[6], 10) : 0;

  const amOrPm = (m[7] ?? "").toLowerCase();
  if (amOrPm !== "am" && amOrPm !== "pm") {
    console.error(`Unrecognised postedAt amOrPm: ${postedAtString}`);
    return null;
  }
  if (amOrPm === "pm" && hours < 12) hours += 12;
  if (amOrPm === "am" && hours === 12) hours = 0;
  return new Date(year, month - 1, day, hours, minutes, seconds, 0);
};

const imageUrls = import.meta.glob<string>(
  "../data/*.{jpg,jpeg,png,gif,webp,mp4}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const parseAuthor = (author: string, data: string): string | null => {
  if (data.includes(`removed ${author}`)) return null;
  const normalized = author.trim().replace(/^~\s*/, "");
  return normalized;
};

const parseAttachment = async (attachment: string): Promise<Meme | null> => {
  const type = parseFileExtension(attachment);
  if (!type) return null;

  if (type === "audio") {
    return null;
  }

  const url = imageUrls[`../data/${attachment}`];
  if (!url) {
    console.error(`Unrecognised image: ${attachment}`);
    return null;
  }

  const dimensions =
    type === "image"
      ? await getImageDimensions(url)
      : await getVideoDimensions(url);
  if (!dimensions) {
    console.error(`Could not read media dimensions: ${attachment}`);
    return null;
  }

  return {
    src: url,
    type,
    width: dimensions.width,
    height: dimensions.height,
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

const getImageDimensions = (
  url: string
): Promise<{ width: number; height: number } | null> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = url;
  });

const getVideoDimensions = (
  url: string
): Promise<{ width: number; height: number } | null> =>
  new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    const finish = (value: { width: number; height: number } | null) => {
      video.removeAttribute("src");
      video.load();
      resolve(value);
    };
    video.onloadedmetadata = () =>
      finish({ width: video.videoWidth, height: video.videoHeight });
    video.onerror = () => finish(null);
    video.src = url;
  });
