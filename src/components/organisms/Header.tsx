import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { Link } from "@tanstack/react-router";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { revealDate } from "~/constants";

export const Header = () => (
  <header className="flex w-full items-center gap-4 border-b border-gray-200 p-4">
    <img src="/memeWhite.png" alt="Soul Meme Stats" className="w-20" />
    <Link to="/" className="[&.active]:font-bold">
      Stats
    </Link>
    <Link to="/memes" className="[&.active]:font-bold">
      Memes
    </Link>
    {revealDate > new Date() && (
      <div className="ml-auto flex items-center gap-4">
        Results will be shown in:
        <FlipClockCountdown
          to={revealDate}
          className="text-sm"
          digitBlockStyle={{ width: 20, height: 30, fontSize: 15 }}
          separatorStyle={{ size: 2 }}
        />
      </div>
    )}
  </header>
);
