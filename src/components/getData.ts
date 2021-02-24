import axios from 'axios';


const getData = (path: string) => {
  const userToken = localStorage.getItem('JWT');

  return axios(`https://conduit.productionready.io/api/${path}`, {
    headers: {
      Authorization: `Token ${userToken}`
    }
  });
};

export default getData;