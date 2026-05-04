'use client';

import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { clientAuth, clientDb } from '@/lib/firebase/client';

export async function toggleBookmark(contentId: string, contentType: 'blog' | 'studyMaterial') {
  if (!clientDb || !clientAuth?.currentUser) {
    throw new Error('Sign in to manage bookmarks.');
  }

  const userId = clientAuth.currentUser.uid;
  const bookmarksRef = collection(clientDb, 'bookmarks');
  const existing = await getDocs(
    query(bookmarksRef, where('userId', '==', userId), where('contentId', '==', contentId)),
  );

  if (!existing.empty) {
    await deleteDoc(existing.docs[0].ref);
    return false;
  }

  await setDoc(doc(bookmarksRef), {
    userId,
    contentId,
    contentType,
    createdAt: new Date().toISOString(),
  });

  return true;
}
