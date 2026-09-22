import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Calendar } from "../components/ui/calendar";
import axios from "axios";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { format, parseISO, isSameDay } from "date-fns";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const eventDates = events.map(event => {
    try {
      return parseISO(event.event_date);
    } catch {
      return null;
    }
  }).filter(Boolean);

  const filteredEvents = selectedDate 
    ? events.filter(event => {
        try {
          return isSameDay(parseISO(event.event_date), selectedDate);
        } catch {
          return false;
        }
      })
    : events;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-ink via-violet to-ink py-20"><div className="blob w-72 h-72 bg-coral/40 -top-10 -right-10"></div><div className="blob w-56 h-56 bg-sky/30 bottom-0 left-1/3"></div>
          <div className="container-custom relative z-10">
            <div className="max-w-3xl">
              <p className="text-sun font-semibold mb-4">School Calendar</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6" data-testid="events-title">
                Upcoming Events
              </h1>
              <p className="text-xl text-white/80">
                Don't miss out on important school activities and events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar Sidebar */}
            <div>
              <Card className="border-0 shadow-card sticky top-24" data-testid="events-calendar">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-ink mb-4">Select Date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={{
                      hasEvent: eventDates
                    }}
                    modifiersStyles={{
                      hasEvent: {
                        backgroundColor: "rgba(245, 158, 11, 0.2)",
                        color: "#D97706",
                        fontWeight: "bold"
                      }
                    }}
                    className="rounded-md border"
                  />
                  <button 
                    onClick={() => setSelectedDate(null)}
                    className="w-full mt-4 text-primary font-medium text-sm hover:underline"
                  >
                    View All Events
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Events List */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="flex">
                        <Skeleton className="w-32 h-32" />
                        <CardContent className="p-6 flex-1">
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (filteredEvents.length === 0 && selectedDate) ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                    <CalendarDays className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-2">No Events on This Date</h3>
                  <p className="text-muted-foreground">Select another date or view all events.</p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                    <CalendarDays className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-2">No Upcoming Events</h3>
                  <p className="text-muted-foreground">Check back later for scheduled events.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="font-bold text-xl text-ink">
                    {selectedDate ? `Events on ${format(selectedDate, "MMMM dd, yyyy")}` : "All Events"}
                  </h3>
                  
                  {(selectedDate ? filteredEvents : events).map((event) => (
                    <Card 
                      key={event.id} 
                      className="overflow-hidden border-0 shadow-card hover:shadow-float transition-shadow duration-300"
                      data-testid={`event-card-${event.id}`}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-primary to-blue-700 flex flex-col items-center justify-center text-white p-4">
                          <span className="text-3xl font-bold">
                            {format(parseISO(event.event_date), "dd")}
                          </span>
                          <span className="text-sm uppercase">
                            {format(parseISO(event.event_date), "MMM")}
                          </span>
                          <span className="text-xs opacity-70">
                            {format(parseISO(event.event_date), "yyyy")}
                          </span>
                        </div>
                        <CardContent className="p-6 flex-1">
                          <h4 className="text-xl font-bold text-ink mb-2">{event.title}</h4>
                          <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
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
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventsPage;
