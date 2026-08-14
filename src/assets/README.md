# Asset Management Guide (`src/assets`)

This directory is set up to store and manage local image assets and online image URLs for your application.

## Directory Structure
```
src/assets/
├── index.ts          # Central module to export local assets & online URLs
├── images/           # Store your local image files (.png, .jpg, .svg, .webp)
│   ├── hero.jpg
│   └── marble.jpg
└── README.md
```

## How to Add & Use Local Images

### Option 1: Store inside `src/assets/images/` (Recommended for React components)
1. Drop your image files (e.g. `banner.jpg`, `logo.png`) into `src/assets/images/`.
2. Open `src/assets/index.ts` and add an import:
   ```ts
   import banner from './images/banner.jpg';

   export const localImages = {
     banner,
     // ...
   };
   ```
3. Use it in any component:
   ```tsx
   import { localImages } from '@/assets';
   // OR
   import { images } from '@/lib/images';

   <img src={localImages.banner} alt="Banner" />
   ```

---

### Option 2: Store inside `public/assets/images/` (For static URL referencing)
1. Drop image files into `public/assets/images/my-image.jpg`.
2. Reference directly as a string path anywhere in your app:
   ```tsx
   <img src="/assets/images/my-image.jpg" alt="Static Asset" />
   ```

---

## How to Use Online Images
You can store external image URLs inside `src/assets/index.ts` under `onlineImages`:
```ts
export const onlineImages = {
  myExternalBanner: 'https://images.unsplash.com/photo-...',
};
```
Then reference in React:
```tsx
import { onlineImages } from '@/assets';

<img src={onlineImages.myExternalBanner} alt="Online Image" />
```
