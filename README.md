# Sistema Interno de Gestión de Incidencias (Ticketing System)

Aplicación web Full-Stack para la gestión y seguimiento de tickets de soporte técnico e incidencias internas. Implementa una arquitectura desacoplada (Frontend SPA / Backend REST API) con autenticación segura y control de acceso basado en roles (**RBAC**).

---

## Características Principales

* **Autenticación y Seguridad:** Registro e inicio de sesión protegido con **JWT (JSON Web Tokens)** y contraseñas encriptadas (`bcrypt`).
* **Control de Acceso Basado en Roles (RBAC):**
  * **Usuario:** Crear tickets, añadir comentarios en sus incidencias y consultar su estado en tiempo real.
  * **Admin:** Panel completo con capacidad de reasignar tickets, modificar estados (`OPEN`, `IN_PROGRESS`, `RESOLVED`) y gestionar asignaciones globalmente.
* **UI/UX Optimizado:** 
  * Búsqueda y filtrado dinámico de datos mediante **debounced fetching** para optimizar peticiones al servidor.
  * Actualizaciones de estado y asignación optimistas para una experiencia fluida.
  * Sistema global de notificaciones (*Toasts*).
* **Gestión de Comentarios:** Hilo de comunicación bidireccional dentro de cada ticket.

---

## Stack Tecnológico

### Frontend
* **Framework:** [Vue.js](https://vuejs.org/)
* **Gestión de Estado:** [Pinia](https://pinia.vuejs.org/)
* **Enrutamiento:** [Vue Router](https://router.vuejs.org/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
* **Cliente HTTP:** [Axios](https://axios-http.com/)

### Backend
* **Entorno de Ejecución:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Base de Datos & ORM:** [MySQL](https://www.mysql.com/) + [Sequelize](https://sequelize.org/)
* **Seguridad:** `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`

---

## Instalación y Configuración Local

### Prerrequisitos

* Node.js (v18 o superior)
* Servidor MySQL en ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/gregoridelrio/ticketing-system.git
cd ticketing-system
```

### 2. Configurar el Backend
```bash
cd backend
npm install
```

Copia el archivo de ejemplo de variables de entorno y ajusta las credenciales de tu base de datos MySQL:

```bash
cp .env.example .env
```

Contenido del archivo .env:
```bash
PORT=3000
DB_NAME=ticketing_db
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_HOST=127.0.0.1
DB_PORT=3306
JWT_SECRET=super_secreto_para_desarrollo
```

Iniciar el servidor backend:
```bash
npm run dev
```

### 2. Configurar el Backend
```bash
cd backend
npm install
```

### 3. Configurar el Frontend

En otra terminal, accede a la carpeta del frontend e inicia la aplicación:
```bash
cd ../frontend
npm install
npm run dev
```

---

## Estructura del Proyecto

```text
ticketing-system/
├── backend/
│   ├── config/          # Configuración de BD y variables
│   ├── controllers/     # Lógica de negocio (tickets, auth)
│   ├── middleware/      # Middlewares de autenticación y roles
│   ├── models/          # Modelos de Sequelize (User, Ticket, Comment)
│   ├── routes/          # Rutas API Express
│   └── server.js        # Punto de entrada de la API
│
└── frontend/
    ├── src/
    │   ├── api/         # Instancia configurada de Axios
    │   ├── components/  # Componentes reutilizables (Navbar, Toast, Modales)
    │   ├── router/      # Guardias de navegación y rutas
    │   ├── stores/      # Stores de Pinia (auth, tickets, toast)
    │   └── views/       # Vistas principales (Dashboard, Detail, Login)
    └── index.html

Instalación y Configuración Local