import Head from 'next/head';
import Layout from '../components/Layout';
import { Mail, MessageSquare, Send } from 'lucide-react';

export default function Contact() {
  return (
    <Layout title="Contact">
      <Head>
        <title>Contact & Reviews | AegisCode</title>
      </Head>

      <div className="bg-gray-50 dark:bg-dark-950 py-20 min-h-screen transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Found a bug? Want to request a topic? Or just want to leave a review?
            </p>
          </div>

          <div className="bg-white dark:bg-dark-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800">
            
            {/* 👇 FORM STARTS HERE 👇 */}
            <form action="https://formspree.io/f/xgvjjbpl" method="POST" className="space-y-6">
              
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="name" 
                    required
                    className="w-full pl-4 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-brand-600 dark:text-white transition"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    name="email" 
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-brand-600 dark:text-white transition"
                    placeholder="john@example.com"
                  />
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
              </div>

              {/* Message/Review Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message or Review</label>
                <div className="relative">
                  <textarea 
                    name="message" 
                    rows="4"
                    required
                    className="w-full pl-4 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-brand-600 dark:text-white transition"
                    placeholder="Hey, I loved the Linux cheatsheet! Can you make one for Docker?"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full flex justify-center items-center gap-2 bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-500 transition shadow-lg shadow-brand-600/30"
              >
                Send Message <Send size={18} />
              </button>

            </form>
          </div>

        </div>
      </div>
    </Layout>
  );
}