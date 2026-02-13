import { motion } from "framer-motion";
import { Shield, Users, Award, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStats } from "@/hooks/useStats";

const About = () => {
  const { t } = useTranslation();
  const { propertiesCount, islandsCount } = useStats();

  const values = [
    {
      icon: Shield,
      title: t('about.values.trusted.title'),
      description: t('about.values.trusted.description'),
    },
    {
      icon: Users,
      title: t('about.values.expertise.title'),
      description: t('about.values.expertise.description'),
    },
    {
      icon: Award,
      title: t('about.values.premium.title'),
      description: t('about.values.premium.description'),
    },
    {
      icon: Heart,
      title: t('about.values.community.title'),
      description: t('about.values.community.description'),
    },
  ];

  const stats = [
    { 
      number: propertiesCount > 0 ? `${propertiesCount}+` : "...", 
      label: t('about.verifiedProperties'),
      dynamic: true 
    },
    { 
      number: islandsCount || "4", 
      label: t('about.islandsCovered'),
      dynamic: true 
    },
    { 
      number: "24/7", 
      label: t('about.customerSupport'),
      dynamic: false 
    },
    { 
      number: "100%", 
      label: t('about.satisfactionFocus'),
      dynamic: false 
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
              {t('about.title')}
            </h1>
            <p className="font-body text-lg text-primary-foreground/90 leading-relaxed">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop"
                  alt="Mentawai Islands"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                {t('about.ourStory')}
              </h2>
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                <p>
                  {t('about.ourStoryPara1')}
                </p>
                <p>
                  {t('about.ourStoryPara2')}
                </p>
                <p>
                  {t('about.ourStoryPara3')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-heading text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="font-body text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('about.ourValues')}
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              {t('about.ourValuesDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
