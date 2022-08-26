import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import AxiosRequestService from './axiosRequest';
import createMarkup from './markupForGallery';

const requireImages = new AxiosRequestService();
const gallery = new SimpleLightbox('.gallery a', {
  scrollZoom: false,
  captionsData: 'alt',
  captionDelay: 250,
});

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.loadMoreBtn.style.display = 'none';

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(evt) {
  evt.preventDefault();

  clearMarkup();
  refs.loadMoreBtn.style.display = 'none';

  const searchValue = evt.currentTarget.elements.searchQuery.value.trim();

  if (!searchValue) {
    return;
  }

  requireImages.query = searchValue;
  requireImages.resetPage();

  const images = await requireImages.getImage();

  const markup = await createMarkup(images.hits);

  addToHTML(markup);

  gallery.refresh();

  if (refs.gallery.childElementCount > 0) {
    showLoadMoreBtn();
  }
}

async function onLoadMore() {
  const images = await requireImages.getImage();

  const markup = await createMarkup(images.hits);

  addToHTML(markup);

  if (refs.gallery.childElementCount === images.totalHits.length) {
    Notify.failure('ERORROROROROROR');
    return;
  }

  gallery.refresh();

  refs.loadMoreBtn.style.display = 'block';
}

function addToHTML(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.style.display = 'block';
}
