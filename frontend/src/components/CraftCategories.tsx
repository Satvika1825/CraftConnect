import { Palette, Scissors, Hammer, Sparkles, Shirt, Gem } from "lucide-react";

const categories = [
  {
    name: "Pottery & Ceramics",
    icon: Palette,
    description: "Traditional clay work and terracotta art",
    color: "from-earth-rust to-earth-clay"
  },
  {
    name: "Textiles & Weaving",
    icon: Scissors,
    description: "Handwoven fabrics and traditional patterns",
    color: "from-secondary to-secondary-light"
  },
  {
    name: "Wood Carving",
    icon: Hammer,
    description: "Intricate wooden sculptures and furniture",
    color: "from-earth-ochre to-earth-sand"
  },
  {
    name: "Embroidery",
    icon: Sparkles,
    description: "Detailed needlework and thread art",
    color: "from-accent to-accent-light"
  },
  {
    name: "Traditional Clothing",
    icon: Shirt,
    description: "Authentic garments and accessories",
    color: "from-primary to-primary-light"
  },
  {
    name: "Jewelry & Ornaments",
    icon: Gem,
    description: "Handcrafted jewelry and decorative pieces",
    color: "from-earth-rust to-primary"
  }
];

const CraftCategories = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="heading-secondary mb-4">Shop by Craft</h2>
          <p className="body-text-large max-w-2xl mx-auto">
            Explore our diverse collection of traditional Indian handicrafts, 
            each representing centuries of cultural heritage and artisanal excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.name}
                className="craft-card group cursor-pointer overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-32 bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 relative overflow-hidden`}>
                  <IconComponent className="w-12 h-12 text-white animate-float" />
                  <div className="absolute inset-0 texture-pattern opacity-30"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="heading-tertiary mb-3 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="body-text mb-4">
                    {category.description}
                  </p>
                  <button className="text-primary font-medium hover:text-primary-dark transition-colors">
                    Explore Collection →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CraftCategories;