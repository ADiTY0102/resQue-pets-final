import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export const DonatePetForm = ({ userId }: { userId: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    type: "",
    age: "",
    disease_reason: "",
    image_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate submitting donation request
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "Pet donation submitted!",
        description: "Your request will be reviewed by admin.",
      });
      setFormData({
        name: "",
        breed: "",
        type: "",
        age: "",
        disease_reason: "",
        image_url: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Pet Name *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="breed">Breed *</Label>
          <Input
            id="breed"
            required
            value={formData.breed}
            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type (Dog/Cat/etc) *</Label>
          <Input
            id="type"
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age (years) *</Label>
          <Input
            id="age"
            type="number"
            required
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="disease_reason">Disease/Reason for Donation</Label>
        <Textarea
          id="disease_reason"
          value={formData.disease_reason}
          onChange={(e) => setFormData({ ...formData, disease_reason: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Donation Request"}
      </Button>
    </form>
  );
};
