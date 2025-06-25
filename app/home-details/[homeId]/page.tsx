import { getHomeById } from "@/actions/getHomeById";
import HomeDetailsClient from "@/components/home/HomeDetailsClient";

interface HomeDetailsProps {
  params: {
    homeId: string;
  };
}

const HomeDetails = async ({ params }: HomeDetailsProps) => {
  const awaitedParams = await params;
  const home = await getHomeById(awaitedParams.homeId);
  if (!home) return <div>Property not found.</div>;
  return (
    <div>
      <HomeDetailsClient home={home} />
    </div>
  );
};

export default HomeDetails;
