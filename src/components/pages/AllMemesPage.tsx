import { getAllMessages } from "~/api/memes";
import { MemeItem } from "~/components/atoms/MemeItem";
import { useState } from "react";

/** Gridlines + padding once on the table via descendant selectors */
const tableClassName =
  "w-full min-w-[640px] table-fixed border-collapse border border-white/15 " +
  "[&_th]:border [&_th]:border-white/15 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:align-top " +
  "[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-slate-950/95 [&_thead_th]:backdrop-blur-sm supports-backdrop-filter:[&_thead_th]:bg-slate-950/80 " +
  "[&_td]:border [&_td]:border-white/15 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top " +
  "[&_tbody_tr]:even:bg-white/4";

export const AllMessagesPage = () => {
  const messages = getAllMessages();

  const [isAMemeAdjustments, setIsAMemeAdjustments] = useState<number[]>([]);

  return (
    <section className="flex w-full flex-col items-center p-4">
      <article className="flex w-full max-w-full flex-col justify-center">
        <div className="overflow-x-auto rounded-lg">
          <table className={tableClassName}>
            <colgroup>
              <col className="w-[50px]" />
              <col />
              <col />
              <col className="w-[150px]" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Posted At</th>
                <th scope="col">Author</th>
                <th scope="col">Meme</th>
                <th scope="col">Data</th>
                <th scope="col">Is A Meme</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message, i) => (
                <tr key={`${message.postedAt.toISOString()}-${i}`}>
                  <td>{i}</td>
                  <td>{message.postedAt.toLocaleString()}</td>
                  <td>{message.postedBy}</td>
                  <td>
                    {message.meme ? <MemeItem meme={message.meme} /> : null}
                  </td>
                  <td>{message.data}</td>
                  <td>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name={`is-meme-${i}`}
                          value="Yes"
                          checked={!!message.meme}
                        />
                        Yes
                      </label>
                      <label className="ml-2">
                        <input
                          type="radio"
                          name={`is-meme-${i}`}
                          value="No"
                          checked={!message.meme}
                        />
                        No
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};
