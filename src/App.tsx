import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Preloader } from '@/components/Preloader';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { BrandStory } from '@/pages/BrandStory';
import { Products } from '@/pages/Products';
import { ProductDetail } from '@/pages/ProductDetail';
import { Exhibitions } from '@/pages/Exhibitions';
import { DreamProject } from '@/pages/DreamProject';
import { InteriorDesign } from '@/pages/InteriorDesign';
import { MarbleGranite } from '@/pages/MarbleGranite';
import { Process } from '@/pages/Process';
import { Contact } from '@/pages/Contact';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Preloader />
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
    </BrowserRouter>
  );
}

export default App;
