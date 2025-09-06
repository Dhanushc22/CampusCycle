import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Package, Users, Star, TrendingUp, Gift, DollarSign } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: userProducts = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "products"],
  });

  const { data: userServices = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "services"],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  if (!user) {
    return null;
  }

  const ecoPoints = user.ecoPoints || 0;
  const nextLevelPoints = Math.ceil((ecoPoints + 250) / 250) * 250;
  const progressToNext = ((ecoPoints % 250) / 250) * 100;

  const completedTransactions = (transactions as any[]).filter((t: any) => t.status === 'completed');
  const itemsSold = completedTransactions.filter((t: any) => t.sellerId === user.id && t.type === 'sale').length;
  const itemsDonated = completedTransactions.filter((t: any) => t.sellerId === user.id && t.type === 'donation').length;
  const itemsExchanged = completedTransactions.filter((t: any) => t.sellerId === user.id && t.type === 'exchange').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Track your impact and manage your listings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={user.profileImageUrl || ""} />
                    <AvatarFallback className="text-2xl">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-foreground" data-testid="text-user-name">
                    {user.firstName} {user.lastName}
                  </h3>
                  {user.university && (
                    <p className="text-muted-foreground" data-testid="text-user-university">
                      {user.university} {user.major && `- ${user.major}`}
                    </p>
                  )}
                  <div className="flex items-center justify-center mt-2">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-foreground font-medium" data-testid="text-user-rating">
                      {user.rating || "0.00"}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      ({user.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Leaf className="w-4 h-4 text-primary mr-2" />
                        <span className="text-primary font-medium">EcoPoints</span>
                      </div>
                      <span className="text-primary font-bold text-xl" data-testid="text-eco-points">
                        {ecoPoints.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progressToNext} className="mb-2" />
                    <p className="text-xs text-primary">
                      Next level: {nextLevelPoints - ecoPoints} points
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-foreground" data-testid="text-items-sold">
                        {itemsSold}
                      </div>
                      <div className="text-sm text-muted-foreground">Sold</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground" data-testid="text-items-donated">
                        {itemsDonated}
                      </div>
                      <div className="text-sm text-muted-foreground">Donated</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground" data-testid="text-items-exchanged">
                        {itemsExchanged}
                      </div>
                      <div className="text-sm text-muted-foreground">Exchanged</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="listings" data-testid="tab-listings">My Listings</TabsTrigger>
                <TabsTrigger value="activity" data-testid="tab-activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="stats" data-testid="tab-stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Products ({(userProducts as any[]).length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(userProducts as any[]).length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        You haven't listed any products yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {(userProducts as any[]).map((product: any) => (
                          <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground" data-testid={`text-product-title-${product.id}`}>
                                {product.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">{product.category} • {product.condition}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={product.type === 'sell' ? 'default' : product.type === 'exchange' ? 'secondary' : 'outline'}>
                                {product.type === 'sell' ? `$${product.price}` : product.type.toUpperCase()}
                              </Badge>
                              <Badge variant={product.isActive ? 'default' : 'secondary'}>
                                {product.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Services ({(userServices as any[]).length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(userServices as any[]).length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        You haven't offered any services yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {(userServices as any[]).map((service: any) => (
                          <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground" data-testid={`text-service-title-${service.id}`}>
                                {service.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {service.category} • {service.completedSessions} completed
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="default">
                                ${service.price}/{service.priceType}
                              </Badge>
                              <Badge variant={service.isActive ? 'default' : 'secondary'}>
                                {service.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {completedTransactions.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No completed transactions yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {completedTransactions.slice(0, 5).map((transaction: any) => (
                          <div key={transaction.id} className="flex items-center p-4 border border-border rounded-lg">
                            <div className={`p-2 rounded-full mr-4 ${
                              transaction.type === 'donation' ? 'bg-accent/10' : 
                              transaction.type === 'exchange' ? 'bg-secondary/50' : 
                              'bg-primary/10'
                            }`}>
                              {transaction.type === 'donation' ? (
                                <Gift className={`w-4 h-4 ${
                                  transaction.type === 'donation' ? 'text-accent' : 
                                  transaction.type === 'exchange' ? 'text-secondary-foreground' : 
                                  'text-primary'
                                }`} />
                              ) : transaction.type === 'exchange' ? (
                                <TrendingUp className="w-4 h-4 text-secondary-foreground" />
                              ) : (
                                <DollarSign className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-foreground">
                                {transaction.type === 'donation' ? 'Donated' : 
                                 transaction.type === 'exchange' ? 'Exchanged' : 'Sold'} item
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {transaction.ecoPointsAwarded > 0 && (
                              <span className="text-primary font-medium">
                                +{transaction.ecoPointsAwarded} EcoPoints
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Impact Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Items Sold</span>
                        <span className="font-medium" data-testid="text-summary-sold">{itemsSold}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Items Donated</span>
                        <span className="font-medium" data-testid="text-summary-donated">{itemsDonated}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Items Exchanged</span>
                        <span className="font-medium" data-testid="text-summary-exchanged">{itemsExchanged}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total EcoPoints</span>
                        <span className="font-medium text-primary" data-testid="text-summary-ecopoints">
                          {ecoPoints.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Environmental Impact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {((itemsSold + itemsDonated + itemsExchanged) * 0.3).toFixed(1)} kg
                        </div>
                        <div className="text-sm text-muted-foreground">Waste Diverted</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent mb-1">
                          {((itemsSold + itemsDonated + itemsExchanged) * 0.06).toFixed(1)} kg
                        </div>
                        <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
