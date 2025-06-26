import { getHomeById } from "@/actions/getHomeById";
import HomeDetailsClient from "@/components/home/HomeDetailsClient";

interface HomeDetailsProps {
  params: Promise<{
    homeId: string;
  }>;
}

const HomeDetails = async ({ params }: HomeDetailsProps) => {
  // Remove the await - params is synchronous
  const { homeId } = await params;
  const home = await getHomeById(homeId);

  if (!home) return <div>Property not found.</div>;

  return (
    <div>
      <HomeDetailsClient home={home} />
    </div>
  );
};

export default HomeDetails;
