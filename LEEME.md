# Regalo digital 💌

## Cómo abrirlo
Abre `index.html` con doble clic (Chrome, Edge, Safari o Firefox).
Para compartirlo con ella, sube la carpeta completa a un hosting gratuito
(Netlify Drop, GitHub Pages, Cloudflare Pages) y envíale el enlace.

**Acceso:** usuario `Mapachito` · contraseña `27-11`
(no distingue mayúsculas, y también acepta `27/11` o `2711`).

## Qué archivos debes poner tú

Todas las imágenes y audios están junto a `index.html`, sin carpetas internas.
Para cambiar las fotos, reemplaza el archivo correspondiente conservando su nombre:

| Archivo | Para qué sirve |
|---|---|
| `musica.mp3` | Tu canción favorita |
| `playa.mp3` | Sonido del mar |
| `foto1.jpg` … `foto8.jpg` | Fotografías de la galería |
| `playa.jpeg` | Foto de la playa para el refugio |

- Los archivos actuales son sustitutos temporales. Reemplázalos por tus fotos y
  canciones originales conservando exactamente los nombres de esta tabla.
- Si todavía no pones `playa.mp3`, la página genera un sonido de olas suave
  por sí sola, para que ya funcione. Cuando agregues tu archivo, usará el real.
- Si no pones `playa.jpeg`, se muestra una playa ilustrada con olas animadas.
- Para **sustituir una foto**, reemplaza el archivo conservando el nombre.
  Recomendado: formato vertical (3:4), unos 1200 px de alto.

## Personalizar textos
- **Mensajes de las fotos, título del audio, usuario y contraseña:**
  edita la sección `CONFIG`, al inicio de `app.js`. Cada entrada de `fotos`
  tiene el nombre de la imagen (`src`) y el texto que aparece al abrirla
  (`msg`). Para agregar más, copia una entrada y actualiza ambos valores.
- **Carta y otros textos de la página:** edítalos directamente en `index.html`.
- **Firma:** edita el texto que aparece debajo de la carta en `index.html`.

## Notas
- La contraseña es parte del diseño del regalo, no una seguridad real:
  quien vea el código fuente puede leerla.
- Las tipografías se cargan de Google Fonts; sin internet se usan
  tipografías similares del sistema.
- Los audios no se reproducen solos: ella debe pulsar el botón.
