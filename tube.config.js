const sharedConfig = {
  videosLimit: 40,
  tagsLimit: 15,
  maxPage: 5,
};

module.exports = {
  /** Routes **/
  routes: {
    index: "index",
    video: "video",
    tag: "tag",
    category: "category",
    city: "city",
    toplist: "cities",
    top: "top",
    new: "new",
    page: "page",
  },
  /** Index Page **/
  index: {
    identifier: "index",
    videosLimit: 40,
    tagsLimit: 15,
    categoriesSectionRole: "category",
    categoriesSectionLimit: 20,
  },
  /** Video Page **/
  video: {
    identifier: "video",
    videosLimit: 40,
    tagsLimit: 15,
  },
  /** Tag Page **/
  tag: {
    identifier: "tag",
    ...sharedConfig,
  },
  /** Category Page **/
  category: {
    identifier: "category",
    ...sharedConfig,
  },
  /** Model Page **/
  city: {
    identifier: "city",
    ...sharedConfig,
  },
  /** Toplist Page **/
  toplist: {
    identifier: "toplist",
    listLimit: 100,
    role: "cities",
  },
  /** New Page **/
  new: {
    identifier: "new",
    ...sharedConfig,
  },
  /** Top Page **/
  top: {
    identifier: "top",
    ...sharedConfig,
  },
  page: {
    identifier: "page",
    ...sharedConfig,
  },
};
