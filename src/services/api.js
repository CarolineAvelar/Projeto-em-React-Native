import axios from 'axios';

const api = axios.create({
  baseURL: "http://www.omdbapi.com/",
  params: {
    apikey: "98a00650"
  }
});

export default api;
