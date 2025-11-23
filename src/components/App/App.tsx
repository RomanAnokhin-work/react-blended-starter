import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import PostForm from "../CreatePostForm/CreatePostForm";
import EditPostForm from "../EditPostForm/EditPostForm";

import css from "./App.module.css";
import { useState } from "react";
import { useDebounce,} from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";
import type { Post } from "../../types/post";


export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isEditPost, setIsEditPost] = useState<boolean>(false);
  const [editedPost, setEditedPost] = useState<Post| null>(null);

  const openCreateModal = () => {
    setIsEditPost(false);
    setIsCreatePost(true);
    setIsModalOpen(true)
  };

  const openEditModal = (post: Post) => {
    setEditedPost(post);
    setIsCreatePost(false);
    setIsEditPost(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCreatePost(false);
    setIsEditPost(false);
    setEditedPost(null);
  };

  const [debounceQuerySearch] = useDebounce(searchQuery, 300);

  const { data } = useQuery({
    queryKey: ["posts", currentPage, debounceQuerySearch],
    queryFn: () => fetchPosts(debounceQuerySearch, currentPage),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (query: string) => {
    setCurrentPage(1);
    setSearchQuery(query);
  };

  const onPageChangeHandler = (page: number) => {
    setCurrentPage(page);
  };

  const posts = data ? data.posts : [];
  const totalPages = data ? data.totalPages : 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearchChange} />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChangeHandler}
        />
        <button className={css.button} onClick={openCreateModal}>
          Create post
        </button>
      </header>
       {isModalOpen && (
        <Modal onClose={closeModal}>
          {isCreatePost && <PostForm onClose={closeModal} />}
          {isEditPost && editedPost && (
            <EditPostForm post={editedPost} onClose={closeModal} />
          )}
        </Modal>
      )}
      <PostList posts={posts} onEdit={openEditModal} />
    </div>
  );
}
