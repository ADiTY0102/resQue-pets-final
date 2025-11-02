import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Link } from "react-router-dom";

const AdoptPets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: pets, isLoading } = useQuery({
    queryKey: ["approved-pets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const adoptMutation = useMutation({
    mutationFn: async (petId: string) => {
      if (!user) throw new Error("Please login to adopt a pet");

      // Get user profile
      const { data: profile } = await supabase
        .from("users_profile")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile) throw new Error("Profile not found");

      const { error } = await supabase
        .from("adoption_requests")
        .insert({
          user_id: profile.id,
          pet_id: petId,
          request_status: "pending",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adoption-requests"] });
      toast({
        title: "Adoption Request Submitted",
        description: "Your request has been sent to admin for approval.",
      });
      setIsDialogOpen(false);
      setSelectedPet(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAdoptClick = (pet: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to adopt a pet",
        variant: "destructive",
      });
      return;
    }
    setSelectedPet(pet);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg">Loading pets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 sm:py-10 lg:py-12 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Adopt a Pet</h1>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
            Find your perfect companion from our loving pets ready for adoption
          </p>
        </div>
      </section>

      {/* Pets Grid */}
      <section className="py-8 sm:py-10 lg:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {!pets || pets.length === 0 ? (
            <Card className="p-8 sm:p-10 lg:p-12 text-center">
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
                No pets available for adoption at the moment. Check back soon!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {pets.map((pet) => (
                <Card key={pet.id} className="hover:shadow-xl transition-all duration-300">
                  {pet.image_url && (
                    <div className="aspect-square w-full overflow-hidden rounded-t-lg">
                      <img
                        src={pet.image_url}
                        alt={pet.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl">{pet.name}</CardTitle>
                      <Badge variant="secondary">{pet.type}</Badge>
                    </div>
                    <CardDescription className="text-base">{pet.breed}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Age:</span>
                      <span className="font-medium">{pet.age} years</span>
                    </div>
                    {pet.disease_reason && (
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">Additional Info:</p>
                        <p className="text-xs">{pet.disease_reason}</p>
                      </div>
                    )}
                    <Button
                      className="w-full"
                      onClick={() => handleAdoptClick(pet)}
                    >
                      Request to Adopt
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Adoption Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Adoption Request</DialogTitle>
            <DialogDescription>
              You are requesting to adopt {selectedPet?.name}. Your request will be sent to our admin team for review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPet && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p><strong>Pet Name:</strong> {selectedPet.name}</p>
                <p><strong>Breed:</strong> {selectedPet.breed}</p>
                <p><strong>Type:</strong> {selectedPet.type}</p>
                <p><strong>Age:</strong> {selectedPet.age} years</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => adoptMutation.mutate(selectedPet?.id)}
                disabled={adoptMutation.isPending}
                className="flex-1"
              >
                {adoptMutation.isPending ? "Submitting..." : "Confirm Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdoptPets;
