import { Button } from "@/components/ui/button";
import { mockImages } from "@/lib/mockGallery";

export const GallerySection = () => {
  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Gallery</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {mockImages.map((image) => (
            <div
              key={image.id}
              className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
            >
              <img
                src={image.image_url}
                alt={image.description}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button variant="outline" size="lg">
            View More
          </Button>
        </div>
      </div>
    </section>
  );
};
