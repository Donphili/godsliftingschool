import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import axios from "axios";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);

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

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-ink via-violet to-ink py-20"><div className="blob w-72 h-72 bg-coral/40 -top-10 -right-10"></div><div className="blob w-56 h-56 bg-sky/30 bottom-0 left-1/3"></div>
          <div className="container-custom relative z-10">
            <div className="max-w-3xl">
              <p className="text-sun font-semibold mb-4">News & Updates</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6" data-testid="news-title">
                Latest News
              </h1>
              <p className="text-xl text-white/80">
                Stay informed about what's happening at God's Lifting International School.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-2">No News Yet</h3>
              <p className="text-muted-foreground">Check back later for updates and announcements.</p>
            </div>
          ) : (
            <>
              {/* Featured News */}
              {news.length > 0 && (
                <Card 
                  className="overflow-hidden border-0 shadow-float mb-12 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => setSelectedNews(news[0])}
                  data-testid="featured-news"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="h-64 md:h-auto bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
                      {news[0].image_url ? (
                        <img src={news[0].image_url} alt={news[0].title} className="w-full h-full object-cover" />
                      ) : (
                        <Calendar className="w-24 h-24 text-white/30" />
                      )}
                    </div>
                    <CardContent className="p-8 flex flex-col justify-center">
                      <span className="text-sun font-semibold text-sm mb-2">Featured</span>
                      <p className="text-muted-foreground text-sm mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(news[0].created_at)}
                      </p>
                      <h2 className="text-2xl font-bold text-ink mb-4">{news[0].title}</h2>
                      <p className="text-muted-foreground line-clamp-3">{news[0].content}</p>
                      <span className="text-primary font-semibold mt-4 flex items-center gap-2 group-hover:gap-3 transition-all">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </CardContent>
                  </div>
                </Card>
              )}

              {/* News Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.slice(1).map((item) => (
                  <Card 
                    key={item.id} 
                    className="overflow-hidden border-0 shadow-card hover:shadow-float transition-shadow duration-300 cursor-pointer group"
                    onClick={() => setSelectedNews(item)}
                    data-testid={`news-card-${item.id}`}
                  >
                    <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Calendar className="w-16 h-16 text-slate-300" />
                      )}
                    </div>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground text-sm mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(item.created_at)}
                      </p>
                      <h3 className="text-lg font-bold text-ink mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-3">{item.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* News Modal */}
      {selectedNews && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedNews(null)}
        >
          <Card 
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedNews.image_url && (
              <div className="h-64 overflow-hidden">
                <img src={selectedNews.image_url} alt={selectedNews.title} className="w-full h-full object-cover" />
              </div>
            )}
            <CardContent className="p-8">
              <p className="text-muted-foreground text-sm mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(selectedNews.created_at)}
              </p>
              <h2 className="text-2xl font-bold text-ink mb-4">{selectedNews.title}</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{selectedNews.content}</p>
              <button 
                onClick={() => setSelectedNews(null)}
                className="mt-6 text-primary font-semibold"
              >
                Close
              </button>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default NewsPage;
