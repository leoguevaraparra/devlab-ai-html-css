import { Exercise } from '../types';

/**
 * Catálogo de ejercicios del Laboratorio Virtual DevLab HTML/CSS.
 *
 * Cada ejercicio incluye:
 * - `instructions`: Lo que el estudiante ve y debe implementar.
 * - `evaluationCriteria`: Criterios técnicos internos usados por la IA para
 *   calificar. No se muestran al estudiante. Permiten evaluaciones más precisas
 *   y consistentes que si usara solo las instrucciones.
 */
export const exercises: Exercise[] = [
  // ── NIVEL JUNIOR ─────────────────────────────────────────────────────────────

  {
    id: 'ex-01',
    title: 'Botón de Llamada a la Acción',
    description:
      'Crea un botón atractivo usando HTML y CSS básico. Este ejercicio te ayudará a entender el modelo de caja, colores y estados interactivos.',
    instructions: [
      'Añade la clase "btn-primary" al elemento <button>.',
      'Cambia el color de fondo del botón a un azul vibrante (ej. #2563eb).',
      'Añade padding interno (ej. 10px arriba/abajo, 20px izquierda/derecha).',
      'Redondea los bordes usando border-radius.',
      'Cambia el color del texto a blanco y quita el borde por defecto.',
      'Añade un efecto hover para que el fondo sea más oscuro al pasar el ratón.',
    ],
    evaluationCriteria: [
      'El elemento <button> tiene aplicada la clase CSS "btn-primary".',
      'La propiedad background-color está definida con un valor de color azul (puede ser hex, rgb, hsl o nombre CSS válido).',
      'Se aplicó padding con valores razonables en ambos ejes (vertical e horizontal).',
      'Se usó border-radius con cualquier valor mayor a 0 para redondear los bordes.',
      'El color del texto es blanco (color: white o color: #fff o equivalente).',
      'Existe una regla CSS usando :hover en .btn-primary que modifica el background-color.',
    ],
    difficulty: 'Junior',
    tags: ['HTML', 'CSS', 'Botones', 'Hover'],
    initialHtml: `<button>Haz clic aquí</button>`,
    initialCss: `/* Escribe tu CSS aquí */
button {
  /* Estilos base */
}
`,
  },
  {
    id: 'ex-02',
    title: 'Texto Enfatizado y Resaltado',
    description:
      'Aprende a dar énfasis a partes del texto usando etiquetas semánticas de HTML para mejorar la lectura y el significado.',
    instructions: [
      'Usa la etiqueta <strong> para hacer que la palabra "importante" se vea en negrita.',
      'Usa la etiqueta <em> para hacer énfasis en la palabra "atención" con cursiva.',
      'Usa la etiqueta <mark> para resaltar la frase "leer con cuidado".',
    ],
    evaluationCriteria: [
      'La palabra "importante" está envuelta en la etiqueta <strong>.',
      'La palabra "atención" está envuelta en la etiqueta <em>.',
      'La frase "leer con cuidado" está envuelta en la etiqueta <mark>.',
      'El texto original del párrafo se preserva; solo se añaden las etiquetas semánticas requeridas.',
    ],
    difficulty: 'Junior',
    tags: ['HTML', 'Semántica', 'Texto'],
    initialHtml: `<p>Este es un aviso muy importante para toda la comunidad. Por favor, presta atención a las siguientes reglas y asegúrate de leer con cuidado todas las instrucciones antes de comenzar.</p>`,
    initialCss: `/* Estilos básicos opcionales */
p {
  font-family: sans-serif;
  line-height: 1.6;
}
`,
  },
  {
    id: 'ex-03',
    title: 'Listas Estilizadas',
    description:
      'Crea listas ordenadas y desordenadas en HTML, y aplica estilos personalizados para cambiar los marcadores predeterminados.',
    instructions: [
      'Crea una lista desordenada <ul> con la clase "task-list" y tres elementos <li> adentro.',
      'Escribe tres tareas de ejemplo dentro de los items de la lista.',
      'Usa CSS para cambiar el tipo de marcador de ".task-list" a cuadrados (square) usando list-style-type.',
      'Crea una lista ordenada <ol> para mostrar tres pasos a seguir.',
    ],
    evaluationCriteria: [
      'Existe un elemento <ul> con la clase "task-list" en el HTML.',
      'El <ul class="task-list"> contiene al menos 3 elementos <li> con texto.',
      'La clase .task-list tiene definida la propiedad list-style-type: square en el CSS.',
      'Existe un elemento <ol> en el HTML con al menos 3 elementos <li>.',
    ],
    difficulty: 'Junior',
    tags: ['HTML', 'CSS', 'Listas'],
    initialHtml: `<!-- Escribe tu HTML aquí -->
<h2>Mis Tareas</h2>
<!-- Lista Desordenada -->

<h2>Pasos</h2>
<!-- Lista Ordenada -->`,
    initialCss: `/* Escribe tu CSS aquí */
h2 {
  color: #333;
}

.task-list {
  /* Cambia el estilo de la lista aquí */
}
`,
  },
  {
    id: 'ex-04',
    title: 'El Modelo de Caja',
    description:
      'Practica el modelo de caja de CSS aplicando bordes, relleno (padding) y márgenes a un elemento contenedor.',
    instructions: [
      'Aplica un borde sólido de 3px de color azul al contenedor ".box".',
      'Añade un padding interno de 20px en todos los lados.',
      'Añade un margen exterior de 15px en la parte superior e inferior, y "auto" a los lados para centrarlo.',
      'Aplica un borde redondeado y un color de fondo claro (ej. #f0f8ff).',
    ],
    evaluationCriteria: [
      'La clase .box tiene un border de estilo solid, ancho de 3px y color azul (o equivalente).',
      'La propiedad padding tiene un valor de 20px (en shorthand o por lados individuales).',
      'El margin usa valores 15px en eje vertical y auto en horizontal (margin: 15px auto o equivalente).',
      'border-radius está definido con algún valor para redondear esquinas.',
      'background-color está definido con algún valor claro.',
    ],
    difficulty: 'Junior',
    tags: ['CSS', 'Box Model', 'Bordes'],
    initialHtml: `<div class="box">
  <p>Soy una caja y quiero tener estilos aplicados. ¡Decórame usando el modelo de caja de CSS!</p>
</div>`,
    initialCss: `body {
  font-family: sans-serif;
}

.box {
  /* Aplica estilos del Box Model aquí */
  width: 300px;
}
`,
  },

  // ── NIVEL SEMI SENIOR ─────────────────────────────────────────────────────────

  {
    id: 'ex-05',
    title: 'Tarjeta de Perfil con Flexbox',
    description:
      'Diseña una tarjeta de perfil de usuario utilizando Flexbox para alinear los elementos internamente.',
    instructions: [
      'Usa Flexbox en el contenedor ".profile-card" para centrar su contenido verticalmente (column).',
      'Añade un ancho máximo, padding, borde redondeado y sombra a la tarjeta.',
      'Haz que la imagen de perfil (".avatar") sea circular (border-radius: 50%) y tenga un tamaño fijo.',
      'Centra el texto del nombre y la descripción.',
      'Usa Flexbox en ".social-links" para distribuir los enlaces horizontalmente con un espacio entre ellos (gap).',
    ],
    evaluationCriteria: [
      '.profile-card tiene display: flex y flex-direction: column.',
      '.profile-card tiene max-width definido, padding, border-radius y box-shadow.',
      '.avatar tiene border-radius: 50% y dimensiones fijas (width y height iguales).',
      'Los elementos de texto (.name, .bio o el h2 y p) tienen text-align: center.',
      '.social-links tiene display: flex y gap definido para separar los enlaces horizontalmente.',
    ],
    difficulty: 'Semi senior',
    tags: ['HTML', 'CSS', 'Flexbox', 'Componentes'],
    initialHtml: `<div class="profile-card">
  <img src="https://picsum.photos/seed/avatar/150/150" alt="Avatar" class="avatar">
  <h2 class="name">Ana García</h2>
  <p class="bio">Desarrolladora Frontend apasionada por crear experiencias web increíbles.</p>
  <div class="social-links">
    <a href="#">Twitter</a>
    <a href="#">GitHub</a>
    <a href="#">LinkedIn</a>
  </div>
</div>`,
    initialCss: `/* Escribe tu CSS aquí */
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background-color: #f3f4f6;
  font-family: sans-serif;
}

.profile-card {
  background: white;
  /* Añade Flexbox y estilos de tarjeta aquí */
}

.avatar {
  /* Haz la imagen circular */
}

.social-links {
  /* Usa Flexbox para alinear los enlaces */
}
`,
  },
  {
    id: 'ex-06',
    title: 'Formulario de Contacto Básico',
    description:
      'Diseña un formulario de contacto profesional estilizándolo con CSS para una mejor experiencia de usuario.',
    instructions: [
      'Usa Flexbox (column) o block display en el contenedor del formulario para apilar los campos.',
      'Estiliza los inputs y el <textarea> para que ocupen el 100% del ancho y tengan padding cómodo.',
      'Añade un borde sutil y un border-radius ligero a los campos.',
      'Asegúrate de que haya espacio vertical (margin-bottom) entre cada campo.',
      'Dale al botón de envío un color llamativo, texto blanco y un efecto hover.',
    ],
    evaluationCriteria: [
      'Los campos del formulario (input, textarea) tienen width: 100% aplicado.',
      'Los campos tienen padding definido (cualquier valor mayor a 0).',
      'Los campos tienen border definido y border-radius mayor a 0.',
      'Existe alguna propiedad de espaciado vertical entre campos (margin-bottom o gap en flex).',
      'El botón de envío tiene background-color definido, color: white, y una regla :hover que cambia el color de fondo.',
    ],
    difficulty: 'Semi senior',
    tags: ['HTML', 'CSS', 'Formularios'],
    initialHtml: `<div class="form-container">
  <h2>Contáctanos</h2>
  <form class="contact-form">
    <label for="name">Nombre:</label>
    <input type="text" id="name" name="name" placeholder="Tu nombre">

    <label for="email">Correo:</label>
    <input type="email" id="email" name="email" placeholder="tu@correo.com">

    <label for="message">Mensaje:</label>
    <textarea id="message" name="message" rows="4"></textarea>

    <button type="submit">Enviar Mensaje</button>
  </form>
</div>`,
    initialCss: `body {
  font-family: sans-serif;
  background-color: #e5e7eb;
  padding: 2rem;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  margin: auto;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.contact-form {
  /* Estiliza el layout del formulario */
}

/* Estiliza los inputs, textarea y el botón aquí */
`,
  },
  {
    id: 'ex-07',
    title: 'Barra de Navegación Fija',
    description:
      "Crea un header de navegación que siempre permanezca visible en la parte superior al hacer scroll.",
    instructions: [
      'Aplica "position: fixed" a la clase ".navbar".',
      'Fija la barra en la parte superior configurando "top: 0" y "left: 0".',
      'Establece el ancho al 100% para que cruce toda la pantalla.',
      'Aplica un z-index alto para asegurarte de que quede por encima del contenido.',
      'Usa display flex en la navbar para centrar verticalmente y separar el logo de los enlaces (space-between).',
    ],
    evaluationCriteria: [
      '.navbar tiene position: fixed definido.',
      '.navbar tiene top: 0 y left: 0.',
      '.navbar tiene width: 100%.',
      '.navbar tiene z-index con un valor numérico positivo (mayor a 0).',
      '.navbar tiene display: flex con justify-content: space-between o equivalente para separar logo y enlaces.',
      '.navbar tiene align-items: center para alinear verticalmente el contenido.',
    ],
    difficulty: 'Semi senior',
    tags: ['CSS', 'Positioning', 'Layout'],
    initialHtml: `<!-- HTML Base -->
<header class="navbar">
  <div class="logo">MiSitio</div>
  <nav class="links">
    <a href="#">Inicio</a>
    <a href="#">Servicios</a>
    <a href="#">Contacto</a>
  </nav>
</header>

<main class="content">
  <h1>Contenido Principal</h1>
  <p>Haz scroll hacia abajo para ver el efecto en la barra.</p>
  <div style="height: 1500px; background: linear-gradient(to bottom, #d1d5db, #4b5563); margin-top:20px;"></div>
</main>`,
    initialCss: `body {
  margin: 0;
  font-family: sans-serif;
}

.navbar {
  background-color: #1f2937;
  color: white;
  padding: 1rem 2rem;
  /* Configura la posición fija aquí */
}

.navbar a {
  color: white;
  text-decoration: none;
  margin-left: 1rem;
}

.content {
  padding: 2rem;
}
`,
  },
  {
    id: 'ex-08',
    title: 'Tarjetas Responsivas con Flexbox',
    description:
      'Aplica la propiedad "flex-wrap" para permitir que múltiples tarjetas formen una cuadrícula fluida y adaptativa.',
    instructions: [
      'Aplica "display: flex" a la ".card-container".',
      'Activa la propiedad "flex-wrap: wrap" para permitir el salto de línea al quedarse sin espacio.',
      'Establece un "gap" de 20px de separación entre las tarjetas.',
      'Asegura que cada ".card" sea flexible dándole "flex: 1 1 250px".',
    ],
    evaluationCriteria: [
      '.card-container tiene display: flex.',
      '.card-container tiene flex-wrap: wrap.',
      '.card-container tiene gap con un valor de 20px (o equivalente en row-gap/column-gap).',
      '.card tiene la propiedad flex con los valores equivalentes a "1 1 250px" (grow, shrink, basis).',
    ],
    difficulty: 'Semi senior',
    tags: ['CSS', 'Flexbox', 'Responsive'],
    initialHtml: `<div class="card-container">
  <div class="card"><h3>Producto 1</h3><p>Descripción del producto uno.</p></div>
  <div class="card"><h3>Producto 2</h3><p>Descripción del producto dos.</p></div>
  <div class="card"><h3>Producto 3</h3><p>Descripción del producto tres.</p></div>
  <div class="card"><h3>Producto 4</h3><p>Descripción del producto cuatro.</p></div>
  <div class="card"><h3>Producto 5</h3><p>Descripción del producto cinco.</p></div>
</div>`,
    initialCss: `body {
  padding: 2rem;
  background-color: #f9fafb;
  font-family: sans-serif;
}

.card-container {
  /* Configura Flexbox aquí */
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  /* Configura el comportamiento flex de las tarjetas */
}
`,
  },

  // ── NIVEL SENIOR ─────────────────────────────────────────────────────────────

  {
    id: 'ex-09',
    title: 'Galería de Imágenes con CSS Grid',
    description:
      'Construye una galería de imágenes responsiva utilizando CSS Grid Layout. Las imágenes deben adaptarse al tamaño de la pantalla.',
    instructions: [
      'Aplica "display: grid" al contenedor ".gallery".',
      'Configura las columnas usando "grid-template-columns" con "repeat" y "minmax" para que sea responsivo.',
      'Añade un espacio entre las imágenes usando "gap".',
      'Asegúrate de que las imágenes (".gallery-img") ocupen el 100% del ancho y height fijo, con object-fit: cover.',
      'Añade un efecto hover a las imágenes para que se escalen ligeramente (transform: scale).',
    ],
    evaluationCriteria: [
      '.gallery tiene display: grid.',
      '.gallery tiene grid-template-columns usando repeat() con minmax() para crear columnas responsivas.',
      '.gallery tiene gap definido con algún valor.',
      '.gallery-img tiene width: 100%, height fijo definido y object-fit: cover.',
      '.gallery-img:hover tiene transform: scale() con un valor mayor a 1 para el efecto de zoom.',
      'Se usa transition en .gallery-img para animar el hover suavemente.',
    ],
    difficulty: 'Senior',
    tags: ['HTML', 'CSS', 'Grid', 'Responsive', 'Galería'],
    initialHtml: `<div class="gallery">
  <img src="https://picsum.photos/seed/1/400/300" alt="Imagen 1" class="gallery-img">
  <img src="https://picsum.photos/seed/2/400/300" alt="Imagen 2" class="gallery-img">
  <img src="https://picsum.photos/seed/3/400/300" alt="Imagen 3" class="gallery-img">
  <img src="https://picsum.photos/seed/4/400/300" alt="Imagen 4" class="gallery-img">
  <img src="https://picsum.photos/seed/5/400/300" alt="Imagen 5" class="gallery-img">
  <img src="https://picsum.photos/seed/6/400/300" alt="Imagen 6" class="gallery-img">
</div>`,
    initialCss: `/* Escribe tu CSS aquí */
body {
  padding: 2rem;
  background-color: #111827;
}

.gallery {
  /* Configura CSS Grid aquí */
}

.gallery-img {
  width: 100%;
  height: 250px;
  border-radius: 8px;
  transition: transform 0.3s ease;
  /* Asegura que la imagen cubra el espacio */
}

.gallery-img:hover {
  /* Añade efecto de escala */
}
`,
  },
  {
    id: 'ex-10',
    title: 'Animación Bola Rebotando',
    description:
      'Crea una animación continua y suave usando la regla @keyframes de CSS combinada con transforms.',
    instructions: [
      'Define una animación @keyframes llamada "bounce".',
      'En el 0% y 100% del ciclo, establece transform: translateY(0).',
      'En el 50%, establece transform: translateY(-100px) para simular el desplazamiento hacia arriba.',
      'En la clase ".ball", asigna la propiedad animation llamando a "bounce" con duración 1s, "ease-in-out" e "infinite".',
    ],
    evaluationCriteria: [
      'Existe una regla @keyframes con el nombre "bounce" en el CSS.',
      'En el 0% y/o 100% del @keyframes se usa transform: translateY(0) o equivalente.',
      'En el 50% del @keyframes se usa transform: translateY con un valor negativo (hacia arriba).',
      '.ball tiene la propiedad animation que referencia "bounce" con infinite.',
      'La duración de la animación está definida (cualquier valor en segundos o milisegundos).',
      'Se usa ease-in-out o una función de timing similar para suavizar la animación.',
    ],
    difficulty: 'Senior',
    tags: ['CSS', 'Animations', 'Keyframes'],
    initialHtml: `<div class="container">
  <div class="ball"></div>
  <div class="floor"></div>
</div>`,
    initialCss: `body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background-color: #8bb1f2;
}

.container {
  position: relative;
  width: 100px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.ball {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ff6b6b, #c0392b);
  /* Aplica tu animación aquí */
}

.floor {
  width: 150px;
  height: 10px;
  background: #2c3e50;
  border-radius: 50%;
  margin-top: -5px;
}

/* Define la regla @keyframes 'bounce' aquí abajo */
`,
  },
  {
    id: 'ex-11',
    title: 'Layout de Dashboard con Grid Template Areas',
    description:
      'Construye un marco base para un panel de administración usando grid-template-areas para ubicar los elementos visualmente.',
    instructions: [
      'Aplica "display: grid" a ".dashboard".',
      'Usa "grid-template-areas" para definir las áreas: "sidebar header" en la primera fila y "sidebar main" en la segunda.',
      'Define "grid-template-columns: 250px 1fr;" para el tamaño de la sidebar y del contenido.',
      'Asigna a cada componente (.sidebar, .header, .main) su área correspondiente con "grid-area".',
    ],
    evaluationCriteria: [
      '.dashboard tiene display: grid.',
      '.dashboard tiene grid-template-areas con al menos 2 filas que incluyen las áreas "sidebar", "header" y "main".',
      '.dashboard tiene grid-template-columns con al menos 2 columnas definidas (una fija para sidebar y 1fr para el contenido).',
      '.sidebar tiene grid-area: sidebar.',
      '.header tiene grid-area: header.',
      '.main tiene grid-area: main.',
      '.dashboard tiene grid-template-rows definido o height: 100vh para que el layout ocupe la pantalla completa.',
    ],
    difficulty: 'Senior',
    tags: ['CSS', 'Grid', 'Layout Avanzado'],
    initialHtml: `<div class="dashboard">
  <aside class="sidebar">Menú Lateral</aside>
  <header class="header">Navegación / Búsqueda</header>
  <main class="main">Contenido Principal del Panel</main>
</div>`,
    initialCss: `body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: sans-serif;
}

.dashboard {
  height: 100vh;
  /* Configura el display Grid junto con las areas y columnas aquí */
}

.sidebar {
  /* asigna grid-area correspondiente a sidebar */
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
}

.header {
  /* asigna grid-area correspondiente a header */
  background-color: #ecf0f1;
  padding: 1rem;
  border-bottom: 1px solid #bdc3c7;
}

.main {
  /* asigna grid-area correspondiente a main */
  background-color: #fdfdfd;
  padding: 2rem;
}
`,
  },
  {
    id: 'ex-12',
    title: 'Sistema de Temas con Variables CSS',
    description:
      'Aprende a usar Custom Properties (variables CSS) para crear un esquema de colores e invertirlo simulando el "Modo Oscuro".',
    instructions: [
      'Define en la pseudo-clase ":root" variables globales: --bg-color: #ffffff; y --text-color: #333333;',
      'Define una clase ".dark-theme" que redefina las variables con colores invertidos (fondo oscuro, texto claro).',
      'Aplica las variables con var() al background-color y color del elemento ".theme-container".',
      'Experimenta quitando la clase "dark-theme" del HTML para ver el tema claro.',
    ],
    evaluationCriteria: [
      'En :root están definidas al menos las variables --bg-color y --text-color.',
      'La clase .dark-theme redefine --bg-color con un valor oscuro y --text-color con un valor claro.',
      '.theme-container usa var(--bg-color) para background-color.',
      '.theme-container usa var(--text-color) para color.',
      'Se usa transition en .theme-container para suavizar el cambio de tema (bonus).',
      'La variable --primary-color u otras variables adicionales están correctamente integradas en los elementos de la interfaz.',
    ],
    difficulty: 'Senior',
    tags: ['CSS', 'Variables', 'Modo Oscuro'],
    initialHtml: `<div class="theme-container dark-theme">
  <h1>Modos Oscuro y Claro con Variables</h1>
  <p>El uso de variables globales te permite realizar cambios rápidos en todos los estilos definidos. Si modificas el HTML de este contenedor y le quitas la clase 'dark-theme', los colores deberían cambiar automáticamente si usas las variables correctamente.</p>
  <button class="btn-primary">Aceptar Acción</button>
</div>`,
    initialCss: `:root {
  /* Define aquí tus variables iniciales */
  --primary-color: #3498db;
}

.dark-theme {
  /* Redefine tus variables modo oscuro (bg, text) aquí */
  --primary-color: #2980b9;
}

.theme-container {
  /* Asigna las variables de estilo a backgroundColor y color */
  min-height: 100vh;
  padding: 2rem;
  font-family: sans-serif;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
`,
  },
];
