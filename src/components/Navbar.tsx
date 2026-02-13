import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Heart, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/store";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: t('nav.home'), href: "/", type: "route" },
    { label: t('nav.properties'), href: "/properties", type: "route" },
    { label: t('nav.islands'), href: "/islands", type: "route" },
    { label: t('nav.about'), href: "/about", type: "route" },
  ];

  // Handle hash navigation on page load
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 300); // Wait for page to render
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const sectionId = href.replace('#', '');
    
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/' + href);
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
      // Update URL hash without triggering navigation
      window.history.pushState(null, '', href);
    }
    
    setMobileOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 56; // Updated height of sticky navbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-12 md:h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <span className="font-heading text-sm sm:text-base font-semibold tracking-tight text-primary">
            Mentawai
          </span>
          <span className="font-heading text-sm sm:text-base font-light text-foreground">
            Land & Living
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            link.type === 'route' ? (
              <Link
                key={link.label}
                to={link.href}
                className="font-body text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollLink(e, link.href)}
                className="font-body text-[13px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
              >
                {link.label}
              </a>
            )
          ))}
          
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 transition-colors hover:bg-secondary"
              >
                <User size={14} />
                <span className="font-body text-[13px]">{user.name}</span>
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-background shadow-lg z-20">
                    <div className="p-3 border-b border-border">
                      <p className="font-body text-sm font-medium">{user.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg font-body text-sm hover:bg-secondary"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <HomeIcon size={16} />
                        Dashboard
                      </Link>
                      <Link
                        to="/favorites"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg font-body text-sm hover:bg-secondary"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Heart size={16} />
                        {t('nav.favorites')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded-lg font-body text-sm text-destructive hover:bg-destructive/10"
                      >
                        <LogOut size={16} />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-full h-8 px-4 text-[13px]">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm" className="rounded-full h-8 px-4 text-[13px]">
                  {t('nav.register')}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-1 hover:bg-secondary rounded-lg transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            link.type === 'route' ? (
              <Link
                key={link.label}
                to={link.href}
                className="block py-3.5 font-body text-base text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollLink(e, link.href)}
                className="block py-3.5 font-body text-base text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            )
          ))}
          
          {/* Language Switcher Mobile */}
          <div className="py-3.5 border-t border-border mt-2">
            <LanguageSwitcher />
          </div>
          
          {isAuthenticated && user ? (
            <div className="mt-4 pt-4 space-y-2 border-t border-border">
              <p className="font-body text-sm font-medium px-3">{user.name}</p>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <HomeIcon size={16} className="mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/favorites" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Heart size={16} className="mr-2" />
                  {t('nav.favorites')}
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-destructive"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                {t('nav.logout')}
              </Button>
            </div>
          ) : (
            <div className="mt-4 pt-4 space-y-3 border-t border-border">
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="default" className="w-full rounded-full">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button variant="default" size="default" className="w-full rounded-full">
                  {t('nav.register')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
