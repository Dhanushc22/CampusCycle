import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, GraduationCap, Code, Palette, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  priceType: string;
  price: number;
  providerId: string;
  completedSessions: number;
  createdAt: string;
}

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startConversation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/conversations", {
        participant2Id: service.providerId,
        serviceId: service.id,
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

  const handleBookService = () => {
    if (!user) {
      toast({
        title: "Info",
        description: "Please try again later",
      });
      return;
    }
    
    if (user.id === service.providerId) {
      toast({
        title: "Info",
        description: "You can't book your own service!",
      });
      return;
    }

    startConversation.mutate();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return <GraduationCap className="text-primary text-xl" />;
      case 'technical':
        return <Code className="text-primary text-xl" />;
      case 'creative':
        return <Palette className="text-primary text-xl" />;
      default:
        return <Users className="text-primary text-xl" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'academic':
        return 'Academic Help';
      case 'technical':
        return 'Technical Service';
      case 'creative':
        return 'Creative Service';
      default:
        return 'Other Service';
    }
  };

  const formatPriceType = (priceType: string) => {
    switch (priceType) {
      case 'hourly':
        return '/hr';
      case 'session':
        return '/session';
      case 'project':
        return '/project';
      default:
        return '';
    }
  };

  const getActionLabel = () => {
    switch (service.priceType) {
      case 'hourly':
        return 'Book Session';
      case 'session':
        return 'Book Session';
      case 'project':
        return 'Get Quote';
      default:
        return 'Contact Provider';
    }
  };

  return (
    <Card className="hover:shadow-xl transition-shadow" data-testid={`card-service-${service.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-lg mr-4">
              {getCategoryIcon(service.category)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground" data-testid={`text-service-title-${service.id}`}>
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm" data-testid={`text-service-category-${service.id}`}>
                {getCategoryLabel(service.category)}
              </p>
            </div>
          </div>
          <Badge className="bg-accent text-accent-foreground text-xs font-medium" data-testid={`text-service-price-${service.id}`}>
            ${service.price}{formatPriceType(service.priceType)}
          </Badge>
        </div>
        
        <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`text-service-description-${service.id}`}>
          {service.description}
        </p>
        
        <div className="flex items-center mb-4">
          <Avatar className="w-8 h-8 mr-3">
            <AvatarImage src="" />
            <AvatarFallback className="text-sm">P</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <span className="text-sm font-medium text-foreground">Provider</span>
            <div className="flex items-center">
              <Star className="w-3 h-3 text-yellow-400 mr-1" />
              <span className="text-sm text-muted-foreground">4.9</span>
              <span className="text-sm text-muted-foreground ml-2" data-testid={`text-service-sessions-${service.id}`}>
                ({service.completedSessions} sessions)
              </span>
            </div>
          </div>
        </div>
        
        <Button
          className="w-full"
          onClick={handleBookService}
          disabled={startConversation.isPending}
          data-testid={`button-book-service-${service.id}`}
        >
          {startConversation.isPending ? 'Contacting...' : getActionLabel()}
        </Button>
      </CardContent>
    </Card>
  );
}
