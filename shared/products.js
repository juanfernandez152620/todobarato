/* Catálogo de la tienda, compartido por los dos diseños (red-social/ y ecomerce/).
 * Editá este archivo para cambiar textos, precios, fotos y videos: se actualizan los dos.
 * Las rutas de video/poster son relativas a cada diseño, por eso conviene usar '../media/...'.
 *
 * Cada producto:
 *   cuotas      valor de CADA cuota → { 9: valor, 12: valor }
 *   ram         GB de RAM (opcional, se muestra como "4 GB RAM · 128 GB")
 *   specs       4 datos de la ficha que se ven en la tarjeta. icon: pantalla, camara, bateria, memoria, parlante, update, carga, ram
 *   highlights  3 frases cortas que aparecen sobre el video
 *   pitch       primera línea de la descripción del post
 *   details     renglones de la descripción del post (se ven al tocar "más")
 *   video       MP4 vertical corto (6–10 s, sin audio, idealmente < 1,5 MB). Ej: '../media/moto-g06-128.mp4'
 *   poster      foto JPG/WebP del producto (sirve como primer cuadro del video). Ej: '../media/moto-g06-128.jpg'
 *   color       colores del celular de muestra que se dibuja mientras no haya foto ni video
 *
 * Confirmá los datos técnicos con el equipo exacto que se vende.
 */

window.STORE = {
  name: 'Todo Barato',
  tag: '.Tec',
  city: 'Tucumán',
  whatsapp: '5493816527629', // formato wa.me: 54 + 9 + característica + número, sin espacios ni "+"
  greeting: '¡Hola! Quiero consultar por un celular.',
  financing: 'GO cuotas',    // se muestra como "Financiá con GO cuotas". Dejalo vacío ('') para ocultarlo
  sinInteres: true,          // true → dice "CUOTAS SIN INTERÉS" (confirmado por el cliente)
  budgets: [45000, 55000, 65000], // botones de "¿Cuánto querés pagar por mes?" (valor de la cuota en 12)
  featured: 'redmi-note14pro-256', // celular de la portada en la versión Minimalista
  hashtags: ['TodoBarato', 'Tucumán'],
  howto: [
    { icon: '📱', title: 'Elegí tu celu', text: 'Mirá los videos y tocá el que más te guste.', bg: '#fff000', fg: '#0b0b0c' },
    { icon: '💳', title: 'Elegí las cuotas', text: 'Financiá con GO cuotas en 9 o 12 cuotas sin interés.', bg: '#e6007e', fg: '#ffffff' },
    { icon: 'wa', title: 'Escribinos por WhatsApp', text: 'Tocá "Pedilo por WhatsApp" y coordinamos todo con vos.', bg: '#0b0b0c', fg: '#fff000' },
  ],
};

