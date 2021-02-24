import axios from 'axios';

const getData = async (path: string) => {
  const userToken = localStorage.getItem('JWT');

  return await (await axios(`https://conduit.productionready.io/api/${path}`, {
    headers: {
      Authorization: `Token ${userToken}`
    }
  })).data;
};

export default getData;