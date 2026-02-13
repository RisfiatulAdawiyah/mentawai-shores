import { motion } from "framer-motion";
import { Shield, Users, Award, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const TrustBadges = () => {
  const { t } = useTranslation();
  
  const badges = [
    {
      icon: Shield,
      title: t('trustBadges.verified.title'),
      description: t('trustBadges.verified.description'),
    },
    {
      icon: Users,
      title: t('trustBadges.experts.title'),
      description: t('trustBadges.experts.description'),
    },
    {
      icon: Award,
      title: t('trustBadges.trusted.title'),
      description: t('trustBadges.trusted.description'),
    },
    {
      icon: CheckCircle,
      title: t('trustBadges.quality.title'),
      description: t('trustBadges.quality.description'),
    },
  ];
  return (
    <section className="py-12 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-sm font-semibold text-foreground mb-1">
                  {badge.title}
                </h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  {badge.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
