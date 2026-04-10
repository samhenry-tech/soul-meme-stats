import { getAllMessages } from "~/api/memes";
import { MemeItem } from "~/components/atoms/MemeItem";
import { additionalStoredNonMemes } from "~/data/additionalNonMemes";
import { useLocalStorage } from "usehooks-ts";

/** Gridlines + padding once on the table via descendant selectors */
const tableClassName =
  "w-full min-w-[640px] table-fixed border-collapse border border-white/15 " +
  "[&_th]:border [&_th]:border-white/15 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:align-top " +
  "[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-slate-950/95 [&_thead_th]:backdrop-blur-sm supports-backdrop-filter:[&_thead_th]:bg-slate-950/80 " +
  "[&_td]:border [&_td]:border-white/15 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top " +
  "[&_tbody_tr]:even:bg-white/4";

const ADDITIONAL_NON_MEMES_KEY = "additional-non-memes";

export const AllMessagesPage = () => {
  const messages = getAllMessages();

  const [additionalNonMemes, setAdditionalNonMemes] = useLocalStorage<number[]>(
    ADDITIONAL_NON_MEMES_KEY,
    additionalStoredNonMemes
  );

  const handleIsAMemeChange = (id: number, isAMeme: boolean) => {
    if (isAMeme) {
      setAdditionalNonMemes((prev) => prev.filter((id) => id !== id));
    } else {
      setAdditionalNonMemes((prev) => [...prev, id]);
    }
  };

  const copyAdditionalNonMemes = async () => {
    await navigator.clipboard.writeText(JSON.stringify(additionalNonMemes));
  };

  return (
    <>
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white cursor-pointer"
        type="button"
        onClick={() => {
          void copyAdditionalNonMemes();
        }}
      >
        Copy Additional Non Memes
      </button>
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
                {messages.map((message, i) => {
                  const hasMemeInData = message.meme !== null;
                  const countsAsMeme =
                    hasMemeInData && !additionalNonMemes.includes(i);

                  return (
                    <tr key={`${message.postedAt.toISOString()}-${i}`}>
                      <td>{i}</td>
                      <td>{message.postedAt.toLocaleString()}</td>
                      <td>{message.postedBy}</td>
                      <td>
                        {message.meme ? <MemeItem meme={message.meme} /> : null}
                      </td>
                      <td>{message.data}</td>
                      <td>
                        {hasMemeInData ? (
                          <div>
                            <label className="inline-flex cursor-pointer items-center gap-1">
                              <input
                                type="radio"
                                name={`is-meme-${i}`}
                                checked={countsAsMeme}
                                onChange={() => handleIsAMemeChange(i, true)}
                              />
                              Yes
                            </label>
                            <label className="ml-2 inline-flex cursor-pointer items-center gap-1">
                              <input
                                type="radio"
                                name={`is-meme-${i}`}
                                checked={!countsAsMeme}
                                onChange={() => handleIsAMemeChange(i, false)}
                              />
                              No
                            </label>
                          </div>
                        ) : (
                          "No"
                        )}
                        {additionalNonMemes.includes(i) ? (
                          <span className="text-red-500">
                            (Additional Non-Meme)
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </>
  );
};
