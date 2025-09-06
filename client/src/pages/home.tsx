import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import ServiceCard from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Plus, Recycle, Users, DollarSign } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const featuredProducts = products.slice(0, 4);
  const featuredServices = services.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="gradient-green hero-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Welcome back, {user?.firstName || 'Student'}!
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              Continue building a sustainable campus community. What are you looking for today?
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Input
                  type="text"
                  className="w-full pl-10 pr-12 py-4 text-lg"
                  placeholder="Search for products, services, or students..."
                  data-testid="input-search"
                />
                <Button 
                  className="absolute inset-y-0 right-0 px-6 bg-primary text-primary-foreground rounded-r-lg hover:bg-primary/90"
                  data-testid="button-search"
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/marketplace">
                <Button variant="secondary" size="lg" data-testid="button-marketplace">
                  🛍️ Browse Marketplace
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="secondary" size="lg" data-testid="button-services">
                  🎓 Find Services
                </Button>
              </Link>
              <Link href="/add-listing">
                <Button variant="secondary" size="lg" data-testid="button-add-listing">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Listing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="bg-secondary py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2" data-testid="text-active-users">
                  {stats.activeUsers.toLocaleString()}
                </div>
                <div className="text-muted-foreground">Active Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2" data-testid="text-items-traded">
                  {stats.itemsTraded.toLocaleString()}
                </div>
                <div className="text-muted-foreground">Items Traded</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2" data-testid="text-waste-reduced">
                  {stats.wasteReduced}
                </div>
                <div className="text-muted-foreground">Waste Reduced</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2" data-testid="text-co2-saved">
                  {stats.co2Saved}
                </div>
                <div className="text-muted-foreground">CO₂ Saved</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Discover amazing items from your fellow students</p>
            </div>
            <Link href="/marketplace">
              <Button variant="outline" data-testid="button-view-all-products">
                View All Products
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No products available yet.</p>
                <Link href="/add-listing">
                  <Button className="mt-4" data-testid="button-add-first-product">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Product
                  </Button>
                </Link>
              </div>
            ) : (
              featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Student Services</h2>
              <p className="text-muted-foreground">Get help or offer your skills to fellow students</p>
            </div>
            <Link href="/services">
              <Button variant="outline" data-testid="button-view-all-services">
                View All Services
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No services available yet.</p>
                <Link href="/add-listing">
                  <Button className="mt-4" data-testid="button-add-first-service">
                    <Plus className="w-4 h-4 mr-2" />
                    Offer First Service
                  </Button>
                </Link>
              </div>
            ) : (
              featuredServices.map((service: any) => (
                <ServiceCard key={service.id} service={service} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/add-listing">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="text-primary text-2xl" />
                  </div>
                  <CardTitle>Sell or Donate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    List items you no longer need and earn EcoPoints
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/messages">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-primary text-2xl" />
                  </div>
                  <CardTitle>Connect</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Message other students and negotiate deals
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Recycle className="text-primary text-2xl" />
                  </div>
                  <CardTitle>Track Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    See your EcoPoints and sustainability impact
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
