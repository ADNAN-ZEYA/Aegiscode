import Head from 'next/head';
import Layout from '../../components/Layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title} | AegisCode</title>
      </Head>

      <article className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300 pb-20">
        
        {/* 1. HEADER SECTION */}
        <div className="bg-gray-50 dark:bg-dark-900 border-b border-gray-100 dark:border-dark-800 py-16">
          <div className="max-w-3xl mx-auto px-6">
            
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-600 mb-8 transition">
              <ArrowLeft size={16} /> Back to Home
            </Link>

            {/* Category Tag */}
            {postData.category && (
               <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-brand-600 uppercase bg-brand-100 dark:bg-brand-900/30 rounded-full">
                 {postData.category}
               </span>
            )}

            {/* Title - FORCED WHITE IN DARK MODE */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              {postData.title}
            </h1>

            {/* Meta Data */}
            <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {postData.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                5 min read
              </div>
            </div>

          </div>
        </div>

        {/* 2. CONTENT SECTION */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          
          <div 
            className="
              prose prose-lg max-w-none
              /* Light Mode: Dark Text */
              text-gray-800 
              prose-headings:text-gray-900 
              prose-strong:text-gray-900 
              
              /* Dark Mode: White Text (This fixes your issue) */
              dark:text-gray-300 
              dark:prose-headings:text-white 
              dark:prose-strong:text-white 
              dark:prose-code:text-brand-400
              dark:prose-a:text-brand-400
            "
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
          />

        </div>
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  return {
    props: {
      postData,
    },
  };
}