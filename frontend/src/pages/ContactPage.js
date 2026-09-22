import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/contact`, formData);
      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      content: "10, Alhaji Memudu Balogun Street, Off Alake Lankoko Street, Off Liasu Road, Egbe, Lagos"
    },
    {
      icon: Phone,
      title: "Phone",
      content: ["08034494498", "09012077546"]
    },
    {
      icon: Mail,
      title: "Email",
      content: "godsliftinginternational23@gmail.com"
    },
    {
      icon: Clock,
      title: "School Hours",
      content: "Monday - Friday: 7:30 AM - 3:00 PM"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-ink via-violet to-ink py-20"><div className="blob w-72 h-72 bg-coral/40 -top-10 -right-10"></div><div className="blob w-56 h-56 bg-sky/30 bottom-0 left-1/3"></div>
          <div className="container-custom relative z-10">
            <div className="max-w-3xl">
              <p className="text-sun font-semibold mb-4">Contact Us</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6" data-testid="contact-title">
                Get In Touch
              </h1>
              <p className="text-xl text-white/80">
                Have questions? We'd love to hear from you. Reach out to us today!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-ink mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. We'll respond to your inquiry shortly.
                      </p>
                      <Button 
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                        }}
                        variant="outline"
                        className="rounded-full"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className="mt-2"
                            data-testid="input-contact-name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="mt-2"
                            data-testid="input-contact-email"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g., 08012345678"
                            className="mt-2"
                            data-testid="input-contact-phone"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="What is your inquiry about?"
                            className="mt-2"
                            data-testid="input-contact-subject"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Write your message here..."
                          rows={5}
                          className="mt-2"
                          data-testid="input-contact-message"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={loading} 
                        className="rounded-full px-8"
                        data-testid="submit-contact-btn"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {loading ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card key={index} className="border-0 shadow-card" data-testid={`contact-info-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-ink mb-1">{info.title}</h3>
                          {Array.isArray(info.content) ? (
                            <div className="space-y-1">
                              {info.content.map((item, i) => (
                                <p key={i} className="text-muted-foreground text-sm">
                                  {info.title === "Phone" ? (
                                    <a href={`tel:${item}`} className="hover:text-primary">{item}</a>
                                  ) : item}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">
                              {info.title === "Email" ? (
                                <a href={`mailto:${info.content}`} className="hover:text-primary break-all">{info.content}</a>
                              ) : info.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Map Embed Placeholder */}
              <Card className="border-0 shadow-card overflow-hidden">
                <div className="h-64 bg-slate-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">Map View</p>
                    <p className="text-slate-400 text-xs">Egbe, Lagos</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
