import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { Card, CardContent } from "../../components/ui/card";
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
import { Plus, CalendarDays, Trash2, Edit, MapPin, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminEvents = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    image_url: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
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
        await axios.put(`${API}/events/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Event updated successfully");
      } else {
        await axios.post(`${API}/events`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Event created successfully");
      }
      
      setDialogOpen(false);
      setEditingId(null);
      setFormData({ title: "", description: "", event_date: "", event_time: "", location: "", image_url: "" });
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save event");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      event_date: item.event_date,
      event_time: item.event_time,
      location: item.location,
      image_url: item.image_url || ""
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await axios.delete(`${API}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Event deleted");
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-ink" data-testid="events-admin-title">
              Events
            </h1>
            <p className="text-muted-foreground">Manage school events and calendar</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingId(null);
              setFormData({ title: "", description: "", event_date: "", event_time: "", location: "", image_url: "" });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="rounded-full" data-testid="add-event-btn">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Event" : "Add New Event"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Event title"
                    className="mt-2"
                    required
                  />
                </div>
                
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Event description..."
                    rows={3}
                    className="mt-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date *</Label>
                    <Input
                      name="event_date"
                      type="date"
                      value={formData.event_date}
                      onChange={handleChange}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label>Time *</Label>
                    <Input
                      name="event_time"
                      type="time"
                      value={formData.event_time}
                      onChange={handleChange}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Location *</Label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Event location"
                    className="mt-2"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingId ? "Update" : "Create"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="border-0 shadow-card" data-testid={`event-item-${event.id}`}>
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-24 bg-primary text-white flex flex-col items-center justify-center p-4">
                      <span className="text-2xl font-bold">
                        {format(parseISO(event.event_date), "dd")}
                      </span>
                      <span className="text-sm uppercase">
                        {format(parseISO(event.event_date), "MMM")}
                      </span>
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-bold text-ink">{event.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{event.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.event_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-4">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-card">
            <CardContent className="py-12 text-center">
              <CalendarDays className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-ink mb-2">No Events</h3>
              <p className="text-muted-foreground">Add your first event</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminEvents;
