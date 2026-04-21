import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

// ------------------------------------------------
// HELPER: Recursively find files in all subfolders
// ------------------------------------------------
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if(file.endsWith('.md')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

// ------------------------------------------------
// 1. FOR HOME PAGE (List all blogs)
// ------------------------------------------------
export function getSortedPostsData() {
  const allFiles = getAllFiles(postsDirectory);
  
  const allPostsData = allFiles.map(file => {
    const id = path.basename(file).replace(/\.md$/, '');
    const fileContents = fs.readFileSync(file, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// ------------------------------------------------
// 2. FOR URL PATHS (Fixes your current error)
// ------------------------------------------------
export function getAllPostIds() {
  const allFiles = getAllFiles(postsDirectory);
  
  return allFiles.map(file => {
    const fileName = path.basename(file);
    const id = fileName.replace(/\.md$/, '');
    return {
      params: {
        slug: id
      }
    };
  });
}

// ------------------------------------------------
// 3. FOR BLOG CONTENT (Reads the file)
// ------------------------------------------------
export async function getPostData(id) {
  const allFiles = getAllFiles(postsDirectory);
  
  // Find the file specifically, ignoring which folder it is in
  const fullPath = allFiles.find(file => path.basename(file) === `${id}.md`);

  if (!fullPath) {
    throw new Error(`Post not found: ${id}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data
  };
}