// Test file untuk memverifikasi i18n setup
// Jalankan dengan: npm run dev dan buka console browser

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const TestI18n = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.log('=== i18n Test ===');
    console.log('Current language:', i18n.language);
    console.log('Available languages:', i18n.languages);
    console.log('Test translation (hero.title):', t('hero.title'));
    console.log('Test translation (nav.home):', t('nav.home'));
    
    // Test language change
    console.log('\n=== Testing Language Change ===');
    console.log('Changing to Indonesian...');
    i18n.changeLanguage('id').then(() => {
      console.log('New language:', i18n.language);
      console.log('Translation after change:', t('hero.title'));
    });
  }, [i18n, t]);

  return null;
};
