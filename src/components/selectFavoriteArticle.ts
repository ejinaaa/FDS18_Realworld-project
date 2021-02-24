import axios from 'axios';

const selectFavoriteArticle = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  
  if (!(target.matches('.article-preview .btn') || target.matches('.article-preview .btn *'))) return;
  
  const userToken: string | null = localStorage.getItem('JWT');
  
  // axios.post(`https://conduit.productionready.io/api/articles/${slug}/favorite`, null, {
  //   headers: {
  //     Authorization: `Token ${userToken}`
  //   }
  // });
};

export default selectFavoriteArticle;