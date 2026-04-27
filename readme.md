# HireBase

HireBase es una proyecto basado en una plataforma de reclutamiento diseñada para conectar candidatos con habilidades tecnológicas con empresas. 
Ofrece una experiencia de usuario fluida y un panel de administración robusto para la gestión de candidatos.

---

## Tecnologías Utilizadas

Este proyecto está dividido en dos partes principales: un Frontend en React y un Backend API REST en PHP.

**Frontend:**
* [Next.js](https://nextjs.org/) (App Router)
* React 18 & TypeScript
* [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) (Componentes de UI)
* React Hook Form (Validación de formularios)
* Axios (Consumo de API)

**Backend:**
* [Laravel](https://laravel.com/) (API REST)
* PHP 8.x & MySQL
* Laravel Sanctum (Autenticación por Tokens JWT)
* Laravel Socialite (Autenticación con Google/GitHub)
* PHPUnit (Pruebas Unitarias y de Integración)

---

## Características Principales

### Para Candidatos (Usuarios):
* **Autenticación Completa:** Registro tradicional y Login Social (Google y GitHub).
* **Recuperación de Contraseña:** Flujo seguro por correo electrónico.
* **Onboarding Dinámico:** Interfaz de validación estricta para completar perfiles creados mediante redes sociales (DNI, Fecha de nacimiento, Especialidad).
* **Gestión de Perfil:** Subida de fotos de perfil y currículums en formato PDF.

### Para Reclutadores (Administradores):
* **Dashboard de Métricas:** Visualización en tiempo real de los estados de contratación.
* **Gestión de Postulantes:** Capacidad de avanzar candidatos a través del pipeline (*Review*, *Interview*, *Hired*, *Rejected*).
* **Seguridad y Control:** Activación y desactivación manual de cuentas de usuarios.

### Arquitectura de Base de Datos:
* Implementación de **Procedimientos Almacenados (Stored Procedures)** y **Vistas SQL** integradas directamente en las migraciones de Laravel para optimizar y asegurar transacciones críticas.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu entorno local:
* [Node.js](https://nodejs.org/) (v18 o superior)
* [Composer](https://getcomposer.org/)
* PHP (v8.1 o superior)
* MySQL o MariaDB

---

## Instalación y Configuración

### 1. Configuración del Backend (Laravel)

```bash
# Navega a la carpeta del backend
cd backend

# Instala las dependencias de PHP
composer install


# Copia el archivo de entorno y genera la clave de la aplicación
cp .env.example .env
php artisan key:generate

# Configura tu .env con el .env.example
```
--- 

### 2. Configuración del Frontend (Next.js)

```bash
# Abre una nueva terminal y navega a la carpeta del frontend
cd frontend/hirebase

# Instala todas las dependencias de Node
npm install

## Configuración de Variables de Entorno:
# Crea un archivo .env.local en la raíz de la carpeta frontend y define la URL de tu API:

NEXT_PUBLIC_API_URL=http://localhost:8000/api

## Nota Importante sobre allowedDevOrigins e IPs Locales:
## Si al clonar el proyecto te encuentras con errores de CORS o problemas para cargar imágenes locales, 
## ten en cuenta que el entorno de desarrollo puede estar apuntando a una IP específica (ej. 192.168.1.x). 
## Deberás actualizar esta IP por localhost o por tu IP actual en los siguientes lugares:

# El archivo next.config.js o next.config.mjs del frontend (para los dominios permitidos de imágenes).

# El archivo .env del backend (FRONTEND_URL y variables _REDIRECT_URI).

# El archivo .env.local del frontend (NEXT_PUBLIC_API_URL).

## Levantar el entorno de desarrollo:

npm run dev
# El frontend estará disponible en http://localhost:3000
```
---
### Pruebas Unitarias (Testing)
```bash
# El backend cuenta con una suite de pruebas automatizadas con PHPUnit para garantizar la integridad de las rutas de usuario, actualización de perfiles, validaciones estrictas y subida de archivos (Mock Storage).

# Para ejecutar las pruebas, utiliza el siguiente comando dentro de la carpeta backend:
php artisan test --filter UserTest
```