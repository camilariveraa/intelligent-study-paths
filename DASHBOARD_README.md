# Dashboard de Next - Plataforma de Aprendizaje con IA

## 🎯 Descripción General

El dashboard de Next es una plataforma completa de aprendizaje que genera rutas personalizadas basadas en videos de YouTube. Utiliza IA para crear experiencias de aprendizaje adaptativas que se ajustan al progreso y necesidades del usuario.

## 🏗️ Arquitectura del Dashboard

### Layout Principal
- **Sidebar Izquierda (280px)**: Navegación, perfil de usuario y rutas recientes
- **Área Central (flexible)**: Contenido principal con video player y sistema de evaluación
- **Panel Derecha (360px)**: Ruta de aprendizaje, progreso y recomendaciones

## 🎨 Diseño y Estilo

### Paleta de Colores
- **Malva**: `#be52d8` - Color principal
- **Lavanda**: `#8377ec` - Color secundario
- **Cielo**: `#489bff` - Color de acento
- **Fondo**: `#0a0a0a` - Negro profundo
- **Bordes**: `#1a1a1a` - Gris oscuro

### Gradientes
- **Primario**: Malva → Lavanda → Cielo
- **Acento**: Fucsia → Cobalto

## 🚀 Funcionalidades Implementadas

### 1. Sidebar Izquierda
- ✅ Logo de Next con nombre
- ✅ Botón "Nueva Ruta" con ícono
- ✅ Navegación principal (Inicio, Mis Rutas, Progreso, Ajustes)
- ✅ Badge con número de rutas
- ✅ Rutas recientes colapsables
- ✅ Perfil de usuario con avatar
- ✅ Modo colapsable

### 2. Área Central

#### Vista de Overview (Inicio de Ruta)
- ✅ Estado de carga elegante con animaciones
- ✅ Hero de la ruta con metadata
- ✅ Botones de acción (Comenzar Ruta, Ver Ruta Completa)
- ✅ Overview de módulos con progreso
- ✅ Objetivos de aprendizaje
- ✅ Skills que se desarrollarán

#### Vista de Video
- ✅ Header con breadcrumb y timer
- ✅ YouTube embed responsive (16:9)
- ✅ Overlay inferior con información del video
- ✅ Controles de navegación (Anterior, Completar, Siguiente)
- ✅ Sistema de tabs (Resumen, Evaluación, Chat con IA, Notas)

#### Sistema de Evaluación
- ✅ Preguntas contextuales de opción múltiple
- ✅ Feedback inmediato (correcto/incorrecto)
- ✅ Explicaciones detalladas
- ✅ Indicador de progreso circular
- ✅ Score de aciertos en tiempo real

#### Chat con IA
- ✅ Interfaz de chat tipo ChatGPT
- ✅ Avatar de IA con logo de Next
- ✅ Sugerencias rápidas
- ✅ Respuestas simuladas de IA
- ✅ Timestamps en mensajes

#### Sistema de Notas
- ✅ Editor de texto simple
- ✅ Botón para agregar notas en timestamp actual
- ✅ Guardado automático

### 3. Panel Derecha

#### Progreso General
- ✅ Círculo de progreso animado con gradiente
- ✅ Estadísticas (videos completados, tiempo de estudio, precisión, racha)
- ✅ Visualización tipo radar

#### Ruta de Aprendizaje
- ✅ Timeline visual con módulos colapsables
- ✅ Thumbnails de videos de YouTube
- ✅ Estados de video (no iniciado, en progreso, completado, necesita refuerzo)
- ✅ Navegación directa a videos
- ✅ Progreso por módulo

#### Recursos Recomendados
- ✅ Sección especial para debilidades detectadas
- ✅ Videos micro-específicos recomendados
- ✅ Botones de acción "Ver ahora"
- ✅ Badges de estado

#### Fortalezas y Debilidades
- ✅ Visualización tipo barras de progreso
- ✅ Porcentajes de dominio por concepto
- ✅ Colores diferenciados (verde para fortalezas, rojo para debilidades)

## 📊 Datos Mock Implementados

### Ruta de Ejemplo: "Finanzas Personales"
- **4 Módulos**:
  1. Fundamentos de Finanzas Personales (5 videos)
  2. Presupuesto y Ahorro (4 videos)
  3. Inversión Básica (4 videos)
  4. Planificación a Largo Plazo (3 videos)

- **Progreso del Usuario**: 68% completado
- **Debilidades Identificadas**: Interés compuesto, Regla de tres simple, Análisis de riesgo
- **Fortalezas Identificadas**: Presupuesto personal, Ahorro básico, Conceptos de inversión, Planificación financiera

## 🎮 Interactividad

### Estados Especiales
- ✅ Animación de confetti al completar videos
- ✅ Transiciones suaves entre videos
- ✅ Loading states elegantes
- ✅ Hover effects sutiles
- ✅ Toast notifications para feedback

### Navegación
- ✅ Cambio entre videos (anterior/siguiente)
- ✅ Selección directa desde panel derecho
- ✅ Cambio de tabs en evaluación
- ✅ Colapso/expansión de módulos

## 🔧 Tecnologías Utilizadas

- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Radix UI** para componentes base
- **Lucide React** para iconos
- **React Router** para navegación
- **TanStack Query** para manejo de estado

## 🚀 Cómo Usar

1. **Acceso**: Navega a `/dashboard` desde el landing page
2. **Inicio**: Ve la vista de overview de tu ruta personalizada
3. **Aprendizaje**: Haz clic en "Comenzar Ruta" para empezar
4. **Evaluación**: Completa videos y responde preguntas
5. **Progreso**: Monitorea tu avance en el panel derecho
6. **Refuerzo**: Revisa recursos recomendados para debilidades

## 📱 Responsive Design

- **Desktop**: Layout completo de 3 columnas
- **Tablet**: Panel derecho se convierte en modal/drawer
- **Mobile**: Sidebar se colapsa en hamburger menu
- **Video Player**: Se adapta a pantalla completa en móviles

## 🎯 Próximas Funcionalidades

- [ ] Integración real con Claude API
- [ ] Integración con YouTube API
- [ ] Sistema de gamificación (puntos, badges)
- [ ] Modo oscuro/claro
- [ ] Velocidad de reproducción variable
- [ ] Keyboard shortcuts
- [ ] Picture-in-Picture
- [ ] Export de notas en PDF
- [ ] Funcionalidades sociales

## 🐛 Estado Actual

El dashboard está **completamente funcional** con datos mock. Todas las interacciones están implementadas y el diseño es completamente responsive. La experiencia de usuario es fluida y profesional, lista para integración con APIs reales.
