import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
  ArrowRight,
  CheckCircle,
  Star,
  Calendar,
  CreditCard,
  FileText,
  FlaskConical,
  Monitor,
  Library
} from "lucide-react";

const HomePage = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Pre-School",
      description: "Nurturing young minds with play-based learning and foundational skills development."
    },
    {
      icon: BookOpen,
      title: "Primary School",
      description: "Basic 1 to 6, providing comprehensive education with focus on core subjects."
    },
    {
      icon: Users,
      title: "Secondary School",
      description: "JSS and SSS classes preparing students for WAEC, NECO, and global opportunities."
    },
    {
      icon: Trophy,
      title: "Excellence",
      description: "Competing with global standards of education through innovative teaching methods."
    }
  ];

  const facilities = [
    {
      icon: FlaskConical,
      title: "Modern Science Lab",
      description: "Fully equipped laboratory for practical science learning"
    },
    {
      icon: Monitor,
      title: "Computer Lab",
      description: "State-of-the-art computer facilities for digital literacy"
    },
    {
      icon: Library,
      title: "Library",
      description: "Well-stocked library with diverse learning resources"
    }
  ];

  const portalFeatures = [
    {
      icon: FileText,
      title: "Check Results Online",
      description: "Access your academic results anytime, anywhere"
    },
    {
      icon: CreditCard,
      title: "Pay Fees Online",
      description: "Secure payment through bank transfer"
    },
    {
      icon: Calendar,
      title: "Events & News",
      description: "Stay updated with school activities and announcements"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 relative overflow-hidden bg-cream">
        <div className="blob w-[450px] h-[450px] bg-sun -top-32 -right-10" />
        <div className="blob w-[350px] h-[350px] bg-sky top-32 -left-32" />

        <div className="container-custom relative py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-white border-2 border-ink rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide mb-6 shadow-sticker">
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                Established January 2023
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6 text-ink">
                Building Future{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Global Leaders</span>
                  <span className="absolute inset-x-0 bottom-2 h-4 sm:h-5 bg-lime -z-0 -rotate-1" />
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg font-medium">
                At God's Lifting International School, we provide qualitative education that enables 
                pupils and students to compete with global standards.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/admission">
                  <Button 
                    size="lg" 
                    className="bg-coral hover:bg-coral/90 text-white rounded-full px-8 font-bold shadow-[0_6px_0_0_theme(colors.ink)] hover:-translate-y-0.5 transition-transform"
                    data-testid="hero-apply-btn"
                  >
                    Apply Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-ink text-ink hover:bg-ink hover:text-white rounded-full px-8 font-bold"
                    data-testid="hero-learn-more-btn"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="relative z-10 rounded-[28px] overflow-hidden border-4 border-ink rotate-2 shadow-sticker-violet">
                <img
                  src="https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/84b40b7d1074d4d60e77f087336d0e7d0b956c79014bf91360ce380a8bb1099b.png"
                  alt="Nigerian students in premium school campus"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-10 z-20 bg-sun rounded-2xl px-6 py-4 border-4 border-ink -rotate-3 shadow-sticker">
                <p className="text-2xl font-bold text-ink font-display">"Raised right,<br />rising fast."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="bg-ink text-white py-3 overflow-hidden border-y-4 border-ink">
        <div className="flex whitespace-nowrap animate-marquee text-sm font-bold tracking-wide font-display">
          {Array(2).fill(0).map((_, i) => (
            <span key={i} className="flex shrink-0">
              <span className="mx-6 text-sun">★ ADMISSIONS OPEN 2026/2027</span>
              <span className="mx-6">NURSERY — SECONDARY</span>
              <span className="mx-6 text-lime">★ RESULT PORTAL LIVE</span>
              <span className="mx-6">GLOBAL STANDARD EDUCATION</span>
            </span>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold mb-4">Our Programs</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
              Comprehensive Education for All Ages
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From pre-school to secondary, we provide a nurturing environment for academic excellence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const accentStyles = [
                { chip: "bg-coral", hoverShadow: "hover:shadow-sticker-coral" },
                { chip: "bg-sky", hoverShadow: "hover:shadow-sticker-lg" },
                { chip: "bg-sun", hoverShadow: "hover:shadow-sticker-lg" },
                { chip: "bg-violet", hoverShadow: "hover:shadow-sticker-violet" },
              ];
              const accent = accentStyles[index % accentStyles.length];
              return (
                <Card 
                  key={index} 
                  className={`group cursor-pointer border-4 border-ink rounded-[24px] bg-white shadow-sticker hover:-translate-y-1 ${accent.hoverShadow} transition-all`}
                  data-testid={`feature-card-${index}`}
                >
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-2xl ${accent.chip} flex items-center justify-center mb-6 border-2 border-ink`}>
                      <Icon className="w-7 h-7 text-ink" />
                    </div>
                    <h3 className="text-xl font-bold text-ink mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground font-medium">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary font-semibold mb-4">Our Facilities</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-6">
                World-Class Learning Environment
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We provide state-of-the-art facilities to ensure our students have access to the best 
                learning resources and environment for their academic journey.
              </p>
              
              <div className="space-y-4">
                {facilities.map((facility, index) => {
                  const Icon = facility.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-cream">
                      <div className="w-12 h-12 rounded-lg bg-sky/30 border-2 border-ink flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-ink">{facility.title}</h4>
                        <p className="text-muted-foreground text-sm">{facility.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/f13ff150485209848e7ab4cffcbc028fd0dd49b22c54201c3f5556aaefa1f5b9.png"
                  alt="Nigerian students in science laboratory"
                  className="rounded-[20px] border-4 border-ink shadow-sticker w-full h-48 object-cover"
                />
                <img
                  src="https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/9e18d325f73fd703d622192ee66f2c5790c2776dec2ade22c27997c03c2a4ba7.png"
                  alt="Nigerian students in modern library"
                  className="rounded-[20px] border-4 border-ink shadow-sticker w-full h-64 object-cover"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/15e3c1b86a6f136f6baec00d483c82c149ade038280040c659dcac680fd88579.png"
                  alt="Nigerian students in computer lab"
                  className="rounded-[20px] border-4 border-ink shadow-sticker w-full h-64 object-cover"
                />
                <img
                  src="https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/8edf40ed18b94c8734f784a34f37f76e763b08af432c2dca600fa9b4f41bcd69.png"
                  alt="Nigerian students sports activities"
                  className="rounded-[20px] border-4 border-ink shadow-sticker w-full h-48 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/1e8a2a07bfa1696716d958838f9aa35456e9f503b49dec75ad1a881e0ea8d673.png"
                alt="Nigerian students at school assembly"
                className="rounded-[28px] border-4 border-ink shadow-sticker-violet -rotate-1"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl border-4 border-ink shadow-sticker rotate-2">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-sun border-2 border-ink flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-ink" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-ink">2+</p>
                    <p className="text-muted-foreground text-sm">Years of Excellence</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-primary font-semibold mb-4">About Us</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-6">
                A Divine Mission for Education
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                God's Lifting International School was established in January 2023, with a divine 
                instruction from God, to tutor pupils and students to have their foundation in 
                qualitative education that will make them compete with the global standard of education.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Qualified and dedicated teachers",
                  "Modern learning facilities",
                  "Character development focus",
                  "Safe and nurturing environment"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-lime" fill="currentColor" fillOpacity={0.2} />
                    <span className="text-ink font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/about">
                <Button className="rounded-full px-8 bg-violet hover:bg-violet/90 text-white font-bold shadow-[0_6px_0_0_theme(colors.ink)] hover:-translate-y-0.5 transition-transform" data-testid="about-learn-more-btn">
                  Learn More About Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Features */}
      <section className="section-padding bg-ink">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-sun font-semibold mb-4">Student Portal</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything at Your Fingertips
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Access results, make payments, and stay updated with our comprehensive online portal.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {portalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const chips = ["bg-sun", "bg-coral", "bg-sky"];
              return (
                <div 
                  key={index} 
                  className="bg-white/5 backdrop-blur-sm rounded-[24px] p-8 text-center border-2 border-white/15 hover:border-white/40 transition-colors"
                  data-testid={`portal-feature-${index}`}
                >
                  <div className={`w-16 h-16 rounded-2xl ${chips[index % chips.length]} border-2 border-ink flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8 text-ink" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/login">
              <Button 
                size="lg" 
                className="bg-coral hover:bg-coral/90 text-white rounded-full px-8 font-semibold"
                data-testid="portal-login-btn"
              >
                Access Portal
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="relative bg-gradient-to-r from-coral to-sun rounded-[28px] p-12 text-center border-4 border-ink shadow-sticker-lg overflow-hidden">
            <div className="blob w-[300px] h-[300px] bg-violet/40 -bottom-24 -left-16" />
            <h2 className="relative text-3xl sm:text-4xl font-bold text-ink mb-4">
              Ready to Join Our Family?
            </h2>
            <p className="relative text-ink/80 mb-8 max-w-2xl mx-auto font-medium">
              Give your child the foundation they need to succeed in life. Apply for admission today!
            </p>
            <Link to="/admission" className="relative inline-block">
              <Button 
                size="lg" 
                className="bg-ink hover:bg-ink/90 text-white rounded-full px-8 font-bold"
                data-testid="cta-apply-btn"
              >
                Start Application
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
