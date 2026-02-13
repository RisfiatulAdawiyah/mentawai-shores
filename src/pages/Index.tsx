import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import TrustBadges from "@/components/TrustBadges";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Navbar />
      <HeroSection />
      <FeaturedProperties />
      <TrustBadges />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
