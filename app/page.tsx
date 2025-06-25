import { getHomes } from "@/actions/getHomes";
import HomeList from "@/components/home/HomeList";

interface HomeProps {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const awaitedParams = await searchParams;
  const homes = await getHomes(awaitedParams);
  if (!homes) return <div>No homes found...</div>;
  return (
    <div>
      <HomeList homes={homes} />
    </div>
  );
}
