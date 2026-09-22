import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { MessageSquare, Mail, Phone, CheckCircle } from "lucide-react";
import { format } from "date-fns";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminMessages = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API}/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API}/contact/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy - HH:mm");
    } catch {
      return dateString;
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink" data-testid="messages-title">
            Contact Messages
          </h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread message(s)` : "All messages read"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : messages.length > 0 ? (
              messages.map((message) => (
                <Card 
                  key={message.id} 
                  className={`border-0 shadow-card cursor-pointer transition-all duration-200 ${
                    selectedMessage?.id === message.id ? "ring-2 ring-primary" : ""
                  } ${!message.read ? "border-l-4 border-l-primary" : ""}`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.read) markAsRead(message.id);
                  }}
                  data-testid={`message-item-${message.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-medium ${!message.read ? "text-primary" : "text-ink"}`}>
                          {message.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{message.subject}</p>
                      </div>
                      {!message.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{formatDate(message.created_at)}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-0 shadow-card">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-muted-foreground">No messages yet</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card className="border-0 shadow-card" data-testid="message-detail">
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedMessage.subject}</CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">{formatDate(selectedMessage.created_at)}</p>
                    </div>
                    {selectedMessage.read && (
                      <span className="flex items-center gap-1 text-emerald-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Read
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Sender Info */}
                  <div className="bg-cream rounded-lg p-4 mb-6">
                    <p className="font-semibold text-ink">{selectedMessage.name}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <a 
                        href={`mailto:${selectedMessage.email}`} 
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <Mail className="w-4 h-4" />
                        {selectedMessage.email}
                      </a>
                      {selectedMessage.phone && (
                        <a 
                          href={`tel:${selectedMessage.phone}`} 
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          <Phone className="w-4 h-4" />
                          {selectedMessage.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div>
                    <h4 className="font-semibold text-ink mb-3">Message</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>

                  {/* Reply Button */}
                  <div className="mt-6">
                    <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                      <Button className="rounded-full">
                        <Mail className="w-4 h-4 mr-2" />
                        Reply via Email
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-card h-full">
                <CardContent className="h-full flex items-center justify-center py-24">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-ink mb-2">Select a Message</h3>
                    <p className="text-muted-foreground">Click on a message to view its content</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMessages;
