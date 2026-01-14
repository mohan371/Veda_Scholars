import dynamic from 'next/dynamic';
import Navbar from './components/Navbar';
import Hero from './home/components/Hero';

// Dynamically import below-the-fold components to reduce initial bundle size
const Founder = dynamic(() => import('./home/components/Founder'), {
  loading: () => <div className="min-h-[400px]" />, // Placeholder to prevent layout shift
});

const Journey = dynamic(() => import('./home/components/Journey'), {
  loading: () => <div className="min-h-[400px]" />,
});

const EducationConsultancy = dynamic(() => import('./home/components/EducationConsultancy'), {
  loading: () => <div className="min-h-[400px]" />,
});

const USP = dynamic(() => import('./home/components/USP'), {
  loading: () => <div className="min-h-[400px]" />,
});

const Recruitment = dynamic(() => import('./home/components/Recruitment'), {
  loading: () => <div className="min-h-[400px]" />,
});

const Testimonials = dynamic(() => import('./home/components/Testimonials'), {
  loading: () => <div className="min-h-[400px]" />,
});

const LookingAhead = dynamic(() => import('./home/components/LookingAhead'), {
  loading: () => <div className="min-h-[400px]" />,
});

const Footer = dynamic(() => import('./components/Footer'), {
  loading: () => <div className="min-h-[200px]" />,
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div id="home">
        <Hero />
      </div>
      <Founder />
      <Journey />
      <EducationConsultancy />
      <USP />
      <Recruitment />
      <Testimonials />
      <LookingAhead />
      <Footer />
    </main>
  );
}
