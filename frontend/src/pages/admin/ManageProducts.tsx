import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageProducts() {
  const { products, updateProduct, deleteProduct } = useStore();

  const handleApprove = (id: string) => {
    updateProduct(id, { approved: true });
    toast.success('Product approved!');
  };

  const handleReject = (id: string) => {
    deleteProduct(id);
    toast.success('Product rejected and removed.');
  };

  const pendingProducts = products.filter((p) => !p.approved);
  const approvedProducts = products.filter((p) => p.approved);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-8">Manage Products</h1>

        {/* Pending Approval */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Pending Approval ({pendingProducts.length})</h2>
          {pendingProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No products pending approval</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">by {product.artisanName}</p>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-primary font-bold">₹{product.price}</span>
                      <span className="text-sm text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(product.id)}
                        className="flex-1 gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(product.id)}
                        variant="destructive"
                        className="flex-1 gap-2"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Approved Products */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Approved Products ({approvedProducts.length})</h2>
          {approvedProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No approved products yet</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {approvedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="text-primary font-bold mt-1">₹{product.price}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
