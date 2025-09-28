import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react';
import artisanWorkshop from '@/assets/artisan-workshop.jpg';
import textileArt from '@/assets/textile-art.jpg';

const MyProducts: React.FC = () => {
  const products = [
    {
      id: 1,
      name: "Handwoven Silk Saree",
      category: "Textiles",
      price: "₹4,500",
      stock: 5,
      status: "Active",
      image: textileArt,
      views: 247,
      sales: 12
    },
    {
      id: 2,
      name: "Terracotta Pot Set",
      category: "Pottery",
      price: "₹850",
      stock: 0,
      status: "Out of Stock",
      image: artisanWorkshop,
      views: 156,
      sales: 8
    },
    {
      id: 3,
      name: "Ceramic Dinner Plates",
      category: "Pottery", 
      price: "₹1,200",
      stock: 15,
      status: "Pending Approval",
      image: artisanWorkshop,
      views: 89,
      sales: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Out of Stock': return 'destructive';
      case 'Pending Approval': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-serif font-bold text-craft-terracotta">
            My Products
          </h1>
          <p className="text-muted-foreground">
            Manage your product inventory and listings
          </p>
        </div>
        <Button variant="craft" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending Approval</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative overflow-hidden rounded-t-lg">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge 
                className="absolute top-2 right-2" 
                variant={getStatusColor(product.status)}
              >
                {product.status}
              </Badge>
            </div>
            
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-craft-deep-red">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <div className="font-semibold text-craft-terracotta">{product.price}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Stock:</span>
                  <div className="font-semibold">{product.stock} units</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Views:</span>
                  <div className="font-semibold">{product.views}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Sales:</span>
                  <div className="font-semibold">{product.sales}</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-craft-terracotta" />
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-muted-foreground">Total Products</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="text-sm text-muted-foreground">Out of Stock</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyProducts;