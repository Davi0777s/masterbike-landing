/* =====================================================================
   MASTER BIKE — CONFIGURACIÓN EDITABLE
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas tocar para actualizar
   precios, teléfono, cobertura y datos del técnico.
   Guarda el archivo y recarga la página para ver los cambios.
   ===================================================================== */

window.MASTERBIKE = {

  /* -------------------------------------------------------------------
     1) WHATSAPP
     Número en formato internacional, SOLO dígitos (sin +, sin espacios).
     Ej. Colombia: 57 + número -> "573001234567"
     ------------------------------------------------------------------- */
  whatsapp: "573005152744",   // Colombia (+57) 300 515 2744

  /* Correo de soporte/contacto (y cuenta para GA4, Meta, TikTok, Clarity, Vercel) */
  email: "sumasterbike@outlook.com",

  /* -------------------------------------------------------------------
     2) ZONA DE COBERTURA
     "coberturaBase": tu ciudad principal.
     "municipios": alrededores donde también atiendes (edita libremente).
     "cobertura": texto corto que se muestra en el hero, footer y stats.
     ------------------------------------------------------------------- */
  coberturaBase: "Ibagué",
  cobertura: "Ibagué y alrededores",
  municipios: [
    "El Espinal", "Girardot", "Flandes", "Melgar",
    "Guamo", "Alvarado", "Rovira", "Coello",
  ],

  /* -------------------------------------------------------------------
     3) DATOS DEL TÉCNICO (sección "Quién repara tu equipo")
     ------------------------------------------------------------------- */
  tecnico: {
    nombre: "Yovani Espinosa",
    cargo: "Técnico independiente · Master Bike",
    aniosExperiencia: "15+",             // "más de 15 años"
    maquinasAtendidas: 500,              // aprox. máquinas atendidas (número)
    frase: "Reviso cada máquina yo mismo. No es un call center, es un solo técnico respondiendo por su trabajo.",
  },

  /* -------------------------------------------------------------------
     4) TIPOS DE MÁQUINA
     El "id" se usa internamente; "label" es lo que ve el cliente.
     ------------------------------------------------------------------- */
  maquinas: [
    { id: "caminadora", label: "Caminadora / Trotadora", icon: "caminadora" },
    { id: "eliptica",   label: "Elíptica",               icon: "eliptica" },
    { id: "estatica",   label: "Bicicleta estática",     icon: "bici" },
    { id: "spinning",   label: "Bicicleta de spinning",  icon: "bici" },
    { id: "escalador",  label: "Escalador / Stepper",    icon: "remo" },
    { id: "remo",       label: "Máquina de remo",        icon: "remo" },
    { id: "fuerza",     label: "Multigimnasio / fuerza", icon: "otra" },
    { id: "otra",       label: "Otra máquina",           icon: "otra" },
  ],

  /* -------------------------------------------------------------------
     4.b) CONFIANZA
     ------------------------------------------------------------------- */
  garantiaDias: 30,          // días de garantía en mano de obra
  todasLasMarcas: true,      // "Atiendo todas las marcas"

  /* -------------------------------------------------------------------
     4.c) POR QUÉ MASTER BIKE (diferenciadores frente a la competencia)
     ------------------------------------------------------------------- */
  diferenciadores: [
    { icon: "user",     titulo: "Un solo técnico responsable", desc: "No es un call center ni un técnico distinto cada vez. Yo reviso tu máquina y yo respondo por el trabajo." },
    { icon: "home",     titulo: "A domicilio, sin mover tu máquina", desc: "Voy a donde estás. No tienes que desmontar ni transportar el equipo a ningún taller." },
    { icon: "wallet",   titulo: "Sin pago por adelantado", desc: "Primero cotizo tu caso por WhatsApp. Pagas cuando el trabajo está hecho y funcionando." },
    { icon: "tag",      titulo: "Todas las marcas", desc: "Atiendo tu equipo sin importar la marca, nacional o importado." },
    { icon: "doc",      titulo: "Orden de servicio firmada", desc: "Dejo por escrito cómo recibo y cómo entrego tu máquina. Transparencia total." },
    { icon: "shield",   titulo: "Garantía real", desc: "30 días de garantía sobre la mano de obra de cada reparación." },
  ],

  /* -------------------------------------------------------------------
     5) TIPOS DE SERVICIO
     Los PRECIOS no se muestran en la página: se cotizan de forma
     personalizada por WhatsApp al recibir la solicitud.
     "incluye" = tareas concretas que se listan en la tarjeta (dan confianza).
     ------------------------------------------------------------------- */
  servicios: [
    {
      id: "preventivo",
      titulo: "Mantenimiento preventivo",
      desc: "Para que tu máquina no falle: la dejo limpia, lubricada y calibrada como nueva.",
      incluye: [
        "Limpieza y ajuste de componentes internos",
        "Lubricación de piezas móviles: poleas, bujes, ejes y rodamientos",
        "Calibración de banda / tensión y limpieza de plataforma",
        "Revisión del panel de control y parámetros",
        "Prueba de funcionamiento y reporte del estado",
      ],
      destacado: true,                    // marca este como el recomendado
    },
    {
      id: "correctivo",
      titulo: "Mantenimiento correctivo",
      desc: "¿Ya falla? Encuentro la avería y la reparo: bandas, motores, consolas y rodamientos.",
      incluye: [
        "Diagnóstico de la falla (motor, banda, consola, tarjeta)",
        "Reparación o reemplazo del componente afectado",
        "Ajuste y calibración después de la reparación",
        "Prueba de funcionamiento bajo carga",
        "30 días de garantía en la mano de obra",
      ],
      destacado: false,
    },
    {
      id: "revision",
      titulo: "Revisión y diagnóstico",
      desc: "Chequeo completo con reporte escrito del estado real. Ideal antes de comprar o vender.",
      incluye: [
        "Inspección interna y externa del equipo",
        "Identificación de fallas y riesgos",
        "Reporte escrito en tu orden de servicio",
        "Cotización de repuestos si se necesitan",
      ],
      destacado: false,
    },
    {
      id: "ensamble",
      titulo: "Ensamble e instalación",
      desc: "¿Compraste una máquina nueva o la vas a mover? Yo la armo y la dejo lista para usar.",
      incluye: [
        "Desembalaje y revisión inicial de piezas",
        "Armado según especificaciones del fabricante",
        "Lubricación y ajuste de piezas móviles",
        "Verificación de funcionamiento óptimo",
        "Explicación de uso y cuidados",
      ],
      destacado: false,
    },
  ],

  /* -------------------------------------------------------------------
     5.b) MARCAS QUE ATIENDES (prueba de confianza — se muestran en un
          carrusel tipo "aliados". Edita/añade las que trabajas.)
     ------------------------------------------------------------------- */
  marcas: [
    "Life Fitness", "Technogym", "Movement", "Sole",
    "Sportop", "Athletic", "Randers", "Bowflex", "Precor", "Evolution",
  ],

  /* -------------------------------------------------------------------
     5.c) RESEÑAS DE CLIENTES (prueba social)
     Reemplaza por reseñas REALES. "foto" es opcional (ruta a imagen);
     si la dejas vacía se muestran las iniciales del nombre.
     ------------------------------------------------------------------- */
  testimonios: [
    { nombre: "Laura M.", zona: "Ibagué", maquina: "Caminadora", rating: 5, foto: "",
      texto: "La caminadora sonaba horrible y ya no la usábamos. Vino, la dejó como nueva el mismo día y me explicó cómo cuidarla. Súper recomendado." },
    { nombre: "Andrés G.", zona: "El Espinal", maquina: "Elíptica", rating: 5, foto: "",
      texto: "Respondió por WhatsApp en minutos y llegó puntual. Se nota que sabe lo que hace y cobra justo. Volveré a agendar el mantenimiento." },
    { nombre: "Catalina R.", zona: "Girardot", maquina: "Bici de spinning", rating: 5, foto: "",
      texto: "Me encantó que dejara todo por escrito en la orden de servicio. Transparencia total y trato de una persona real, no un call center." },
  ],

  /* -------------------------------------------------------------------
     6) PREGUNTAS FRECUENTES
     ------------------------------------------------------------------- */
  faqs: [
    {
      q: "¿Cuánto cuesta el servicio?",
      a: "Cada equipo y cada falla es distinta, así que la cotización es personalizada. Al enviar tu solicitud te doy el precio exacto por WhatsApp, sin costo ni compromiso.",
    },
    {
      q: "¿Tengo que llevar la máquina a un taller?",
      a: "No. Voy a tu domicilio en Ibagué y municipios cercanos, sin que tengas que desmontar ni transportar el equipo. La reviso donde está.",
    },
    {
      q: "¿Debo pagar por adelantado?",
      a: "No. Primero te doy la cotización por WhatsApp; pagas cuando el trabajo está hecho y tu máquina funciona.",
    },
    {
      q: "¿Atienden todas las marcas?",
      a: "Sí, atiendo tu equipo sin importar la marca, sea nacional o importado.",
    },
    {
      q: "¿Hacen instalación de máquinas nuevas?",
      a: "Sí. También armo e instalo equipos nuevos y los dejo listos para usar, con explicación de uso y cuidados.",
    },
    {
      q: "¿Cuánto tarda un mantenimiento?",
      a: "Un mantenimiento preventivo estándar toma entre 45 y 90 minutos según el estado y el tipo de máquina.",
    },
    {
      q: "¿Cómo confirmo mi cita?",
      a: "Al enviar el formulario se abre WhatsApp con tu orden de servicio prellenada. Solo la envías y te confirmo disponibilidad.",
    },
    {
      q: "¿Dan garantía?",
      a: "Sí: 30 días de garantía sobre la mano de obra de cada reparación. Todo queda registrado en tu orden de servicio.",
    },
  ],

  /* -------------------------------------------------------------------
     7) REDES SOCIALES (deja "" para ocultar un ícono)
     ------------------------------------------------------------------- */
  redes: {
    instagram: "",   // ej. "https://instagram.com/masterbike"
    facebook: "",
    tiktok: "",
  },
};
