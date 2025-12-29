<!-- Hero -->
# 🎧 AudioPlayer

AudioPlayer es un reproductor de música web ligero y visualmente atractivo, construido con React + TypeScript y Vite. Está pensado como una demo/SPA para reproducir listas locales desde `public/`, con controles completos, descarga de pistas y una estructura modular basada en Context API.

[Demo (GitHub Pages)](https://sathaniel99.github.io/AudioPlayer/) • Última versión: `1.0`

---

## 🔖 Tabla de contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación rápida](#-instalación-rápida)
- [Formato de la playlist](#-formato-de-la-playlist)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Consejos de desarrollo](#-consejos-de-desarrollo)
- [Dónde mirar primero](#-dónde-mirar-primero)
- [Contribuir](#-contribuir)

---

## ✨ Características

- Reproducción: play / pause, siguiente / anterior, manejo de tiempo y slider.
- Playlist dinámica cargada desde `public/songs.json`.
- Descarga de la pista actual mediante botón dedicado.
- Carga y lectura de metadata básica; manejo de eventos `onLoadedMetadata`, `onTimeUpdate`, `onEnded`.
- Contextos separados: `PlayerContext` y `EquilizerContext` para separar responsabilidades.

## 🧰 Tecnologías

- Vite
- React 19 + TypeScript
- Tailwind CSS + Radix UI (componentes UI)
- `music-metadata-browser` (para metadata)
- `sonner` (notificaciones)

---

## ⚡ Instalación rápida

```bash
npm install
npm run dev
```

Construir para producción:

```bash
npm run build
npm run preview
```

Desplegar (GitHub Pages):

```bash
npm run deploy
```

---

## 🗂 Formato de la playlist (`public/songs.json`)

Ejemplo de entrada:

```json
{
  "url": "/AudioPlayer/songs/(NOMBRE_DEL_AUDIO).mp3",
  "name": "(NOMBRE_DE_LA_CANCION)",
  "artist": "(ARTISTA)",
  "cover": "/covers/(NOMBRE_DEL_COVER).jpg"
}
```

Notas:
- Usa rutas relativas si vas a desplegar en una subcarpeta (p. ej. GitHub Pages). El `homepage` en `package.json` ya apunta a `https://sathaniel99.github.io/AudioPlayer/`.

---

## 📁 Estructura recomendada (resumen)

- `public/` — `songs.json`, `songs/`, `covers/`, recursos estáticos.
- `src/` — `App.tsx`, `main.tsx`, `components/`, `Contexts/`, `lib/`.

---

## 🛠 Consejos de desarrollo

- Para probar rápidamente localmente, añade pistas pequeñas (1–5 MB) en `public/songs/`.
- Usa `music-metadata-browser` para extraer metadatos más detallados si lo deseas.
- Mantén `public/songs.json` actualizado y comprueba que las rutas de `cover` sean accesibles.

---

## 👀 Dónde mirar primero

- `src/Contexts/PlayerContext/PlayerContext.tsx` — estado y lógica central.
- `src/components/Player/Player.tsx` — UI del reproductor y bindings del elemento `audio`.
- `public/songs.json` — controla las canciones visibles en la playlist.

---

## 🤝 Contribuir

Si quieres mejorar el proyecto, abre un issue o envía un PR. Buenas ideas:
- Mejoras visuales (temas, animaciones, accesibilidad).
- Integración con fuentes de streaming externas (APIs).
- Tests y mejoras en la estructura del contexto.

---