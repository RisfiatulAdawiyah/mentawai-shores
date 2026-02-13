import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScrollLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const sectionId = href.replace("#", "");

    // If not on home page, navigate to home first
    if (location.pathname !== "/") {
      navigate("/" + href);
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
      window.history.pushState(null, "", href);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-heading text-xl font-semibold mb-2">
              {t('footer.newsletter')}
            </h3>
            <p className="font-body text-primary-foreground/80 text-sm mb-4">
              {t('footer.newsletterDesc')}
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                required
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent font-body text-sm"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-body font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "..." : t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">
              Mentawai Shores
            </h3>
            <p className="font-body text-primary-foreground/80 mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2 font-body">
              <li>
                <Link
                  to="/"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/properties"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {t('nav.properties')}
                </Link>
              </li>
              <li>
                <Link
                  to="/islands"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {t('nav.islands')}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">
              Property Types
            </h4>
            <ul className="space-y-2 font-body">
              <li>
                <Link
                  to="/properties?category=villa"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  Villas
                </Link>
              </li>
              <li>
                <Link
                  to="/properties?category=resort"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  Resorts
                </Link>
              </li>
              <li>
                <Link
                  to="/properties?category=land"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  Land
                </Link>
              </li>
              <li>
                <Link
                  to="/properties?category=house"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  Houses
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 font-body">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  Kepulauan Mentawai, Sumatera Barat, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a
                  href="tel:+6282386407123"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  +62 823-8640-7123
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a
                  href="mailto:info@mentawaishores.com"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  info@mentawaishores.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="font-body text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Mentawai Shores. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
