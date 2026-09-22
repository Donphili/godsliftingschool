import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Card, CardContent } from "../components/ui/card";
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  BookOpen,
  GraduationCap,
  Star,
  FlaskConical,
  Monitor,
  Library
} from "lucide-react";

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: "Faith",
      description: "Grounded in divine instruction and Christian values."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Striving for the highest standards in all we do."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building strong relationships between students, teachers, and parents."
    },
    {
      icon: BookOpen,
      title: "Learning",
      description: "Fostering a love for continuous learning and growth."
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
              <p className="text-sun font-semibold mb-4">About Us</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6" data-testid="about-title">
                Our Story & Mission
              </h1>
              <p className="text-xl text-white/80">
                Discover the divine vision behind God's Lifting International School.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-ink mb-6">Our Beginning</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  God's Lifting International School was fully established in <strong>January 2023</strong>, 
                  with a divine instruction from God, to tutor pupils and students to have their foundation 
                  in qualitative education.
                </p>
                <p>
                  Our mission is to provide education that will make pupils and students compete with the 
                  global standard of education. We believe every child has unique potential waiting to be 
                  discovered and nurtured.
                </p>
                <p>
                  The school was founded by <strong>Mr. Christopher Olawale Daniyan</strong>, who received 
                  the divine calling to establish an institution that would shape the future of Nigerian 
                  children through quality education grounded in faith.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/ae1f1da12b8efb79fc47a4a78314dd990ab42d585e9d86ac11e38159ba24b144.png"
                alt="Nigerian students in modern classroom"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-0 shadow-card" data-testid="vision-card">
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-ink mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be a leading educational institution that nurtures globally competitive students 
                  who are grounded in faith, excellence, and character. We envision producing future 
                  leaders who will positively impact their communities and the world.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 border-0 shadow-card" data-testid="mission-card">
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-xl bg-sun/20 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-sun" />
                </div>
                <h3 className="text-2xl font-bold text-ink mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide qualitative education that enables pupils and students to compete with 
                  global standards. We achieve this through dedicated teachers, modern facilities, 
                  and a curriculum that balances academic excellence with moral development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold mb-4">Our Values</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
              What We Stand For
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our core values guide everything we do at God's Lifting International School.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={index} 
                  className="text-center p-6 border-0 shadow-card hover:shadow-float transition-shadow duration-300"
                  data-testid={`value-card-${index}`}
                >
                  <CardContent className="p-0">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-ink mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="section-padding bg-ink">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-sun" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Our Founder</h2>
            <p className="text-xl text-sun font-semibold mb-4">Mr. Christopher Olawale Daniyan</p>
            <p className="text-white/80 leading-relaxed">
              With a divine calling and a passion for education, Mr. Daniyan established 
              God's Lifting International School to provide Nigerian children with the 
              foundation they need to succeed in life. His vision continues to guide the 
              school's mission of excellence in education.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold mb-4">Our Facilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
              World-Class Learning Environment
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-0 shadow-card" data-testid="science-lab-card">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/f13ff150485209848e7ab4cffcbc028fd0dd49b22c54201c3f5556aaefa1f5b9.png"
                  alt="Nigerian students in science laboratory"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <FlaskConical className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-ink">Science Laboratory</h3>
                </div>
                <p className="text-muted-foreground">
                  Fully equipped laboratory for practical science experiments, fostering 
                  hands-on learning and scientific curiosity.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-card" data-testid="computer-lab-card">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/15e3c1b86a6f136f6baec00d483c82c149ade038280040c659dcac680fd88579.png"
                  alt="Nigerian students in computer laboratory"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Monitor className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-ink">Computer Lab</h3>
                </div>
                <p className="text-muted-foreground">
                  State-of-the-art computer facilities ensuring digital literacy and 
                  preparing students for the modern world.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-card" data-testid="library-card">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://static.prod-images.emergentagent.com/jobs/532fef3c-ad1c-4187-8f2c-ad4d85d1c7d2/images/9e18d325f73fd703d622192ee66f2c5790c2776dec2ade22c27997c03c2a4ba7.png"
                  alt="Nigerian students in modern library"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Library className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-ink">Library</h3>
                </div>
                <p className="text-muted-foreground">
                  Well-stocked library with diverse books and learning resources 
                  to support academic excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold mb-4">Our Programs</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
              Academic Programs
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-0 shadow-card" data-testid="preschool-card">
              <div className="h-48 bg-gradient-to-br from-coral to-sun flex items-center justify-center">
                <Star className="w-20 h-20 text-white/80" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-ink mb-2">Pre-School</h3>
                <p className="text-muted-foreground">
                  Nurturing young minds through play-based learning, introducing foundational 
                  skills in a safe and loving environment.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-card" data-testid="primary-card">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <BookOpen className="w-20 h-20 text-white/80" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-ink mb-2">Primary Section</h3>
                <p className="text-muted-foreground">
                  Basic 1 to 6 classes providing comprehensive education in core subjects 
                  with emphasis on literacy and numeracy.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-card" data-testid="secondary-card">
              <div className="h-48 bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <GraduationCap className="w-20 h-20 text-white/80" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-ink mb-2">Secondary Section</h3>
                <p className="text-muted-foreground">
                  JSS and SSS classes preparing students for WAEC, NECO, and other 
                  qualifying examinations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
