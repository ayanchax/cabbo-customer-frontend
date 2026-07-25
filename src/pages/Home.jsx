import {AppLayout} from "@/layouts";
import {HomeHeader,SearchCard, BrandFeatureHighlights} from "@/components";
const Home = () => {
  return (
    <AppLayout>
      <HomeHeader />
      <SearchCard/>
      <BrandFeatureHighlights/>
    </AppLayout>
  );
};

export default Home;