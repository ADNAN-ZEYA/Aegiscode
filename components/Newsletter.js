import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { CheckCircle, Send } from 'lucide-react';

export default function Newsletter() {
  // Replace this with your actual Formspree ID
  const [state, handleSubmit] = useForm("xgvjjbpl");

  if (state.succeeded) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 font-medium animate-fade-in">
        <CheckCircle size={20} />
        <span>Welcome to the inner circle!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-2">
      <div className="relative flex-grow">
        <input
          id="email"
          type="email" 
          name="email"
          placeholder="Email address"
          required
          className="w-full bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white text-sm px-4 py-2 rounded-lg focus:outline-none border border-transparent focus:border-brand-600 transition-colors"
        />
        <ValidationError 
          prefix="Email" 
          field="email"
          errors={state.errors}
          className="text-red-500 text-xs absolute -bottom-5 left-0"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={state.submitting}
        className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {state.submitting ? '...' : <Send size={18} />}
      </button>
    </form>
  );
}