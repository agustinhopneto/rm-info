export const getIdsFromUrls = (urls: string[]): string => {
  const ids = urls.map(url => {
    const urlArray = url.split('/');
    const id = urlArray[urlArray.length - 1];

    return Number(id);
  });

  return ids.join(',');
};

export const scrollToTop = (): void => {
  const container = document.querySelector('#container');

  if (container) {
    container.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }
};
