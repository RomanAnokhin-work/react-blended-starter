import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "../../types/post";
import css from "./PostList.module.css";
import { deletePost } from "../../services/postService";

interface PostListProps {
  posts: Post[];
  onEdit: (post: Post) => void;
}

export default function PostList({ posts, onEdit }: PostListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li key={post.id} className={css.listItem}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button className={css.edit} onClick={() => onEdit(post)}>
              Edit
            </button>
            <button className={css.delete} onClick={() => deleteMutation.mutate(post.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
