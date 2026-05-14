/**
 * ══════════════════════════════════════════════════════
 *  El Expreso Carmesí — Base de Datos del Juego
 *  data.js  —  Edita este archivo para cambiar contenido
 *
 *  Contiene: personajes, locaciones, armas,
 *            preguntas de interrogatorio (estilo Reigns)
 *            e historias finales.
 * ══════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────
//  PERSONAJES  (5 sospechosos)
// ─────────────────────────────────────────────────────
const CHARS = [
  {
    id:    'vivienne',
    name:  'Condesa Vivienne Moreau',
    role:  'Aristócrata de Monte Carlo',
    color: '#5C0A14',
    emoji: '<i class="fa-solid fa-crown"></i>',
    symbol:'♛',
    motive:'Deudas de juego — £400.000',

    culprit_clues: [
      'Fragmentos de perlas rosas del collar de la Condesa Moreau fueron hallados a centímetros del cadáver.',
      'El perfume «Nuit de Paris», exclusivo de Moreau, impregnaba el lugar del crimen con inusual intensidad.',
      'Lord Blackwood guardaba cartas de Monte Carlo: cuatrocientas mil libras a su nombre, vencidas.',
      'Un mozo la vio abandonar precipitadamente la escena del crimen minutos antes de la medianoche.',
    ],

    story_title: 'La Deuda de Terciopelo',
    story: (weapon, room) =>
      `"Lord Blackwood conocía cada céntimo de mis deudas —cuatrocientas mil libras enterradas bajo capas ` +
      `de mentiras y diamantes prestados. Esa noche me entregó una nota: <em>pagas mañana en Viena o tu ` +
      `marido sabrá todo antes de desayunar.</em> Me llamó al ${room}. Tomé ${weapon}. No de entre mis cosas ` +
      `—lo encontré allí, por azar, o quizás por destino. Mis manos no temblaron. Soy una Moreau. ` +
      `Sobrevivimos guerras, revoluciones y ruinas. Un chantajista más no iba a ser la excepción."`,

    interrogation: {
      q_left:  '¿Dónde estuvo entre las 11 PM y la medianoche?',
      q_right: '¿Tenía alguna deuda pendiente con Lord Blackwood?',

      answer_left_guilty:
        '«En mi compartimento con mi doncella. Una velada completamente tranquila. No salí ni un instante.»',
      answer_left_innocent:
        '«Estuve con el Coronel Hargrove en el salón de té hasta las 23:30. Pregunte al Coronel, él lo confirma.»',
      answer_right_guilty:
        '«Tuvimos algunas transacciones comerciales. Asuntos completamente bajo control, Detective.»',
      answer_right_innocent:
        '«Una deuda de juego, ya saldada. Pero Blackwood guardaba secretos de más de uno en este tren. Especialmente de Emilio Vega.»',

      clue_left_guilty:   { text: 'La doncella de la Condesa no la vio durante al menos 90 minutos esa noche —su coartada se derrumba.', tag: 'suspect' },
      clue_left_innocent: null,
      clue_right_guilty:  { text: 'La Condesa evitó la cifra exacta: £400.000 en documentos hallados la comprometen directamente.', tag: 'suspect' },
      clue_right_innocent:{ text: 'La Condesa menciona a Emilio Vega —el marchante tenía un trato secreto con la víctima por £50.000.', tag: 'suspect' },
    },
  },

  {
    id:    'fenwick',
    name:  'Dr. Aldous Fenwick',
    role:  'Médico Forense en retiro',
    color: '#0A2C2C',
    emoji: '<i class="fa-solid fa-stethoscope"></i>',
    symbol:'✚',
    motive:'Expediente 1918 — chantaje médico sobre experimentos ilegales',

    culprit_clues: [
      'La firma del Dr. Fenwick aparece en el expediente «Experimentos No Autorizados, Bélgica, 1918» que Blackwood guardaba.',
      'Fenwick admitió haber visitado el camarote de Blackwood a las 22:00 —la última visita registrada antes del crimen.',
      'Su estuche médico presentaba el inventario alterado: faltan 40 mg de digitalina sin justificación clínica.',
      'Rastros microscópicos de guantes de látex quirúrgico fueron identificados en las manos de la víctima.',
    ],

    story_title: 'El Expediente 1918',
    story: (weapon, room) =>
      `"Blackwood guardaba un expediente —Experimentos No Autorizados, Hospital de Campaña 14, Bélgica, 1918— ` +
      `con mi nombre firmando cada página. Cincuenta y tres pacientes. Siete sobrevivientes. Yo tenía razones ` +
      `científicas. Él tenía razones para hundirme. Lo cité en el ${room}. <em>Los médicos sabemos exactamente ` +
      `cómo matar sin ruido ni escándalo innecesario.</em> Usé ${weapon} —un instrumento prestado por las ` +
      `circunstancias, no el mío propio. La ciencia avanza con sacrificios. Blackwood fue parte de la factura."`,

    interrogation: {
      q_left:  '¿Cuándo fue la última vez que vio a Lord Blackwood con vida?',
      q_right: '¿Tenía acceso a sustancias venenosas en su maletín médico?',

      answer_left_guilty:
        '«Durante la cena. Intercambiamos algunas palabras sobre su salud. Me retiré temprano, los viajes me fatigan.»',
      answer_left_innocent:
        '«Lo atendí en su compartimento a las 22:00 —una queja cardiaca leve. Al irme estaba perfectamente.»',
      answer_right_guilty:
        '«Todo médico lleva medicamentos controlados. Es mi obligación profesional. Nada fuera de lo ordinario.»',
      answer_right_innocent:
        '«Sí, digitalina y morfina, debidamente registradas. Pero le cuento algo: el Coronel Hargrove tenía un expediente que Blackwood iba a entregar al Tribunal de La Haya mañana.»',

      clue_left_guilty:   { text: 'El registro del tren muestra que Fenwick ingresó al vagón de Blackwood a las 23:15 —hora que no menciona.', tag: 'suspect' },
      clue_left_innocent: null,
      clue_right_guilty:  { text: 'Evasivo sobre el inventario: el frasco de digitalina aparece en su lista pero faltan 40 mg sin justificación.', tag: 'weapon'  },
      clue_right_innocent:{ text: 'El Dr. Fenwick menciona que Blackwood iba a entregar documentos al Tribunal —motivo del Coronel Hargrove.', tag: 'suspect' },
    },
  },

  {
    id:    'celeste',
    name:  'Celeste Noir',
    role:  'Cantante de Jazz del Blue Velvet',
    color: '#1C0A30',
    emoji: '<i class="fa-solid fa-masks-theater"></i>',
    symbol:'♪',
    motive:'Identidad robada por Blackwood hace 15 años',

    culprit_clues: [
      'Lentejuelas doradas de su vestido de actuación fueron halladas junto al cuerpo de Blackwood.',
      'Una nota con el nombre «Marie Beaumont» —su identidad real— fue encontrada en el bolsillo de la víctima.',
      'Alguien con marcado acento francés fue escuchado discutiendo con Blackwood a las 23:30 por dos testigos.',
      'El lápiz labial «Rouge Nuit» —exclusivo de Celeste— manchó la solapa de la víctima durante el forcejeo.',
    ],

    story_title: 'El Nombre Robado',
    story: (weapon, room) =>
      `"Mi nombre real es Marie Beaumont. Lord Blackwood falsificó documentos en 1922 para robarme mi herencia, ` +
      `mi apellido y mi vida. Quince años cantando en cabarets para sobrevivir mientras él vivía de lo mío. ` +
      `Lo encontré por casualidad en la lista de pasajeros. <em>El destino tiene un sentido del humor oscuro, ` +
      `Detective.</em> Lo cité en el ${room}. Encontré ${weapon} allí —no era mío, pero lo fue en ese instante. ` +
      `Con él recuperé lo único que me quedaba: la dignidad."`,

    interrogation: {
      q_left:  '¿Dónde estaba cuando terminó su actuación a las 23:00?',
      q_right: '¿Conocía a Lord Blackwood de antes de este viaje?',

      answer_left_guilty:
        '«Me retiré sola a mi camarote. Estaba agotada. El escenario consume mucho. Monsieur Lacroix... se marchó antes.»',
      answer_left_innocent:
        '«Monsieur Lacroix me acompañó hasta la puerta de mi camarote. Conversamos unos minutos en el pasillo.»',
      answer_right_guilty:
        '«No. Lo vi por primera vez en este tren. Un hombre correcto, nada más. Su muerte me resulta... perturbadora.»',
      answer_right_innocent:
        '«Superficialmente. Compartimos una gala en París. Le cuento: Blackwood llevaba documentos con el nombre «Marie Beaumont». Nunca supe por qué.»',

      clue_left_guilty:   { text: 'Lacroix declara que Celeste le pidió que se fuera antes —25 minutos sin coartada verificada.', tag: 'suspect' },
      clue_left_innocent: null,
      clue_right_guilty:  { text: 'Contradicción: el encargado del andén de París los vio discutir acaloradamente antes de embarcar.', tag: 'suspect' },
      clue_right_innocent:{ text: 'Celeste menciona el nombre «Marie Beaumont» —identidad con vínculo directo a los documentos de la víctima.', tag: 'suspect' },
    },
  },

  {
    id:    'hargrove',
    name:  'Coronel R. Hargrove',
    role:  'Militar retirado, Regimiento 14',
    color: '#0A1830',
    emoji: '<i class="fa-solid fa-medal"></i>',
    symbol:'★',
    motive:'Crímenes de guerra — documentos para el Tribunal de La Haya',

    culprit_clues: [
      'Botones con la insignia del Regimiento 14 fueron hallados directamente en la escena del crimen.',
      'Las heridas en Blackwood son consistentes con técnicas de combate cuerpo a cuerpo de entrenamiento militar.',
      'Una nota codificada con el sello «Regimiento 14, Bélgica, 1918» fue hallada en el bolsillo del Coronel.',
      'El libro de a bordo registra una reunión privada entre Hargrove y Blackwood a las 22:45 que el Coronel omite.',
    ],

    story_title: 'La Orden de Fusilamiento',
    story: (weapon, room) =>
      `"En noviembre de 1918 ordené fusilar a dieciséis prisioneros sin juicio previo. Decisión táctica. ` +
      `Blackwood era el único testigo civil que conservaba la documentación original con mi firma. ` +
      `Mañana en Viena iba a entregarla al Tribunal Internacional. <em>Cuarenta años de carrera militar ` +
      `destruidos por un cobarde con un archivador.</em> En el ${room}, encontré ${weapon} a mi alcance ` +
      `—no recuerdo si era mío o de alguien más. En el campo aprendes a usar lo que tienes. ` +
      `Tomé la única decisión que un soldado puede tomar: neutralizar la amenaza."`,

    interrogation: {
      q_left:  '¿Tuvo alguna reunión privada con Blackwood durante el viaje?',
      q_right: '¿Qué clase de relación tenía con la víctima antes de este tren?',

      answer_left_guilty:
        '«Una breve conversación durante la cena. Asuntos de inversión sin importancia. Nada más que añadir.»',
      answer_left_innocent:
        '«Sí, hablamos sobre un tema de negocios hasta cerca de las 23:00. Terminó amistosamente.»',
      answer_right_guilty:
        '«Nos conocíamos de reuniones empresariales. Una relación puramente profesional.»',
      answer_right_innocent:
        '«Conocimos en 1918, en Bélgica. Le digo algo fuera de protocolo: Celeste Noir no es quien aparenta. Blackwood guardaba algo sobre su nombre verdadero.»',

      clue_left_guilty:   { text: 'El libro de a bordo registra la reunión a las 22:45 —el Coronel la omite deliberadamente en su relato.', tag: 'suspect' },
      clue_left_innocent: null,
      clue_right_guilty:  { text: 'Su expediente militar tiene tres incidentes de uso excesivo de fuerza archivados bajo secreto de Estado.', tag: 'suspect' },
      clue_right_innocent:{ text: 'Hargrove menciona que Blackwood tenía información sobre el nombre real de Celeste Noir —pista clave.', tag: 'suspect' },
    },
  },

  {
    id:    'vega',
    name:  'Emilio Vega',
    role:  'Marchante de Arte, Galería Vega París',
    color: '#0A2010',
    emoji: '<i class="fa-solid fa-palette"></i>',
    symbol:'◆',
    motive:'Arte falsificado — £50.000 y toda su reputación',

    culprit_clues: [
      'Rastros de laca carmesí para sellar correspondencia —marca exclusiva de Vega Gallery— fueron hallados en la escena.',
      'Un recibo por £50.000 a nombre de «Vega Gallery, París» fue encontrado arrugado junto al cuerpo.',
      'El inconfundible barniz de pintura al óleo impregnaba la ropa de la víctima tras contacto prolongado.',
      'El sello de cera de una galería inexistente fue descubierto bajo la alfombra junto al cadáver.',
    ],

    story_title: 'El Cuadro Maldito',
    story: (weapon, room) =>
      `"El Picasso que vendí a Blackwood era perfecto —mi obra maestra técnica: cincuenta mil libras de genio ` +
      `sobre lienzo envejecido artificialmente. Lo descubrió, investigó, y encontró once transacciones más. ` +
      `Mi galería, mi reputación, veinte años de trabajo. Todo. <em>Un hombre que comercia con belleza ` +
      `no puede permitir que lo despojen de todo lo que construyó.</em> Lo invité al ${room}. ` +
      `${weapon} estaba allí —no era mío esa noche, pero lo usé como si lo fuera. ` +
      `Las obras más valiosas son aquellas por las que alguien estuvo dispuesto a pagar cualquier precio."`,

    interrogation: {
      q_left:  '¿Qué tipo de negocios tenía con la víctima?',
      q_right: '¿Sabe si Blackwood tenía enemigos a bordo de este tren?',

      answer_left_guilty:
        '«Una transacción de arte. Un Picasso de colección privada. Todo completamente legítimo.»',
      answer_left_innocent:
        '«Le vendí tres piezas para su residencia londinense. Todo con factura y certificado de autenticidad.»',
      answer_right_guilty:
        '«Ninguno que yo conozca. Lord Blackwood era un caballero respetado por todos.»',
      answer_right_innocent:
        '«Blackwood hacía preguntas incómodas. La Condesa Moreau tenía razones muy poderosas para desear su silencio. Deudas imposibles de saldar.»',

      clue_left_guilty:   { text: 'Evita mencionar el monto: el recibo de £50.000 hallado contradice su versión de «transacción menor».', tag: 'weapon'  },
      clue_left_innocent: null,
      clue_right_guilty:  { text: 'Vega evita el contacto visual durante toda su respuesta —señal de mentiroso bajo presión.', tag: 'suspect' },
      clue_right_innocent:{ text: 'Vega menciona las «deudas imposibles» de la Condesa Moreau —corrobora el motivo de Monte Carlo.', tag: 'suspect' },
    },
  },
];

// ─────────────────────────────────────────────────────
//  LOCACIONES  (5 vagones / áreas del tren)
// ─────────────────────────────────────────────────────
const LOCATIONS = [
  {
    id:    'comedor',
    name:  'Vagón Comedor',
    sub:   'Lugar del descubrimiento',
    icon:  '<i class="fa-solid fa-wine-glass"></i>',
    color: '#2A0808',
    desc:
      'El elegante vagón donde se sirven las cenas de gala. Candelabros de plata, manteles blancos ' +
      'impecables y el olor persistente a vino de Burdeos. Los asientos de terciopelo carmesí guardan ' +
      'los secretos de la última noche de Lord Blackwood.',
    clues: [
      { text: 'El reloj de pared del Vagón Comedor fue detenido a las 23:47 —hora exacta de la muerte, según el forense.', tag: 'location' },
      { text: 'Manchas de sangre disimuladas bajo el mantel de la tercera mesa fueron encontradas por el personal de limpieza.', tag: 'location' },
      { text: 'Las marcas de arrastre comienzan en el rincón norte del Vagón Comedor y se dirigen al pasillo de primera clase.', tag: 'location' },
    ],
  },
  {
    id:    'primera',
    name:  'Compartimento A-7',
    sub:   'Primera clase — reservado por la víctima',
    icon:  '<i class="fa-solid fa-gem"></i>',
    color: '#08142A',
    desc:
      'El compartimento más lujoso del Expreso. Paredes de damasco azul, ventana panorámica y bar privado. ' +
      'Lord Blackwood lo reservó exclusivamente para reuniones confidenciales durante el viaje.',
    clues: [
      { text: 'El Compartimento A-7 tenía la cerradura forzada desde dentro —señal inequívoca de lucha violenta entre dos personas.', tag: 'location' },
      { text: 'Un espejo veneciano roto en el A-7 revela marcas de forcejeo contra la pared —la víctima se defendió.', tag: 'location' },
      { text: 'La alfombra persa del Compartimento A-7 muestra manchas de sangre tipo A+ —grupo del pasajero Blackwood.', tag: 'location' },
    ],
  },
  {
    id:    'bar',
    name:  'Vagón Bar & Salón',
    sub:   'Jazz, ginebra y confesiones peligrosas',
    icon:  '<i class="fa-solid fa-martini-glass-citrus"></i>',
    color: '#1A0A2C',
    desc:
      'Donde el jazz suena hasta las dos de la madrugada. Cuero negro, lámparas art déco y el ruido ' +
      'del hielo en los vasos. El lugar perfecto para hacer y deshacer vidas sin que nadie lo note.',
    clues: [
      { text: 'Un vaso con huellas deliberadamente borradas fue hallado en el Vagón Bar junto a una mancha de labial carmesí.', tag: 'location' },
      { text: 'El barman reportó que alguien subió el gramófono al máximo hacia las 23:45 —para cubrir ruidos del pasillo contiguo.', tag: 'location' },
      { text: 'Rastros de sangre en el taburete más alejado del Vagón Bar coinciden con el grupo sanguíneo de la víctima.', tag: 'location' },
    ],
  },
  {
    id:    'maquinas',
    name:  'Sala de Máquinas',
    sub:   'Acceso restringido — cerradura forzada esa noche',
    icon:  '<i class="fa-solid fa-gears"></i>',
    color: '#0A1808',
    desc:
      'El corazón palpitante del tren. Calor sofocante, el estruendo de los pistones y grasa de carbón ' +
      'en cada superficie. Solo el personal autorizado tiene acceso, pero la cerradura fue forzada esa noche.',
    clues: [
      { text: 'Un botón de marfil —de ropa de alta costura, no de uniforme— fue encontrado entre los engranajes de la Sala de Máquinas.', tag: 'location' },
      { text: 'El maquinista reportó huellas de zapatos de cuero fino en el aceite —alguien completamente ajeno al personal técnico.', tag: 'location' },
      { text: 'La puerta trasera de la Sala de Máquinas fue abierta ilegalmente entre las 23:30 y la medianoche, según el registro de temperatura.', tag: 'location' },
    ],
  },
  {
    id:    'equipaje',
    name:  'Vagón de Equipaje',
    sub:   'Oscuro, olvidado y perfecto para un secreto',
    icon:  '<i class="fa-solid fa-suitcase"></i>',
    color: '#1A0E08',
    desc:
      'Baúles apilados hasta el techo, maletas atadas con cuerdas y una oscuridad casi perfecta. ' +
      'El ruido del tren ahoga cualquier grito. Nadie viene aquí hasta llegar a destino. ' +
      'El lugar ideal para esconder lo que no debe encontrarse.',
    clues: [
      { text: 'El baúl personal de Blackwood en el Vagón de Equipaje fue forzado y vaciado de todos sus documentos confidenciales.', tag: 'location' },
      { text: 'Marcas de sangre fresca en el sector trasero del Vagón de Equipaje confirman actividad criminal en la zona durante la madrugada.', tag: 'location' },
      { text: 'Un guante negro de cabritilla —talla pequeña, costura francesa— fue hallado oculto entre las maletas del fondo.', tag: 'location' },
    ],
  },
];

// ─────────────────────────────────────────────────────
//  ARMAS  (5 objetos vinculados a cada sospechoso)
//
//  DISEÑO NARRATIVO:
//  · Cada objeto pertenece simbólicamente a un sospechoso.
//  · El arma asesina NO necesariamente la usó su dueño.
//  · El culpable pudo tomarla prestada, robarla o
//    encontrarla en el lugar del crimen.
//  · Todas tienen una explicación inocente para las manchas.
// ─────────────────────────────────────────────────────
const WEAPONS = [

  {
    id:         'frasco',
    owner_id:   'vivienne',
    owner_name: 'la Condesa Moreau',
    name:       'El Frasco de Cristal Bohemio',
    icon:       '<i class="fa-solid fa-flask"></i>',
    sound:      'frasco',
    description:
      'Frasco de cristal tallado a mano con el monograma «VM» grabado en plata. ' +
      'Accesorio personal de la Condesa —nunca sale de gira sin él. ' +
      'Hallado volcado junto al cuerpo, con residuo oscuro en el interior.',
    innocent_reason:
      '«El Chateau Pétrus de 1921 tiene un negro-carmesí perfectamente natural. ' +
      'El tanino tiñe cualquier cristal de forma permanente. ' +
      'No es sangre, Detective, es buen vino envejecido durante veinte años.»',
    // Estas pistas aparecen SOLO si este es el arma asesina.
    // Son forenses pero no nombran el arma directamente.
    clues: [
      { text: 'El sistema digestivo de Blackwood presentó arsénico blanco en dosis letales —ingesta en las últimas 2 horas de vida.', tag: 'weapon' },
      { text: 'El residuo del frasco hallado junto al cadáver no distingue entre Bordeaux envejecido y un agente orgánico disolvente.', tag: 'weapon' },
    ],
  },

  {
    id:         'estuche',
    owner_id:   'fenwick',
    owner_name: 'el Dr. Fenwick',
    name:       'El Estuche de Bisturí',
    icon:       '<i class="fa-solid fa-suitcase-medical"></i>',
    sound:      'estuche',
    description:
      'Estuche de cuero negro con iniciales «A.F.» grabadas en plata. ' +
      'Contiene instrumental quirúrgico de precisión: bisturís, jeringas hipodérmicas ' +
      'y frascos de medicamentos controlados. Hallado abierto bajo la mesa del comedor.',
    innocent_reason:
      '«Traté una arritmia severa al pasajero del camarote 12 esa misma tarde. ' +
      'La digitalina en la jeringa es completamente estándar para ese diagnóstico. ' +
      'El estuche se extravió antes de medianoche —cualquiera pudo tomarlo.»',
    clues: [
      { text: 'Una herida puntiforme de 2mm en el cuello izquierdo de Blackwood —perfectamente compatible con aguja hipodérmica de calibre 20.', tag: 'weapon' },
      { text: 'La jeringa hallada bajo la mesa contenía restos de digitalina en concentración tres veces superior a la dosis terapéutica máxima.', tag: 'weapon' },
    ],
  },

  {
    id:         'baston',
    owner_id:   'hargrove',
    owner_name: 'el Coronel Hargrove',
    name:       'El Bastón de Ébano',
    icon:       '<i class="fa-solid fa-crutch"></i>',
    sound:      'baston',
    description:
      'Bastón de ébano con empuñadura de plata maciza —casi un kilo de metal sólido. ' +
      'Regalo de Su Majestad por 30 años de servicio al Imperio Británico. ' +
      'Hallado en el corredor de primera clase con la empuñadura parcialmente limpiada.',
    innocent_reason:
      '«Llevo ese bastón desde la batalla del Marne, 1914. ' +
      'Las manchas oscuras en la plata son óxido de la vaina de mi sable de campaña, ' +
      'guardada junto al bastón durante décadas. Lo dejé en el comedor al terminar de cenar.»',
    clues: [
      { text: 'La fractura occipital del cráneo de Blackwood fue causada por impacto de objeto cilíndrico de alta densidad —diámetro aproximado 4 cm.', tag: 'weapon' },
      { text: 'La empuñadura de plata presentaba material biológico incrustado bajo el grabado —limpiado con urgencia y sin agua suficiente.', tag: 'weapon' },
    ],
  },

  {
    id:         'cortapapeles',
    owner_id:   'vega',
    owner_name: 'Emilio Vega',
    name:       'El Cortapapeles Florentino',
    icon:       '<i class="fa-solid fa-pen-nib"></i>',
    sound:      'cortapapeles',
    description:
      'Cortapapeles de plata del siglo XVIII con hoja de doble filo y grabados florales período Médici. ' +
      'Vega lo usa para sellar su correspondencia comercial con laca carmesí. ' +
      'De valor estimado en £2.000. Hallado bajo la alfombra del vagón comedor.',
    innocent_reason:
      '«La laca carmesí es mi sello personal —veinte años sellando contratos con cera roja. ' +
      'Ese rojo en la hoja es laca de sellar, no sangre. Mándelo analizar si quiere. ' +
      'Verá que tengo razón. Lo que le cueste el análisis, se lo descuento de su sueldo.»',
    clues: [
      { text: 'Blackwood presentó una herida de 8cm en el costado derecho —hoja ornamentada de doble filo con patrón de entrada consistente con pieza ceremonial.', tag: 'weapon' },
      { text: 'El cortapapeles hallado bajo la alfombra tenía grabados del período Médici y una mancha que el luminol confirmó como sangre humana tipo A+.', tag: 'weapon' },
    ],
  },

  {
    id:         'panuelo',
    owner_id:   'celeste',
    owner_name: 'Celeste Noir',
    name:       'El Pañuelo de Seda Violeta',
    icon:       '<i class="fa-solid fa-ribbon"></i>',
    sound:      'panuelo',
    description:
      'Pañuelo de seda pura en violeta profundo —accesorio característico de Celeste Noir ' +
      'en su número de cierre. Encontrado bajo el asiento del vagón bar ' +
      'con marcas de tensión extrema en las fibras y residuos de carmín labial.',
    innocent_reason:
      '«Rouge Nuit es mi color de firma. Ese pañuelo lleva carmín porque lo uso en escena ' +
      'para mis gestos dramáticos del final. Lo dejé en el salón al terminar la actuación. ' +
      'Cualquier pasajero pudo tomarlo de la silla. No es evidencia, es maquillaje.»',
    clues: [
      { text: 'Las marcas de estrangulación en el cuello de Blackwood corresponden a fibras de seda pura —grosor 2.5mm, color violeta.', tag: 'weapon' },
      { text: 'El pañuelo de seda violeta hallado bajo el asiento presentaba fibras dérmicas incrustadas en el tejido, consistentes con estrangulación sostenida.', tag: 'weapon' },
    ],
  },
];

// ─────────────────────────────────────────────────────
//  PISTAS FALSAS  (red herrings — una por sospechoso)
//  Se distribuyen aleatoriamente entre las locaciones.
// ─────────────────────────────────────────────────────
const RED_HERRINGS = {
  vivienne: { text: 'La Condesa discutió acaloradamente con Blackwood durante la cena sobre «un asunto de honor» —visto por el sumiller.', tag: 'suspect' },
  fenwick:  { text: 'El Dr. Fenwick fue visto saliendo del camarote de Blackwood a las 22:00 con su maletín médico abierto.', tag: 'suspect' },
  celeste:  { text: 'Un pasajero vio a «una mujer con vestido de lentejuelas» salir corriendo del pasillo de primera clase a las 23:50.', tag: 'suspect' },
  hargrove: { text: 'El Coronel y Blackwood tuvieron una discusión tensa visible en el pasillo del vagón 2 a las 21:30.', tag: 'suspect' },
  vega:     { text: 'Emilio Vega intentó a último momento cambiar su billete por el compartimento adjunto al de Blackwood.', tag: 'suspect' },
};

// ─────────────────────────────────────────────────────────────────────
//  MAZO DE INTERROGATORIO  (3 cartas por sospechoso)
//
//  Cada carta tiene 2 opciones (izquierda / derecha).
//  Una opción es CORRECTA para la psicología del personaje.
//  La otra es INCORRECTA (lo cierra o lo pone a la defensiva).
//
//  type: 'pregunta' | 'comentario' | 'halago' | 'presion' | 'tactica'
//  correct: 'left' | 'right'   ← la dirección que abre al personaje
//  clue: pista bonus que SOLO se desbloquea si el jugador lo acierta
//         en la ronda final (2/3 o 3/3 correctas)
// ─────────────────────────────────────────────────────────────────────
const INTERROGATION_DECKS = {

// ── VIVIENNE — aristócrata orgullosa ──
  vivienne: {
    bonus_clue: {
      text: 'La Condesa, sintiéndose comprendida, revela que vio luz encendida en el camarote de Blackwood a las 2:00 AM.',
      tag: 'suspect'
    },
    penalty_clue: {
      text: 'La Condesa, ofendida, insinúa que Fenwick salió de su camarote a medianoche.',
      tag: 'suspect',
      is_false: true
    },
    cards: [
      { // Mantenemos derecha
        id: 'v1', type: 'acercamiento', label: '① Apertura',
        context: 'Madame Moreau la observa fijamente mientras usted elige cómo iniciar la conversación.',
        left_text:  '← Abordarla directamente sobre su paradero esa noche',
        right_text: 'Elogiar su compostura en estas circunstancias →',
        left_label:  'Preguntar', right_label: 'Halagar', correct: 'right',
        left_response:  '«¿Disculpe? Yo no respondo a ese tono, Detective.»',
        right_response: '«Es usted perceptivo. Sí, intento mantener la calma...»',
      },
      { // Cambiamos a izquierda
        id: 'v2', type: 'tactica', label: '② Estrategia',
        context: 'La Condesa comienza a hablar. Usted elige el ángulo para profundizar.',
        left_text:  '← Comentar que entiende los compromisos de su posición',
        right_text: 'Preguntarle directamente sobre su deuda con Blackwood →',
        left_label:  'Empatizar', right_label: 'Confrontar', correct: 'left',
        left_response:  '«Exactamente. Reginald exigía pagos como si fuéramos tenderos.»',
        right_response: '«Mis finanzas son absolutamente privadas. No pienso discutirlas.»',
      },
      { // Mantenemos derecha
        id: 'v3', type: 'presion', label: '③ Cierre',
        context: 'La Condesa está más relajada. Es el momento de presionar o proteger.',
        left_text:  '← «Necesito la verdad absoluta. La justicia no tiene clase social.»',
        right_text: '«Solo quiero asegurarme de que su nombre quede limpio.» →',
        left_label:  'Presionar', right_label: 'Proteger', correct: 'right',
        left_response:  '«La clase social es exactamente lo que me separa de un sospechoso. Buenos días.»',
        right_response: '«En ese caso... hay algo que quizás debería saber sobre esa noche.»',
      },
    ],
  },

  // ── FENWICK — médico racional ──
  fenwick: {
    bonus_clue: {
      text: 'Fenwick admite haber notado síntomas de envenenamiento en Blackwood durante la cena.',
      tag: 'weapon'
    },
    penalty_clue: {
      text: 'El Doctor insiste en que vio a Celeste Noir bajando de primera clase.',
      tag: 'suspect',
      is_false: true
    },
    cards: [
      { // Cambiamos a izquierda
        id: 'f1', type: 'respeto', label: '① Apertura',
        context: 'El Doctor revisa sus notas con indiferencia aparente.',
        left_text:  '← Pedirle su opinión profesional sobre la causa de muerte',
        right_text: 'Preguntarle por su relación personal con la víctima →',
        left_label:  'Profesional', right_label: 'Personal', correct: 'left',
        left_response:  '«Alguien que hace las preguntas correctas. La muerte no fue natural.»',
        right_response: '«La relación médico-paciente es confidencial, incluso post mortem.»',
      },
      { // Mantenemos derecha
        id: 'f2', type: 'tecnica', label: '② Estrategia',
        context: 'El Doctor está hablando. Puede usar lenguaje técnico o emocional.',
        left_text:  '← Mencionar que la familia está destrozada emocionalmente',
        right_text: 'Preguntarle su hipótesis sobre el vector del veneno →',
        left_label:  'Emocionar', right_label: 'Análisis', correct: 'right',
        left_response:  '«La emoción no tiene lugar en la medicina. ¿Tiene preguntas concretas?»',
        right_response: '«Oral o intravenoso. Por los síntomas, diría oral, en el vino.»',
      },
      { // Mantenemos izquierda (ya estaba así)
        id: 'f3', type: 'etica', label: '③ Cierre',
        context: 'El momento de la verdad. ¿Apela a su ética o a su orgullo?',
        left_text:  '← «Su ética médica le impide guardar silencio ante un asesinato.»',
        right_text: '«Solo su gran intelecto podría identificar al responsable.» →',
        left_label:  'Ética', right_label: 'Orgullo', correct: 'left',
        left_response:  '«Tiene razón. El juramento hipocrático no termina con la muerte.»',
        right_response: '«Lisonjearme no le llevará a ningún lado, Detective. Soy científico.»',
      },
    ],
  },

// ── CELESTE — artista apasionada, se abre con admiración y validación ──
  celeste: {
    bonus_clue: {
      text: 'Celeste, sintiéndose finalmente escuchada, revela que Blackwood recibió una nota anónima a bordo del tren esa tarde.',
      tag: 'location',
      confidence: 'alta' // Asumiendo que ya añadiste esta propiedad
    },
    penalty_clue: {
      text: 'Celeste, herida por el interrogatorio frío, alega haber visto al Coronel Hargrove forcejear con Blackwood.',
      tag: 'suspect',
      is_false: true
    },
    cards: [
      { // Cambiado a Izquierda
        id: 'c1', type: 'admiracion', label: '① Apertura',
        context: 'Celeste mira por la ventana del tren, distante. Usted elige cómo acercarse.',
        left_text:  '← Mencionar que su actuación de anoche fue extraordinaria',
        right_text: 'Preguntarle si conocía a Blackwood antes de este viaje →',
        left_label:  'Admiración', right_label: 'Directo', correct: 'left',
        left_response:  '«Gracias. Cantar en estas circunstancias fue lo más difícil de mi vida. Hay cosas que me pesan esta mañana.»',
        right_response: '«Esa pregunta es demasiado fría para este momento, Detective.»',
      },
      { // Mantenido a Derecha
        id: 'c2', type: 'injusticia', label: '② Estrategia',
        context: 'Celeste habla. Usted puede validar su historia o cuestionarla.',
        left_text:  '← «Entiendo que su relación con Blackwood era... complicada.»',
        right_text: 'Decirle que lo que Blackwood hizo con su identidad fue imperdonable →',
        left_label:  'Neutro', right_label: 'Validar', correct: 'right',
        left_response:  '«"Complicada" es una palabra muy pequeña para lo que viví durante quince años.»',
        right_response: '«¡Exactamente! Quince años. Y nadie lo sabía. Nadie me creyó cuando lo intenté denunciar.»',
      },
      { // Cambiado a Izquierda
        id: 'c3', type: 'confesion', label: '③ Cierre',
        context: 'Celeste está al borde de revelar algo. ¿Cómo la conduce?',
        left_text:  '← «¿Hay alguien más en este tren que supiera lo que Blackwood le hacía?»',
        right_text: '«¿Fue usted quien lo confrontó esa noche?» →',
        left_label:  'Ampliar', right_label: 'Acusar', correct: 'left',
        left_response:  '«Sí. Al menos dos personas a bordo sabían exactamente quién era él. No solo yo.»',
        right_response: '«No voy a responder eso sin un abogado presente.»',
      },
    ],
  },

  // ── HARGROVE — militar, responde a jerarquía, disciplina y franqueza ──
  hargrove: {
    bonus_clue: {
      text: 'El Coronel confirma haber escuchado pasos bajando hacia la bodega a las 2:30 AM —pasos de alguien que llevaba tacones.',
      tag: 'location',
      confidence: 'alta'
    },
    penalty_clue: {
      text: 'El Coronel, molesto, declara que Emilio Vega tenía una botella sin etiqueta durante la cena.',
      tag: 'weapon',
      is_false: true
    },
    cards: [
      { // Cambiado a Izquierda
        id: 'h1', type: 'respeto', label: '① Apertura',
        context: 'El Coronel está de pie, la espalda recta. Usted elige el tono.',
        left_text:  '← Presentarse formalmente y pedir permiso para continuar',
        right_text: 'Sentarse sin pedir permiso y empezar a hablar casualmente →',
        left_label:  'Protocolo', right_label: 'Informal', correct: 'left',
        left_response:  '«Correcto. Un hombre con protocolo. Siéntese. Tengo diez minutos.»',
        right_response: '«La informalidad no impresiona a quienes han servido al Imperio durante cuarenta años, Detective.»',
      },
      { // Mantenido a Derecha
        id: 'h2', type: 'franqueza', label: '② Estrategia',
        context: 'El Coronel espera. Usted elige qué preguntar directamente.',
        left_text:  '← Preguntarle cómo se sentía emocionalmente ante la muerte',
        right_text: 'Pedirle que detalle sus movimientos exactos entre las 22:00 y las 02:00 →',
        left_label:  'Emocional', right_label: 'Operativo', correct: 'right',
        left_response:  '«Los sentimientos no son relevantes para una investigación. Haga preguntas pertinentes.»',
        right_response: '«Eso es lo correcto. 22:00, cena. 23:10, mi camarote. 00:30, escuché algo. Me levanté a las 01:00.»',
      },
      { // Cambiado a Izquierda
        id: 'h3', type: 'honor', label: '③ Cierre',
        context: 'El Coronel revela que "escuchó algo". Usted decide cómo cerrarlo.',
        left_text:  '← «Un hombre con su historial no dudaría en reportar lo que sabe, General.»',
        right_text: '«¿Por qué no reportó eso de inmediato? Eso es muy sospechoso.» →',
        left_label:  'Honor', right_label: 'Acusar', correct: 'left',
        left_response:  '«Tiene razón. Mi silencio fue un error. Lo que escuché eran pasos con tacones, bajando hacia la bodega.»',
        right_response: '«Esta conversación ha terminado.»',
      },
    ],
  },

  // ── VEGA — marchante astuto, responde a adulación intelectual y ego ──
  vega: {
    bonus_clue: {
      text: 'Vega, revelando su posición sin darse cuenta, confiesa que estuvo en la bodega a las 23:30 "solo para admirar los vinos".',
      tag: 'suspect',
      confidence: 'alta'
    },
    penalty_clue: {
      text: 'Vega afirma categóricamente haber visto a la Condesa Moreau guardando algo en su bolso a medianoche.',
      tag: 'weapon',
      is_false: true
    },
    cards: [
      { // Mantenido a Derecha
        id: 'eg1', type: 'halago', label: '① Apertura',
        context: 'Vega examina un cuadro en la pared. Usted elige cómo entrar.',
        left_text:  '← Preguntarle directamente por sus negocios con Blackwood',
        right_text: 'Comentar que el cuadro es una pieza fascinante —¿es auténtico? →',
        left_label:  'Directo', right_label: 'Arte', correct: 'right',
        left_response:  '«Mis relaciones comerciales son confidenciales. Hable con mi abogado.»',
        right_response: '«¡Sabe usted de arte, Detective! Es una copia, curiosamente. Hay muchas cosas en este tren que no son lo que parecen.»',
      },
      { // Cambiado a Izquierda
        id: 'eg2', type: 'superioridad', label: '② Estrategia',
        context: 'Vega quiere sentir que lleva ventaja. Usted decide si se lo permite.',
        left_text:  '← Admitir que está perdido con el arte y necesita su guía experta',
        right_text: 'Demostrar que ya sabe todo sobre la falsificación del Picasso →',
        left_label:  'Ceder', right_label: 'Revelar', correct: 'left',
        left_response:  '«Claro, claro. Verá, en el mercado del arte, la autenticidad es... relativa. Blackwood lo entendía.»',
        right_response: '«¿Quién le dijo eso? No hay pruebas de nada. Esta conversación ha terminado.»',
      },
      { // Cambiado a Izquierda
        id: 'eg3', type: 'ego', label: '③ Cierre',
        context: 'Vega está hablando de más. Usted elige cómo cerrarlo.',
        left_text:  '← «Con su ojo experto, ¿quién cree que tenía más que perder con Blackwood vivo?»',
        right_text: '«¿Entonces admite que tenía motivos para querer a Blackwood muerto?» →',
        left_label:  'Ego', right_label: 'Trampa', correct: 'left',
        left_response:  '«¿Mi análisis? La Condesa, claro. Pero si quiere saber dónde estaba yo específicamente a las 23:30... estaba en la bodega.»',
        right_response: '«No admito nada. Hay demasiados "si" en su pregunta. Buenos días.»',
      },
    ],
  }
};
