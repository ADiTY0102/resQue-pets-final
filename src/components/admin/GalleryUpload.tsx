import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export const GalleryUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Simulate file upload
      toast({
        title: "Image Uploaded",
        description: "Image has been added to the gallery.",
      });
      setFile(null);
      setDescription("");
      
      // Reset file input
      const fileInput = document.getElementById("gallery-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="gallery-upload">Select Image</Label>
        <Input
          id="gallery-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={uploading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description for this image..."
          disabled={uploading}
          rows={3}
        />
      </div>

      {file && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Selected: <strong>{file.name}</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Size: {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? "Uploading..." : "Upload to Gallery"}
      </Button>
    </div>
  );
};
