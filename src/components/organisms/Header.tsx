import { Link } from "@tanstack/react-router";

export const Header = () => (
  <header className="flex w-full items-center gap-4 border-b border-gray-200 p-4">
    <img src="/logo-white.jpg" alt="Soul Meme Stats" className="h-8" />
    <Link to="/" className="[&.active]:font-bold">
      Stats
    </Link>
    <Link to="/memes" className="[&.active]:font-bold">
      Memes
    </Link>
  </header>
);
