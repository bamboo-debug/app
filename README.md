# Bamboo · Club de Innovación Texo

App base para Bamboo: aprendizaje modular, gamificación, blog y formulario de inscripción al club conectado a Google Sheets vía Apps Script.

## Qué trae esta versión
- Landing con mejor jerarquía visual y CTA más claros.
- Dashboard enfocado en siguiente acción y progreso real.
- Módulos interactivos con progreso por sección, ejercicio, quiz multiple choice y cierre del módulo.
- XP incremental en tiempo real.
- Blog con borradores guardados en perfil demo y envío a revisión.
- Rutas API listas para conectar Supabase y notificar a `bamboo@texo.com.py`.
- Formulario `/join` conectado a Google Sheets vía Apps Script.
- Modo demo si todavía no configuras Supabase.

## Correr en local
```bash
npm install
npm run dev
```

## Variables de entorno
Copia `.env.example` a `.env.local` y completa lo que vayas a usar.

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GOOGLE_APPS_SCRIPT_URL=...
BLOG_REVIEW_WEBHOOK_URL=...
```

## Cómo configurar Supabase

### 1) Crear el proyecto
1. Entra a Supabase y crea un proyecto nuevo.
2. Copia `Project URL` y `anon public key`.
3. Copia también la `service_role key` para usarla solo del lado servidor.

### 2) Cargar el esquema
1. Abre el SQL Editor de Supabase.
2. Copia el contenido de `supabase/schema.sql`.
3. Ejecuta el script completo.

Ese script crea:
- `profiles`
- `modules`
- `activities`
- `blog_posts`
- `blog_submissions`
- `module_progress`
- `points_ledger`
- trigger para crear perfil al registrarse
- RLS base para perfiles, blog, progreso y ledger

### 3) Variables de entorno locales
En `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
```

### 4) Variables de entorno en Vercel
En Vercel > Project Settings > Environment Variables agrega:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_APPS_SCRIPT_URL`
- `BLOG_REVIEW_WEBHOOK_URL` si vas a reenviar artículos a Bamboo

### 5) Auth
La pantalla `/auth` ya usa Supabase Auth.
Cuando configures las variables:
- crear cuenta funcionará con Supabase
- login funcionará con Supabase
- el trigger creará automáticamente el perfil en `profiles`

## Cómo conectar el blog con Bamboo
La app ya trae:
- `POST /api/blog/draft`
- `POST /api/blog/submit`

### Qué hace `/api/blog/submit`
- valida título, resumen y contenido
- guarda en `blog_submissions` si Supabase está configurado
- reenvía el contenido a `BLOG_REVIEW_WEBHOOK_URL` si lo configuras

### Cómo enviar a `bamboo@texo.com.py`
Tienes dos opciones:

#### Opción A: Apps Script
Crear otro Apps Script como el de inscripción para que reciba:
```json
{
  "destino": "bamboo@texo.com.py",
  "titulo": "...",
  "tema": "...",
  "resumen": "...",
  "contenido": "..."
}
```
Y ese Apps Script envía el mail. Luego usas su URL en `BLOG_REVIEW_WEBHOOK_URL`.

#### Opción B: Resend o SMTP
Puedes cambiar la ruta `app/api/blog/submit/route.ts` para usar Resend o Nodemailer.
Si vas a deployar en Vercel, Resend suele ser la opción más simple.

## Flujo actual del formulario al Google Sheet
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

## Sistema de puntaje implementado en demo
### Módulos
- sección completada: `+10 XP`
- ejercicio práctico: `+20 XP`
- quiz correcto: `+30 XP`
- quiz respondido incorrecto: `+10 XP`
- finalizar módulo: `+40 XP`

### Blog
- guardar borrador: `0 XP`
- enviar a revisión: `+20 XP`
- publicación aprobada: sugerido `+250 XP`

## Qué falta si quieres dejarlo 100% productivo
- persistir `module_progress` por usuario autenticado en Supabase
- reflejar `points_ledger` al completar secciones y quizzes
- aprobar/rechazar artículos desde un panel admin real
- publicar automáticamente artículos aprobados en `blog_posts`

## Deploy en Vercel
1. Sube este proyecto a GitHub.
2. En Vercel, crea un proyecto nuevo e importa el repositorio.
3. Agrega las variables de entorno.
4. Deploy.
5. Si usas Supabase Auth, revisa en Supabase > Authentication > URL Configuration y agrega tu dominio de Vercel.
