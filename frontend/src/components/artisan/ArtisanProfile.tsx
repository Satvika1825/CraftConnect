import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Award, Calendar, Star, Upload, User, Store } from 'lucide-react';
import artisanWorkshop from '@/assets/artisan-workshop.jpg';

const ArtisanProfile: React.FC = () => {
  const achievements = [
    { title: "Master Craftsperson", year: "2020", organization: "Indian Handicrafts Board" },
    { title: "Heritage Craft Award", year: "2019", organization: "Ministry of Culture" },
    { title: "Excellence in Pottery", year: "2018", organization: "Craft Council of India" }
  ];

  const specializations = ["Traditional Pottery", "Terracotta Art", "Ceramic Glazing", "Wheel Throwing"];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Avatar className="h-32 w-32 mx-auto">
          <AvatarFallback className="bg-craft-terracotta text-white text-4xl">
            🎨
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-serif font-bold text-craft-terracotta">
            Artisan Profile
          </h1>
          <p className="text-muted-foreground">Showcase your craft and heritage</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="workshop">Workshop</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="artisanName">Full Name</Label>
                  <Input id="artisanName" defaultValue="Ramesh Kumar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="craftTradition">Craft Tradition</Label>
                  <Input id="craftTradition" defaultValue="5th Generation Potter" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input id="experience" defaultValue="25" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="Khurja, Uttar Pradesh" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    defaultValue="I am a 5th generation potter from Khurja, carrying forward the traditional art of ceramic making that has been in my family for over 150 years."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {specializations.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  Add Specialization
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Achievements & Recognition</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-craft-deep-red">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.organization}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{achievement.year}</Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Add Achievement
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workshop" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5" />
                <span>Workshop Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workshopName">Workshop Name</Label>
                  <Input id="workshopName" defaultValue="Kumar Traditional Pottery" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="established">Established Year</Label>
                  <Input id="established" defaultValue="1875" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workshopAddress">Workshop Address</Label>
                <Textarea 
                  id="workshopAddress" 
                  defaultValue="123 Pottery Lane, Khurja, Bulandshahr, Uttar Pradesh - 203131"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workshopDescription">Workshop Description</Label>
                <Textarea 
                  id="workshopDescription" 
                  defaultValue="Our workshop is equipped with traditional pottery wheels, kilns, and glazing facilities. We maintain the authentic methods passed down through generations while incorporating modern quality standards."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Workshop Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="aspect-square">
                    <img 
                      src={artisanWorkshop} 
                      alt="Workshop"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  {[...Array(2)].map((_, index) => (
                    <div 
                      key={index}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-craft-terracotta transition-colors"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Craft Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div 
                    key={index}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-craft-terracotta transition-colors"
                  >
                    <div className="text-center space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div className="text-sm text-muted-foreground">Upload Work</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Showcase your best work to attract customers. Include process photos and finished products.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 space-y-4">
                <Star className="h-16 w-16 mx-auto text-craft-mustard" />
                <h3 className="text-xl font-semibold">4.8 out of 5</h3>
                <p className="text-muted-foreground">Based on 24 customer reviews</p>
                <div className="space-y-2 max-w-sm mx-auto">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <span className="text-sm w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-craft-mustard h-2 rounded-full" 
                          style={{ width: rating === 5 ? '80%' : rating === 4 ? '15%' : '5%' }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {rating === 5 ? '20' : rating === 4 ? '3' : '1'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button variant="craft" size="lg">
          Update Profile
        </Button>
      </div>
    </div>
  );
};

export default ArtisanProfile;