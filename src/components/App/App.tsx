import Section from "../Section/Section";
import Container from "../Container/Container";
import Form from "../Form/Form";
import { useState } from "react";
import { getPhotos } from "../../services/photos";
import toast from "react-hot-toast";
import type { Photo } from "../../types/photo";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleSubmit = async (query: string) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getPhotos(query);
      setPhotos(response);
    } catch (error) {
      setIsError(true);
      toast.error(String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedPhoto(null);
  };

  return (
    <>
      <Section>
        <Container>
          <Form onSubmit={handleSubmit} />
          {photos.length > 0 && (
            <PhotosGallery photos={photos} openModal={handleOpenModal} />
          )}
          {isLoading && <Loader />}
          {isError && <p>Something went wrong...</p>}
          {isOpen && selectedPhoto && (
            <Modal photo={selectedPhoto} onClose={handleCloseModal} />
          )}
        </Container>
      </Section>
    </>
  );
}
