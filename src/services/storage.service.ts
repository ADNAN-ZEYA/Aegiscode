import { clientStorage } from '@/lib/firebase/client';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export async function uploadContentAsset(path: string, file: File) {
  if (!clientStorage) {
    throw new Error('Firebase Storage is not configured.');
  }

  const storageRef = ref(clientStorage, path);
  await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  return getDownloadURL(storageRef);
}
