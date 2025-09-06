import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Package, Users } from "lucide-react";

export default function AddListing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    type: "",
    price: "",
  });

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    category: "",
    priceType: "",
    price: "",
  });

  const productMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/products", {
        ...data,
        price: data.price ? parseFloat(data.price) : null,
        imageUrls: [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product listed successfully!",
      });
      setLocation("/marketplace");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product listing",
        variant: "destructive",
      });
    },
  });

  const serviceMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/services", {
        ...data,
        price: parseFloat(data.price),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Success",
        description: "Service listed successfully!",
      });
      setLocation("/services");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create service listing",
        variant: "destructive",
      });
    },
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.title || !productForm.description || !productForm.category || 
        !productForm.condition || !productForm.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (productForm.type === "sell" && !productForm.price) {
      toast({
        title: "Error",
        description: "Price is required for items being sold",
        variant: "destructive",
      });
      return;
    }

    productMutation.mutate(productForm);
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceForm.title || !serviceForm.description || !serviceForm.category || 
        !serviceForm.priceType || !serviceForm.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    serviceMutation.mutate(serviceForm);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Add New Listing</h1>
          <p className="text-muted-foreground">Share products or offer services to your fellow students</p>
        </div>

        <Tabs defaultValue="product" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="product" className="flex items-center" data-testid="tab-product">
              <Package className="w-4 h-4 mr-2" />
              Product
            </TabsTrigger>
            <TabsTrigger value="service" className="flex items-center" data-testid="tab-service">
              <Users className="w-4 h-4 mr-2" />
              Service
            </TabsTrigger>
          </TabsList>

          <TabsContent value="product">
            <Card>
              <CardHeader>
                <CardTitle>List a Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product-title">Title *</Label>
                      <Input
                        id="product-title"
                        placeholder="e.g., Advanced Data Structures Textbook"
                        value={productForm.title}
                        onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                        data-testid="input-product-title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="product-category">Category *</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger data-testid="select-product-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="books">Books</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="stationery">Stationery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="product-description">Description *</Label>
                    <Textarea
                      id="product-description"
                      placeholder="Describe your item, its condition, and any relevant details..."
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      data-testid="textarea-product-description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="product-condition">Condition *</Label>
                      <Select
                        value={productForm.condition}
                        onValueChange={(value) => setProductForm(prev => ({ ...prev, condition: value }))}
                      >
                        <SelectTrigger data-testid="select-product-condition">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Like New</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="product-type">Type *</Label>
                      <Select
                        value={productForm.type}
                        onValueChange={(value) => setProductForm(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger data-testid="select-product-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sell">For Sale</SelectItem>
                          <SelectItem value="exchange">For Exchange</SelectItem>
                          <SelectItem value="donate">Free/Donation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {productForm.type === "sell" && (
                      <div>
                        <Label htmlFor="product-price">Price ($) *</Label>
                        <Input
                          id="product-price"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          data-testid="input-product-price"
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={productMutation.isPending}
                    data-testid="button-submit-product"
                  >
                    {productMutation.isPending ? "Creating..." : "List Product"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service">
            <Card>
              <CardHeader>
                <CardTitle>Offer a Service</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleServiceSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="service-title">Service Title *</Label>
                      <Input
                        id="service-title"
                        placeholder="e.g., Math Tutoring, Web Development"
                        value={serviceForm.title}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                        data-testid="input-service-title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="service-category">Category *</Label>
                      <Select
                        value={serviceForm.category}
                        onValueChange={(value) => setServiceForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger data-testid="select-service-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic Help</SelectItem>
                          <SelectItem value="technical">Technical Service</SelectItem>
                          <SelectItem value="creative">Creative Service</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="service-description">Description *</Label>
                    <Textarea
                      id="service-description"
                      placeholder="Describe your service, your experience, and what you can help with..."
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      data-testid="textarea-service-description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="service-price-type">Pricing Type *</Label>
                      <Select
                        value={serviceForm.priceType}
                        onValueChange={(value) => setServiceForm(prev => ({ ...prev, priceType: value }))}
                      >
                        <SelectTrigger data-testid="select-service-price-type">
                          <SelectValue placeholder="Select pricing type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Per Hour</SelectItem>
                          <SelectItem value="session">Per Session</SelectItem>
                          <SelectItem value="project">Per Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="service-price">Price ($) *</Label>
                      <Input
                        id="service-price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                        data-testid="input-service-price"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={serviceMutation.isPending}
                    data-testid="button-submit-service"
                  >
                    {serviceMutation.isPending ? "Creating..." : "Offer Service"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
