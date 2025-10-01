import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { useUser } from '@clerk/clerk-react';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MyProducts() {
  const { user } = useUser();
  const { products, deleteProduct } = useStore();
  
  const myProducts = products.filter((p) => p.artisanId === user?.id);

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success('Product deleted successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-8">My Products</h1>

        {myProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">You haven't added any products yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.approved ? 'bg-accent/20 text-accent' : 'bg-secondary/20 text-secondary'
                    }`}>
                      {product.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-primary font-bold">₹{product.price}</span>
                    <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
