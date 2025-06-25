import AddHotelForm from "@/components/home/AddHomeForm";
import { getHomeById } from "@/actions/getHomeById";
import { auth } from "@clerk/nextjs/server";

interface HomePageProps {
  params: {
    homeId: string;
  };
}

const Home = async ({ params }: HomePageProps) => {
  const awaitedParams = await params;
  const home = await getHomeById(awaitedParams.homeId);
  const { userId } = await auth();
  if (!userId) return <div>Not authenticated</div>;
  return (
    <div>
      <AddHotelForm home={home} />
    </div>
  );
};

export default Home;
