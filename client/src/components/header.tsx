import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
import { Recycle, Bell, MessageCircle, Leaf, User, Settings } from "lucide-react";

export default function Header() {
  const { user } = useAuth();
  const [location] = useLocation();


  const navigationItems = [
    { href: "/", label: "Home", current: location === "/" },
    { href: "/marketplace", label: "Marketplace", current: location === "/marketplace" },
    { href: "/services", label: "Services", current: location === "/services" },
    { href: "/messages", label: "Messages", current: location === "/messages" },
  ];

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer" data-testid="link-home">
                <Recycle className="text-primary text-2xl mr-2" />
                <h1 className="text-xl font-bold text-primary">CampusCycle</h1>
              </div>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      item.current
                        ? "text-primary border-b-2 border-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </button>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* EcoPoints Display */}
            <div className="hidden md:flex items-center bg-muted rounded-lg px-3 py-2">
              <Leaf className="text-accent mr-2 w-4 h-4" />
              <span className="text-sm font-medium text-muted-foreground" data-testid="text-ecopoints">
                {user?.ecoPoints ? user.ecoPoints.toLocaleString() : "0"} EcoPoints
              </span>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative" data-testid="button-notifications">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>

            {/* Messages */}
            <Link href="/messages">
              <Button variant="ghost" size="sm" data-testid="button-messages">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2" data-testid="button-user-menu">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium" data-testid="text-user-name">
                    {user?.firstName} {user?.lastName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium" data-testid="text-dropdown-user-name">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/add-listing" className="flex items-center cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Add Listing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer"
                  data-testid="button-demo-mode"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Demo Mode
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
