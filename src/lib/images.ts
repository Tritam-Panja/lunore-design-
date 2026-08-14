import { assets, localImages, onlineImages } from '../assets';

export const images = {
  // Home hero background - easily switch between local or online
  heroBg: localImages.hero || onlineImages.heroBg,

  // Products (6 sculptures) — keyed by product name
  products: onlineImages.products,

  // Dream Project gallery (4 images)
  dreamProject: onlineImages.dreamProject,

  // Exhibitions
  exhibitions: onlineImages.exhibitions,

  // Page heroes
  aboutHero: onlineImages.aboutHero,
  brandStoryHero: onlineImages.brandStoryHero,
  interiorHero: onlineImages.interiorHero,
  marbleHero: onlineImages.marbleHero,

  // Process steps
  process: [
    'https://images.pexels.com/photos/37845015/pexels-photo-37845015.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6714322/pexels-photo-6714322.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6713847/pexels-photo-6713847.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],

  // Expose local and online assets directly
  local: localImages,
  online: onlineImages,
};

export { assets };
