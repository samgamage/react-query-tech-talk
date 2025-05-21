import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
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

function getPostById(id: string): Post | undefined {
  const posts = getPosts();
  return posts.find(post => post.id === id);
}

function updatePost(id: string, updates: Partial<Omit<Post, 'id'>>): Post | undefined {
  const posts = getPosts();
  const postIndex = posts.findIndex(post => post.id === id);
  
  if (postIndex === -1) {
    return undefined;
  }
  
  const updatedPost = {
    ...posts[postIndex],
    ...updates,
  };
  
  posts[postIndex] = updatedPost;
  fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
  return updatedPost;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | { error: string }>
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  // Simulate network delay
  await randomDelay();

  try {
    const postsData = fs.readFileSync(dataFilePath, 'utf-8');
    const posts: Post[] = JSON.parse(postsData);
    const postIndex = posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    switch (req.method) {
      case 'GET':
        return res.status(200).json(posts[postIndex]);

      case 'PUT':
        const { title, content } = req.body;
        
        if (!title || !content) {
          return res.status(400).json({ error: 'Title and content are required' });
        }

        posts[postIndex] = {
          ...posts[postIndex],
          title,
          content,
        };

        fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
        return res.status(200).json(posts[postIndex]);

      case 'DELETE':
        posts.splice(postIndex, 1);
        fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling post:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 