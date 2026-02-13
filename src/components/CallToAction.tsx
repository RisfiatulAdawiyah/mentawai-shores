import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section id="contact" className="bg-secondary py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl text-center"
        >
          <h2 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Ready to Find Your Place in Mentawai?
          </h2>
          <p className="mt-4 font-body text-muted-foreground leading-relaxed">
            Our local advisors are here to guide you — from finding the right property
            to completing a secure transaction. No pressure, just honest help.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/6282386407123"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-body text-sm font-medium text-accent-foreground transition-all hover:brightness-110"
            >
              <MessageCircle size={18} />
              Talk with Local Advisor
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
