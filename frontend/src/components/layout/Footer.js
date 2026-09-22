import { Link } from "react-router-dom";
import { GraduationCap, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-ink text-white border-t-4 border-violet">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* School Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-sun" />
              </div>
              <div>
                <h3 className="font-bold text-lg">God's Lifting</h3>
                <p className="text-sm text-slate-400">International School</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Established January 2023, with a divine instruction from God, to tutor pupils and students to have their foundation in qualitative education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "About Us", path: "/about" },
                { name: "Admission", path: "/admission" },
                { name: "Portal Login", path: "/login" },
                { name: "News & Updates", path: "/news" },
                { name: "Events", path: "/events" },
                { name: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sun flex-shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm">
                  10, Alhaji Memudu Balogun Street, Off Alake Lankoko Street, Off Liasu Road, Egbe, Lagos
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sun flex-shrink-0" />
                <div className="text-slate-400 text-sm">
                  <a href="tel:08034494498" className="hover:text-white">08034494498</a>
                  <span className="mx-2">|</span>
                  <a href="tel:09012077546" className="hover:text-white">09012077546</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sun flex-shrink-0" />
                <a 
                  href="mailto:godsliftinginternational23@gmail.com" 
                  className="text-slate-400 text-sm hover:text-white break-all"
                >
                  godsliftinginternational23@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Hours */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Connect With Us</h4>
            <div className="flex gap-4 mb-8">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-coral transition-colors duration-200"
                data-testid="social-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-coral transition-colors duration-200"
                data-testid="social-twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-coral transition-colors duration-200"
                data-testid="social-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <h5 className="font-medium text-sm mb-3">School Hours</h5>
            <p className="text-slate-400 text-sm">Monday - Friday: 7:30 AM - 3:00 PM</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} God's Lifting International School. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Founded by Mr. Christopher Olawale Daniyan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
