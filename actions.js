export const toggleYear = (year) => {
  return {
    type: 'TOGGLE_YEAR',
    year
  }
};

export const toggleAlbum = (albumId) => {
  return {
    type: 'TOGGLE_ALBUM',
    albumId
  }
};

export const loadAlbums = (albums) => {
  return {
    type: 'ALBUMS_FETCH_SUCCEEDED',
    albums
  }
};
