import axios from 'axios';

const unfollowUser = (target: HTMLButtonElement) => {
  const userName: string = window.location.pathname.split('@')[1];
  const userToken: string | null = localStorage.getItem('JWT');
  
  axios.delete(`https://conduit.productionready.io/api/profiles/${userName}/follow`, {
    headers: {
      Authorization: `Token ${userToken}`
    }
  });

  target.textContent = 'Follow';
};

export default unfollowUser;