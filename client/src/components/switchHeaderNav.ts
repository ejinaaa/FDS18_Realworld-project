import renderHeader from './renderHeader';
import navigateTo from '../utils/navigateTo';

const switchHeaderNav = async () => {
  try {
    const $header = document.querySelector('header') as HTMLElement;
  
    $header.innerHTML = await renderHeader();
  
    navigateTo('/');
  } catch (err) {
    const errorObj = err.response.data.errors;
    const errorName: string[] = Object.keys(errorObj);
    const errorMessage: string[][] = Object.values(errorObj);
    
    console.log(`${errorName} ${errorMessage}`);
  }
};

export default switchHeaderNav;