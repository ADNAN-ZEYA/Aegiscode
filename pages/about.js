import Head from 'next/head';
import Layout from '../components/Layout';
import { Shield, Zap, UserX, Mail } from 'lucide-react';

export default function About() {
  return (
    <Layout title="About">
      <Head>
        <title>About AegisCode</title>
      </Head>

      {/* Main Container */}
      <div className="bg-white dark:bg-dark-950 min-h-screen py-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Building the <span className="text-brand-600">Field Manual</span> <br />
              for Developers.
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              AegisCode is an independent learning hub created to simplify concepts for students. 
              Whether you are preparing for exams, diving into Cybersecurity, or training models, 
              resources should be clear, direct, and free.
            </p>
          </div>

          {/* The 3 Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Card 1 */}
            <div className="bg-gray-50 dark:bg-dark-900 p-8 rounded-2xl border border-gray-100 dark:border-dark-800 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">No Fluff</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Learning shouldn't be interrupted by ads or long intros. Just direct notes and actionable code.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 dark:bg-dark-900 p-8 rounded-2xl border border-gray-100 dark:border-dark-800 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Open Source</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We believe in open knowledge. Our roadmaps and cheat sheets are free for everyone.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 dark:bg-dark-900 p-8 rounded-2xl border border-gray-100 dark:border-dark-800 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <UserX size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Anonymous</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                The focus is on the content, not the creator. No personal brands, just engineering.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-brand-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail size={32} className="text-brand-200" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-brand-100 mb-8 max-w-lg mx-auto">
                Have a suggestion, found a bug, or want to contribute to the notes?
                We'd love to hear from you.
              </p>
              
              <a 
                href="mailto:aegiscodein@gmail.com" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-900 font-bold rounded-xl hover:bg-brand-50 transition shadow-lg"
              >
                aegiscodein@gmail.com
              </a>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}