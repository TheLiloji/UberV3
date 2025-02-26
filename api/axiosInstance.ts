import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://10.2.7.129:3000', // Replace with your API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
