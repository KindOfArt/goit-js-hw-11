import axios from 'axios';
import { Notify } from 'notiflix';

const params = {
  key: '28415242-e0e8b03e245983e2ec7e6c358',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

export default class AxiosRequestService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getImage() {
    try {
      const url = `https://pixabay.com/api/?q=${this.searchQuery}&page=${this.page}&per_page=100`;

      const response = await axios.get(url, { params });

      console.log(response.data);

      await this.incrementPage();
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
  }

  async incrementPage() {
    this.page += 1;
  }

  async resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
