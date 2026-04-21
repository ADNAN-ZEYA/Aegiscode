import Layout from '../../components/Layout';

export default function About() {
  return (
    <Layout title="About">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">About AegisCode</h1>
        
        <div className="prose prose-lg prose-slate">
          <p>
            AegisCode is an independent learning hub created to simplify concepts for students.
            Whether you are preparing for JEE, diving into Cybersecurity, or training a Machine Learning model,
            resources should be clear, direct, and free.
          </p>
          
          <h3>The Philosophy</h3>
          <ul>
            <li><strong>No Ads:</strong> Learning shouldn't be interrupted.</li>
            <li><strong>No Fluff:</strong> Direct notes and actionable code.</li>
            <li><strong>No Identity:</strong> The focus is on the content, not the creator.</li>
          </ul>

          <div className="mt-12 p-6 bg-slate-900 text-slate-300 rounded-xl">
            <h4 className="text-white font-bold text-lg mb-2">Contact</h4>
            <p>
              Have a suggestion or found a bug? <br />
              Email at: <span className="text-blue-400">aegiscode@gmail.com</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}