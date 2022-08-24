import { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', async evt => {
  evt.preventDefault();

  refs.loadMoreBtn.style.display = 'none';

  const searchValue = evt.currentTarget.elements.searchQuery.value.trim();

  if (!searchValue) {
    return;
  }
  const images = await getImage(searchValue);

  if (images) {
    refs.loadMoreBtn.style.display = 'block';
  }

  const markup = await createMarkup(images);

  addToHTML(markup);

  const gallery = new SimpleLightbox('.gallery a', {
    scrollZoom: false,
    captionsData: 'alt',
    captionDelay: 250,
  });
});

function addToHTML(markup) {
  refs.gallery.innerHTML = '';
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function createMarkup(images) {
  return images
    .map(image => {
      return `
      <div class="gallery__item">
        <a class="gallery__link" href="${image.largeImageURL}">
            <img class="gallery__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="gallery__info">
            <p class="gallery__info-item">
                <b>Likes ${image.likes}</b>
            </p>
            <p class="gallery__info-item">
                <b>Views ${image.views}</b>
            </p>
            <p class="gallery__info-item">
                <b>Comments ${image.comments}</b>
            </p>
            <p class="gallery__info-item">
                <b>Downloads ${image.downloads}</b>
            </p>
        </div>
    </div>`;
    })
    .join('');
}

async function getImage(searchValue) {
  try {
    const params = {
      key: '28415242-e0e8b03e245983e2ec7e6c358',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    };
    const response = await axios.get(
      `https://pixabay.com/api/?q=${searchValue}&page=1&per_page=80`,
      { params }
    );

    return response.data.hits;
  } catch (error) {
    console.error(error);
  }
}
