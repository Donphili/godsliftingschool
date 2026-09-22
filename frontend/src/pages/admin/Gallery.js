import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { Plus, Image, Trash2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminGallery = () => {
  const { token } = useAuth();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    category: "general"
  });

  const categories = ["general", "classroom", "sports", "events", "campus", "facilities"];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`${API}/gallery`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Image added to gallery");
      setDialogOpen(false);
      setFormData({ title: "", image_url: "", category: "general" });
      fetchGallery();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add image");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await axios.delete(`${API}/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Image deleted");
      fetchGallery();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-ink" data-testid="gallery-admin-title">
              Photo Gallery
            </h1>
            <p className="text-muted-foreground">Manage school photos and images</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full" data-testid="add-gallery-btn">
                <Plus className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Photo to Gallery</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Photo title"
                    className="mt-2"
                    required
                  />
                </div>
                
                <div>
                  <Label>Image URL *</Label>
                  <Input
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.image_url && (
                  <div className="mt-4">
                    <Label>Preview</Label>
                    <div className="mt-2 h-40 rounded-lg overflow-hidden bg-slate-100">
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.style.display = "none"}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Photo</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : gallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <Card key={item.id} className="border-0 shadow-card overflow-hidden group" data-testid={`gallery-admin-item-${item.id}`}>
                <div className="aspect-square relative">
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="font-medium text-ink text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-card">
            <CardContent className="py-12 text-center">
              <Image className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-ink mb-2">No Photos</h3>
              <p className="text-muted-foreground">Add photos to your gallery</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminGallery;
