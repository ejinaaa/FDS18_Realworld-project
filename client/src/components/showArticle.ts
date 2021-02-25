import navigateTo from '../utils/navigateTo';

const showArticle = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const parentNode = target.parentNode as HTMLAnchorElement;

  if (!target.matches('[href] > *')) return;

  e.preventDefault();
  navigateTo(parentNode.href);
};

export default showArticle;