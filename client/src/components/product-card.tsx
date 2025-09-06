import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  type: string;
  price: number | null;
  imageUrls: string[];
  sellerId: string;
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startConversation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/conversations", {
        participant2Id: product.sellerId,
        productId: product.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({
        title: "Success",
        description: "Conversation started! Check your messages.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to start conversation",
        variant: "destructive",
      });
    },
  });

  const handleContactSeller = () => {
    if (!user) {
      window.location.href = "/api/login";
      return;
    }
    
    if (user.id === product.sellerId) {
      toast({
        title: "Info",
        description: "You can't contact yourself!",
      });
      return;
    }

    startConversation.mutate();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sell':
        return 'bg-accent text-accent-foreground';
      case 'exchange':
        return 'bg-secondary text-secondary-foreground';
      case 'donate':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sell':
        return 'SELL';
      case 'exchange':
        return 'EXCHANGE';
      case 'donate':
        return 'FREE';
      default:
        return type.toUpperCase();
    }
  };

  const formatPrice = () => {
    if (product.type === 'donate') return 'Free';
    if (product.type === 'exchange') return 'Trade';
    if (product.price) return `$${product.price}`;
    return 'Price TBD';
  };

  return (
    <Card className="hover:shadow-xl transition-shadow" data-testid={`card-product-${product.id}`}>
      <div className="aspect-[4/3] bg-muted rounded-t-lg flex items-center justify-center">
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <img
            src={product.imageUrls[0]}
            alt={product.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="text-muted-foreground text-6xl">📦</div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground truncate flex-1" data-testid={`text-product-title-${product.id}`}>
            {product.title}
          </h3>
          <Badge className={`ml-2 ${getTypeColor(product.type)} text-xs font-medium`}>
            {getTypeLabel(product.type)}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2" data-testid={`text-product-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
            {formatPrice()}
          </span>
          <span className="text-sm text-muted-foreground capitalize" data-testid={`text-product-condition-${product.id}`}>
            {product.condition}
          </span>
        </div>
        <div className="flex items-center mb-3">
          <Avatar className="w-6 h-6 mr-2">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs">S</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground flex-1">Seller</span>
          <div className="flex items-center">
            <Star className="w-3 h-3 text-yellow-400 mr-1" />
            <span className="text-sm text-muted-foreground">4.8</span>
          </div>
        </div>
        <Button
          className="w-full"
          onClick={handleContactSeller}
          disabled={startConversation.isPending}
          data-testid={`button-contact-seller-${product.id}`}
        >
          {startConversation.isPending ? 'Contacting...' : 
           product.type === 'donate' ? 'Claim Item' : 
           product.type === 'exchange' ? 'Propose Exchange' : 'Contact Seller'}
        </Button>
      </CardContent>
    </Card>
  );
}
