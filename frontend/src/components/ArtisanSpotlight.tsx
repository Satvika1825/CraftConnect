import { MapPin, Award, Clock, ArrowRight } from "lucide-react";

const artisans = [
  {
    name: "Kamala Devi",
    craft: "Block Printing",
    village: "Sanganer, Rajasthan",
    experience: "25 years",
    speciality: "Traditional Rajasthani patterns",
    products: 45,
    rating: 4.9,
    story: "Kamala has been preserving the ancient art of block printing, using natural dyes and hand-carved wooden blocks passed down through generations.",
    image: "/api/placeholder/300/300"
  },
  {
    name: "Ashok Kumar",
    craft: "Blue Pottery",
    village: "Jaipur, Rajasthan", 
    experience: "18 years",
    speciality: "Decorative tiles and vases",
    products: 32,
    rating: 4.8,
    story: "Ashok specializes in the distinctive blue pottery of Jaipur, creating stunning pieces that blend traditional techniques with contemporary designs.",
    image: "/api/placeholder/300/300"
  }
];

const ArtisanSpotlight = () => {
  return (
    <section className="py-20 bg-gradient-earth">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="heading-secondary mb-4">Meet Our Artisans</h2>
          <p className="body-text-large max-w-2xl mx-auto">
            Get to know the skilled craftspeople behind every masterpiece. 
            Each artisan brings decades of experience and cultural heritage to their work.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {artisans.map((artisan, index) => (
            <div
              key={artisan.name}
              className="craft-card bg-white/90 backdrop-blur-sm group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex flex-col md:flex-row gap-6 p-8">
                {/* Artisan Image */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-warm rounded-full flex items-center justify-center shadow-craft">
                    <span className="text-4xl font-bold text-primary-foreground">
                      {artisan.name.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Artisan Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="heading-tertiary mb-1 group-hover:text-primary transition-colors">
                        {artisan.name}
                      </h3>
                      <p className="text-primary font-medium mb-2">{artisan.craft}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{artisan.village}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-secondary/20 px-3 py-1 rounded-full">
                      <Award className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium">{artisan.rating}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      <span className="text-sm">{artisan.experience} experience</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{artisan.products}</span> products
                    </div>
                  </div>

                  {/* Speciality */}
                  <div className="mb-4">
                    <h4 className="font-medium text-foreground mb-1">Speciality:</h4>
                    <p className="text-sm text-muted-foreground">{artisan.speciality}</p>
                  </div>

                  {/* Story */}
                  <p className="body-text text-sm leading-relaxed mb-6">
                    {artisan.story}
                  </p>

                  {/* Action Button */}
                  <button className="craft-button-primary flex items-center gap-2 text-sm px-4 py-2">
                    Visit Shop
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="craft-button-secondary">
            Meet All Artisans
          </button>
        </div>
      </div>
    </section>
  );
};

export default ArtisanSpotlight;