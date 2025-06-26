import { getHomeById } from "@/actions/getHomeById";
import HomeDetailsClient from "@/components/home/HomeDetailsClient";

interface HomeDetailsProps {
  params: Promise<{ homeId: string }>; // ✅ Extends PageProps
}

const HomeDetails = async ({ params }: HomeDetailsProps) => {
  // Remove the await - params is synchronous
  const { homeId } = await params;
  const home = await getHomeById(homeId);

  if (!home) return <div>Property not found.</div>;
  const homeData = { ...home, availableTo: home.availableTo ?? undefined };

  return (
    <div>
      <HomeDetailsClient home={homeData} />
    </div>
  );
};

export default HomeDetails;
