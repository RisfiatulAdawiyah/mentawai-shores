# Multi-Language Implementation Guide

## Overview
Website Mentawai Shores sekarang mendukung 2 bahasa:
- 🇬🇧 **English (EN)** - Default
- 🇮🇩 **Bahasa Indonesia (ID)**

## Features
✅ Automatic language detection dari browser
✅ Language switcher di Navbar (desktop & mobile)
✅ Persistent language selection (disimpan di localStorage)
✅ Smooth transition antar bahasa
✅ Comprehensive translations untuk semua halaman

## How to Use

### For Users
1. Klik tombol **Globe icon (🌐)** di Navbar
2. Bahasa akan otomatis toggle antara EN ↔ ID
3. Pilihan bahasa akan tersimpan dan diingat saat kembali ke website

### For Developers

#### 1. Menggunakan Translation di Component
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
};
```

#### 2. Translation dengan Variables
```tsx
// Translation file
{
  "islands": {
    "viewProperties": "View {{count}} Properties"
  }
}

// Component
<button>{t('islands.viewProperties', { count: 5 })}</button>
// Output: "View 5 Properties" atau "Lihat 5 Properti"
```

#### 3. Menambah Translation Baru
Edit file di `src/i18n/locales/`:
- `en.json` - English translations
- `id.json` - Indonesian translations

Struktur:
```json
{
  "section": {
    "key": "Translation text"
  }
}
```

#### 4. Change Language Programmatically
```tsx
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();

// Change to Indonesian
i18n.changeLanguage('id');

// Change to English
i18n.changeLanguage('en');

// Get current language
const currentLang = i18n.language; // 'en' or 'id'
```

## Translation Keys Structure

### Navigation (`nav`)
- home, properties, islands, about, contact
- login, register, logout
- myProperties, favorites

### Hero Section (`hero`)
- title, subtitle, searchPlaceholder, searchButton

### Properties Page (`properties`)
- title, subtitle, searchPlaceholder
- filters, sorting, pagination
- error messages, empty states

### Property Detail (`propertyDetail`)
- form labels, buttons
- property information
- inquiry form

### Authentication (`auth`)
- login, register forms
- labels, buttons, messages

### Common (`common`)
- Reusable words: loading, error, success
- Actions: save, delete, edit, view
- Time units: day, month, year

## Files Structure
```
src/
├── i18n/
│   ├── index.ts              # i18n configuration
│   └── locales/
│       ├── en.json           # English translations
│       └── id.json           # Indonesian translations
├── components/
│   └── LanguageSwitcher.tsx  # Language toggle button
└── main.tsx                  # i18n initialization
```

## Best Practices

### 1. Always Use Translation Keys
❌ Bad:
```tsx
<h1>Find Your Paradise</h1>
```

✅ Good:
```tsx
<h1>{t('hero.title')}</h1>
```

### 2. Keep Keys Organized
Group related translations:
```json
{
  "properties": {
    "title": "...",
    "subtitle": "...",
    "filters": {
      "title": "...",
      "sortBy": "..."
    }
  }
}
```

### 3. Use Descriptive Keys
❌ Bad: `t('text1')`, `t('btn')`, `t('msg')`
✅ Good: `t('hero.title')`, `t('properties.searchButton')`, `t('auth.loginButton')`

### 4. Handle Plurals
```json
{
  "properties": {
    "found_one": "{{count}} Property Found",
    "found_other": "{{count}} Properties Found"
  }
}
```

```tsx
{t('properties.found', { count: propertyCount })}
```

## Testing
1. Open website
2. Click language switcher (🌐 icon)
3. Verify all text changes to selected language
4. Refresh page - language should persist
5. Test on mobile menu

## Troubleshooting

### Language not changing?
- Check browser console for errors
- Verify translation keys exist in both en.json and id.json
- Clear localStorage and try again

### Missing translations?
- Check if key exists in translation files
- Verify key path is correct (case-sensitive)
- Add missing keys to both language files

### Language resets on refresh?
- Check if localStorage is enabled
- Verify i18n configuration in `src/i18n/index.ts`

## Future Enhancements
- [ ] Add more languages (Chinese, Japanese, etc.)
- [ ] RTL support for Arabic
- [ ] Date/time localization
- [ ] Currency formatting per locale
- [ ] SEO meta tags per language
- [ ] Language-specific URLs (/en/properties, /id/properti)

## Support
Jika ada pertanyaan atau issue, silakan hubungi tim development.
