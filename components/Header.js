import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Search } from 'lucide-react';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              AegisCode
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-white font-medium transition">
              Home
            </Link>
            <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-white font-medium transition">
              Blog
            </Link>
            <Link href="/resources" className="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-white font-medium transition">
              Study Materials
            </Link>
          </nav>

          {/* Right Side: Search + Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Placeholder (Visual only) */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-gray-200 text-sm rounded-full pl-10 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-600 border border-transparent dark:border-dark-700"
              />
              <Search size={14} className="absolute left-3.5 top-2.5 text-gray-400" />
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 transition"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-gray-600 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}