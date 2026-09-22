import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Skeleton } from "../components/ui/skeleton";
import axios from "axios";
import { Image, X } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${API}/gallery`);
      setGallery(response.data);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", ...new Set(gallery.map(item => item.category))];
  
  const filteredGallery = filter === "all" 
    ? gallery 
    : gallery.filter(item => item.category === filter);

  // Default premium school images for demo
  const defaultImages = [
    {
      id: "default-1",
      title: "Our Premium Campus",
      image_url: "https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/26ca143aa7ef81f42d6f09500b37493d6655a78bd9d5a875ab7fa347085d64b0.png",
      category: "campus"
    },
    {
      id: "default-2",
      title: "Students at School Entrance",
      image_url: "https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/84b40b7d1074d4d60e77f087336d0e7d0b956c79014bf91360ce380a8bb1099b.png",
      category: "campus"
    },
    {
      id: "default-3",
      title: "Science Laboratory",
      image_url: "https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/f13ff150485209848e7ab4cffcbc028fd0dd49b22c54201c3f5556aaefa1f5b9.png",
      category: "facilities"
    },
    {
      id: "default-4",
      title: "Modern Library",
      image_url: "https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/9e18d325f73fd703d622192ee66f2c5790c2776dec2ade22c27997c03c2a4ba7.png",
      category: "facilities"
    },
    {
      id: "default-5",
      title: "Computer Lab Session",
      image_url: "https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/15e3c1b86a6f136f6baec00d483c82c149ade038280040c659dcac680fd88579.png",
      category: "facilities"
    },
    {
      id: "default-6",
      title: "Modern Classroom",
      image_url: "https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/ae1f1da12b8efb79fc47a4a78314dd990ab42d585e9d86ac11e38159ba24b144.png",
      category: "classroom"
    },
    {
      id: "default-7",
      title: "Sports Field Activities",
      image_url: "https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/8edf40ed18b94c8734f784a34f37f76e763b08af432c2dca600fa9b4f41bcd69.png",
      category: "sports"
    },
    {
      id: "default-8",
      title: "School Assembly",
      image_url: "https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/1e8a2a07bfa1696716d958838f9aa35456e9f503b49dec75ad1a881e0ea8d673.png",
      category: "classroom"
    }
  ];

  const displayGallery = gallery.length > 0 ? filteredGallery : defaultImages;
  const displayCategories = gallery.length > 0 ? categories : ["all", "campus", "facilities", "classroom", "sports"];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-ink via-violet to-ink py-20"><div className="blob w-72 h-72 bg-coral/40 -top-10 -right-10"></div><div className="blob w-56 h-56 bg-sky/30 bottom-0 left-1/3"></div>
          <div className="container-custom relative z-10">
            <div className="max-w-3xl">
              <p className="text-sun font-semibold mb-4">Photo Gallery</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6" data-testid="gallery-title">
                School Moments
              </h1>
              <p className="text-xl text-white/80">
                Explore our world-class facilities and vibrant school life through these captured moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8" data-testid="gallery-filters">
            {displayCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  filter === cat
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(filter === "all" ? displayGallery : displayGallery.filter(item => item.category === filter)).map((item) => (
                <div
                  key={item.id}
                  className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative"
                  onClick={() => setSelectedImage(item)}
                  data-testid={`gallery-item-${item.id}`}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium text-sm">{item.title}</p>
                      {item.category && (
                        <span className="text-white/70 text-xs capitalize">{item.category}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-sun transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl max-h-[90vh] animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="text-white font-medium">{selectedImage.title}</p>
              {selectedImage.category && (
                <span className="text-white/70 text-sm capitalize">{selectedImage.category}</span>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;
