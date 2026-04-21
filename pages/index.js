import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getSortedPostsData } from '../lib/posts';
import { ArrowRight, BookOpen, FileText, Code, Users, BarChart, PenTool } from 'lucide-react';

export default function Home({ allPostsData }) {
  const recentPosts = allPostsData.slice(0, 3); 

  return (
    <Layout home>
      <Head>
        <title>AegisCode | Learn Tech, Build Future</title>
      </Head>

      {/* 1. HERO SECTION */}
      <section className="relative bg-white dark:bg-dark-950 transition-colors duration-300 pt-24 pb-32 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <span className="text-brand-600 font-semibold tracking-wide uppercase text-sm mb-4 block">
            Learn Tech, Build Your Future
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
            Explore our collection of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500">tech notes</span> & study materials.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Enhance your skills with curated roadmaps, security labs, and developer cheatsheets.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/blog" className="px-8 py-4 rounded-xl bg-brand-600 text-white font-bold text-lg hover:bg-brand-500 transition shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2">
              Browse Notes <ArrowRight size={20} />
            </Link>
            <Link href="/resources" className="px-8 py-4 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white border border-gray-200 dark:border-dark-700 font-bold text-lg hover:bg-gray-200 dark:hover:bg-dark-700 transition flex items-center justify-center gap-2">
              Study Materials <BookOpen size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="bg-gray-50 dark:bg-dark-900 py-12 border-y border-gray-200 dark:border-dark-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Curated Notes</h3>
            <p className="text-gray-500 dark:text-gray-400">Covering Cyber, Linux & Web</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl mb-4">
              <BookOpen size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Free Resources</h3>
            <p className="text-gray-500 dark:text-gray-400">Comprehensive learning guides</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Student Focused</h3>
            <p className="text-gray-500 dark:text-gray-400">Simplified for clarity</p>
          </div>
        </div>
      </section>

      {/* 3. POPULAR MATERIALS SECTION */}
      <section className="py-20 bg-white dark:bg-dark-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Popular Study Materials</h2>
              <p className="text-gray-500 dark:text-gray-400">Comprehensive guides to master your skills</p>
            </div>
            <span className="text-gray-400 text-sm cursor-not-allowed">
              View All <ArrowRight size={16} className="inline"/>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - LOCKED */}
            <div className="h-full bg-gray-50 dark:bg-dark-900 p-8 rounded-2xl border border-gray-100 dark:border-dark-800 opacity-60 relative flex flex-col cursor-not-allowed">
              <div className="w-14 h-14 bg-white dark:bg-dark-800 rounded-xl flex items-center justify-center text-blue-500 mb-6 shadow-sm">
                <Code size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">HTML & CSS Basics</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed flex-1">
                The building blocks of the web. Learn semantic HTML tags and modern Flexbox layouts.
              </p>
              <div className="flex justify-between items-center border-t border-gray-200 dark:border-dark-800 pt-4 mt-auto">
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">Frontend</span>
                <span className="text-gray-400 text-sm font-semibold">Coming Soon...</span>
              </div>
            </div>

            {/* Card 2 - PYTHON (UNLOCKED) */}
            <Link href="/blog/python-lesson-01-basics" className="group h-full bg-white dark:bg-dark-900 p-8 rounded-2xl border border-gray-100 dark:border-dark-800 shadow-sm hover:shadow-md hover:border-green-500 transition relative flex flex-col">
              <div className="w-14 h-14 bg-green-50 dark:bg-dark-800 rounded-xl flex items-center justify-center text-green-600 mb-6 shadow-sm group-hover:bg-green-100 transition">
                <BarChart size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 transition">Python Zero to Hero</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed flex-1">
                Master lists, loops, functions, and basic data manipulation with Pandas.
              </p>
              <div className="flex justify-between items-center border-t border-gray-200 dark:border-dark-800 pt-4 mt-auto">
                <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold uppercase">Python</span>
                <span className="text-green-600 text-sm font-bold flex items-center gap-1">New Release <ArrowRight size={14}/></span>
              </div>
            </Link>

            {/* Card 3 - LOCKED */}
            <div className="h-full bg-gray-50 dark:bg-dark-900 p-8 rounded-2xl border border-gray-100 dark:border-dark-800 opacity-60 relative flex flex-col cursor-not-allowed">
              <div className="w-14 h-14 bg-white dark:bg-dark-800 rounded-xl flex items-center justify-center text-purple-500 mb-6 shadow-sm">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Linux & Networking</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed flex-1">
                Learn to navigate the terminal, file permissions, and basic Nmap scanning.
              </p>
              <div className="flex justify-between items-center border-t border-gray-200 dark:border-dark-800 pt-4 mt-auto">
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase">Security</span>
                <span className="text-gray-400 text-sm font-semibold">Coming Soon...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LATEST LOGS (Fixed: Removed "Coming Soon") */}
      <section className="py-20 bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Blog Posts</h2>
            <Link href="/blog" className="text-brand-600 hover:underline">View All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {recentPosts.length > 0 ? (
              recentPosts.map(({ id, date, title, description, category, image }) => (
                <Link href={`/blog/${id}`} key={id} className="group">
                  <article className="h-full bg-white dark:bg-dark-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-dark-800 shadow-sm hover:shadow-md hover:border-brand-500 transition flex flex-col">
                    {/* IMAGE SECTION */}
                    <div className="h-48 overflow-hidden relative bg-gray-200 dark:bg-gray-800">
                      {image ? (
                        <img 
                          src={image} 
                          alt={title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 transition-colors flex items-center justify-center">
                          <span className="text-dark-700 dark:text-dark-600 font-bold text-4xl opacity-20">AegisCode</span>
                        </div>
                      )}
                    </div>
                    
                    {/* TEXT CONTENT */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-bold uppercase rounded-full">
                          {category || 'Tech'}
                        </span>
                        <span className="text-gray-400 text-xs">{date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-brand-500 transition">
                        {title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                        {description || "Click to read more..."}
                      </p>
                      
                      {/* THIS IS FIXED NOW: Shows "Read Article" instead of "Coming Soon" */}
                      <span className="text-brand-600 text-sm font-bold flex items-center gap-1 mt-auto">
                        Read Article <ArrowRight size={16} />
                      </span>
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              // Empty State
              <div className="col-span-3 text-center py-10">
                 <p className="text-gray-500 dark:text-gray-400">No logs found yet.</p>
              </div>
            )}

            {/* 3rd PLACEHOLDER CARD (Keep this one locked) */}
            <div className="group h-full bg-gray-50 dark:bg-dark-900 rounded-2xl border border-dashed border-gray-300 dark:border-dark-700 flex flex-col items-center justify-center p-8 text-center opacity-60 cursor-not-allowed">
                <div className="w-16 h-16 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <PenTool size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Writing in Progress...</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    New guide about <strong>Podman & DevOps</strong>.
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHEATSHEETS SECTION */}
      <section className="py-20 bg-white dark:bg-dark-950 transition-colors duration-300 border-t border-gray-100 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Dev Cheatsheets</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Don't memorize syntax. Just bookmark these.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Linux', 'Git', 'Docker', 'Python', 'SQL', 'React', 'Bash', 'Vim'].map((tech) => (
              <div key={tech} className="flex items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-100 dark:border-dark-700 opacity-50 cursor-not-allowed">
                <span className="font-semibold text-gray-500 dark:text-gray-500">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}