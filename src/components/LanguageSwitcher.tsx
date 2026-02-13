import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Change language"
    >
      <Globe className="w-4 h-4 text-muted-foreground" />
      <span className="font-body text-sm font-medium text-foreground uppercase">
        {i18n.language === 'en' ? 'EN' : 'ID'}
      </span>
    </motion.button>
  );
};

export default LanguageSwitcher;
