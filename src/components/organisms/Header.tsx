import { Link } from "@tanstack/react-router";

export const Header = () => (
  <header className="b flex w-full items-center gap-4 p-4">
    <Link to="/">
      <img src="/memeWhite.png" alt="Soul Meme Stats" className="w-20" />
    </Link>
    <Link to="/" className="[&.active]:font-bold">
      Stats
    </Link>
    <Link to="/memes" className="[&.active]:font-bold">
      Memes
    </Link>
  </header>
);
