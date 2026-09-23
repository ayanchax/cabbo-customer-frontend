import {AppLayout} from "@/layouts";
import {
  HomeHeader,
  SearchCard,
  BrandFeatureHighlights,
  MobileBrandSignature,
  AdCampaign,
} from "@/components";

import durgaPujaBookingBanner from "@/assets/campaigns/blr/durga-puja-2026/booking-banner-cta.png";
const Home = () => {
  return (
    <AppLayout>
      <HomeHeader />
      
      <SearchCard/>
      <BrandFeatureHighlights/>
      <AdCampaign
        placement="home"
        imageSrc={durgaPujaBookingBanner}
        slug={`campaign/durga-puja-bengaluru-2026`}
        campaignKey="durga-puja-blr-2026"
        ariaLabel="Explore Durga Puja 2026 Bengaluru cab packages"
        altText="Durga Puja 2026 Bengaluru cab packages by Cabbo, starting from Rs 1,999 for 4 hours and 40 km"
        className="mx-auto mb-4 w-[calc(100%-1rem)] max-w-screen-sm md:max-w-2xl lg:max-w-2xl"
        enabled ={import.meta.env.VITE_DURGA_PUJA_CAMPAIGN_ENABLED==="true"}
        runAdInRegions={["WB","KA","KL","TN","AP","TS"]}
      />
      <MobileBrandSignature />
      
    </AppLayout>
  );
};

export default Home;
