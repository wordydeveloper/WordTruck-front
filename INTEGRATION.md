# WordTruck — Integración Frontend ↔ Backend

Este documento resume la revisión del backend (`WordTruck-back`) y todo lo que se
conectó en este frontend (`WordTruck-front`) para que deje de usar datos de ejemplo
y hable con la API real.

## 1. Cómo correrlo

**Backend** (.NET 9, requiere SQL Server accesible con la cadena de
`appsettings.json` o variable de entorno equivalente):

```bash
cd WordTruck.API
dotnet ef database update   # aplica las migraciones (crea tablas + seeds de Roles/Estados)
dotnet run                  # perfil "http" -> http://localhost:5000
```

Swagger queda disponible en `http://localhost:5000/`.

**Frontend**:

```bash
cp .env.example .env   # ya viene apuntando a http://localhost:5000
npm install
npm run dev            # http://localhost:5173 (o el puerto que definas)
```

El backend ya tiene CORS configurado para `http://localhost:5173` y
`http://localhost:3000`, así que no hace falta tocar nada ahí salvo que cambies
de puerto.

Para iniciar sesión necesitas un usuario real en la tabla `Usuarios` (creado vía
`POST /api/usuarios` o directamente en la base de datos). No existe un usuario
demo tipo `admin/admin123` como tenía el mock original.

## 2. Qué se conectó

Se agregó una capa de servicios (`src/services/`) con tipos que reflejan
exactamente los DTOs de `WordTruck.Business.Dtos`, más un `AuthContext` para la
sesión. Pantalla por pantalla:

| Pantalla | Antes | Ahora |
|---|---|---|
| Login | Usuario/contraseña hardcodeados (`admin`/`admin123`) | `POST /api/usuarios/login` real, con manejo de 401 y errores de red |
| Dashboard | KPIs y tabla con arrays fijos | `GET /api/paquetes`, KPIs y distribución por estado calculados en vivo |
| Nuevo Paquete | Formulario con campos remitente/destinatario que el backend no soporta | Formulario ajustado a `PaqueteCreateDto` real (cliente, origen, destino, dimensiones, tarifa) contra `POST /api/paquetes` |
| Consulta de Paquetes | Array fijo | `GET /api/paquetes` + `GET /api/clientes` para mostrar nombre real del cliente, con filtros client-side |
| Seguimiento | Diccionario de 2 paquetes hardcodeados con timeline inventado | `GET /api/paquetes/tracking/{tracking}` real. Se retiró el timeline falso (ver limitación abajo) |
| Clientes | Array fijo, botón "Nuevo cliente" sin función | `GET /api/clientes` + alta real. Ver nota sobre el modelo Usuario/Cliente abajo |
| Reportes | Datos de meses/rutas inventados | KPIs, distribución por estado y ranking de clientes calculados desde `/api/paquetes` y `/api/clientes`; pestaña de rutas reemplazada por "Facturación" usando `/api/facturas` |
| Rutas de Entrega | Tabla de rutas inventada | Ver limitación: no hay endpoint de rutas. Se dejó una vista honesta que agrupa paquetes "En ruta" por zona, con un aviso visible explicando el porqué |

## 3. Hallazgos del backend (para que los tengas presentes)

1. **No hay autenticación por token.** `POST /api/usuarios/login` valida
   correo/contraseña (con BCrypt, correcto) pero no devuelve JWT ni nada
   parecido, y ningún controller tiene `[Authorize]`. Hoy cualquiera que
   conozca la URL de la API puede leer/crear/borrar todo sin haber iniciado
   sesión. El frontend guarda la respuesta del login en `localStorage` solo
   para mantener la sesión en la UI — **no es un mecanismo de seguridad real**.
   Si esto va a producción, hace falta JWT (o cookies + `[Authorize]`) antes
   que cualquier otra cosa.

2. **Cliente ≠ Usuario+datos en un solo endpoint.** `ClienteCreateDto` solo
   recibe `usuarioId`, `documento` y `direccion`; el nombre/correo/teléfono
   viven en `Usuario`. Es decir, dar de alta un cliente nuevo requiere primero
   `POST /api/usuarios` (con `rolId = 2`, el rol "Cliente" sembrado en
   `WordTruckContext`) y luego `POST /api/clientes` con el `usuarioId`
   resultante. El frontend ya hace esta cadena en
   `clientesService.createFull()`, pero si agregan un endpoint combinado en el
   backend convendría simplificarlo.

3. **Sin endpoints de Rutas / Asignaciones / Historial de estados**, aunque los
   modelos de datos ya existen (`WordTruck.Data.Models.Ruta`, `Asignacion`,
   `HistorialEstados`) y están mapeados en el `DbContext`. Faltan sus
   controllers + DTOs + servicios. Sin esto:
   - La pantalla "Rutas de Entrega" no puede mostrar rutas reales.
   - "Seguimiento" solo puede mostrar el **estado actual** de un paquete, no
     una línea de tiempo con cada evento (aunque `PaquetesController` sí tiene
     `POST /{id}/actualizar-estado`, que internamente debería estar escribiendo
     en `HistorialEstados` — solo que no hay forma de leer ese historial desde
     afuera todavía).

4. **Catálogos sembrados** (útiles para no adivinarlos desde el frontend):
   - Roles: `1 = Administrador`, `2 = Cliente`, `3 = Repartidor`.
   - Estados de paquete: `1 = Registrado`, `2 = En bodega`, `3 = En ruta`,
     `4 = Entregado`, `5 = Cancelado`.

## 4. Sugerencia de próximos endpoints en el backend

Si quieres que el frontend explote el resto de las pantallas al 100%, el
siguiente paso natural en `WordTruck-back` sería agregar:

- `GET /api/paquetes/{id}/historial` (o similar) leyendo `HistorialEstados`.
- Un `RutasController` + `AsignacionesController` con CRUD básico.
- Opcional: un endpoint combinado `POST /api/clientes/registro` que cree
  Usuario + Cliente en una sola llamada.
- Autenticación con JWT y `[Authorize]` en los controllers.

En cuanto esos endpoints existan, avísame y conecto esas pantallas
(historial completo en Seguimiento, rutas reales, alta de cliente en un solo
paso) sin tener que tocar el resto de la integración.
