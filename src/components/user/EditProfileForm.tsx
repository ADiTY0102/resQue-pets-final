import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export const EditProfileForm = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    email: "user@example.com",
  });

  useEffect(() => {
    // Simulate loading mock profile data
    setFormData({
      full_name: "John Doe",
      phone: "+1234567890",
      address: "123 Main St, City, State 12345",
      email: "user@example.com",
    });
    setIsLoading(false);
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate saving profile
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email (Cannot be changed)</Label>
        <Input id="email" value={formData.email} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name *</Label>
        <Input
          id="full_name"
          required
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
