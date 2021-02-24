import axios, { AxiosResponse } from 'axios';

const userToken = localStorage.getItem('JWT');

const getData = (param: string) => {
  return axios(`https://conduit.productionready.io/api/${param}`, {
    headers: {
      Authorization: `Token ${userToken}`
    }
  });
};

export default getData;