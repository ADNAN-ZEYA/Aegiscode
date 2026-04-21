import Head from 'next/head';
import Header from './Header';
import Link from 'next/link';
import Newsletter from './Newsletter';

export default function Layout({ children, home, title }) {
  const siteTitle = "AegisCode | Simplified Tech & Prep";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-900 font-sans text-slate-900 dark:text-gray-100 transition-colors duration-300">
      <Head>
        <title>{title ? `${title} | AegisCode` : siteTitle}</title>
        <meta name="description" content="Tech notes, security labs, and cheat sheets." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow w-full">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-dark-950 border-t border-gray-200 dark:border-dark-800 pt-16 pb-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand */}
            <div className="col-span-1 md:col-span-1">
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                Aegis<span className="text-brand-600">Code</span>
              </span>
              <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Open source notes for developers. <br/>
                Built for clarity, not for clicks.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-gray-900 dark:text-white font-bold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="/" className="hover:text-brand-600 transition">Home</Link></li>
                <li><Link href="/blog" className="hover:text-brand-600 transition">All Blogs</Link></li>
                <li><Link href="/resources" className="hover:text-brand-600 transition">Roadmaps</Link></li>
                <li><Link href="/about" className="hover:text-brand-600 transition">About Us</Link></li>
              </ul>
            </div>

            {/* Resources & Cheatsheets */}
            <div>
              <h4 className="text-gray-900 dark:text-white font-bold mb-4">Cheatsheets</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="/resources" className="hover:text-brand-600 transition">Linux Commands</Link></li>
                <li><Link href="/resources" className="hover:text-brand-600 transition">Git & GitHub</Link></li>
                <li><Link href="/resources" className="hover:text-brand-600 transition">Python Security</Link></li>
                <li><Link href="/resources" className="hover:text-brand-600 transition">SQL Basics</Link></li>
              </ul>
            </div>

            {/* Subscribe */}
             <div>
              <h4 className="text-gray-900 dark:text-white font-bold mb-4">Newsletter</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Get new cheatsheets directly to your inbox.</p>
              
              {/* Correct usage of the Newsletter Component */}
              <Newsletter />
              
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-dark-800 pt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-600">
              © {new Date().getFullYear()} AegisCode.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}