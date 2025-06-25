import { HomeFormData } from "./AddHomeForm";
import HomeCard from "./HomeCard";

const HomeList = ({ homes }: { homes: HomeFormData[] }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Discover Your Perfect Stay
          </h1>
          <p className="text-muted-foreground mt-1">
            {homes.length} {homes.length === 1 ? "property" : "properties"}{" "}
            available
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {homes.map((home, index) => (
          <div
            key={home.id}
            className="animate-in fade-in-50 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <HomeCard home={home} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {homes.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-lg font-semibold mb-2">No properties found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default HomeList;
