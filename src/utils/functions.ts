export const getIdsFromUrls = (urls: string[]): string => {
  const ids = urls.map(url => {
    const urlArray = url.split('/');
    const id = urlArray[urlArray.length - 1];

    return Number(id);
  });

  return ids.join(',');
};
