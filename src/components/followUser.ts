import axios from 'axios';

const followUser = (target: HTMLButtonElement) => {
  const userName: string = window.location.pathname.split('@')[1];
  const userToken: string | null = localStorage.getItem('JWT');
  
  axios.post(`https://conduit.productionready.io/api/profiles/${userName}/follow`, null, {
    headers: {
      Authorization: `Token ${userToken}`
    }
  });

  target.textContent = 'Unfollow';
};

export default followUser;