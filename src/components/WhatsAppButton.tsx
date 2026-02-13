import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show button after user scrolls down a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show tooltip after 3 seconds on first visit
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem("whatsapp-tooltip-seen");
    if (!hasSeenTooltip && isVisible) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        localStorage.setItem("whatsapp-tooltip-seen", "true");
        // Auto hide after 5 seconds
        setTimeout(() => setShowTooltip(false), 5000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClick = () => {
    // WhatsApp number for Mentawai Land & Living
    const phoneNumber = "6282386407123"; // Format: country code + number (no + or spaces)
    const message = encodeURIComponent(
      "Hi! I'm interested in properties in Mentawai. Can you help me?"
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute bottom-full right-0 mb-3 w-64"
              >
                <div className="bg-white rounded-xl shadow-xl p-4 border border-border relative">
                  <button
                    onClick={() => setShowTooltip(false)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="font-body text-sm text-foreground pr-6">
                    <span className="font-semibold">Need help?</span>
                    <br />
                    Chat with our local experts on WhatsApp!
                  </p>
                  {/* Arrow */}
                  <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-border transform rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WhatsApp Button */}
          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Chat on WhatsApp"
          >
            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75" />
            
            {/* Icon */}
            <MessageCircle className="relative w-7 h-7" />

            {/* Hover tooltip */}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-foreground text-primary-foreground text-xs font-body px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                Chat with us
                <div className="absolute -bottom-1 right-4 w-2 h-2 bg-foreground transform rotate-45" />
              </div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;
