# Skill: Vue & Vuetify Best Practices

Esta "skill" define los estándares de desarrollo para este proyecto, enfocándose en la escalabilidad, mantenibilidad y excelencia visual.

## 1. Componetización Extrema (MANDATORIO)
**Regla de Oro:** Si un bloque de código supera las 50 líneas o se repite en más de un lugar, **debe ser un componente**.
- Divide las páginas en componentes atómicos.
- Carpeta `src/components/` organizada por módulos (ej: `common/`, `dashboard/`, `rooms/`).
- Usa **props** para pasar datos y **emits** para eventos.

## 2. Vue 3 (Composition API)
- Usa siempre `<script setup lang="ts">`.
- Mantén la lógica reactiva limpia usando `ref`, `computed` y `watch`.
- Define tipos para las props para mejorar el soporte de TypeScript.

## 3. Vuetify 3 (The Right Way)
- **Props de Estilo:** Prioriza el uso de props de Vuetify (`rounded="xl"`, `elevation="2"`, `color="primary"`) antes que clases CSS personalizadas.
- **Layouts:** Usa `v-row` y `v-col` para la responsividad. Nunca uses `float` o layouts manuales.
- **Iconos:** Usa consistentemente `mdi-` (Material Design Icons).
- **Tematización:** Usa las clases de utilidad de color (`text-primary`, `bg-surface`) para que el modo oscuro funcione automáticamente.

## 4. Internacionalización (i18n)
- **Prohibido el texto plano:** Todo texto visible debe pasar por `$t('path.to.key')`.
- Las claves deben ser descriptivas y estar organizadas jerárquicamente en `src/plugins/i18n.ts`.

## 5. Rendimiento y Estética
- **Micro-animaciones:** Usa componentes de transición de Vuetify (`v-fade-transition`, `v-slide-y-transition`).
- **Estados de Carga:** Siempre implementa `v-skeleton-loader` o `v-progress-circular` para llamadas asíncronas.
- **Glassmorphism:** Usa variantes `tonal` y opacidades en fondos para efectos modernos.

## 6. Estructura de un Componente Ideal
```vue
<template>
  <v-card v-bind="$attrs">
    <!-- Contenido -->
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  // ...
}>()

const emit = defineEmits(['action'])
</script>

<style scoped>
/* Solo CSS estrictamente necesario */
</style>
```
