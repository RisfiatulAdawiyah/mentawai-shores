import { Shield, Users, MapPin, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  {
    icon: MapPin,
    title: "Local Expertise",
    desc: "Born and raised in Mentawai, we know every beach, village, and opportunity on these islands.",
  },
  {
    icon: Shield,
    title: "Trusted Process",
    desc: "Transparent land certificates, legal support, and guided due diligence for every transaction.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "We work alongside local communities ensuring fair, respectful, and sustainable development.",
  },
  {
    icon: Leaf,
    title: "Eco Commitment",
    desc: "Every listing supports responsible building practices that protect Mentawai's natural beauty.",
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="mb-14 text-center">
          <p className="font-body text-sm font-medium uppercase tracking-widest text-accent">
            Why Choose Us
          </p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Mentawai Land & Living
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-body text-muted-foreground">
            Your trusted partner for property in the Mentawai Islands
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <r.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {r.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
