import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { PageLoader } from '@/components/PageLoader';
import { ExperienceProvider } from '@/components/ExperienceContext';

// Lazily load all page components for code splitting & initial bundle optimization 
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('@/pages/About').then(m => ({ default: m.About })));
const BrandStory = lazy(() => import('@/pages/BrandStory').then(m => ({ default: m.BrandStory })));
const Products = lazy(() => import('@/pages/Products').then(m => ({ default: m.Products })));
const ProductDetail = lazy(() => import('@/pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Exhibitions = lazy(() => import('@/pages/Exhibitions').then(m => ({ default: m.Exhibitions })));
const DreamProject = lazy(() => import('@/pages/DreamProject').then(m => ({ default: m.DreamProject })));
const InteriorDesign = lazy(() => import('@/pages/InteriorDesign').then(m => ({ default: m.InteriorDesign })));
const MarbleGranite = lazy(() => import('@/pages/MarbleGranite').then(m => ({ default: m.MarbleGranite })));
const Process = lazy(() => import('@/pages/Process').then(m => ({ default: m.Process })));
const Contact = lazy(() => import('@/pages/Contact').then(m => ({ default: m.Contact })));
const TheEngawaLine = lazy(() => import('@/pages/TheEngawaLine').then(m => ({ default: m.TheEngawaLine })));
const AmberAndOlive = lazy(() => import('@/pages/AmberAndOlive').then(m => ({ default: m.AmberAndOlive })));
const TheSkylineResidence = lazy(() => import('@/pages/TheSkylineResidence').then(m => ({ default: m.TheSkylineResidence })));
const TheOliveGroveResidence = lazy(() => import('@/pages/TheOliveGroveResidence').then(m => ({ default: m.TheOliveGroveResidence })));
const ClayAndSage = lazy(() => import('@/pages/ClayAndSage').then(m => ({ default: m.ClayAndSage })));
const TheCanopyHouse = lazy(() => import('@/pages/TheCanopyHouse').then(m => ({ default: m.TheCanopyHouse })));
const ComingSoon = lazy(() => import('@/pages/ComingSoon').then(m => ({ default: m.ComingSoon })));
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })));

function App() {
  return (
    <ExperienceProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/brand-story" element={<BrandStory />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/exhibitions" element={<Exhibitions />} />
              <Route path="/dream-project" element={<DreamProject />} />
              <Route path="/interior-design" element={<InteriorDesign />} />
              <Route path="/marble-granite" element={<MarbleGranite />} />
              <Route path="/process" element={<Process />} />
              <Route path="/contact" element={<Contact />} />
              {/* Dedicated Interior Project Pages */}
              <Route path="/the-engawa-line" element={<TheEngawaLine />} />
              <Route path="/amber-and-olive" element={<AmberAndOlive />} />
              <Route path="/the-skyline-residence" element={<TheSkylineResidence />} />
              <Route path="/the-olive-grove-residence" element={<TheOliveGroveResidence />} />
              <Route path="/clay-and-sage" element={<ClayAndSage />} />
              <Route path="/the-canopy-house" element={<TheCanopyHouse />} />
              {/* Legacy Aliases & Sub-routes */}
              <Route path="/sanctuary-residences" element={<TheEngawaLine />} />
              <Route path="/skyline-penthouses" element={<AmberAndOlive />} />
              <Route path="/executive-suites" element={<TheSkylineResidence />} />
              <Route path="/boutique-lounges" element={<TheOliveGroveResidence />} />
              <Route path="/interiors/the-engawa-line" element={<TheEngawaLine />} />
              <Route path="/interiors/amber-and-olive" element={<AmberAndOlive />} />
              <Route path="/interiors/the-skyline-residence" element={<TheSkylineResidence />} />
              <Route path="/interiors/the-olive-grove-residence" element={<TheOliveGroveResidence />} />
              <Route path="/interiors/clay-and-sage" element={<ClayAndSage />} />
              <Route path="/interiors/the-canopy-house" element={<TheCanopyHouse />} />
              {/* Coming Soon / Aurexa Showcase */}
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/aurexa" element={<ComingSoon />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ExperienceProvider>
  );
}

export default App;

