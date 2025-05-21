import axios, { AxiosRequestConfig } from 'axios';
import { Post, PostFormData } from "./types";

const API_BASE_URL = '/api';

export interface CreatePostData {
  title: string;
  content: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
}

export async function getAllPosts(config?: AxiosRequestConfig): Promise<Post[]> {
  const { data } = await axios.get(`${API_BASE_URL}/posts`, config);
  return data;
}

export async function getPost(id: string, config?: AxiosRequestConfig): Promise<Post> {
  const { data } = await axios.get(`${API_BASE_URL}/posts/${id}`, config);
  return data;
}

export async function createPost(post: PostFormData, config?: AxiosRequestConfig): Promise<Post> {
  const { data } = await axios.post(`${API_BASE_URL}/posts`, post, {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
  });
  return data;
}

export async function updatePost(id: string, post: PostFormData, config?: AxiosRequestConfig): Promise<Post> {
  const { data } = await axios.put(`${API_BASE_URL}/posts/${id}`, post, {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
  });
  return data;
}

export async function deletePost(id: string, config?: AxiosRequestConfig): Promise<void> {
  await axios.delete(`${API_BASE_URL}/posts/${id}`, config);
} 