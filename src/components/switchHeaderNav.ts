import renderHeader from './renderHeader';
import navigateTo from '../utils/navigateTo';

const switchHeaderNav = async () => {
  const $header = document.querySelector('header') as HTMLElement;

  $header.innerHTML = await renderHeader();

  navigateTo('/');
};

export default switchHeaderNav;