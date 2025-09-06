import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { Plus, Search } from "lucide-react";

export default function Marketplace() {
  const [filters, setFilters] = useState({
    category: "",
    condition: "",
    type: "",
    search: "",
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      return fetch(`/api/products?${params}`).then(res => res.json());
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Browse products from fellow students</p>
          </div>
          <Link href="/add-listing">
            <Button data-testid="button-add-listing">
              <Plus className="w-4 h-4 mr-2" />
              Add Listing
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
                placeholder="Search products..."
                className="pl-10"
                defaultValue={filters.search}
                data-testid="input-search-products"
              />
            </div>
            <Button type="submit" data-testid="button-search-products">
              Search
            </Button>
          </form>

          <div className="flex flex-wrap gap-4">
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-40" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="stationery">Stationery</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.condition}
              onValueChange={(value) => setFilters(prev => ({ ...prev, condition: value }))}
            >
              <SelectTrigger className="w-40" data-testid="select-condition">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Condition</SelectItem>
                <SelectItem value="new">Like New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.type}
              onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="w-40" data-testid="select-type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="sell">For Sale</SelectItem>
                <SelectItem value="exchange">For Exchange</SelectItem>
                <SelectItem value="donate">Free/Donation</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setFilters({ category: "", condition: "", type: "", search: "" })}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {Object.values(filters).some(v => v) 
                ? "Try adjusting your filters or search terms"
                : "Be the first to add a product to the marketplace!"
              }
            </p>
            <Link href="/add-listing">
              <Button data-testid="button-add-first-product">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {products.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-muted-foreground" data-testid="text-results-count">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
