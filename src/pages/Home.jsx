import {AppLayout} from "@/layouts";
import {HomeHeader} from "@/components";
import {SearchCard} from "@/components";
const Home = () => {
  return (
    <AppLayout>
      <HomeHeader />
      <SearchCard/>
    </AppLayout>
  );
};

export default Home;