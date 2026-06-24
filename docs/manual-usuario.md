# Manual de Usuario — Sistema de Gestión de Biblioteca

**Trabajo Práctico Integrador — Programación IV**
**UTN TUC — Tecnicatura Universitaria en Programación**

---

## ¿Qué es este sistema?

El Sistema de Gestión de Biblioteca es una aplicación web que permite al personal de la
biblioteca registrar, consultar, modificar y eliminar los libros del catálogo de forma rápida
y sencilla desde cualquier navegador.

---

## Requisitos previos

- Tener instalado **Node.js** (versión 16 o superior).
- Acceso a un navegador web moderno (Chrome, Firefox, Edge).

---

## Cómo iniciar la aplicación

### 1. Iniciar el servidor (Backend)

Abrir una terminal en la carpeta `backend` y ejecutar:

```bash
npm install        # solo la primera vez
npm run dev        # inicia el servidor en modo desarrollo
```

El servidor quedará disponible en: `http://localhost:3001`

### 2. Iniciar la interfaz web (Frontend)

Abrir otra terminal en la carpeta `frontend` y ejecutar:

```bash
npm install        # solo la primera vez
npm run dev        # inicia la interfaz web
```

La aplicación quedará disponible en: `http://localhost:5173`

> Ambos deben estar corriendo al mismo tiempo para que la aplicación funcione.

---

## Pantalla de inicio de sesión

Al abrir la aplicación en el navegador, se muestra la pantalla de login.

**Credenciales de acceso:**

| Campo      | Valor          |
|------------|----------------|
| Usuario    | `admin`        |
| Contraseña | `biblioteca123`|

[CAPTURA: Pantalla de login]

**Errores posibles:**
- Si algún campo está vacío, aparece el mensaje *"El usuario es obligatorio"* o
  *"La contraseña es obligatoria"* debajo del campo correspondiente.
- Si las credenciales son incorrectas, aparece el mensaje *"Usuario o contraseña incorrectos"*
  en rojo sobre el formulario.

Hacer clic en **Ingresar** para acceder al sistema.

---

## Pantalla principal — Gestión de Libros

[CAPTURA: Pantalla principal con la tabla de libros]

Una vez autenticado se accede a la pantalla principal, que contiene:

| Elemento                 | Descripción                                              |
|--------------------------|----------------------------------------------------------|
| **Buscador**             | Campo de texto para filtrar libros por título en tiempo real |
| **Filtro de disponibilidad** | Menú desplegable: Todos / Disponibles / No disponibles |
| **Botón "+ Agregar libro"** | Abre el formulario para registrar un nuevo libro      |
| **Tabla de libros**      | Listado con ID, Título, Autor, Año, Disponibilidad y acciones |
| **Botón "Cerrar sesión"** | Cierra la sesión y regresa a la pantalla de login      |

### Columnas de la tabla

| Columna          | Descripción                                                 |
|------------------|-------------------------------------------------------------|
| ID               | Identificador numérico único asignado automáticamente       |
| Título           | Nombre del libro                                            |
| Autor            | Nombre del autor                                            |
| Año              | Año de publicación                                          |
| Disponibilidad   | Badge verde "Disponible" o rojo "No disponible"             |
| Acciones         | Botones **Editar** y **Eliminar** por cada fila             |

---

## Cómo agregar un libro

1. Hacer clic en el botón **+ Agregar libro**.
2. Se abrirá un formulario modal con los siguientes campos:

   | Campo               | Descripción                                        | Obligatorio |
   |---------------------|----------------------------------------------------|-------------|
   | Título              | Nombre del libro                                   | Sí          |
   | Autor               | Nombre del autor o autora                          | Sí          |
   | Año de publicación  | Año en que se publicó (entre 1900 y el año actual) | Sí          |
   | Disponible          | Casilla de verificación (marcada = disponible)     | Sí          |

3. Completar los campos y hacer clic en **Guardar**.
4. Si todo es correcto, el libro aparece en la tabla y se muestra una notificación verde
   *"Libro agregado correctamente"*.

