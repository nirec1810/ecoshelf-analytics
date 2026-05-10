# Ecoshelf Analytics

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## Descripción

**Ecoshelf Analytics** es una plataforma web de gestión de producción para panaderías de pequeño y mediano tamaño. Permite digitalizar el registro diario de producción y ventas, gestionar insumos y recetas, y ejecutar un motor de análisis que compara el historial semanal para recomendar cómo redistribuir la producción, reducir el desperdicio y aumentar la ganancia.

### Propósito

Las panaderías definen cuánto producir cada día basándose en la experiencia o la intuición, sin datos históricos que respalden esas decisiones. El resultado es desperdicio frecuente en algunos productos mientras otros se agotan antes del mediodía. Ecoshelf Analytics convierte ese ciclo en un ciclo de mejora continua semana a semana.

### 🗺️ Módulos del sistema

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| **Autenticación** | Login seguro con Supabase Auth y protección de rutas privadas | ✅ Implementado |
| **Insumos** | CRUD de ingredientes con costo y stock semanal | ✅ Implementado |
| **Panes y Recetas** | Catálogo de panes con receta base y cálculo de margen por unidad | ✅ Implementado |
| **Producción Diaria** | Registro de producido y vendido con cálculo automático de desperdicio, costo y ganancia | ✅ Implementado |
| **Historial** | Consulta de registros anteriores con filtros por fecha y tipo de pan | ✅ Implementado |
| **Motor de Sugerencias** | Análisis semanal con recomendaciones de redistribución y ganancia estimada | ✅ Implementado |
| **Dashboard** | Resumen de los últimos 7 días con métricas por pan | ✅ Implementado |

---

## Stack Tecnológico

| Tecnología | Rol en el proyecto |
|---|---|
| **Next.js 15** (App Router) | Framework principal — rutas, Server Components, Server Actions |
| **TypeScript** | Tipado estricto para evitar errores en precios, cantidades y cálculos del motor |
| **Supabase** | Base de datos PostgreSQL + Autenticación JWT |
| **@supabase/ssr** | Integración de Supabase con SSR y Server Components de Next.js |
| **Tailwind CSS** | Estilos utilitarios responsivos |
| **shadcn/ui** | Componentes de UI accesibles y personalizables |
| **ESLint** | Análisis estático de código |

---

## Guía de Instalación

### Prerrequisitos

- Node.js **18.x** o superior
- npm **9.x** o superior
- Una cuenta en [Supabase](https://supabase.com)

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/Ecoshelf Analytics.git
cd Ecoshelf Analytics
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

| Ruta | Descripción |
|---|---|
| `/` | Página de login |
| `/dashboard` | Resumen semanal (requiere autenticación) |
| `/insumos` | Gestión de ingredientes |
| `/panes` | Catálogo de panes y recetas |
| `/produccion` | Registro de producción diaria |
| `/produccion/historial` | Historial de registros |
| `/sugerencias` | Motor de análisis semanal |

### 4. Flujo de ingreso inicial de datos

Para que el motor de sugerencias funcione correctamente, ingresa los datos en este orden:

```
1. /insumos             → Crear insumos con costos y stock semanal
2. /panes               → Crear tipos de pan con precio de venta
3. /panes/[id]/receta   → Definir ingredientes y cantidades de cada pan
4. /produccion          → Registrar producción diaria (mínimo 7 días)
5. /sugerencias         → Ejecutar el motor con el rango de fechas
```

---

---

## Arquitectura del Sistema

El proyecto sigue el patrón **MVC (Modelo-Vista-Controlador)** adaptado a la arquitectura de Next.js para separar la lógica de negocio de la interfaz:

*   **`src/app/` (Vista):** Manejo de rutas, Server Components y layouts.
*   **`src/controllers/` (Controlador):** Server Actions que validan reglas de negocio y coordinan el flujo.
*   **`src/models/` (Modelo/Repositorio):** Definición de esquemas de datos y comunicación directa con Supabase.
*   **`src/lib/` (Infraestructura):** Configuración de clientes de Supabase y utilidades globales.

---


### Separación de responsabilidades

| Capa | Archivo ejemplo | Responsabilidad |
|---|---|---|
| **Vista** | `app/(privado)/insumos/page.tsx` | Renderizar UI, cargar datos iniciales en el servidor |
| **Controlador** | `produccion.controlador.ts` | Validar reglas, calcular campos derivados, coordinar el flujo |
| **Repositorio** | `produccion.repositorio.ts` | Ejecutar queries a Supabase |
| **Modelo** | `produccion.model.ts` | Definir la forma de los datos (tipos e interfaces) |

---

## 🔐 Autenticación

La autenticación usa **Supabase Auth** con JWT almacenado en cookies del navegador.

- `src/proxy.ts` intercepta todas las peticiones y verifica la sesión activa
- Rutas privadas redirigen al login si no hay sesión activa
- Con sesión activa, intentar ir al login redirige a `/dashboard`
- La sesión persiste entre reinicios del servidor (vive en cookies del navegador)
- El token de acceso dura **1 hora**; el refresh token, **7 días**

### Decisiones técnicas relevantes

- `redirect()` se usa dentro del Server Action (`auth.controlador.ts`), no en el cliente.
- En `FormularioLogin.tsx` se usa `isRedirectError` de Next.js para distinguir un redirect intencional de un error real, evitando el flash del mensaje `NEXT_REDIRECT`.
- En Next.js 15, `params` en rutas dinámicas es una `Promise` y debe esperarse con `await` antes de usarse.
- Los campos `desperdicio`, `costo` y `ganancia` de la tabla `produccion` se calculan en el controlador antes de guardar — nunca se ingresan manualmente desde el cliente.

---

## 👤 Autor

Desarrollado por **Nicolás Recalde**

