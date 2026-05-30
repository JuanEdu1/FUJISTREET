# Fujistreet — Landing MVP

Sushi y street food japonés en Villavicencio. Sitio estático servido por un servidor Node mínimo (sin dependencias), listo para Railway.

## Estructura
```
index.html        Página
styles.css        Estilos
script.js         Interacciones (menú, lightbox, reels, sonido)
server.js         Servidor estático (escucha en $PORT)
package.json      Script de arranque
railway.json      Configuración de Railway
static/           Logo, imágenes, videos y la carpeta menu/
```

## Probar localmente
Requiere Node 18+.
```bash
npm start
```
Abre http://localhost:3000

## Desplegar en Railway

### Opción A — Desde GitHub (recomendada)
1. Sube el proyecto a un repositorio de GitHub.
2. En [railway.app](https://railway.app): **New Project → Deploy from GitHub repo** y elige el repo.
3. Railway detecta Node, instala y ejecuta `node server.js` automáticamente.
4. En la pestaña **Settings → Networking**, pulsa **Generate Domain** para obtener la URL pública.
5. (Opcional) **Settings → Domains** para conectar un dominio propio (ej. fujistreet.com).

### Opción B — Con Railway CLI
```bash
npm i -g @railway/cli
railway login
railway init        # crea el proyecto
railway up          # sube y despliega
railway domain      # genera el dominio público
```

## Notas
- No hay que configurar el puerto: Railway inyecta `PORT` y el servidor ya lo usa.
- No subas `node_modules/` (ya está en `.gitignore`); no hay dependencias externas.
- Al cambiar imágenes/videos en `static/`, haz commit y push: Railway redepliega solo.
- El SEO (meta tags + datos estructurados) solo surte efecto una vez publicado con un dominio.
