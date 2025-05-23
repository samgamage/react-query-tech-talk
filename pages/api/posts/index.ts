import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Post } from '@/utils/types';
import { randomDelay } from '@/utils/delay';

const dataFilePath = path.join(process.cwd(), 'data', 'posts.json');

function getPosts(): Post[] {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return [];
  }
}

function createPost(post: Omit<Post, 'id'>): Post {
  const posts = getPosts();
  const newPost = {
    ...post,
    id: uuidv4(),
  };
  
  posts.push(newPost);
  fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
  return newPost;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | Post[] | { error: string }>
) {
  // Set common headers
  res.setHeader('Content-Type', 'application/json');
  
  switch (req.method) {
    case 'GET':
      await randomDelay();
      const posts = getPosts();
      return res.status(200).json(posts);

    case 'POST':
      const { title, content } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      await randomDelay();
      const newPost = createPost({ title, content });
      return res.status(201).json(newPost);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 