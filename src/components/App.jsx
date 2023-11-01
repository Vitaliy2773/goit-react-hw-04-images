import React, { useState, useEffect } from 'react';
import css from '../App.module.css';
import axios from 'axios';
import Searchbar from './Searchbar/Serachbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39459893-bedb370270db67e1c0c9a6273';

export default function App() {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [totalHits, setTotalHits] = useState(0);
  const [per_page, setPer_page] = useState(12);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === 'Escape' && showModal) {
        closeModal();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  useEffect(() => {
    if (searchQuery) {
      fetchImages();
    }
  }, [searchQuery]);

  function onChangeQuery(query) {
    setSearchQuery(query);
    setPage(1);
    setPer_page(12);
    setImages([]);
  }

  function fetchImages() {
    const options = {
      method: 'GET',
      url: `${BASE_URL}?q=${searchQuery}&page=${page}&key=${API_KEY}&per_page=${per_page}`,
    };

    setIsLoading(true);

    axios(options)
      .then(response => {
        setImages(prevImages => [...prevImages, ...response.data.hits]);
        setTotalHits(response.data.totalHits);
        setPage(prevPage => prevPage + 1);
      })
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false));
  }

  function handleImageClick(largeImageURL) {
    setShowModal(true);
    setLargeImageURL(largeImageURL);
  }

  function closeModal() {
    setShowModal(false);
    setLargeImageURL('');
  }

  return (
    <div className={css.App}>
      <Searchbar onSubmit={onChangeQuery} />
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {isLoading && <Loader />}
      {images.length > 0 && images.length < totalHits && !isLoading && (
        <Button onClick={fetchImages} />
      )}
      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={closeModal} />
      )}
    </div>
  );
}
