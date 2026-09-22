import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { Plus, Newspaper, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminNews = () => {
  const { token } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    category: "general"
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API}/news`);
      setNews(response.data);
    } catch (error) {
      console.error("Failed to fetch news:", error);
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
      if (editingId) {
        await axios.put(`${API}/news/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("News updated successfully");
      } else {
        await axios.post(`${API}/news`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("News posted successfully");
      }
      
      setDialogOpen(false);
      setEditingId(null);
      setFormData({ title: "", content: "", image_url: "", category: "general" });
      fetchNews();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save news");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      content: item.content,
      image_url: item.image_url || "",
      category: item.category || "general"
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;
    
    try {
      await axios.delete(`${API}/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("News deleted");
      fetchNews();
    } catch (error) {
      toast.error("Failed to delete news");
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-ink" data-testid="news-admin-title">
              News & Announcements
            </h1>
            <p className="text-muted-foreground">Manage school news and updates</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingId(null);
              setFormData({ title: "", content: "", image_url: "", category: "general" });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="rounded-full" data-testid="add-news-btn">
                <Plus className="w-4 h-4 mr-2" />
                Post News
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit News" : "Post New News"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="News title"
                    className="mt-2"
                    required
                  />
                </div>
                
                <div>
                  <Label>Content *</Label>
                  <Textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your news content..."
                    rows={5}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label>Image URL (Optional)</Label>
                  <Input
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="mt-2"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingId ? "Update" : "Post"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : news.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Card key={item.id} className="border-0 shadow-card overflow-hidden" data-testid={`news-item-${item.id}`}>
                <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <Newspaper className="w-12 h-12 text-slate-300" />
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-2">{formatDate(item.created_at)}</p>
                  <h3 className="font-bold text-ink mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">{item.content}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4 mr-1 text-red-500" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-card">
            <CardContent className="py-12 text-center">
              <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-ink mb-2">No News Posted</h3>
              <p className="text-muted-foreground">Post your first news article</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminNews;
