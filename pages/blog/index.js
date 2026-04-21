import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getSortedPostsData } from '../../lib/posts';
import { Search, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function BlogIndex({ allPostsData }) {
  const [search, setSearch] = useState('');

  const filteredPosts = allPostsData.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Blog">
      <Head>
        <title>All Articles | AegisCode</title>
      </Head>

      {/* Main Background with Dark Mode Support */}
      <div className="bg-gray-50 dark:bg-dark-950 min-h-screen py-12 md:py-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              The Archive
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              Browse all notes, study plans, and technical guides.
            </p>

            {/* Search Bar (Dark Mode Fixed) */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search by title or topic..."
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-600 shadow-sm transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(({ id, date, title, category, description, image }) => (
                <Link href={`/blog/${id}`} key={id} className="block group">
                  <article className="bg-white dark:bg-dark-900 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-dark-800 shadow-sm hover:shadow-lg hover:border-brand-500 dark:hover:border-brand-500 transition-all duration-300 flex flex-col md:flex-row gap-6">
                    
                    {/* 🖼️ IMAGE SECTION (Only shows if image exists) */}
                    {image && (
                      <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-xl">
                        <img 
                          src={image} 
                          alt={title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Text Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase rounded">
                          {category || 'Tech'}
                        </span>
                        <span className="text-sm text-gray-400">{date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors mb-2">
                        {title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                        {description || "Click to read full article..."}
                      </p>
                      <div className="md:hidden text-brand-600 text-sm font-semibold flex items-center gap-1">
                        Read Post <ArrowRight size={14} />
                      </div>
                    </div>

                    {/* Desktop Arrow */}
                    <div className="hidden md:flex items-center text-brand-600 dark:text-brand-500">
                       <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </div>

                  </article>
                </Link>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">No posts found matching "{search}"</p>
              </div>
            )}
          </div>

        </div>
      </div>
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