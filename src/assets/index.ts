// Local Image Imports (from src/assets/images)
import heroLocal from './images/hero.jpg';
import marbleLocal from './images/marble.jpg';

// Local Asset Exports
export const localImages = {
  hero: heroLocal,
  marble: marbleLocal,
};

// Static Public Asset Paths (accessible directly as web URLs)
export const publicImages = {
  hero: '/assets/images/hero.jpg',
  heroVideo: encodeURI('/assets/images/LUNORE_—_Subtle_Cinematic_Imag (1).mp4'),
  heroMobileVideo: encodeURI('/assets/images/Lunore hero mobile.mp4'),
  marble: '/assets/images/marble.jpg',
  marbleHero: encodeURI('/assets/images/marble hero.jpeg'),
  sculptureHero: '/assets/images/sculpture hero .jpeg',
};

// Online Image URLs (Unsplash / Pexels CDN)
export const onlineImages = {
  heroBg: 'https://i.pinimg.com/736x/4f/f1/5b/4ff15b710b08d50e2abacaff45ea7772.jpg',
  aboutHero: 'https://images.pexels.com/photos/31164214/pexels-photo-31164214.jpeg?auto=compress&cs=tinysrgb&w=1600',
  brandStoryHero: 'https://images.pexels.com/photos/36580493/pexels-photo-36580493.jpeg?auto=compress&cs=tinysrgb&w=1600',
  interiorHero: 'https://images.pexels.com/photos/33529500/pexels-photo-33529500.jpeg?auto=compress&cs=tinysrgb&w=1600',
  marbleHero: 'https://images.pexels.com/photos/6634141/pexels-photo-6634141.jpeg?auto=compress&cs=tinysrgb&w=1600',

  products: {
    'Marble Monolith': 'https://images.pexels.com/photos/29127901/pexels-photo-29127901.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Obsidian Figure': 'https://images.pexels.com/photos/34710655/pexels-photo-34710655.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Limestone Relief': 'https://images.pexels.com/photos/27552329/pexels-photo-27552329.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Figurative Sculptures': 'https://images.pexels.com/photos/4997068/pexels-photo-4997068.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Gilded Marble Sculptures': 'https://images.pexels.com/photos/14680179/pexels-photo-14680179.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Spiritual / Religious Sculpture': 'https://images.pexels.com/photos/33753643/pexels-photo-33753643.jpeg?auto=compress&cs=tinysrgb&w=800',
  } as Record<string, string>,

  dreamProject: {
    'Celestial Being': 'https://images.pexels.com/photos/4702882/pexels-photo-4702882.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Obsidian Equinox': 'https://images.pexels.com/photos/6634136/pexels-photo-6634136.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Emerald Gateway': 'https://images.pexels.com/photos/35451978/pexels-photo-35451978.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Illuminated Onyx': 'https://images.pexels.com/photos/28288786/pexels-photo-28288786.jpeg?auto=compress&cs=tinysrgb&w=800',
  } as Record<string, string>,

  exhibitions: {
    'AUREXA EXHIBITION': 'https://images.pexels.com/photos/12329046/pexels-photo-12329046.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Echoes in Marble': 'https://images.pexels.com/photos/19026978/pexels-photo-19026978.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Luxury Jewelry Exhibition': 'https://images.pexels.com/photos/16680933/pexels-photo-16680933.jpeg?auto=compress&cs=tinysrgb&w=800',
  } as Record<string, string>,
};

// Combined helper export
export const assets = {
  local: localImages,
  public: publicImages,
  online: onlineImages,
};

export default assets;
