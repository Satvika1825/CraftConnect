import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';

export default function ManageUsers() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-8">Manage Users</h1>

        <Card className="p-8 text-center">
          <p className="text-muted-foreground">User management interface will be displayed here</p>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
