import { getAllMessages } from "~/api/memes";
import { MemeItem } from "~/components/atoms/MemeItem";

export const AllMessagesPage = () => {
  const messages = getAllMessages();
  return (
    <section className="flex w-full flex-col items-center p-4">
      <article className="flex flex-col justify-center">
        <table className="w-full table-fixed border-collapse border border-white/15">
          <thead>
            <tr>
              <th className="border border-white/15 px-3 py-2 text-left">
                Posted At
              </th>
              <th className="border border-white/15 px-3 py-2 text-left">
                Author
              </th>
              <th className="w-[150px] border border-white/15 px-3 py-2 text-left">
                Meme
              </th>
              <th className="border border-white/15 px-3 py-2 text-left">
                Data
              </th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message, i) => (
              <tr key={i}>
                <td className="border border-white/15 px-3 py-2 align-top">
                  {message.postedAt.toLocaleString()}
                </td>
                <td className="border border-white/15 px-3 py-2 align-top">
                  {message.postedBy}
                </td>
                <td className="border border-white/15 px-3 py-2 align-top">
                  {message.meme ? <MemeItem meme={message.meme} /> : null}
                </td>
                <td className="border border-white/15 px-3 py-2 align-top">
                  {message.data}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
};
