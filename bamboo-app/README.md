# Bamboo · Club de Innovación Texo

App base para Bamboo: aprendizaje modular, gamificación, blog y formulario de inscripción al club conectado a Google Sheets vía Apps Script.

## Incluye
- Landing con bienvenida al club de innovación
- Login y registro base con Supabase Auth
- Dashboard de progreso
- Módulos con contenido real de demo
- Ranking por puntos
- Blog Bamboo como actividad gamificada
- Formulario `/join` para inscribirse al club
- Proxy server-side a Apps Script para evitar problemas de CORS
- Modo demo si todavía no configuras Supabase

## Correr en local
```bash
npm install
npm run dev
```

## Variables de entorno
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbx6H9ACK5_Y8Y0OfOJnO0B2JmhtYUkVvJTTgpDkr72-Gq9MM104NYl2UmUPXYnrroR4LA/exec
```

## Flujo del formulario al Google Sheet
1. El usuario completa `/join`.
2. El frontend envía los datos a `/api/club-signup`.
3. La API del proyecto reenvía el payload a `GOOGLE_APPS_SCRIPT_URL`.
4. Tu Apps Script guarda la fila en Google Sheets y manda el mail de bienvenida.

Payload enviado al Apps Script:
```json
{
  "nombre": "Ana",
  "apellido": "Pérez",
  "email": "ana@texo.com",
  "telefono": "+595981123456",
  "agencia": "Texo",
  "area": "Estrategia"
}
```

## Despliegue en Vercel
1. Sube este proyecto a GitHub.
2. En Vercel, crea un proyecto nuevo e importa el repositorio.
3. Agrega las variables de entorno.
4. Deploy.
