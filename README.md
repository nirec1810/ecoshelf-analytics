#  EcoShelf Analytics

---

##  Descripción

**EcoShelf Analytics** es una plataforma integral de gestión de excedentes alimentarios orientada a empresas como supermercados, panaderías y restaurantes. Permite digitalizar el inventario próximo a vencer, facilitando su venta rápida o donación, mientras genera inteligencia de negocios para reducir el desperdicio desde la fuente.

### Propósito

El desperdicio de alimentos es uno de los problemas más críticos de la industria alimentaria. EcoShelf aborda este problema en tres frentes:

1. **Visibilidad**: Digitaliza los lotes próximos a vencer en tiempo real.
2. **Acción**: Facilita la venta con descuento o la donación a ONGs antes de que los productos venzan.
3. **Prevención**: Analiza tendencias para que los gerentes tomen mejores decisiones de compra en el futuro.

### Módulos del sistema

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| **Gestor de Lotes** | CRUD completo de productos con fecha de caducidad, cantidad y precio dinámico | ✅ Implementado |
| **Autenticación** | Login seguro con Supabase Auth, protección de rutas privadas | ✅ Implementado |
| **Marketplace de Rescate** | Interfaz para consumidores finales y ONGs | 🔄 En desarrollo |
| **Inteligencia de Desperdicio** | Dashboard de análisis de tendencias y pérdidas recuperadas | 🔄 En desarrollo |

---

## Stack Tecnológico

| Tecnología | Rol en el proyecto |
|---|---|
| **Next.js 15** (App Router) | Framework principal — maneja rutas, Server y Client Components |
| **TypeScript** | Tipado estricto para evitar errores en precios, cantidades y fechas |
| **Supabase** | Base de datos PostgreSQL + Autenticación JWT |

---

## Guía de Instalación

### Prerrequisitos

- Node.js **18.x** o superior
- npm **9.x** o superior
- Una cuenta en [Supabase](https://supabase.com)

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/ecoshelf-analytics.git
cd ecoshelf-analytics
```

---

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
| `/lotes` | Gestión de lotes (requiere autenticación) |

---

## Arquitectura y Estructura de Carpetas

El proyecto sigue el patrón **MVC (Modelo - Vista - Controlador)** adaptado a Next.js App Router:

```
ecoshelf-analytics/
│
├── src/
│   │
│   ├── app/                          # VISTA — Rutas y páginas (Next.js App Router)
│   │   ├── layout.tsx                # Layout raíz de la aplicación
│   │   ├── page.tsx                  # Página de login (ruta /)
│   │   └── lotes/
│   │       ├── page.tsx              # Página principal de lotes — Server Component
│   │       └── LotesCliente.tsx      # Lógica de UI con estado — Client Component
│   │
│   ├── controllers/                  # CONTROLADOR — Lógica de negocio
│   │   ├── lote.controlador.ts       # Server Actions: crear, actualizar, eliminar lotes
│   │   └── auth.controlador.ts       # Server Actions: login y logout
│   │
│   ├── models/                       # MODELO — Datos y acceso a la base de datos
│   │   ├── lote.model.ts             # Interfaces y tipos TypeScript del lote
│   │   └── lote.repositorio.ts       # Consultas a Supabase (findAll, create, update...)
│   │
│   ├── components/                   # Componentes de UI reutilizables
│   │   ├── ui/                       
│   │   ├── lotes/
│   │   │   ├── TablaLotes.tsx        
│   │   │   ├── FormularioLote.tsx    
│   │   │   └── EstadoLoteBadge.tsx   
│   │   └── auth/
│   │       └── FormularioLogin.tsx   # Formulario de autenticación
│   │
│   ├── lib/                          # Utilidades y configuración
│   │   └── supabase/
│   │       ├── client.ts             # Cliente Supabase para el navegador
│   │       └── server.ts             # Cliente Supabase para Server Components
│   │
│   └── proxy.ts                      # Protección de rutas (Next.js Proxy)
│
├── .env.local                       
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Flujo de datos

```
Usuario → Vista (app/)
            ↓
        Controlador (controllers/)   ← Valida reglas de negocio
            ↓
        Repositorio (models/)        ← Solo habla con la base de datos
            ↓
        Supabase (PostgreSQL)
```
---

## Autenticación

La autenticación usa **Supabase Auth** con JWT almacenado en cookies del navegador.

- El archivo `src/proxy.ts` intercepta todas las peticiones y verifica la sesión
- Rutas privadas (`/lotes`) redirigen al login si no hay sesión activa
- La sesión persiste entre reinicios del servidor (vive en cookies del navegador)
- El token de acceso dura **1 hora**; el refresh token **7 días**

---

## Autor

Desarrollado por **Nicolás Recalde**

