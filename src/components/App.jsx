import React, { Component } from 'react';
import css from '../App.module.css';
import axios from 'axios';
import Searchbar from './Searchbar/Serachbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39459893-bedb370270db67e1c0c9a6273';

export default class App extends Component {
  state = {
    images: [],
    searchQuery: '',
    page: 1,
    isLoading: false,
    showModal: false,
    largeImageURL: '',
    totalHits: 0,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(_, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.fetchImages();
    }
  }

  onChangeQuery = query => {
    this.setState({
      searchQuery: query,
      page: 1,
      per_page: 12,
      images: [],
    });
  };

  fetchImages = () => {
    const { searchQuery, page, per_page } = this.state;

    const options = {
      method: 'GET',
      url: `${BASE_URL}?q=${searchQuery}&page=${page}&key=${API_KEY}&per_page=${per_page}`,
    };

    this.setState({ isLoading: true });

    axios(options)
      .then(response => {
        this.setState(prevState => ({
          images: [...prevState.images, ...response.data.hits],
          totalHits: response.data.totalHits,
          page: prevState.page + 1,
        }));
      })
      .catch(error => console.log(error))
      .finally(() => this.setState({ isLoading: false }));
  };

  handleImageClick = largeImageURL => {
    this.setState({
      showModal: true,
      largeImageURL,
    });
  };

  handleKeyDown = e => {
    if (e.code === 'Escape' && this.state.showModal) {
      this.closeModal();
    }
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      largeImageURL: '',
    });
  };

  render() {
    const { images, isLoading, showModal, largeImageURL, totalHits } =
      this.state;

    return (
      <div className={css.App}>
        <Searchbar onSubmit={this.onChangeQuery} />
        <ImageGallery images={images} onImageClick={this.handleImageClick} />
        {isLoading && <Loader />}
        {images.length > 0 && images.length < totalHits && !isLoading && (
          <Button onClick={this.fetchImages} />
        )}
        {showModal && (
          <Modal largeImageURL={largeImageURL} onClose={this.closeModal} />
        )}
      </div>
    );
  }
}
