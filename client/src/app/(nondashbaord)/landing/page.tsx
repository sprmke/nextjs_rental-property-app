import CallToActionSection from '@/app/(nondashbaord)/landing/CallToActionSection';
import DiscoverSection from '@/app/(nondashbaord)/landing/DiscoverSection';
import FeaturesSection from '@/app/(nondashbaord)/landing/FeaturesSection';
import FooterSection from '@/app/(nondashbaord)/landing/FooterSection';
import HeroSection from '@/app/(nondashbaord)/landing/HeroSection';

const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <DiscoverSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
