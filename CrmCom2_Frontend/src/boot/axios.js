import Vue from "vue";
import axios from "axios";

Vue.prototype.$axios = axios;
const axiosInstance = axios.create({ baseURL: process.env.API_URL_SERVER });

export default ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance;
  console.log("API_URL_SERVER");
  console.log(process.env.API_URL_SERVER);
};

export { axiosInstance };
