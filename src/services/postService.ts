import axios from "axios";
import { Post } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

interface FetchPostsResponse {
  posts: Post[];
  totalPages: number;
}

interface CreatePostRequest {
  title: string;
  body: string;
}

// interface CreatePostResponse {
//   post: Post;
// }

interface EditPostResponse {
  post: Post;
}

// interface DeletePostResponse {
//   post: Post;
// }

export const fetchPosts = async (searchText: string, page: number): Promise<FetchPostsResponse> => {
  const params: { _limit: number; _page: number; q?: string } = {
    _limit: 8,
    _page: page,
  };

  if (searchText.trim() !== "") {
    params.q = searchText;
  }

  const response = await axios.get<Post[]>("/posts", {
    params,
  });

  const totalPages = Math.ceil (Number(response.headers["x-total-count"]) / params._limit);

  return { posts: response.data, totalPages };
};

export const createPost = async (newPost: CreatePostRequest): Promise<Post> => {
  const { data } = await axios.post<Post>("/posts", newPost);
  return data;
};

export const editPost = async (newDataPost: Post): Promise<EditPostResponse> => {
  const { data } = await axios.patch<EditPostResponse>(`/posts/${newDataPost.id}`, newDataPost);
  return data;
};

export const deletePost = async (postId: number) => {
    const { data } = await axios.patch(`/posts/${postId}`);
    return data
};
