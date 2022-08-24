import { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearchSubmit);

async function onSearchSubmit(evt) {
  evt.preventDefault();

  const searchValue = evt.target.elements.searchQuery.value.trim();

  if (!searchValue) {
    return;
  }

  const images = await axios
    .get(`https://pixabay.com/api/?q=${searchValue}&page=1&per_page=5`, {
      params: {
        key: '28415242-e0e8b03e245983e2ec7e6c358',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    })
    .then(images => images.data.hits);

  const markup = images
    .map(image => {
      return `<div class="photo-card">
      <a href=""${image.largeImageURL}>
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
          <div class="info">
          <p class="info-item">
          <b>Likes</b>
          </p>
      <p class="info-item">
        <b>Views</b>
      </p>
      <p class="info-item">
        <b>Comments</b>
        </p>
      <p class="info-item">
      <b>Downloads</b>
      </p>
    </div>
  </div>`;
    })
    .join('');

  refs.gallery.innerHTML = '';
  refs.gallery.insertAdjacentHTML('beforeend', markup);

  const gallery = new SimpleLightbox('.gallery a');
}
