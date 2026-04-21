import Head from 'next/head';
import Layout from '../../components/Layout';
import { Github, Code, Terminal } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      title: 'Python Malware Scanner',
      desc: 'A simple script to scan directories for suspicious file signatures using Python.',
      tags: ['Python', 'Security', 'Scripting'],
      link: '#'
    },
    {
      title: 'JEE Rank Predictor',
      desc: 'ML model trained on past 5 years of cutoff data to predict college possibilities.',
      tags: ['Machine Learning', 'Data Science'],
      link: '#'
    },
    {
      title: 'Portfolio Starter',
      desc: 'The code for this very website. A clean Next.js boilerplate for students.',
      tags: ['Next.js', 'Tailwind', 'React'],
      link: '#'
    },
  ];

  return (
    <Layout title="Projects">
      <Head>
        <title>Code & Labs | AegisCode</title>
      </Head>

      <div className="bg-white py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="mb-12">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Projects & Labs</h1>
            <p className="text-slate-600">Open source scripts, experiments, and tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj, i) => (
              <div key={i} className="group relative flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition duration-300">
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                      <Terminal size={20} />
                    </div>
                    <Github size={20} className="text-slate-400 group-hover:text-black transition" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                    {proj.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {proj.desc}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proj.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded border border-slate-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href={proj.link} className="text-sm font-semibold text-blue-600 hover:underline">
                    View Source →
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}