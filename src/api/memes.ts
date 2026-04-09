import { groupBy } from "~/helpers/util";
import { processWhatsAppData } from "~/helpers/whatsapp-processor";
import type { Message, MessageWithMeme } from "~/models/Message";

const messages = (await processWhatsAppData()).filter(
  (message) => message.postedAt > new Date("2026-01-01")
);

const messagesWithMemes: MessageWithMeme[] = messages
  .filter((message) => message.meme !== null)
  .map((message) => ({
    ...message,
    meme: message.meme!,
  }))
  .sort((a, b) => a.postedAt.getTime() - b.postedAt.getTime());

const messagesWithoutMemes = messages.filter(
  (message) => message.meme === null
);

export const getAllMessages = () => {
  return messages;
};

export const getMemes = () => {
  return messagesWithMemes;
};

export const getMemesByAuthor = () => {
  const rows: { author: string; messages: MessageWithMeme[] }[] = [];
  const indexByAuthor = new Map<string, number>();
  for (const message of messagesWithMemes) {
    if (message.postedBy === null) continue;
    const i = indexByAuthor.get(message.postedBy);
    if (i !== undefined) {
      rows[i]!.messages.push(message);
    } else {
      indexByAuthor.set(message.postedBy, rows.length);
      rows.push({ author: message.postedBy, messages: [message] });
    }
  }
  return rows.sort((a, b) => b.messages.length - a.messages.length);
};

const firstMeme = messagesWithMemes[0];

export const getFirstMeme = () => {
  return firstMeme;
};

export const getAuthorWithMostMessagesWithoutMemes = () => {
  const groupedByAuthor = messagesWithoutMemes.reduce(
    (acc, message) => {
      if (message.postedBy === null) return acc;
      acc[message.postedBy] = [...(acc[message.postedBy] ?? []), message];
      return acc;
    },
    {} as Record<string, Message[]>
  );

  const authorCounts = Object.entries(groupedByAuthor)
    .map(([author, messages]) => ({
      author,
      count: messages.length,
    }))
    .sort((a, b) => b.count - a.count);

  return authorCounts[0] ?? { author: null, count: 0 };
};

export const getDayWithMostMemes = () => {
  const groupedByDay = groupBy(messagesWithMemes, "postedAt", (postedAt) => {
    return postedAt.toISOString().slice(0, 10);
  });

  const dayCounts = Array.from(groupedByDay.entries())
    .map(([day, messages]) => ({
      day: new Date(day),
      count: messages.length,
    }))
    .sort((a, b) => b.count - a.count);
  return dayCounts[0] ?? null;
};
