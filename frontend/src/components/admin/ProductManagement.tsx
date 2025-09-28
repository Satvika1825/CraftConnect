import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Package, CheckCircle, XCircle, Clock, Eye, AlertCircle } from 'lucide-react';
import textileArt from '@/assets/textile-art.jpg';
import artisanWorkshop from '@/assets/artisan-workshop.jpg';

const ProductManagement: React.FC = () => {
  const products = [
    {
      id: 1,
      name: "Handwoven Silk Saree",
      artisan: "Meera Textile Arts",
      category: "Textiles",
      price: "₹4,500",
      status: "pending",
      submittedDate: "2024-01-18",
      image: textileArt,
      description: "Traditional Banarasi silk saree with intricate gold thread work"
    },
    {
      id: 2,
      name: "Terracotta Pot Set",
      artisan: "Kumar Pottery",
      category: "Pottery",
      price: "₹850",
      status: "approved",
      submittedDate: "2024-01-15",
      image: artisanWorkshop,
      description: "Set of 4 traditional terracotta pots for home décor"
    },
    {
      id: 3,
      name: "Wooden Elephant Sculpture",
      artisan: "Traditional Crafts",
      category: "Wood Carving",
      price: "₹2,200",
      status: "rejected",
      submittedDate: "2024-01-12",
      image: artisanWorkshop,
      description: "Hand-carved wooden elephant with traditional patterns",
      rejectionReason: "Quality standards not met, requires refinishing"
    },
    {
      id: 4,
      name: "Brass Diya Collection",
      artisan: "Heritage Metalworks",
      category: "Metalwork",
      price: "₹1,200",
      status: "flagged",
      submittedDate: "2024-01-10",
      image: artisanWorkshop,
      description: "Set of traditional brass oil lamps for festivals",
      flagReason: "Possible duplicate listing"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      case 'flagged': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'flagged': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-craft-terracotta">
          Product Management
        </h1>
        <p className="text-muted-foreground">
          Review and manage product submissions from artisans
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-craft-terracotta" />
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-sm text-muted-foreground">Total Products</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">23</div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">1,189</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-muted-foreground">Flagged</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="pottery">Pottery</SelectItem>
                <SelectItem value="textiles">Textiles</SelectItem>
                <SelectItem value="woodwork">Wood Carving</SelectItem>
                <SelectItem value="metalwork">Metalwork</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Product Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                <div className="flex space-x-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-craft-deep-red">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">by {product.artisan}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <Badge variant="outline">{product.category}</Badge>
                          <span className="font-semibold text-craft-terracotta">{product.price}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(product.status)} className="flex items-center space-x-1">
                        {getStatusIcon(product.status)}
                        <span className="capitalize">{product.status}</span>
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">{product.description}</p>

                    {product.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <p className="text-sm text-red-700">
                          <strong>Rejection Reason:</strong> {product.rejectionReason}
                        </p>
                      </div>
                    )}

                    {product.flagReason && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <p className="text-sm text-yellow-700">
                          <strong>Flagged:</strong> {product.flagReason}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Submitted: {product.submittedDate}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        
                        {product.status === 'pending' && (
                          <>
                            <Button size="sm" variant="craft">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {product.status === 'flagged' && (
                          <>
                            <Button size="sm" variant="craft">
                              Resolve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              Remove
                            </Button>
                          </>
                        )}
                        
                        {product.status === 'approved' && (
                          <Button size="sm" variant="outline" className="text-red-600">
                            Remove from Store
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;