/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#F4F7FB',
    surface: '#FFFFFF',
    primary: '#6366F1',
    'primary-darken-1': '#4F46E5',
    secondary: '#10B981',
    'secondary-darken-1': '#059669',
    error: '#EF4444',
    info: '#3B82F6',
    success: '#22C55E',
    warning: '#F59E0B',
  },
}

const myCustomDarkTheme = {
  dark: true,
  colors: {
    background: '#0F172A',
    surface: '#1E293B',
    primary: '#818CF8',
    'primary-darken-1': '#6366F1',
    secondary: '#34D399',
    'secondary-darken-1': '#10B981',
    error: '#F87171',
    info: '#60A5FA',
    success: '#4ADE80',
    warning: '#FBBF24',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
      myCustomDarkTheme,
    },
  },
})
