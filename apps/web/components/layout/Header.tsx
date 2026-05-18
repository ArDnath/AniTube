"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-50 bg-pastel-purple-100 border-b-4 border-black shadow-brutal">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-pastel-yellow-300 border-3 border-black rounded-lg px-3 py-2 rotate-3 group-hover:rotate-0 transition-transform shadow-brutal">
              <span className="font-black text-2xl uppercase">AniTube</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="font-bold text-black hover:text-pastel-purple-600 transition-colors uppercase"
            >
              Home
            </Link>
            <Link
              href="/search"
              className="font-bold text-black hover:text-pastel-purple-600 transition-colors uppercase"
            >
              Browse
            </Link>
            <Link
              href="/about"
              className="font-bold text-black hover:text-pastel-purple-600 transition-colors uppercase"
            >
              About
            </Link>
            <div className="relative group">
              <button className="font-bold text-black hover:text-pastel-purple-600 transition-colors uppercase">
                Genres
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white border-3 border-black rounded-lg shadow-brutal-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48">
                {[
                  "Action",
                  "Comedy",
                  "Drama",
                  "Fantasy",
                  "Romance",
                  "Sci-Fi",
                  "Slice of Life",
                ].map((genre) => (
                  <Link
                    key={genre}
                    href={`/genre/${genre.toLowerCase().replace(/ /g, "-")}`}
                    className="block px-3 py-2 font-bold hover:bg-pastel-pink-100 rounded uppercase text-sm"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anime..."
                className="w-64 px-4 py-2 pl-10 border-3 border-black rounded-lg font-bold focus:outline-none focus:ring-4 focus:ring-pastel-purple-400 bg-white"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            </div>
          </form>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="hidden md:flex items-center justify-center w-10 h-10 bg-pastel-yellow-300 border-3 border-black rounded-lg hover:scale-110 transition-transform shadow-brutal"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 bg-pastel-pink-300 border-3 border-black rounded-lg flex items-center justify-center shadow-brutal"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anime..."
              className="w-full px-4 py-2 pl-10 border-3 border-black rounded-lg font-bold focus:outline-none focus:ring-4 focus:ring-pastel-purple-400 bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t-4 border-black p-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 font-bold bg-pastel-purple-100 border-3 border-black rounded-lg hover:bg-pastel-purple-200 uppercase"
          >
            Home
          </Link>
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 font-bold bg-pastel-pink-100 border-3 border-black rounded-lg hover:bg-pastel-pink-200 uppercase"
          >
            Browse
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 font-bold bg-pastel-blue-100 border-3 border-black rounded-lg hover:bg-pastel-blue-200 uppercase"
          >
            About
          </Link>
          <div className="space-y-1">
            <div className="px-4 py-2 font-black uppercase text-sm">Genres</div>
            {["Action", "Comedy", "Drama", "Fantasy", "Romance", "Sci-Fi"].map(
              (genre) => (
                <Link
                  key={genre}
                  href={`/genre/${genre.toLowerCase().replace(/ /g, "-")}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-6 py-2 font-bold hover:bg-pastel-yellow-100 rounded uppercase text-sm"
                >
                  {genre}
                </Link>
              ),
            )}
          </div>
          <button
            onClick={toggleTheme}
            className="w-full px-4 py-3 font-bold bg-pastel-yellow-100 border-3 border-black rounded-lg hover:bg-pastel-yellow-200 uppercase flex items-center justify-center gap-2"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      )}
    </header>
  );
}
