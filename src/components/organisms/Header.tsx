import { Link } from "@tanstack/react-router";

export const Header = () => (
  <header className="flex w-full items-center gap-4 border-b border-gray-200 p-4">
    <h1 className="text-sam-green text-2xl font-semibold">Project Alpha</h1>
    <Link to="/" className="[&.active]:font-bold">
      Home
    </Link>
    <Link to="/memes" className="[&.active]:font-bold">
      Memes
    </Link>
  </header>
);
