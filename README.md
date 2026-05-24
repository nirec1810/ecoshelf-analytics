# Ecoshelf Analytics

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=000000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## Descripción

**Ecoshelf Analytics** es una plataforma web de gestión de producción para panaderías de pequeño y mediano tamaño. Permite digitalizar el registro diario de producción y ventas, gestionar insumos y recetas, y ejecutar un motor de análisis que compara el historial semanal para recomendar cómo redistribuir la producción, reducir el desperdicio y aumentar la ganancia.

### Propósito

Las panaderías suelen decidir cuánto producir cada día con experiencia e intuición, pero sin historial consolidado. Ecoshelf Analytics convierte ese proceso en un ciclo medible: registrar producción, revisar resultados, detectar desperdicio y ajustar la siguiente semana.

### Alcance actual

El sistema se concentra en el flujo principal de producción:

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| **Autenticación** | Login seguro con Supabase Auth y protección de rutas privadas | Implementado |
| **Insumos** | CRUD de ingredientes con costo y stock semanal | Implementado |
| **Panes y Recetas** | Catálogo de panes con receta base y cálculo de margen por unidad | Implementado |
| **Producción Diaria** | Registro de producido y vendido con cálculo automático de desperdicio, costo y ganancia | Implementado |
| **Historial** | Consulta de registros anteriores por rango de fechas | Implementado |
| **Motor de Sugerencias** | Análisis semanal con recomendaciones de redistribución y ganancia estimada | Implementado |
| **Dashboard** | Resumen de los últimos 7 días con métricas por pan | Implementado |

El módulo de lotes queda fuera del alcance actual. Si se retoma en el futuro, debe agregarse como feature completa con ruta, UI, reglas de negocio y documentación propia.

---

## Stack Tecnológico

| Tecnología | Rol en el proyecto |
|---|---|
| **Next.js 16.2.2** (App Router) | Framework principal: rutas, Server Components y Server Actions |
| **React 19.2.4** | Librería de interfaz para componentes cliente y servidor |
| **TypeScript 5** | Tipado estricto para precios, cantidades y cálculos del motor |
| **Supabase** | Base de datos PostgreSQL + autenticación JWT |
| **@supabase/ssr** | Integración de Supabase con SSR, cookies y Server Components |
| **Tailwind CSS 4** | Estilos utilitarios responsivos |
| **shadcn/ui + Radix UI** | Componentes de UI accesibles y personalizables |
| **ESLint 9** | Análisis estático de código |

---

## Guía de Instalación

### Prerrequisitos

- Node.js **18.x** o superior
- npm **9.x** o superior
- Una cuenta en [Supabase](https://supabase.com)

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
| `/panes/[id]/receta` | Edición de receta de un pan |
| `/produccion` | Registro de producción diaria |
| `/produccion/historial` | Historial de registros |
| `/sugerencias` | Motor de análisis semanal |

### 4. Flujo de ingreso inicial de datos

Para que el motor de sugerencias funcione correctamente, ingresa los datos en este orden:

```text
1. /insumos             -> Crear insumos con costos y stock semanal
2. /panes               -> Crear tipos de pan con precio de venta
3. /panes/[id]/receta   -> Definir ingredientes y cantidades de cada pan
4. /produccion          -> Registrar producción diaria (mínimo 7 días)
5. /sugerencias         -> Ejecutar el motor con el rango de fechas
```

---

## Arquitectura del Sistema

El proyecto mantiene una estructura MVC adaptada a Next.js:

- **`src/app/` (Vista):** rutas, páginas y layouts. Las páginas deben enfocarse en renderizar y delegar cálculos a controladores o helpers.
- **`src/components/` (UI):** formularios, tablas, navegación y componentes reutilizables.
- **`src/controllers/` (Controlador):** Server Actions, reglas de negocio y coordinación de flujo.
- **`src/models/` (Modelo/Repositorio):** tipos de datos y consultas directas a Supabase.
- **`src/lib/` (Infraestructura y helpers):** clientes Supabase, fechas, porcentajes y formateo.

La complejidad debe concentrarse en reglas de negocio y acceso a datos, no en la UI. Por eso los cálculos del dashboard y del motor de sugerencias se mantienen fuera de las páginas.

### Flujo de datos principal

1. Las páginas de `src/app` cargan datos iniciales desde controladores o repositorios.
2. Los componentes cliente capturan interacción del usuario.
3. Las mutaciones se envían a Server Actions en `src/controllers`.
4. Los controladores validan reglas y delegan persistencia a `src/models/*.repositorio.ts`.
5. Los repositorios usan el cliente de Supabase definido en `src/lib/supabase/server.ts`.
6. Después de mutar datos, los controladores revalidan rutas con `revalidatePath`.

---

## Producción y Motor de Sugerencias

Los campos `desperdicio`, `costo` y `ganancia` de la tabla `produccion` se calculan en `guardarProduccionAction` antes de guardar. No deben ingresarse manualmente desde el cliente.

La producción diaria valida que:

- La cantidad producida no sea negativa.
- La cantidad vendida no sea negativa.
- Lo vendido no supere lo producido.
- El costo unitario salga de la receta del pan.

El motor de sugerencias se ejecuta desde `ejecutarMotorAction(inicio, fin)` y delega el cálculo a `sugerencia.motor.ts`. Usa estos umbrales:

- **20% de desperdicio:** identifica panes con exceso.
- **85% de venta:** identifica panes con alta demanda.

El resultado compara panes con exceso contra panes con demanda, estima insumos liberados, calcula producción extra posible y ordena las sugerencias por ganancia estimada.

---

## Autenticación

La autenticación usa **Supabase Auth** con JWT almacenado en cookies del navegador.

- `src/proxy.ts` intercepta las peticiones y verifica la sesión activa.
- Rutas privadas redirigen al login si no hay sesión activa.
- Con sesión activa, intentar ir al login redirige a `/dashboard`.
- La sesión persiste entre reinicios del servidor porque vive en cookies del navegador.
- El token de acceso dura **1 hora**; el refresh token, **7 días**.

### Decisiones técnicas relevantes

- `redirect()` se usa dentro del Server Action (`auth.controlador.ts`), no en el cliente.
- En `FormularioLogin.tsx` se usa `isRedirectError` de Next.js para distinguir un redirect intencional de un error real.
- En Next.js 16, `params` en rutas dinámicas puede recibirse como `Promise` y debe esperarse con `await` antes de usarse.
- Los campos derivados de producción se calculan en el controlador antes de guardar.
- WSL es el entorno recomendado para validar este proyecto si las dependencias fueron instaladas para Linux.

---

## Comandos útiles

```bash
npm run dev
npm run lint
npm run build
```

---

## Autor

Desarrollado por **Nicolás Recalde**
