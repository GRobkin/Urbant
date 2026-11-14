# Inmobiliaria Urbant

Aplicación web Full-Stack para una inmobiliaria, desarrollada con **SvelteKit** y **TypeScript**.

Los clientes envían solicitudes para publicar sus inmuebles (casas, apartamentos o terrenos). Los funcionarios de la inmobiliaria las revisan, las aprueban (el inmueble se publica en el catálogo) o las rechazan con un motivo que el cliente puede consultar.

## Integrantes

| Nombre           | GitHub                                         |
| ---------------- | ---------------------------------------------- |
| Guillermo Robkin | [@GRobkin](https://github.com/GRobkin)         |
| Erick Del Pino   | [@erickdpino](https://github.com/erickdpino)   |
| Katrin Lopez     | [@KatrinLopez](https://github.com/KatrinLopez) |
| Felipe Leal      | [@PinkFloyd96](https://github.com/PinkFloyd96) |

## Alcance del sistema

**Cliente**

- Se registra e inicia sesión.
- Envía solicitudes de publicación de inmuebles en cualquier punto de Uruguay, con tipo de inmueble (casa, apartamento o terreno), departamento, ciudad o localidad, dirección, precio, tipo de operación (venta o alquiler), dormitorios, baños, superficie, garaje (cantidad de autos), características y descripción.
- Consulta el estado de sus solicitudes y, si fueron rechazadas, el motivo.

**Funcionario** (área restringida)

- Ve todas las solicitudes y las filtra por estado: pendiente, aprobada o rechazada.
- Aprueba una solicitud (el inmueble se publica en el catálogo) o la rechaza indicando un motivo.
- Gestiona los inmuebles publicados: los edita, cambia su estado (disponible, reservado, vendido/alquilado) o los elimina.

**Público**

- Navega por el catálogo y lo filtra por tipo de inmueble (casa, apartamento o terreno), tipo de operación, departamento (los 19 de Uruguay), rango de precio, cantidad de dormitorios y garaje.

**Seguridad:** autenticación con login y sesión, y áreas restringidas según el rol (`cliente` o `funcionario`).

## Estado actual: Etapa 1

En esta etapa los datos son **simulados en memoria** en el servidor ([src/lib/server/datos.ts](src/lib/server/datos.ts)) y se reinician cada vez que se reinicia el servidor.

Las páginas de login y registro ya tienen su formulario y validan los datos en el servidor, pero todavía no inician sesión ni crean cuentas: eso se conecta con Supabase Auth en la próxima etapa. La consulta de solicitudes del cliente y el área de funcionarios también llegan en próximas etapas.

### Rutas

| Ruta                 | Descripción                                                                       | Flujo cliente-servidor                          |
| -------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| `/`                  | Inicio con buscador                                                               | **GET**: `load`                                 |
| `/catalogo`          | Catálogo con filtros (tipo, operación, departamento, precio, dormitorios, garaje) | **GET**: `load` + `{#each}`                     |
| `/solicitudes/nueva` | Formulario de solicitud de publicación                                            | **POST**: Form Action con validación y feedback |
| `/login`             | Iniciar sesión                                                                    | **POST**: Form Action con validación            |
| `/registro`          | Crear cuenta de cliente                                                           | **POST**: Form Action con validación            |

Estructura principal:

```
src/
├── lib/
│   ├── types.ts            # Interfaces TypeScript (Casa, Solicitud, ...)
│   ├── uruguay.ts          # Los 19 departamentos de Uruguay
│   ├── formato.ts          # Formato de precios, ubicación y etiquetas
│   ├── components/         # Tarjeta de inmueble, íconos y atributos
│   └── server/datos.ts     # "Base de datos" en memoria (solo servidor)
└── routes/
    ├── +layout.svelte      # Cabecera con menú de navegación y pie de página
    ├── +page.svelte        # Inicio (con su +page.server.ts)
    ├── catalogo/           # Catálogo con filtros
    ├── solicitudes/nueva/  # Formulario de solicitud de publicación
    ├── login/              # Iniciar sesión
    └── registro/           # Crear cuenta
```

## Base de datos planificada (Supabase / PostgreSQL)

La autenticación usará **Supabase Auth**: los usuarios se guardan en `auth.users` y cada uno tiene un perfil con su rol.

**`perfiles`**

| Campo     | Tipo                            | Notas                 |
| --------- | ------------------------------- | --------------------- |
| id        | uuid (PK, FK → `auth.users.id`) |                       |
| nombre    | text                            |                       |
| rol       | enum `cliente` \| `funcionario` | por defecto `cliente` |
| creado_en | timestamptz                     | `now()`               |

**`solicitudes`**

| Campo           | Tipo                                          | Notas                                        |
| --------------- | --------------------------------------------- | -------------------------------------------- |
| id              | bigint (PK, identity)                         |                                              |
| cliente_id      | uuid (FK → `perfiles.id`)                     | quién envía la solicitud                     |
| tipo            | enum `casa` \| `apartamento` \| `terreno`     | en terrenos: dormitorios, baños y garaje = 0 |
| direccion       | text                                          |                                              |
| ciudad          | text                                          | ciudad o localidad                           |
| departamento    | text                                          | uno de los 19 departamentos de Uruguay       |
| precio          | numeric(12,2)                                 | > 0                                          |
| operacion       | enum `venta` \| `alquiler`                    |                                              |
| dormitorios     | smallint                                      | ≥ 0                                          |
| banos           | smallint                                      | ≥ 1 (0 en terrenos)                          |
| area_m2         | numeric(8,2)                                  |                                              |
| garaje_autos    | smallint                                      | 0 = sin garaje                               |
| caracteristicas | text[]                                        |                                              |
| descripcion     | text                                          |                                              |
| estado          | enum `pendiente` \| `aprobada` \| `rechazada` | por defecto `pendiente`                      |
| motivo_rechazo  | text, null                                    | obligatorio si `rechazada`                   |
| revisada_por    | uuid, null (FK → `perfiles.id`)               | funcionario que la revisó                    |
| creada_en       | timestamptz                                   | `now()`                                      |

**`casas`**

| Campo                                                                                                                             | Tipo                                          | Notas                                                        |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| id                                                                                                                                | bigint (PK, identity)                         |                                                              |
| solicitud_id                                                                                                                      | bigint, unique (FK → `solicitudes.id`)        | solicitud que originó la casa; sus fotos están en `imagenes` |
| tipo, direccion, ciudad, departamento, precio, operacion, dormitorios, banos, area_m2, garaje_autos, caracteristicas, descripcion | (igual que en `solicitudes`)                  | copiados al aprobar; editables                               |
| estado                                                                                                                            | enum `disponible` \| `reservado` \| `vendido` | por defecto `disponible`                                     |
| publicada_en                                                                                                                      | timestamptz                                   | `now()`                                                      |
| actualizada_en                                                                                                                    | timestamptz                                   |                                                              |

**`imagenes`**

Los archivos se guardan en **Supabase Storage** (bucket `inmuebles`); la tabla guarda solo la ruta de cada archivo dentro del bucket.

| Campo        | Tipo                           | Notas                                                   |
| ------------ | ------------------------------ | ------------------------------------------------------- |
| id           | bigint (PK, identity)          |                                                         |
| solicitud_id | bigint (FK → `solicitudes.id`) | al borrar la solicitud se borran sus imágenes (cascade) |
| ruta         | text                           | ej.: `solicitudes/15/a3f9c2.jpg`                        |
| orden        | smallint                       | orden en la galería                                     |
| es_portada   | boolean                        | foto principal; una sola por solicitud                  |
| subida_en    | timestamptz                    | `now()`                                                 |

**Relaciones:** un `perfil` (cliente) tiene muchas `solicitudes`; cada `solicitud` tiene muchas `imagenes` (1:N) y, si se aprueba, genera una `casa` (1:1) que muestra esas mismas imágenes.

**Seguridad (Row Level Security):**

- `casas`: lectura pública; escritura solo para funcionarios.
- `imagenes` y bucket `inmuebles`: el cliente sube imágenes solo a sus solicitudes; lectura pública cuando la solicitud está aprobada; los funcionarios ven todas.
- `solicitudes`: el cliente solo ve e inserta las suyas; los funcionarios ven y actualizan todas.
- `perfiles`: cada usuario ve el suyo; solo un funcionario puede cambiar roles.

## Cómo ejecutar

Requisitos: Node.js 22.17 o superior.

```sh
git clone https://github.com/GRobkin/Urbant.git
cd Urbant
npm install
npm run dev -- --open
```

Otros comandos:

```sh
npm run check    # verificación de tipos (svelte-check)
npm run build    # build de producción
npm run format   # formatear con Prettier
```

## Tecnologías

- [SvelteKit 3](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev)
- TypeScript
- Tailwind CSS 4
- Supabase (etapa 2)
