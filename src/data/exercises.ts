import { Exercise } from '../types';

export const exercises: Exercise[] = [
  {
    id: '1',
    title: 'Botón de Llamada a la Acción',
    description: 'Crea un botón atractivo usando HTML y CSS básico. Este ejercicio te ayudará a entender el modelo de caja, colores y estados interactivos.',
    instructions: [
      'Añade una clase "btn-primary" al elemento <button>.',
      'Cambia el color de fondo del botón a un azul vibrante (ej. #2563eb).',
      'Añade padding interno (ej. 10px arriba/abajo, 20px izquierda/derecha).',
      'Redondea los bordes usando border-radius.',
      'Cambia el color del texto a blanco y quita el borde por defecto.',
      'Añade un efecto hover para que el fondo sea más oscuro al pasar el ratón.'
    ],
    difficulty: 'Junior',
    tags: ['HTML', 'CSS', 'Botones', 'Hover'],
    initialHtml: `<button>Haz clic aquí</button>`,
    initialCss: `/* Escribe tu CSS aquí */
button {
  /* Estilos base */
}
`
  },
  {
    id: '4',
    title: 'Texto Enfatizado y Resaltado',
    description: 'Aprende a dar énfasis a partes del texto usando etiquetas semánticas de HTML para mejorar la lectura y el significado.',
    instructions: [
      'Usa la etiqueta <strong> para hacer que la palabra "importante" se vea en negrita.',
      'Usa la etiqueta <em> para hacer énfasis en la palabra "atención" con cursiva.',
      'Usa la etiqueta <mark> para resaltar la frase "leer con cuidado".'
    ],
    difficulty: 'Junior',
    tags: ['HTML', 'Semántica', 'Texto'],
    initialHtml: `<p>Este es un aviso muy importante para toda la comunidad. Por favor, presta atención a las siguientes reglas y asegúrate de leer con cuidado todas las instrucciones antes de comenzar.</p>`,
    initialCss: `/* Estilos básicos opcionales */
p {
  font-family: sans-serif;
  line-height: 1.6;
}
`
  },
  {
    id: '5',
    title: 'Listas Estilizadas',
    description: 'Crea listas ordenadas y desordenadas en HTML, y aplica estilos personalizados para cambiar los marcadores predeterminados.',
    instructions: [
      'Crea una lista desordenada <ul> con la clase "task-list" y tres elementos <li> adentro.',
      'Escribe tres tareas de ejemplo dentro de los items de la lista.',
      'Usa CSS para cambiar el tipo de marcador de ".task-list" a cuadrados (square) usando list-style-type.',
      'Crea una lista ordenada <ol> para mostrar tres pasos a seguir.'
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
`
  },
  {
    id: '6',
    title: 'El Modelo de Caja',
    description: 'Practica el modelo de caja de CSS aplicando bordes, relleno (padding) y márgenes a un elemento contenedor.',
    instructions: [
      'Aplica un borde sólido de 3px de color azul al contenedor ".box".',
      'Añade un padding interno de 20px en todos los lados.',
      'Añade un margen exterior de 15px en la parte superior e inferior, y "auto" a los lados para centrarlo.',
      'Aplica un borde redondeado y un color de fondo claro (ej. #f0f8ff).'
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
`
  },
  {
    id: '2',
    title: 'Tarjeta de Perfil con Flexbox',
    description: 'Diseña una tarjeta de perfil de usuario utilizando Flexbox para alinear los elementos internamente.',
    instructions: [
      'Usa Flexbox en el contenedor ".profile-card" para centrar su contenido verticalmente (column).',
      'Añade un ancho máximo, padding, borde redondeado y sombra a la tarjeta.',
      'Haz que la imagen de perfil (".avatar") sea circular (border-radius: 50%) y tenga un tamaño fijo (ej. 100px x 100px).',
      'Centra el texto del nombre y la descripción.',
      'Usa Flexbox en ".social-links" para distribuir los enlaces horizontalmente con un espacio entre ellos (gap).'
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
`
  },
  {
    id: '7',
    title: 'Formulario de Contacto Básico',
    description: 'Diseña un formulario de contacto profesional estilizándolo con CSS para una mejor experiencia de usuario.',
    instructions: [
      'Usa Flexbox (column) o block display en el contenedor del formulario para apilar los campos.',
      'Estiliza los inputs y el <textarea> para que ocupen el 100% del ancho (width: 100%) y tengan un padding cómodo (ej. 10px).',
      'Añade un borde sutil y un border-radius ligero a los campos.',
      'Asegúrate de que haya espacio vertical (margin-bottom) entre cada campo.',
      'Dale al botón de envío un color llamativo, texto blanco y un efecto al pasar el cursor (hover).'
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
`
  },
  {
    id: '8',
    title: 'Barra de Navegación Fija',
    description: "Crea un header de navegación que siempre permanezca visible en la parte superior ('sticky' o 'fixed') al hacer scroll en la página.",
    instructions: [
      'Aplica "position: fixed" a la clase ".navbar".',
      'Fija la barra en la parte superior configurando "top: 0" y "left: 0".',
      'Establece el ancho al 100% para que cruce toda la pantalla superior.',
      'Aplica un z-index alto para asegurarte de que quede por encima del contenido que se deslice abajo.',
      'Usa display flex en la navbar para centrar verticalmente y separar el logo de los enlaces (space-between).'
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
  /* El contenido puede requerir un padding o margin top igual al alto de la navbar para no quedar detrás de la misma inicialmente. */
}
`
  },
  {
    id: '9',
    title: 'Tarjetas Responsivas con Flexbox',
    description: 'Aplica la propiedad "flex-wrap" para permitir que múltiples tarjetas formen una cuadrícula de filas múltiples de manera fluida y adaptativa.',
    instructions: [
      'Aplica "display: flex" a la ".card-container".',
      'Activa la propiedad "flex-wrap: wrap" para permitir el salto de línea al quedarse sin espacio.',
      'Establece un "gap" de 20px de separación entre las tarjetas.',
      'Asegura que cada ".card" sea flexible dándole "flex: 1 1 250px" (puede crecer, encogerse, con una base mínima de 250px).'
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
`
  },
  {
    id: '3',
    title: 'Galería de Imágenes con CSS Grid',
    description: 'Construye una galería de imágenes responsiva utilizando CSS Grid Layout. Las imágenes deben adaptarse al tamaño de la pantalla.',
    instructions: [
      'Aplica "display: grid" al contenedor ".gallery".',
      'Configura las columnas usando "grid-template-columns" con "repeat" y "minmax" para que sea responsivo (ej. minmax(200px, 1fr)).',
      'Añade un espacio entre las imágenes usando "gap".',
      'Asegúrate de que las imágenes (".gallery-img") ocupen el 100% del ancho y alto de su celda, manteniendo su proporción (object-fit: cover).',
      'Añade un efecto hover a las imágenes para que se escalen ligeramente (transform: scale).'
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
`
  },
  {
    id: '10',
    title: 'Animación Bola Rebotando',
    description: 'Crea una animación continua y suave usando la regla @keyframes de CSS combinada con transforms.',
    instructions: [
      'Define unas animaciones @keyframes llamadas "bounce".',
      'En el 0% y 100% del ciclo, establece transform: translateY(0).',
      'En el 50%, establece transform: translateY(-100px) para simular el desplazamiento hacia arriba.',
      'En la clase ".ball", asigna la propiedad animation llamando a "bounce" con una duración de 1s, "ease-in-out" y valor "infinite".'
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
`
  },
  {
    id: '11',
    title: 'Layout de Dashboard con Grid Template Areas',
    description: 'Construye un marco base para un panel de administración usando grid-template-areas para ubicar los elementos visualmente con facilidad.',
    instructions: [
      'Aplica "display: grid" a ".dashboard".',
      'Usa "grid-template-areas" para definir las áreas. Filas: "sidebar header", y debajo "sidebar main".',
      'Define "grid-template-columns: 250px 1fr;" para definir el tamaño de la sidebar y del contenido.',
      'Asigna a cada componente base (.sidebar, .header, .main) su área correspondiente usando la propiedad "grid-area".'
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
  /* asigna grid-area correspondientes a sidebar */
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
}

.header {
  /* asigna grid-area correspondientes a header */
  background-color: #ecf0f1;
  padding: 1rem;
  border-bottom: 1px solid #bdc3c7;
}

.main {
  /* asigna grid-area correspondientes a main */
  background-color: #fdfdfd;
  padding: 2rem;
}
`
  },
  {
    id: '12',
    title: 'Sistema de Temas con Variables CSS',
    description: 'Aprende a usar Custom Properties (variables) para crear un esquema de colores e invertirlo aplicando una clase global, simulando el "Modo Oscuro".',
    instructions: [
      'Define en la pseudo-clase ":root" variables globales: --bg-color: #ffffff; y --text-color: #333333;',
      'Define una clase ".dark-theme" y dentro de ella redefine o invierte el valor de las variables (ej: --bg-color: #1a1a1a;).',
      'Aplica el color de fondo ("var(--bg-color)") y el color de texto en el selector ".theme-container".',
      'Experimenta añadiendo dinámicamente o directamente en HTML la clase dark-theme al theme-container.'
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
`
  }
];
