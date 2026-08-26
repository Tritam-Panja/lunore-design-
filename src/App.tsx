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
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ExperienceProvider>
  );
}

export default App;

