import axios from 'axios';


const exChange = function () {
  const apiUrl = 'https://api.exchangeratesapi.io';

  let _baseCurrency = 'INR';

  const http = axios.create({
    baseURL: apiUrl,
  });

  this.setBaseCurrency = function (base) {
    _baseCurrency = base;
    return this;
  };

  this.latest = function () {
    return http.get(`/latest?base=${_baseCurrency || 'INR'}`);
  };
};


export default exChange;
