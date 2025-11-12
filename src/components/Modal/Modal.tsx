import { createPortal } from "react-dom";
import styled from "./Modal.module.css";
import type { Photo } from "../../types/photo";
import { useEffect } from "react";

interface ModalProps {
  photo: Photo;
  onClose: () => void;
}

export default function Modal({ photo, onClose }: ModalProps) {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return createPortal(
    <div
      className={styled.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={styled.modal}>
        <button
          className={styled.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        {<img src={photo.src.large} alt={photo.alt} />}
      </div>
    </div>,
    document.body,
  );
}
