# BRASA · Cocina de Fuego — Carta digital con Realidad Aumentada

Carta digital premium para restaurante, construida con **React + Vite**. Permite navegar
categorías, ver el detalle de cada plato (ingredientes, info nutricional, alérgenos,
maridaje, opiniones) y, lo más importante, **ver el plato en 3D sobre tu propia mesa** con
la cámara del teléfono (WebAR real con WebXR).

Restaurante ficticio de cocina de fuego en Pinamar. Bilingüe ES/EN.

---

## 🚀 Cómo correrlo

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`). El flag `--host` ya está
configurado, así que también vas a ver una URL de red local para abrir desde el celular.

Build de producción:

```bash
npm run build
npm run preview
```

Requisitos: **Node 18+** (probado en Node 22).

---

## 📱 Realidad Aumentada — la verdad sobre las plataformas

El AR real (renderizar el plato sobre tu mesa con la cámara) usa **WebXR**, y eso tiene
límites reales según el dispositivo. La app detecta el dispositivo y elige el mejor camino:

| Dispositivo | Experiencia |
|---|---|
| **Android (Chrome)** | ✅ **WebAR real**. Detección de superficie (hit-test), colocás el plato tocando, rotás con un dedo, escalás con pinch, sombra sobre la mesa. |
| **iPhone / iPad (Safari)** | ⚠️ Safari **no soporta WebXR**. Cae a un **visor 3D interactivo** (girar/escalar). Para AR nativo en iOS se usa *AR Quick Look*, que necesita un archivo `.usdz` por plato (ver abajo). |
| **Desktop** | Visor 3D interactivo (sirve para previsualizar el modelo). |

### ⚠️ Importante: WebXR requiere HTTPS

Para probar el AR real en un Android **tenés que servir la app por HTTPS** (WebXR no funciona
sobre `http://` salvo en `localhost`). Para testear en tu teléfono dentro de la misma red:

1. Instalá el plugin de SSL local:
   ```bash
   npm install -D @vitejs/plugin-basic-ssl
   ```
2. Descomentá las líneas indicadas en `vite.config.js` (import + plugin).
3. `npm run dev` → abrí la URL `https://<tu-ip-local>:5173` desde el Android.
4. Aceptá el certificado autofirmado en el teléfono.

En producción, cualquier hosting con HTTPS (Vercel, Netlify, Cloudflare Pages) sirve.

---

## 🧊 Los modelos 3D

Los modelos son **procedurales**: se generan con primitivas de Three.js (no hay archivos
`.glb`), así el proyecto es 100% autocontenido y liviano. Cada plato define en
`src/data/menuData.js` un `model` (arquetipo: `pasta`, `meat`, `fish`, `burger`, `pizza`,
`dessert`, `salad`, `drink`, `wine`, `starter`) y un `accent` (color).

### Cómo usar modelos reales (`.glb`)

Para un look fotorrealista, reemplazá los modelos procedurales por GLTF reales:

1. Poné tus `.glb` en `public/models/`.
2. En `src/components/ar/DishModel.jsx`, usá `useGLTF` de `@react-three/drei`:
   ```jsx
   import { useGLTF } from '@react-three/drei'
   const { scene } = useGLTF('/models/bife.glb')
   return <primitive object={scene} />
   ```
3. Agregá un campo `glb` a cada plato en `menuData.js` y ruteá por ahí.

Para **AR Quick Look en iOS** necesitás además un `.usdz` por plato. Con esos archivos,
el botón de iOS puede abrir `<model-viewer>` (ya incluido en `index.html`) en modo AR nativo.

---

## 🔎 SEO

- `index.html` trae meta tags, **Open Graph** y **JSON-LD** de `Restaurant` (Schema.org).
- Cada plato tiene su ruta propia `/dish/:id` y actualiza el `document.title`.

> **Nota:** esto es una SPA (client-side rendering). Para SEO serio, lo ideal es
> **prerender / SSR** (que el HTML llegue ya armado al crawler). Opciones:
> [`vite-plugin-ssr` / `vike`](https://vike.dev), [`vite-plugin-prerender`], o migrar a un
> framework con SSR. Las rutas `/dish/:id` están pensadas para prerenderizarse una por una.

---

## 🗂️ Estructura

```
src/
├── components/
│   ├── ar/
│   │   ├── ARViewer.jsx      # Modal AR (orquesta los 3 caminos)
│   │   ├── ARScene.jsx       # Escena R3F: visor + hit-test WebXR
│   │   ├── DishModel.jsx     # Modelos 3D procedurales por arquetipo
│   │   ├── ModelPreview.jsx  # Visor 3D no inmersivo (hero / fallback)
│   │   └── Reticle.jsx       # Retículo de superficie
│   ├── Header.jsx  Hero.jsx  CategoryCard.jsx  DishCard.jsx
│   ├── DishModal.jsx  DishImage.jsx  SearchBar.jsx  Badges.jsx  Footer.jsx
├── pages/
│   ├── Home.jsx              # Landing + carta completa
│   └── DishPage.jsx          # Ruta individual del plato (/dish/:id)
├── context/LanguageContext.jsx   # ES/EN con persistencia
├── hooks/   useARSupport.js · useDishSearch.js
├── i18n/translations.js
├── data/menuData.js          # Categorías + 15 platos (bilingüe)
└── utils/format.js
```

---

## ⚙️ Stack

React 18 · Vite 5 · React Router 6 · Tailwind CSS 3 · Framer Motion 11 ·
React Three Fiber 8 · Three.js · drei · WebXR (hit-test + dom-overlay).

## ✅ Notas de performance / accesibilidad

- Visor 3D, modal y AR cargan con `React.lazy` (no penalizan el primer render).
- Imágenes con `loading="lazy"` y placeholder generado si una foto falla.
- Foco visible, roles ARIA en modales, `prefers-reduced-motion` respetado.
- Las fotos de demo salen de Unsplash; reemplazalas por las tuyas en `menuData.js`.

---

Hecho para Clyra Studio.
