import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Kepulauan Mentawai", "Sumatera Barat, Indonesia"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+62 823-8640-7123", "Mon-Sat: 9AM - 6PM"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@mentawaishores.com", "support@mentawaishores.com"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-primary py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Get in Touch
            </h1>
            <p className="font-body text-lg text-primary-foreground/90 leading-relaxed">
              Have questions about properties in Mentawai? Our local experts are here to help. 
              Reach out and let's start your island journey together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 -mt-10 relative z-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 text-center shadow-lg"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                    {info.title}
                  </h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="font-body text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Send us a Message
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={isSubmitting}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isSubmitting}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={isSubmitting}
                        placeholder="+62 823-8640-7123"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      disabled={isSubmitting}
                      placeholder="Property Inquiry"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      disabled={isSubmitting}
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-body font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                  Why Contact Us?
                </h2>
                <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                  <p>
                    Whether you're looking to buy your dream beachfront property, invest in 
                    tropical land, or simply learn more about living in Mentawai, our team 
                    is here to help.
                  </p>
                  <p>
                    As locals with deep roots in the islands, we provide:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Expert guidance on property selection and legal processes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Insider knowledge about each island and community</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Personalized property tours and viewings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Support throughout your entire journey</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-secondary rounded-2xl p-6">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                  Quick Response Time
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  We typically respond to inquiries within 24 hours during business days. 
                  For urgent matters, please call us directly.
                </p>
                <div className="flex items-center gap-2 text-primary font-body text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  <span>+62 823-8640-7123</span>
                </div>
              </div>

              <div className="aspect-video rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop"
                  alt="Mentawai Islands"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
