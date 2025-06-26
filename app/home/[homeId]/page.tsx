import AddHotelForm from "@/components/home/AddHomeForm";
import { getHomeById } from "@/actions/getHomeById";
import { auth } from "@clerk/nextjs/server";

interface HomePageProps {
  params: Promise<{ homeId: string }>;
}

const Home = async ({ params }: HomePageProps) => {
  const awaitedParams = await params;
  const home = await getHomeById(awaitedParams.homeId);
  const { userId } = await auth();
  if (!userId) return <div>Not authenticated</div>;
  if (home === null || home === undefined) return <div>Not found</div>;

  return (
    <div>
      <AddHotelForm home={home} />
    </div>
  );
};

export default Home;
