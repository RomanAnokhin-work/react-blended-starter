import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from "formik";

import css from "./CreatePostForm.module.css";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postService";

const CreatePostFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  body: Yup.string()
    .max(500, "Content must be at most 500 characters")
    .required("Content is required"),
});

interface CreatePostFormProps {
  onClose: () => void
}

interface CreatePostRequest {
  title: string;
  body: string;
}

export default function PostForm({ onClose }: CreatePostFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

   const initialValues: CreatePostRequest = {
    title: "",
    body: "",
  };

  const createPostMutation = useMutation({
    mutationFn: (post: CreatePostRequest) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Post created successfully!");
      onClose();
    },
  });

   const handleSubmit = (
    post: CreatePostRequest,
    actions: FormikHelpers<CreatePostRequest>,
  ) => {
    createPostMutation.mutate(post);
    actions.resetForm();
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={CreatePostFormSchema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-body`}>Content</label>
          <Field id={`${fieldId}-body`} as="textarea" name="body" rows="8" className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={createPostMutation.isPending}>
            Create post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