[CAPTURA: Modal de alta de libro con datos completados]

**Errores posibles al guardar:**
- *"El título es obligatorio"* — el campo Título está vacío.
- *"El autor es obligatorio"* — el campo Autor está vacío.
- *"El año debe ser un número"* — se ingresó texto en el campo Año.
- *"El año debe ser mayor o igual a 1900"* — el año es anterior a 1900.
- *"El año no puede ser mayor a [año actual]"* — el año supera el año en curso.

---

## Cómo editar un libro

1. En la tabla, hacer clic en el botón **Editar** de la fila del libro que se desea modificar.
2. Se abrirá el formulario modal con los datos actuales del libro precargados.
3. Modificar los campos necesarios y hacer clic en **Guardar**.
4. La tabla se actualizará y aparecerá la notificación *"Libro actualizado correctamente"*.

[CAPTURA: Modal de edición con datos del libro]

> Para cancelar sin guardar cambios, hacer clic en **Cancelar** o fuera del modal.

---

## Cómo eliminar un libro

1. En la tabla, hacer clic en el botón **Eliminar** de la fila del libro a eliminar.
2. Aparecerá un diálogo de confirmación: *"¿Estás seguro de que querés eliminar este libro?"*

[CAPTURA: Diálogo de confirmación de eliminación]

3. Hacer clic en **Aceptar** para confirmar o **Cancelar** para volver sin eliminar.
4. Si se confirma, el libro desaparece de la tabla y aparece la notificación
   *"Libro eliminado correctamente"*.

---

## Cómo buscar libros

Escribir cualquier parte del título del libro en el campo de búsqueda ubicado en la parte
superior de la pantalla. La tabla se filtra automáticamente a medida que se escribe.

[CAPTURA: Buscador con texto ingresado y tabla filtrada]

Para limpiar la búsqueda, borrar el texto del campo.

---

## Cómo filtrar por disponibilidad

Usar el menú desplegable ubicado junto al buscador:

| Opción           | Resultado                                           |
|------------------|-----------------------------------------------------|
| Todos            | Muestra todos los libros sin importar disponibilidad |
| Disponibles      | Muestra solo los libros marcados como disponibles   |
| No disponibles   | Muestra solo los libros no disponibles              |

Se puede combinar con el buscador para refinar aún más los resultados.

---

## Notificaciones del sistema

Las notificaciones temporales (toast) aparecen en la pantalla durante 3 segundos para informar
el resultado de cada operación:

| Color  | Significado                       | Ejemplo                          |
|--------|-----------------------------------|----------------------------------|
| Verde  | Operación realizada con éxito     | "Libro agregado correctamente"   |
| Rojo   | Ocurrió un error                  | "El título es obligatorio"       |

Se pueden cerrar manualmente haciendo clic en la notificación antes de que desaparezca.

---

## Cerrar sesión

Hacer clic en el botón **Cerrar sesión** en la esquina superior derecha de la pantalla
principal. La sesión se cierra y se regresa a la pantalla de login.

> La sesión se mantiene activa aunque se cierre y vuelva a abrir el navegador, hasta que se
> cierre sesión manualmente.

---

## Preguntas frecuentes

**¿Se guardan los datos si se reinicia el servidor?**
Sí. El catálogo de libros se almacena en el archivo `backend/data/libros.json`, por lo que
los datos persisten entre reinicios del servidor.

**¿Qué pasa si el servidor no está corriendo?**
La tabla mostrará el mensaje de carga indefinidamente o aparecerá un toast de error. Verificar
que el backend esté iniciado en el puerto 3001.

**¿Puedo acceder desde otro dispositivo?**
En la configuración actual, la aplicación solo funciona en la misma computadora donde está
corriendo. Para acceso en red se requiere configuración adicional.

**¿Puedo tener dos libros con el mismo título?**
Sí. El sistema identifica los libros por su ID numérico, no por el título. Pueden existir
libros con el mismo título o autor.
