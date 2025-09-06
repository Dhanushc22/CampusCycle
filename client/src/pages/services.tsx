import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import ServiceCard from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { Plus, Search } from "lucide-react";

export default function Services() {
  const [filters, setFilters] = useState({
    category: "",
    search: "",
  });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["/api/services", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      return fetch(`/api/services?${params}`).then(res => res.json());
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get("search") as string;
    setFilters(prev => ({ ...prev, search }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Student Services</h1>
            <p className="text-muted-foreground">Find help or offer your skills to fellow students</p>
          </div>
          <Link href="/add-listing">
            <Button data-testid="button-offer-service">
              <Plus className="w-4 h-4 mr-2" />
              Offer Service
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                name="search"
                placeholder="Search services..."
                className="pl-10"
                defaultValue={filters.search}
                data-testid="input-search-services"
              />
            </div>
            <Button type="submit" data-testid="button-search-services">
              Search
            </Button>
          </form>

          <div className="flex flex-wrap gap-4">
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-40" data-testid="select-service-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="academic">Academic Help</SelectItem>
                <SelectItem value="technical">Technical Service</SelectItem>
                <SelectItem value="creative">Creative Service</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setFilters({ category: "", search: "" })}
              data-testid="button-clear-service-filters"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-foreground mb-2">No services found</h3>
            <p className="text-muted-foreground mb-4">
              {Object.values(filters).some(v => v) 
                ? "Try adjusting your filters or search terms"
                : "Be the first to offer a service!"
              }
            </p>
            <Link href="/add-listing">
              <Button data-testid="button-add-first-service">
                <Plus className="w-4 h-4 mr-2" />
                Offer Service
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service: any) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {services.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-muted-foreground" data-testid="text-services-count">
              Showing {services.length} service{services.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
