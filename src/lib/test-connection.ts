/**
 * Test Connection to Backend API
 * 
 * Run this in browser console to test API connection:
 * import('./lib/test-connection').then(m => m.testConnection())
 */

import { api } from './api';

export async function testConnection() {
  console.log('🔍 Testing API Connection...\n');
  
  const tests = [
    {
      name: 'Backend Health Check',
      test: async () => {
        const response = await fetch(import.meta.env.VITE_API_BASE_URL);
        return response.ok;
      }
    },
    {
      name: 'Get Islands',
      test: async () => {
        const response = await api.getIslands();
        return response.success && Array.isArray(response.data);
      }
    },
    {
      name: 'Get Categories',
      test: async () => {
        const response = await api.getCategories();
        return response.success && Array.isArray(response.data);
      }
    },
    {
      name: 'Get Featured Properties',
      test: async () => {
        const response = await api.getFeaturedProperties();
        return response.success && Array.isArray(response.data);
      }
    },
    {
      name: 'Get Latest Properties',
      test: async () => {
        const response = await api.getLatestProperties();
        return response.success && Array.isArray(response.data);
      }
    },
  ];

  const results = [];

  for (const { name, test } of tests) {
    try {
      const success = await test();
      results.push({ name, success, error: null });
      console.log(`${success ? '✅' : '❌'} ${name}`);
    } catch (error: unknown) {
      const err = error as { message?: string };
      results.push({ name, success: false, error: err.message || 'Unknown error' });
      console.log(`❌ ${name}: ${err.message || 'Unknown error'}`);
    }
  }

  const passed = results.filter(r => r.success).length;
  const total = results.length;

  console.log(`\n📊 Results: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('🎉 All tests passed! Backend is connected successfully.');
  } else {
    console.log('⚠️ Some tests failed. Check your backend configuration.');
    console.log('\nTroubleshooting:');
    console.log('1. Make sure Laravel server is running: php artisan serve');
    console.log('2. Check VITE_API_URL in .env matches backend URL');
    console.log('3. Check CORS configuration in backend config/cors.php');
    console.log('4. Clear Laravel config cache: php artisan config:clear');
  }

  return results;
}

// Auto-run in development
if (import.meta.env.DEV) {
  console.log('💡 Tip: Run testConnection() in console to test API connection');
}
