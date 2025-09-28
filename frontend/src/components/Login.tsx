import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, LoginForm } from '@/types/auth';
import { Loader2, Palette, Hammer, Shield } from 'lucide-react';
import heroArtisan from '@/assets/hero-artisan.jpg';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    role: 'customer',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      await login(formData);
    }
  };

  const roleOptions = [
    {
      value: 'customer' as UserRole,
      label: 'Customer',
      description: 'Browse and purchase beautiful handicrafts',
      icon: Palette,
      color: 'craft-teal',
    },
    {
      value: 'artisan' as UserRole,
      label: 'Artisan',
      description: 'Showcase and sell your traditional crafts',
      icon: Hammer,
      color: 'craft-terracotta',
    },
    {
      value: 'admin' as UserRole,
      label: 'Admin',
      description: 'Manage the marketplace platform',
      icon: Shield,
      color: 'craft-deep-red',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroArtisan})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-craft-terracotta/80 via-craft-mustard/60 to-craft-deep-red/80 backdrop-blur-sm"></div>
        <div className="absolute inset-0 texture-overlay"></div>
      </div>

      {/* Login Form */}
      <Card className="w-full max-w-md z-10 craft-card bg-card/95 backdrop-blur-md animate-fade-in-up">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-serif text-craft-terracotta">
            CraftConnect
          </CardTitle>
          <CardDescription className="text-base">
            Welcome to the Village Marketplace
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Choose Your Role</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData({ ...formData, role: value })
                }
                className="space-y-3"
              >
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors cursor-pointer"
                      onClick={() => setFormData({ ...formData, role: option.value })}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="data-[state=checked]:bg-craft-terracotta data-[state=checked]:border-craft-terracotta"
                      />
                      <Icon className={`h-5 w-5 text-${option.color}`} />
                      <div className="flex-1">
                        <Label
                          htmlFor={option.value}
                          className="font-medium cursor-pointer"
                        >
                          {option.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="bg-background/80 border-border/50 focus:border-craft-terracotta"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="bg-background/80 border-border/50 focus:border-craft-terracotta"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entering the Marketplace...
                </>
              ) : (
                'Enter CraftConnect'
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <p>New to CraftConnect? Join our community of artisans and craft lovers!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;