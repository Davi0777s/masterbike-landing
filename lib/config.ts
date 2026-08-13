// Master Bike — configuración de contenido (portado desde js/config.js)
// Único lugar para editar textos, precios (ocultos), cobertura, técnico, etc.

export const config = {
  whatsapp: "573005152744", // Colombia (+57) 300 515 2744
  email: "sumasterbike@outlook.com",

  tracking: {
    ga4: "",
    metaPixel: "",
    tiktokPixel: "",
    clarity: "y1htg0bruf",
  },

  coberturaBase: "Ibagué",
  cobertura: "Ibagué y alrededores",
  municipios: ["El Espinal", "Girardot", "Flandes", "Melgar", "Guamo", "Alvarado", "Rovira", "Coello"],

  tecnico: {
    nombre: "Yovani Espinosa",
    cargo: "Técnico independiente · Master Bike",
    aniosExperiencia: "15+",
    maquinasAtendidas: 500,
    frase: "Reviso cada máquina yo mismo. No es un call center, es un solo técnico respondiendo por su trabajo.",
  },

  maquinas: [
    { id: "caminadora", label: "Caminadora / Trotadora", icon: "caminadora" },
    { id: "eliptica", label: "Elíptica", icon: "eliptica" },
    { id: "estatica", label: "Bicicleta estática", icon: "bici" },
    { id: "spinning", label: "Bicicleta de spinning", icon: "bici" },
    { id: "escalador", label: "Escalador / Stepper", icon: "remo" },
    { id: "remo", label: "Máquina de remo", icon: "remo" },
    { id: "fuerza", label: "Multigimnasio / fuerza", icon: "otra" },
    { id: "otra", label: "Otra máquina", icon: "otra" },
  ],

  garantiaDias: 30,
  todasLasMarcas: true,

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
      destacado: true,
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

  diferenciadores: [
    { icon: "user", titulo: "Un solo técnico responsable", desc: "No es un call center ni un técnico distinto cada vez. Yo reviso tu máquina y yo respondo por el trabajo." },
    { icon: "home", titulo: "A domicilio, sin mover tu máquina", desc: "Voy a donde estás. No tienes que desmontar ni transportar el equipo a ningún taller." },
    { icon: "wallet", titulo: "Sin pago por adelantado", desc: "Primero cotizo tu caso por WhatsApp. Pagas cuando el trabajo está hecho y funcionando." },
    { icon: "tag", titulo: "Todas las marcas", desc: "Atiendo tu equipo sin importar la marca, nacional o importado." },
    { icon: "doc", titulo: "Orden de servicio firmada", desc: "Dejo por escrito cómo recibo y cómo entrego tu máquina. Transparencia total." },
    { icon: "shield", titulo: "Garantía real", desc: "30 días de garantía sobre la mano de obra de cada reparación." },
  ],

  marcas: ["Life Fitness", "Technogym", "Movement", "Sole", "Sportop", "Athletic", "Randers", "Bowflex", "Precor", "Evolution"],

  testimonios: [
    { nombre: "Laura M.", zona: "Ibagué", maquina: "Caminadora", rating: 5, foto: "", texto: "La caminadora sonaba horrible y ya no la usábamos. Vino, la dejó como nueva el mismo día y me explicó cómo cuidarla. Súper recomendado." },
    { nombre: "Andrés G.", zona: "El Espinal", maquina: "Elíptica", rating: 5, foto: "", texto: "Respondió por WhatsApp en minutos y llegó puntual. Se nota que sabe lo que hace y cobra justo. Volveré a agendar el mantenimiento." },
    { nombre: "Catalina R.", zona: "Girardot", maquina: "Bici de spinning", rating: 5, foto: "", texto: "Me encantó que dejara todo por escrito en la orden de servicio. Transparencia total y trato de una persona real, no un call center." },
  ],

  faqs: [
    { q: "¿Cuánto cuesta el servicio?", a: "Cada equipo y cada falla es distinta, así que la cotización es personalizada. Al enviar tu solicitud te doy el precio exacto por WhatsApp, sin costo ni compromiso." },
    { q: "¿Tengo que llevar la máquina a un taller?", a: "No. Voy a tu domicilio en Ibagué y municipios cercanos, sin que tengas que desmontar ni transportar el equipo. La reviso donde está." },
    { q: "¿Debo pagar por adelantado?", a: "No. Primero te doy la cotización por WhatsApp; pagas cuando el trabajo está hecho y tu máquina funciona." },
    { q: "¿Atienden todas las marcas?", a: "Sí, atiendo tu equipo sin importar la marca, sea nacional o importado." },
    { q: "¿Hacen instalación de máquinas nuevas?", a: "Sí. También armo e instalo equipos nuevos y los dejo listos para usar, con explicación de uso y cuidados." },
    { q: "¿Cuánto tarda un mantenimiento?", a: "Un mantenimiento preventivo estándar toma entre 45 y 90 minutos según el estado y el tipo de máquina." },
    { q: "¿Cómo confirmo mi cita?", a: "Al enviar el formulario se abre WhatsApp con tu orden de servicio prellenada. Solo la envías y te confirmo disponibilidad." },
    { q: "¿Dan garantía?", a: "Sí: 30 días de garantía sobre la mano de obra de cada reparación. Todo queda registrado en tu orden de servicio." },
  ],

  redes: { instagram: "", facebook: "", tiktok: "" },
};

export type Config = typeof config;
