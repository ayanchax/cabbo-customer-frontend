import {AppLayout} from "@/layouts";
import {
  HomeHeader,
  SearchCard,
  BrandFeatureHighlights,
  MobileBrandSignature,
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
