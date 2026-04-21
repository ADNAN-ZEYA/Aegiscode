import Head from 'next/head';
import Layout from '../../components/Layout';
import { FileText, Map, Download, ExternalLink } from 'lucide-react';

export default function Resources() {
  
  const roadmaps = [
    { title: 'Full Stack Web Dev', desc: 'From HTML to React & Node.js', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    { title: 'Cybersecurity Path', desc: 'Zero to Pen-Tester guide', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
    { title: 'Machine Learning', desc: 'Python, Math & Algorithms', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  ];

  // Updated link to point to your new file location if needed
  const cheatsheets = [
    { title: 'Linux Commands', type: 'PDF', size: '2.4 MB', link: '/documents/linux-cheatsheet.pdf' },
    { title: 'Git & GitHub', type: 'PDF', size: '1.1 MB', link: '#' },
    { title: 'Python Syntax', type: 'IMG', size: '800 KB', link: '#' },
  ];

  return (
    <Layout title="Resources">
      <Head>
        <title>Downloads & Roadmaps | AegisCode</title>
      </Head>

      {/* Dark Mode Background applied here */}
      <div className="bg-white dark:bg-dark-950 py-12 md:py-20 min-h-screen transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Resource Library</h1>
            <p className="text-gray-600 dark:text-gray-400">Curated roadmaps and high-quality cheatsheets for your studies.</p>
          </div>

          {/* ROADMAPS */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Map className="text-brand-600" /> Learning Roadmaps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {roadmaps.map((map, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 dark:border-dark-800 bg-gray-50 dark:bg-dark-900 shadow-sm hover:shadow-md transition">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${map.color}`}>
                  <Map size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{map.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{map.desc}</p>
                <button className="text-sm font-semibold text-brand-600 flex items-center gap-1 hover:underline">
                  View Roadmap <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* CHEATSHEETS */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="text-brand-600" /> Cheatsheets & PDFs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cheatsheets.map((sheet, i) => (
              <a href={sheet.link} download key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-dark-800 transition group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 dark:bg-dark-800 p-3 rounded-lg group-hover:bg-white dark:group-hover:bg-dark-700 transition">
                    <FileText size={24} className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{sheet.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sheet.type} • {sheet.size}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 group-hover:text-brand-600 transition">
                  <Download size={20} />
                </button>
              </a>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}