import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

import css from "./EditPostForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "../../types/post";
import { editPost } from "../../services/postService";
import { useId } from "react";

const EditPostFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Content must be at most 500 characters")
    .required("Content is required"),
});

interface EditPostFormProps {
  post:Post
  onClose: () => void;
}

export default function EditPostForm({ post, onClose }: EditPostFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const initialValues: Post = {
    id: post.id,
    title: post.title,
    body: post.body,
  };

  const editPostMutation = useMutation({
    mutationFn: (post: Post) => editPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Post edited successfully!");
      onClose();
    },
  });

  const handleSubmit = (post: Post, actions: FormikHelpers<Post>) => {
    editPostMutation.mutate(post);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={EditPostFormSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-body`}>Content</label>
          <Field
            id={`${fieldId}-body`}
            as="textarea"
            name="body"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={editPostMutation.isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
