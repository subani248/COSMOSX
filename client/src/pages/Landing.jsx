import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import ParticleField from '../components/landing/ParticleField';
import ShootingStars from '../components/landing/ShootingStars';
import HeroSection from '../components/landing/HeroSection';
import FeatureCards from '../components/landing/FeatureCards';
import AboutSection from '../components/landing/AboutSection';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-cosmos-950"
    >
      <ParticleField />
      <ShootingStars />
      <Navbar />
      <HeroSection />
      <FeatureCards />
      <AboutSection />
      <CTA />
      <Footer />
    </motion.div>
  );
}
