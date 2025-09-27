import Header from "../components/Header";
import Hero from "../components/Hero";
import CraftCategories from "../components/CraftCategories";
import FeaturedProducts from "../components/FeaturedProducts";
import ArtisanSpotlight from "../components/ArtisanSpotlight";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <CraftCategories />
        <FeaturedProducts />
        <ArtisanSpotlight />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
