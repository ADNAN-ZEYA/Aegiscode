'use client';

import { useState, useTransition } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { deleteContentItem } from './actions';

interface Props {
  id: string;
  contentType: string;
  title: string;
}

export function DeleteContentButton({ id, contentType, title }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await deleteContentItem(contentType, id);
    });
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="max-w-[140px] truncate text-xs text-red-400">
          Delete &ldquo;{title}&rdquo;?
        </span>
        <button
          onClick={handleConfirm}
          disabled={isPending}
          className="flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
          {isPending ? 'Deleting…' : 'Delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="rounded-md bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/60 transition hover:bg-white/10 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Delete "${title}"`}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-red-500/20 bg-background text-red-400/70 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
