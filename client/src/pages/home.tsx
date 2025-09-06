import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import ServiceCard from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Plus, Recycle, Users, DollarSign, MessageSquare, BookOpen, Shield } from "lucide-react";

interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  endDate?: string;
  date?: string;
  highlight: string;
}

interface TrendingSection {
  id: string;
  title: string;
  items: string[];
}

interface PromotionsData {
  featured: Promotion[];
  trending: TrendingSection[];
}

export default function Home() {
  const { user } = useAuth();

  const { data: promotions } = useQuery<PromotionsData>({
    queryKey: ["promotions"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5000/api/promotions");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5000/api/services");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5000/api/stats");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // Mock stats if not available
  const displayStats = stats || {
    activeUsers: 2847,
    itemsTraded: 15293,
    wasteReduced: "4.2 tons",
    co2Saved: "892 kg"
  };

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
              {user ? `Welcome back, ${user.firstName}!` : 'Welcome to EcoFind'}
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-4 max-w-3xl mx-auto">
              Your Student-Exclusive Marketplace for Sustainable Campus Living
            </p>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
              Join thousands of verified students in buying, selling, exchanging, and sharing resources while building a greener campus community.
            </p>
            
            {!user && (
              <div className="flex gap-4 justify-center mb-8">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/login">Login with Student Email</Link>
                </Button>
                <Button size="lg" variant="default" asChild>
                  <Link href="/signup">Join EcoFind</Link>
                </Button>
              </div>
            )}
            
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

      {/* Key Features Section */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EcoFind?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Student-Verified Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Exclusive access for verified students ensures a trusted, secure marketplace within your campus community.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Recycle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Earn EcoPoints</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Get rewarded for sustainable choices. Earn points when you donate, exchange, or help fellow students.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Direct Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Chat directly with buyers, sellers, and service providers. Negotiate deals safely within the platform.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-center mb-12">Our Growing Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2" data-testid="text-active-users">
                {typeof displayStats.activeUsers === 'number' ? displayStats.activeUsers.toLocaleString() : displayStats.activeUsers}
              </div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2" data-testid="text-items-traded">
                {typeof displayStats.itemsTraded === 'number' ? displayStats.itemsTraded.toLocaleString() : displayStats.itemsTraded}
              </div>
              <div className="text-muted-foreground">Resources Shared</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2" data-testid="text-money-saved">
                ${displayStats.moneyStudentsSaved || "45,293"}
              </div>
              <div className="text-muted-foreground">Student Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2" data-testid="text-service-hours">
                {displayStats.serviceHoursProvided?.toLocaleString() || "1,893"}
              </div>
              <div className="text-muted-foreground">Service Hours</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Promotions */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Offers</h2>
          
          {/* Carousel of promotions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {promotions?.featured.map((promo) => (
              <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={promo.image} 
                  alt={promo.title}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{promo.title}</CardTitle>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {promo.highlight}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{promo.description}</p>
                  {promo.endDate && (
                    <p className="text-sm mt-4 text-primary">
                      Ends: {new Date(promo.endDate).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trending Items/Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {promotions?.trending.map((trend) => (
              <Card key={trend.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{trend.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {trend.items.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How EcoFind Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">1. Verify Account</h3>
              <p className="text-muted-foreground">Sign up with your student email for instant verification</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">2. Create Listings</h3>
              <p className="text-muted-foreground">List items to sell/exchange or services you can offer</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">3. Connect</h3>
              <p className="text-muted-foreground">Chat with other students and arrange exchanges</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">4. Earn & Impact</h3>
              <p className="text-muted-foreground">Complete transactions and earn EcoPoints</p>
            </div>
          </div>
        </div>
      </section>

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">Get Started Today</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Join thousands of students in building a sustainable campus community
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/add-listing">
              <Card className="hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="text-primary text-2xl" />
                  </div>
                  <CardTitle>List & Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center mb-4">
                    Sell, exchange, or donate items you no longer need. Offer your skills and services.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span>Quick listing process</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span>Multiple categories</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span>Earn EcoPoints</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            <Link href="/services">
              <Card className="hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-primary text-2xl" />
                  </div>
                  <CardTitle>Find Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center mb-4">
                    Discover student services from tutoring to technical help and creative work.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span>Academic support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span>Project assistance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span>Verified providers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard">
              <Card className="hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Recycle className="text-primary text-2xl" />
                  </div>
                  <CardTitle>Make an Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center mb-4">
                    Track your contribution to campus sustainability and circular economy.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span>Track EcoPoints</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span>View impact stats</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span>Build reputation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
