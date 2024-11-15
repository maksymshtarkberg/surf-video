const videoSelector = {
  _id: 0,
  id: 1,
  title: 1,
  tags: 1,
  models: 1,
  categories: 1,
  slug: 1,
  isHD: 1,
  videoSrc: 1,
};

export const videoPreviewSelector = {
  ...videoSelector,
  thumbnail: 1,
};

export const videoTitleSelector = {
  slug: 1,
  title: 1,
};

export const videoFullSelector = {
  ...videoSelector,
  poster: 1,
  createdAt: 1,
};

export const categorySelector = {
  _id: 0,
  id: 1,
  name: 1,
  role: 1,
  image: 1,
  videoCount: 1,
};
