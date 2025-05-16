export const CABALLEROS_DISPONIBLES = [
  {
    id: 'seiya_v2', // Unique ID
    name: 'SEIYA DE PEGASO II',
    image: '/images/pegaso.png', // Placeholder image path
    stats: {
      pv_max: 230, pa_max: 300, pc_max: 500, // pc_max is "COSMOS"
      currentPV: 230, currentPA: 300, currentPC: 500,
      atrapar_bonus: 0,
      brokenParts: { arms: 0, legs: 0, ribs: 0 },
      concentrationLevel: 0,
      lastActionType: null,
      actionHistory: [],
      fortalezaAvailable: false, fortalezaUsedThisCombat: false,
      agilidadAvailable: false, agilidadUsedThisCombat: false,
      destrezaAvailable: false, destrezaUsedThisCombat: false,
      lanzamientosSucesivosUsedThisCombat: false,
      resistenciaAvailable: false, resistenciaUsedThisCombat: false,
      comboVelocidadLuzUsedThisCombat: false,
      dobleSaltoUsedThisCombat: false,
      arrojarUsedThisCombat: false,
      furiaUsedThisCombat: false,
      apresarUsedThisCombat: false,
      quebrarUsedThisCombat: false,
      septimoSentidoActivo: false, septimoSentidoIntentado: false,
      puntosVitalesGolpeados: false, puntosVitalesUsadoPorAtacante: false,
    },
    defenseRanges: {
      esquivar: [8, 20], // ESQ
      bloquear: [8, 20], // BLOQ
      contraatacar: [13, 20], // CONTRATQ
    },
    actions: { // Values are base damage or true if logic is complex and handled in App.jsx
      golpe: 50,
      llave: 60,
      salto: 80,
      velocidad_luz: 50,
      embestir: 70,
      cargar: 80,
      presa: { damagePerHit: 15, maxHits: 3, type: 'vida' }, // PRESA: 15 x 3
      destrozar: { damagePerHit: 15, maxHits: 3, type: 'armadura' }, // DESTROZAR: 15 x 3
      lanzar_obj: 60,
      romper: true, // ROMPER: 2 x 11-20 (range is in supportRanges)
      atrapar: true, // ATRAPAR: 11-20 (range is in supportRanges or hardcoded)
      concentracion: true, // MEDITACIÓN: OK
      combo: true, // COMBO: 50 x 3
      engaño: true, // ENGAÑO: 20 + 50
      fortaleza: true, agilidad: true, destreza: true, resistencia: true, // F/A/D/R: OK
      lanzamientos_sucesivos: true, // LANZ SUCES: 40 x 3
      combo_velocidad_luz: true, // COMB V.LUZ: 60 x 3
      doble_salto: true, // DOBLE SALTO: 100
      arrojar: true, // ARROJAR: 30 x 6
      furia: true, // FURIA: 50 x 3
      apresar: true, // APRESAR: 15 x 5
      quebrar: true, // QUEBRAR: 15 x 5
      alcanzar_septimo_sentido: true, // 7º SENT (action to attempt)
      golpear_puntos_vitales: true, // PTOS VIT (action to attempt)
    },
    powers: [
      { id: 'P001', name: 'Meteoros de Pegaso', cost: 100, type: ['RMult'], details: '5-8 golpes x 20 Ptos Daño' },
      { id: 'P002', name: 'Vuelo del Pegaso', cost: 100, type: ['LL'], damage: 100 },
      { id: 'P003', name: 'Cometa Pegaso', cost: 200, type: ['R'], damage: 190, effects: '-1 Esq/-1 Bloq' },
    ],
    bonuses: {
      pasivos: ['+2 Esq', '+1 ContrAtq', '+2 7º Sent', '+10 Dmg Salto/VelLuz/Embestir', '+1 Percep'],
      activos: ['+4 Int Div', '+4 Ayuda (aliados)', 'UltSuspiro 25% PV', 'Armadura Divina'],
    },
    statusEffects: [],
    supportRanges: {
      percepcion: [16, 20],
      septimo_sentido: [17, 20],
      puntos_vitales: [17, 20],
      romper: [11, 20],
      ayuda: [12, 20],
    },
  },
  {
    id: 'shiryu_v2',
    name: 'SHIRYU DE DRAGON II',
    image: '/images/dragon.png',
    stats: {
      pv_max: 280, pa_max: 300, pc_max: 400,
      currentPV: 280, currentPA: 300, currentPC: 400,
      atrapar_bonus: 0,
      brokenParts: { arms: 0, legs: 0, ribs: 0 },
      concentrationLevel: 0,
      lastActionType: null,
      actionHistory: [],
      fortalezaAvailable: false, fortalezaUsedThisCombat: false,
      agilidadAvailable: false, agilidadUsedThisCombat: false,
      destrezaAvailable: false, destrezaUsedThisCombat: false,
      lanzamientosSucesivosUsedThisCombat: false,
      resistenciaAvailable: false, resistenciaUsedThisCombat: false,
      comboVelocidadLuzUsedThisCombat: false,
      dobleSaltoUsedThisCombat: false,
      arrojarUsedThisCombat: false,
      furiaUsedThisCombat: false,
      apresarUsedThisCombat: false,
      quebrarUsedThisCombat: false,
      septimoSentidoActivo: false, septimoSentidoIntentado: false,
      puntosVitalesGolpeados: false, puntosVitalesUsadoPorAtacante: false,
    },
    defenseRanges: {
      esquivar: [10, 20],
      bloquear: [6, 20],
      contraatacar: [14, 20],
    },
    actions: {
      golpe: 60,
      llave: 60,
      salto: 70,
      velocidad_luz: 50,
      embestir: 60,
      cargar: 80,
      presa: { damagePerHit: 15, maxHits: 3, type: 'vida' },
      destrozar: { damagePerHit: 15, maxHits: 3, type: 'armadura' },
      lanzar_obj: 60,
      romper: true,
      atrapar: true,
      concentracion: true,
      combo: true, // 60x3
      engaño: true, // 20+50
      fortaleza: true, agilidad: true, destreza: true, resistencia: true,
      lanzamientos_sucesivos: true, // 40x3
      combo_velocidad_luz: true, // 50x3
      doble_salto: true, // 90
      arrojar: true, // 30x6
      furia: true, // 60x3
      apresar: true, // 15x5
      quebrar: true, // 15x5
      alcanzar_septimo_sentido: true,
      golpear_puntos_vitales: true,
    },
    powers: [ // Assuming similar to existing App.jsx Shiryu
        { id: 'P004', name: 'Dragon Naciente', cost: 100, type: ['R'], damage: 120 },
        { id: 'P005', name: 'Fuerza de Shiryu', cost: 100, type: ['SA'], effects: '+20 Dmg (all), +1 Bloq (ESC, ARM)' },
        { id: 'P006', name: 'Ultimo Dragon', cost: 200, type: ['R'], damage: 220, effects: 'Ambos KO (-2000 PV)' },
    ],
    bonuses: { // Based on Shiryu V1 example
      pasivos: ['+1 Percep', '+2 Bloq (ESC, ARM)', '+2 ContrAtq (ESC)', '+1 Vs Llave', '+1 Vs Presa', '+1 Vs Quebrar', 'Ignora -1 ContrAtq (ESC Roto)'],
      activos: ['+4 Int Div', '+4 Ayuda (aliados)', 'UltSuspiro 25% PV', 'Armadura Divina'],
    },
    statusEffects: [],
    supportRanges: {
      percepcion: [16, 20],
      septimo_sentido: [19, 20],
      puntos_vitales: [17, 20],
      romper: [11, 20],
      ayuda: [12, 20],
    },
  },
  {
    id: 'hyoga_v2',
    name: 'HYOGA DE CISNE II',
    image: '/images/cisne.png',
    stats: {
      pv_max: 230, pa_max: 300, pc_max: 500,
      currentPV: 230, currentPA: 300, currentPC: 500,
      atrapar_bonus: 0,
      brokenParts: { arms: 0, legs: 0, ribs: 0 },
      concentrationLevel: 0,
      lastActionType: null,
      actionHistory: [],
      fortalezaAvailable: false, fortalezaUsedThisCombat: false,
      agilidadAvailable: false, agilidadUsedThisCombat: false,
      destrezaAvailable: false, destrezaUsedThisCombat: false,
      lanzamientosSucesivosUsedThisCombat: false,
      resistenciaAvailable: false, resistenciaUsedThisCombat: false,
      comboVelocidadLuzUsedThisCombat: false,
      dobleSaltoUsedThisCombat: false,
      arrojarUsedThisCombat: false,
      furiaUsedThisCombat: false,
      apresarUsedThisCombat: false,
      quebrarUsedThisCombat: false,
      septimoSentidoActivo: false, septimoSentidoIntentado: false,
      puntosVitalesGolpeados: false, puntosVitalesUsadoPorAtacante: false,
    },
    defenseRanges: {
      esquivar: [10, 20],
      bloquear: [6, 20],
      contraatacar: [14, 20],
    },
    actions: { // Defaulting to Seiya's actions, adjust as needed
      golpe: 50, llave: 60, salto: 80, velocidad_luz: 50, embestir: 70, cargar: 80,
      presa: { damagePerHit: 15, maxHits: 3, type: 'vida' },
      destrozar: { damagePerHit: 15, maxHits: 3, type: 'armadura' },
      lanzar_obj: 60, romper: true, atrapar: true, concentracion: true, combo: true,
      engaño: true, fortaleza: true, agilidad: true, destreza: true, resistencia: true,
      lanzamientos_sucesivos: true, combo_velocidad_luz: true, doble_salto: true,
      arrojar: true, furia: true, apresar: true, quebrar: true,
      alcanzar_septimo_sentido: true, golpear_puntos_vitales: true,
    },
    powers: [ // Thematic powers for Hyoga
        { id: 'P007', name: 'Polvo de Diamantes', cost: 100, type: ['R'], damage: 100, effects: 'Congelar (1 turno)'}, // Example effect
        { id: 'P008', name: 'Rayo Aurora', cost: 150, type: ['R'], damage: 150 },
        { id: 'P009', name: 'Ejecución Aurora', cost: 250, type: ['R'], damage: 250, effects: '-2 Esq/-2 Bloq'},
    ],
    bonuses: {
      pasivos: ['+1 Percep', '+2 7º Sent', '+1 Vs Carga/Embestir'], // Example bonuses
      activos: ['+4 Int Div', '+4 Ayuda (aliados)', 'UltSuspiro 25% PV', 'Armadura Divina'],
    },
    statusEffects: [],
    supportRanges: {
      percepcion: [16, 20],
      septimo_sentido: [19, 20],
      puntos_vitales: [17, 20],
      romper: [11, 20],
      ayuda: [12, 20],
    },
  },
  {
    id: 'shun_v2',
    name: 'SHUN DE ANDROMEDA II',
    image: '/images/shun.png',
    stats: {
      pv_max: 200, pa_max: 300, pc_max: 560,
      currentPV: 200, currentPA: 300, currentPC: 560,
      atrapar_bonus: 0,
      brokenParts: { arms: 0, legs: 0, ribs: 0 },
      concentrationLevel: 0,
      lastActionType: null,
      actionHistory: [],
      fortalezaAvailable: false, fortalezaUsedThisCombat: false,
      agilidadAvailable: false, agilidadUsedThisCombat: false,
      destrezaAvailable: false, destrezaUsedThisCombat: false,
      lanzamientosSucesivosUsedThisCombat: false,
      resistenciaAvailable: false, resistenciaUsedThisCombat: false,
      comboVelocidadLuzUsedThisCombat: false,
      dobleSaltoUsedThisCombat: false,
      arrojarUsedThisCombat: false,
      furiaUsedThisCombat: false,
      apresarUsedThisCombat: false,
      quebrarUsedThisCombat: false,
      septimoSentidoActivo: false, septimoSentidoIntentado: false,
      puntosVitalesGolpeados: false, puntosVitalesUsadoPorAtacante: false,
    },
    defenseRanges: { // Defaulting to Hyoga's, adjust if Shun is different
      esquivar: [10, 20],
      bloquear: [6, 20],
      contraatacar: [14, 20],
    },
    actions: {
      golpe: 60, // Higher base golpe
      llave: 60,
      salto: 80, // Defaulting to Seiya's actions, adjust as needed
      velocidad_luz: 50, embestir: 70, cargar: 80,
      presa: { damagePerHit: 20, maxHits: 3, type: 'vida' }, // Stronger presa
      destrozar: { damagePerHit: 20, maxHits: 3, type: 'armadura' }, // Stronger destrozar
      lanzar_obj: 60, romper: true,
      atrapar: true, // Range 9-20 for Shun
      concentracion: true, combo: true, engaño: true,
      fortaleza: true, agilidad: true, destreza: true, resistencia: true,
      lanzamientos_sucesivos: true, combo_velocidad_luz: true, doble_salto: true,
      arrojar: true, furia: true,
      apresar: true, // Stronger apresar 20x5
      quebrar: true, // Stronger quebrar 20x5
      alcanzar_septimo_sentido: true, golpear_puntos_vitales: true,
    },
    powers: [ // Thematic powers for Shun
        { id: 'P010', name: 'Cadena Nebular', cost: 100, type: ['RMult'], details: '3-6 golpes x 25 Ptos Daño', effects: 'Atrapar'},
        { id: 'P011', name: 'Defensa Circular', cost: 120, type: ['SA'], effects: '+5 Bloq (todos), Inmunidad Presa/Atrapar (1 turno)'},
        { id: 'P012', name: 'Tormenta Nebular', cost: 280, type: ['R'], damage: 280, effects: 'Reduce PA enemigo 50%'},
    ],
    bonuses: {
      pasivos: ['+2 Percep', '+2 Vs Atrapar/Presa', '+2 Vs Quebrar/Romper'], // Example bonuses
      activos: ['+4 Int Div', '+4 Ayuda (aliados)', 'UltSuspiro 25% PV', 'Armadura Divina', 'Cadena Defensiva Automatica'],
    },
    statusEffects: [],
    supportRanges: {
      percepcion: [15, 20],
      septimo_sentido: [19, 20],
      puntos_vitales: [17, 20],
      romper: [11, 20],
      ayuda: [12, 20],
      atrapar: [9, 20], // Specific for Shun
    },
  },
  {
    id: 'ikki_v2',
    name: 'IKKI DE FENIX II',
    image: '/images/fenix.png',
    stats: {
      pv_max: 280, pa_max: 300, pc_max: 400,
      currentPV: 280, currentPA: 300, currentPC: 400,
      atrapar_bonus: 0,
      brokenParts: { arms: 0, legs: 0, ribs: 0 },
      concentrationLevel: 0,
      lastActionType: null,
      actionHistory: [],
      fortalezaAvailable: false, fortalezaUsedThisCombat: false,
      agilidadAvailable: false, agilidadUsedThisCombat: false,
      destrezaAvailable: false, destrezaUsedThisCombat: false,
      lanzamientosSucesivosUsedThisCombat: false,
      resistenciaAvailable: false, resistenciaUsedThisCombat: false,
      comboVelocidadLuzUsedThisCombat: false,
      dobleSaltoUsedThisCombat: false,
      arrojarUsedThisCombat: false,
      furiaUsedThisCombat: false,
      apresarUsedThisCombat: false,
      quebrarUsedThisCombat: false,
      septimoSentidoActivo: false, septimoSentidoIntentado: false,
      puntosVitalesGolpeados: false, puntosVitalesUsadoPorAtacante: false,
    },
    defenseRanges: { // Defaulting to Hyoga's, adjust if Ikki is different
      esquivar: [10, 20],
      bloquear: [6, 20],
      contraatacar: [14, 20],
    },
    actions: { // Defaulting to Seiya's actions, adjust as needed
      golpe: 50, llave: 60, salto: 80, velocidad_luz: 50, embestir: 70, cargar: 80,
      presa: { damagePerHit: 15, maxHits: 3, type: 'vida' },
      destrozar: { damagePerHit: 15, maxHits: 3, type: 'armadura' },
      lanzar_obj: 60, romper: true, atrapar: true, concentracion: true, combo: true,
      engaño: true, fortaleza: true, agilidad: true, destreza: true, resistencia: true,
      lanzamientos_sucesivos: true, combo_velocidad_luz: true, doble_salto: true,
      arrojar: true, furia: true, apresar: true, quebrar: true,
      alcanzar_septimo_sentido: true, golpear_puntos_vitales: true,
    },
    powers: [ // Thematic powers for Ikki
        { id: 'P013', name: 'Puño Fantasma del Fenix', cost: 120, type: ['R'], damage: 80, effects: 'Confusion (Objetivo ataca aliado o a si mismo)' },
        { id: 'P014', name: 'Alas del Fenix', cost: 180, type: ['R'], damage: 200, effects: '+2 Esq (propio)'},
        { id: 'P015', name: 'Resurreccion del Fenix', cost: 300, type: ['SA'], effects: 'Recupera 50% PV (una vez por combate)'}, // Self-revive
    ],
    bonuses: {
      pasivos: ['+2 Percep', 'Ignora Dolor Leve', '+2 Resistencia', '+10 Dmg (critico)'], // Example bonuses
      activos: ['+4 Int Div', '+4 Ayuda (aliados)', 'UltSuspiro 25% PV', 'Armadura Divina', 'Voluntad Indomable'],
    },
    statusEffects: [],
    supportRanges: {
      percepcion: [16, 20],
      septimo_sentido: [19, 20],
      puntos_vitales: [17, 20],
      romper: [11, 20],
      ayuda: [12, 20],
    },
  },
]; 