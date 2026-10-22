import {AppLayout} from "@/layouts";
import {
  HomeHeader,
  SearchCard,
  BrandFeatureHighlights,
  MobileBrandSignature,
  AdCampaign,
} from "@/components";

const Home = () => {
  return (
    <AppLayout>
      <HomeHeader />
      
      <SearchCard/>
      <BrandFeatureHighlights/>
       
      <MobileBrandSignature />
      
    </AppLayout>
  );
};

export default Home;
