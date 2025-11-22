import Header from '../components/Header';
import Hero from '../components/Hero';
import Activities from '../components/Activities';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import HotlineButton from '../components/HotlineButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Header />
        <main>
          <Hero />
          <Activities />
          <About />
          <Testimonials />
        </main>
        <Footer />
      </div>
      <HotlineButton />
    </div>
  );
}
