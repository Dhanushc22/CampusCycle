import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Recycle, Users, DollarSign, Leaf, Star, MessageCircle } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Recycle className="text-primary text-2xl mr-2" />
                <h1 className="text-xl font-bold text-primary">CampusCycle</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleLogin}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-login"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-green hero-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Sustainable Student Marketplace
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              Buy, sell, exchange, and donate with fellow students. Build a circular economy on campus while earning EcoPoints for sustainable actions.
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
              <Button variant="secondary" size="lg" data-testid="button-category-books">
                📚 Books
              </Button>
              <Button variant="secondary" size="lg" data-testid="button-category-electronics">
                💻 Electronics
              </Button>
              <Button variant="secondary" size="lg" data-testid="button-category-furniture">
                🛋️ Furniture
              </Button>
              <Button variant="secondary" size="lg" data-testid="button-category-services">
                🤝 Services
              </Button>
            </div>

            <div className="mt-8">
              <Button 
                size="lg" 
                onClick={handleLogin}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="button-get-started"
              >
                Get Started - Join CampusCycle
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2" data-testid="text-active-users">2,847</div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2" data-testid="text-items-traded">15,293</div>
              <div className="text-muted-foreground">Items Traded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2" data-testid="text-waste-reduced">4.2 tons</div>
              <div className="text-muted-foreground">Waste Reduced</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2" data-testid="text-co2-saved">892 kg</div>
              <div className="text-muted-foreground">CO₂ Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">About CampusCycle</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We're building a sustainable future, one campus at a time. CampusCycle connects students to create a circular economy that reduces waste, saves money, and builds community.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Recycle className="text-primary text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Sustainability</h3>
                <p className="text-muted-foreground">Reduce waste by giving products a second life through our marketplace</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-primary text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Community</h3>
                <p className="text-muted-foreground">Connect with fellow students and build lasting relationships</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-primary text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Affordability</h3>
                <p className="text-muted-foreground">Access essential items at student-friendly prices</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Recycle className="text-2xl mr-2" />
                <h3 className="text-xl font-bold">CampusCycle</h3>
              </div>
              <p className="text-primary-foreground/80 mb-4">
                Building sustainable campus communities through peer-to-peer marketplace solutions.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#marketplace" className="text-primary-foreground/80 hover:text-primary-foreground">Marketplace</a></li>
                <li><a href="#services" className="text-primary-foreground/80 hover:text-primary-foreground">Services</a></li>
                <li><a href="#about" className="text-primary-foreground/80 hover:text-primary-foreground">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">Help Center</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">Safety Guidelines</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">Contact Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2">
                <p className="text-primary-foreground/80">hello@campuscycle.edu</p>
                <p className="text-primary-foreground/80">(555) 123-4567</p>
                <p className="text-primary-foreground/80">Student Union Building</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 pt-8 mt-8 text-center">
            <p className="text-primary-foreground/80">
              &copy; 2024 CampusCycle. All rights reserved. Made with ♻️ for sustainable campuses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
