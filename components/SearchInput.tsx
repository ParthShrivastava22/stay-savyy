"use client";

import { Input } from "./ui/input";
import { Search } from "lucide-react";

const SearchInput = () => {
  return (
    <div className="relative w-full">
      <Search className="absolute h-4 w-4 top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search destinations, properties..."
        className="pl-10 h-10 bg-background/50 border-border/50 backdrop-blur-sm focus:bg-background transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
      />
    </div>
  );
};

export default SearchInput;
