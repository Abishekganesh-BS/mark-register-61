
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Mark Register</h1>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