window.PRODUCTS = [
  {
    id: 'moto-g06-128', brand: 'Motorola', name: 'Moto g06', storage: 128,
    cuotas: { 9: 59811, 12: 44858 },
    specs: [
      { icon: 'pantalla', v: '6,88"', l: 'Pantalla 120 Hz' },
      { icon: 'camara', v: '50', u: 'MP', l: 'Cámara' },
      { icon: 'bateria', v: '5200', u: 'mAh', l: 'Batería' },
      { icon: 'memoria', v: '128', u: 'GB', l: 'Memoria' },
    ],
    highlights: ['Pantalla gigante de 6,88"', 'Cámara de 50 MP', 'Batería de 5200 mAh'],
    pitch: 'Pantalla gigante para ver videos y redes, y una batería enorme. 🔥',
    details: ['📱 Pantalla de 6,88" a 120 Hz', '📸 Cámara principal de 50 MP', '🔋 Batería de 5200 mAh', '💾 128 GB de memoria'],
    color: ['#0f4c47', '#2dd4bf'], video: '', poster: '',
  },
  {
    id: 'moto-g06-64', brand: 'Motorola', name: 'Moto g06', storage: 64,
    cuotas: { 9: 55854, 12: 41883 },
    specs: [
      { icon: 'pantalla', v: '6,88"', l: 'Pantalla 120 Hz' },
      { icon: 'camara', v: '50', u: 'MP', l: 'Cámara' },
      { icon: 'bateria', v: '5200', u: 'mAh', l: 'Batería' },
      { icon: 'memoria', v: '64', u: 'GB', l: 'Memoria' },
    ],
    highlights: ['Pantalla gigante de 6,88"', 'Cámara de 50 MP', 'Batería de 5200 mAh'],
    pitch: 'El Moto con pantalla gigante a la cuota más baja. 💸',
    details: ['📱 Pantalla de 6,88" a 120 Hz', '📸 Cámara principal de 50 MP', '🔋 Batería de 5200 mAh', '💾 64 GB de memoria'],
    color: ['#3b1d78', '#a78bfa'], video: '', poster: '',
  },
  {
    id: 'moto-g17-256', brand: 'Motorola', name: 'Moto g17', storage: 256,
    cuotas: { 9: 74855, 12: 56141 },
    specs: [
      { icon: 'pantalla', v: '6,72"', l: 'Full HD+' },
      { icon: 'camara', v: '50', u: 'MP', l: 'Cámara' },
      { icon: 'bateria', v: '5200', u: 'mAh', l: 'Batería' },
      { icon: 'memoria', v: '256', u: 'GB', l: 'Memoria' },
    ],
    highlights: ['Pantalla Full HD+ de 6,72"', 'Cámara de 50 MP', '256 GB para todas tus fotos'],
    pitch: 'Más memoria para guardar todo: 256 GB sin borrar nada. 📸',
    details: ['📱 Pantalla Full HD+ de 6,72"', '📸 Cámara principal de 50 MP', '🔋 Batería de 5200 mAh', '💾 256 GB de memoria'],
    color: ['#172f6e', '#60a5fa'], video: '', poster: '',
  },
  {
    id: 'nubia-music2-128', brand: 'Nubia', name: 'Nubia Music 2', storage: 128, ram: 4,
    cuotas: { 9: 61644, 12: 46233 },
    specs: [
      { icon: 'parlante', v: '95', u: 'dB', l: '3 parlantes' },
      { icon: 'pantalla', v: '6,7"', l: 'Pantalla 120 Hz' },
      { icon: 'camara', v: '50', u: 'MP', l: 'Cámara' },
      { icon: 'bateria', v: '5000', u: 'mAh', l: 'Batería' },
    ],
    highlights: ['3 parlantes, hasta 95 dB', 'Pantalla de 6,7" a 120 Hz', 'Batería de 5000 mAh'],
    pitch: 'El celu para los que viven con música: suena fuerte de verdad. 🔊',
    details: ['🔊 Sistema de 3 parlantes, hasta 95 dB', '📱 Pantalla de 6,7" a 120 Hz', '📸 Cámara principal de 50 MP', '🔋 Batería de 5000 mAh', '💾 4 GB de RAM y 128 GB de memoria'],
    color: ['#d4d4d8', '#ffffff'], video: '', poster: '',
  },
  {
    id: 'samsung-a07-128', brand: 'Samsung', name: 'Galaxy A07', storage: 128,
    cuotas: { 9: 68800, 12: 51600 },
    specs: [
      { icon: 'pantalla', v: '6,7"', l: 'Pantalla 90 Hz' },
      { icon: 'camara', v: '50', u: 'MP', l: 'Cámara' },
      { icon: 'bateria', v: '5000', u: 'mAh', l: 'Batería' },
      { icon: 'update', v: '6', u: 'años', l: 'Actualizaciones' },
    ],
    highlights: ['Pantalla de 6,7" a 90 Hz', 'Cámara de 50 MP', '6 años de actualizaciones'],
    pitch: 'Un Samsung que se mantiene actualizado durante 6 años. ✅',
    details: ['📱 Pantalla de 6,7" a 90 Hz', '📸 Cámara principal de 50 MP', '🔋 Batería de 5000 mAh', '🔄 6 años de actualizaciones de Android', '💾 128 GB de memoria'],
    color: ['#1c2330', '#8b97a8'], video: '', poster: '',
  },
  {
    id: 'samsung-a07-64', brand: 'Samsung', name: 'Galaxy A07', storage: 64,
    cuotas: { 9: 55344, 12: 41508 },
    specs: [
      { icon: 'pantalla', v: '6,7"', l: 'Pantalla 90 Hz' },
      { icon: 'camara', v: '50', u: 'MP', l: 'Cámara' },
      { icon: 'bateria', v: '5000', u: 'mAh', l: 'Batería' },
      { icon: 'update', v: '6', u: 'años', l: 'Actualizaciones' },
    ],
    highlights: ['Pantalla de 6,7" a 90 Hz', 'Cámara de 50 MP', '6 años de actualizaciones'],
    pitch: 'El Samsung más accesible, con 6 años de actualizaciones. ✅',
    details: ['📱 Pantalla de 6,7" a 90 Hz', '📸 Cámara principal de 50 MP', '🔋 Batería de 5000 mAh', '🔄 6 años de actualizaciones de Android', '💾 64 GB de memoria'],
    color: ['#14532d', '#86efac'], video: '', poster: '',
  },
  {
    id: 'samsung-a16-128', brand: 'Samsung', name: 'Galaxy A16', storage: 128,
    cuotas: { 9: 81322, 12: 60991 },
    specs: [
      { icon: 'pantalla', v: '6,7"', l: 'Super AMOLED' },
      { icon: 'camara', v: '50', u: 'MP', l: 'Triple cámara' },
      { icon: 'bateria', v: '5000', u: 'mAh', l: 'Batería' },
      { icon: 'update', v: '6', u: 'años', l: 'Actualizaciones' },
    ],
    highlights: ['Pantalla Super AMOLED de 6,7"', 'Triple cámara de 50 MP', '6 años de actualizaciones'],
    pitch: 'Pantalla Super AMOLED para ver todo con colores intensos. 🌈',
    details: ['📱 Pantalla Super AMOLED de 6,7"', '📸 Triple cámara, principal de 50 MP', '🔋 Batería de 5000 mAh', '🔄 6 años de actualizaciones de Android', '💾 128 GB de memoria'],
    color: ['#2b3a4f', '#cbd5e1'], video: '', poster: '',
  },
  {
    id: 'redmi-note14pro-256', brand: 'Xiaomi', name: 'Redmi Note 14 Pro', storage: 256, ram: 8,
    cuotas: { 9: 142811, 12: 107108 },
    specs: [
      { icon: 'camara', v: '200', u: 'MP', l: 'Cámara' },
      { icon: 'pantalla', v: '6,67"', l: 'AMOLED 120 Hz' },
      { icon: 'carga', v: '45', u: 'W', l: 'Carga rápida' },
      { icon: 'ram', v: '8', u: 'GB', l: 'RAM' },
    ],
    highlights: ['Cámara de 200 MP', 'Pantalla AMOLED de 120 Hz', 'Carga rápida de 45 W'],
    pitch: 'Cámara de 200 MP para fotos con muchísimo detalle. 🤩',
    details: ['📸 Cámara principal de 200 MP', '📱 Pantalla AMOLED de 6,67" a 120 Hz', '⚡ Carga rápida de 45 W', '💾 8 GB de RAM y 256 GB de memoria'],
    color: ['#7a5f48', '#ead6c0'], video: '', poster: '',
  },
];
