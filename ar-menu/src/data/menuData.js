// =============================================================================
//  BRASA · Datos de la carta
// -----------------------------------------------------------------------------
//  Estructura pensada para escalar: categorías + platos, ambos bilingües (es/en).
//  Las imágenes apuntan a fotos reales (Unsplash). Si alguna no carga, el
//  componente <DishImage> muestra un placeholder elegante generado al vuelo,
//  así la UI nunca se "rompe". Reemplazá `image`/`gallery` por tus fotos.
//
//  El campo `model` define qué modelo 3D procedural se renderiza en el visor /
//  en AR (ver components/ar/DishModel.jsx). `accent` tiñe el placeholder y el 3D.
// =============================================================================

const u = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

// ---- Categorías -------------------------------------------------------------
export const categories = [
  {
    id: 'entradas',
    name: { es: 'Entradas', en: 'Starters' },
    description: {
      es: 'El primer fuego. Bocados para abrir el apetito y la conversación.',
      en: 'The first fire. Bites to open the appetite and the conversation.',
    },
    cover: u('1541014741259-de529411b96a'),
  },
  {
    id: 'ensaladas',
    name: { es: 'Ensaladas', en: 'Salads' },
    description: {
      es: 'Verde de huerta, semillas y aderezos de la casa.',
      en: 'Garden greens, seeds and house dressings.',
    },
    cover: u('1512621776951-a57141f2eefd'),
  },
  {
    id: 'pastas',
    name: { es: 'Pastas', en: 'Pasta' },
    description: {
      es: 'Masa fresca amasada cada mañana. Rellenos y salsas lentas.',
      en: 'Fresh dough kneaded each morning. Slow fillings and sauces.',
    },
    cover: u('1551183053-bf91a1d81141'),
  },
  {
    id: 'carnes',
    name: { es: 'Carnes', en: 'Beef' },
    description: {
      es: 'El centro de la parrilla. Cortes a las brasas de quebracho.',
      en: 'The heart of the grill. Cuts over quebracho embers.',
    },
    cover: u('1558030006-450675393462'),
  },
  {
    id: 'pescados',
    name: { es: 'Pescados', en: 'Fish' },
    description: {
      es: 'Pesca del día del Atlántico, a la plancha y al horno de barro.',
      en: "Today's Atlantic catch, grilled and clay-oven baked.",
    },
    cover: u('1519708227418-c8fd9a32b7a2'),
  },
  {
    id: 'hamburguesas',
    name: { es: 'Hamburguesas', en: 'Burgers' },
    description: {
      es: 'Blend propio madurado, pan brioche y queso fundido.',
      en: 'House-aged blend, brioche bun and melted cheese.',
    },
    cover: u('1568901346375-23c9450c58cd'),
  },
  {
    id: 'pizzas',
    name: { es: 'Pizzas', en: 'Pizzas' },
    description: {
      es: 'Masa de fermentación lenta, horno a leña 400°.',
      en: 'Slow-fermented dough, 400° wood-fired oven.',
    },
    cover: u('1513104890138-7c749659a591'),
  },
  {
    id: 'postres',
    name: { es: 'Postres', en: 'Desserts' },
    description: {
      es: 'El final dulce. Clásicos reinterpretados por la casa.',
      en: 'The sweet ending. Classics reinterpreted in house.',
    },
    cover: u('1488477181946-6428a0291777'),
  },
  {
    id: 'bebidas',
    name: { es: 'Bebidas', en: 'Drinks' },
    description: {
      es: 'Aguas saborizadas, sodas artesanales y cócteles de autor.',
      en: 'Flavored waters, craft sodas and signature cocktails.',
    },
    cover: u('1551024601-bec78aea704b'),
  },
  {
    id: 'vinos',
    name: { es: 'Vinos', en: 'Wines' },
    description: {
      es: 'Carta de Malbec, Cabernet y blancos de altura. Por copa o botella.',
      en: 'Malbec, Cabernet and high-altitude whites. By glass or bottle.',
    },
    cover: u('1510812431401-41d2bd2722f3'),
  },
]

// ---- Platos -----------------------------------------------------------------
// tags: 'recommended' | 'new' | 'vegan' | 'glutenFree' | 'spicy'
export const dishes = [
  // ===================== ENTRADAS =====================
  {
    id: 'bruschettas',
    category: 'entradas',
    model: '/modelos3D/Sandwich.glb',
    modelLight: 'starter',
    accent: '#C2491D',
    name: { es: 'Bruschettas de la casa', en: 'House Bruschettas' },
    description: {
      es: 'Pan de masa madre tostado, tomate confitado, burrata y albahaca.',
      en: 'Toasted sourdough, confit tomato, burrata and basil.',
    },
    longDescription: {
      es: 'Tres bruschettas sobre pan de masa madre fermentado 48 horas y tostado a la parrilla. Coronadas con tomates confitados en aceite de oliva, burrata cremosa, albahaca fresca y una reducción de aceto balsámico.',
      en: 'Three bruschettas on 48-hour fermented sourdough, grill-toasted. Topped with olive-oil confit tomatoes, creamy burrata, fresh basil and a balsamic reduction.',
    },
    ingredients: {
      es: ['Pan de masa madre', 'Tomate confitado', 'Burrata', 'Albahaca', 'Aceto balsámico', 'Aceite de oliva'],
      en: ['Sourdough bread', 'Confit tomato', 'Burrata', 'Basil', 'Balsamic vinegar', 'Olive oil'],
    },
    nutrition: { kcal: 420, protein: 14, carbs: 38, fat: 22 },
    allergens: { es: ['Gluten', 'Lácteos'], en: ['Gluten', 'Dairy'] },
    prepTime: 12,
    spice: 0,
    price: 9800,
    tags: ['recommended'],
    image: u('1572695157366-5e585ab2b69f'),
    gallery: [u('1572695157366-5e585ab2b69f'), u('1505253758473-96b7015fcd40'), u('1506280754576-f6fa8a873550')],
    pairing: { es: 'Copa de Sauvignon Blanc de altura.', en: 'A glass of high-altitude Sauvignon Blanc.' },
    reviews: [
      { author: 'Lucía R.', rating: 5, es: 'La burrata se deshace. Mi entrada favorita.', en: 'The burrata melts. My favorite starter.' },
      { author: 'Tomás G.', rating: 4, es: 'El pan estaba perfecto, bien tostado.', en: 'The bread was perfect, nicely toasted.' },
    ],
  },
  {
    id: 'empanadas-gourmet',
    category: 'entradas',
    model: '/modelos3D/MasaMadre.glb',
    modelLight: 'starter',
    accent: '#B5582F',
    name: { es: 'Empanadas gourmet de osobuco', en: 'Gourmet Ossobuco Empanadas' },
    description: {
      es: 'Masa criolla, osobuco braseado 6 horas y un toque de malbec.',
      en: 'Criolla dough, 6-hour braised ossobuco and a touch of Malbec.',
    },
    longDescription: {
      es: 'Empanadas de masa criolla hojaldrada, rellenas de osobuco braseado lentamente durante seis horas en su jugo con vino malbec, cebolla caramelizada y un punto de comino. Horneadas a leña.',
      en: 'Flaky criolla-dough empanadas filled with ossobuco slow-braised for six hours in its own juices with Malbec, caramelized onion and a hint of cumin. Wood-oven baked.',
    },
    ingredients: {
      es: ['Masa criolla', 'Osobuco', 'Vino malbec', 'Cebolla', 'Comino', 'Huevo'],
      en: ['Criolla dough', 'Ossobuco', 'Malbec wine', 'Onion', 'Cumin', 'Egg'],
    },
    nutrition: { kcal: 310, protein: 16, carbs: 24, fat: 16 },
    allergens: { es: ['Gluten', 'Huevo'], en: ['Gluten', 'Egg'] },
    prepTime: 15,
    spice: 1,
    price: 8500,
    tags: ['recommended', 'new'],
    image: u('1601050690597-df0568f70950'),
    gallery: [u('1601050690597-df0568f70950'), u('1565299507177-b0ac66763828')],
    pairing: { es: 'Malbec joven, mismo del relleno.', en: 'Young Malbec, the same as the filling.' },
    reviews: [
      { author: 'Felipe M.', rating: 5, es: 'La carne se desarma sola. Una locura.', en: 'The meat falls apart on its own. Insane.' },
    ],
  },

  // ===================== ENSALADAS =====================
  {
    id: 'cesar-pollo',
    category: 'ensaladas',
    model: '/modelos3D/grilled-cheese.glb',
    modelLight: 'salad',
    accent: '#7A8C4A',
    name: { es: 'César de pollo grillado', en: 'Grilled Chicken Caesar' },
    description: {
      es: 'Lechuga romana, pollo a la parrilla, croutons y aderezo césar.',
      en: 'Romaine, grilled chicken, croutons and Caesar dressing.',
    },
    longDescription: {
      es: 'Hojas de lechuga romana crocante con pechuga de pollo grillada, croutons de masa madre, escamas de parmesano y nuestro aderezo césar con anchoas y limón.',
      en: 'Crisp romaine leaves with grilled chicken breast, sourdough croutons, parmesan flakes and our Caesar dressing with anchovy and lemon.',
    },
    ingredients: {
      es: ['Lechuga romana', 'Pollo grillado', 'Croutons', 'Parmesano', 'Aderezo césar'],
      en: ['Romaine lettuce', 'Grilled chicken', 'Croutons', 'Parmesan', 'Caesar dressing'],
    },
    nutrition: { kcal: 380, protein: 32, carbs: 18, fat: 20 },
    allergens: { es: ['Gluten', 'Lácteos', 'Pescado'], en: ['Gluten', 'Dairy', 'Fish'] },
    prepTime: 10,
    spice: 0,
    price: 10200,
    tags: [],
    image: u('1546793665-c74683f339c1'),
    gallery: [u('1546793665-c74683f339c1'), u('1512621776951-a57141f2eefd')],
    pairing: { es: 'Chardonnay sin madera.', en: 'Unoaked Chardonnay.' },
    reviews: [{ author: 'Ana P.', rating: 4, es: 'Fresca y abundante.', en: 'Fresh and generous.' }],
  },
  {
    id: 'quinoa-bowl',
    category: 'ensaladas',
    model: '/modelos3D/grilled-cheese.glb',
    modelLight: 'salad',
    accent: '#6E8B3D',
    name: { es: 'Bowl de quinoa y palta', en: 'Quinoa & Avocado Bowl' },
    description: {
      es: 'Quinoa tricolor, palta, vegetales asados y vinagreta de cítricos.',
      en: 'Tricolor quinoa, avocado, roasted veggies and citrus vinaigrette.',
    },
    longDescription: {
      es: 'Bowl 100% vegetal con quinoa tricolor, palta, zanahoria y zucchini asados, rúcula, semillas tostadas y una vinagreta de cítricos. Liviano y nutritivo.',
      en: 'Fully plant-based bowl with tricolor quinoa, avocado, roasted carrot and zucchini, arugula, toasted seeds and a citrus vinaigrette. Light and nourishing.',
    },
    ingredients: {
      es: ['Quinoa tricolor', 'Palta', 'Zanahoria', 'Zucchini', 'Rúcula', 'Semillas'],
      en: ['Tricolor quinoa', 'Avocado', 'Carrot', 'Zucchini', 'Arugula', 'Seeds'],
    },
    nutrition: { kcal: 340, protein: 11, carbs: 42, fat: 15 },
    allergens: { es: [], en: [] },
    prepTime: 10,
    spice: 0,
    price: 9600,
    tags: ['vegan', 'glutenFree'],
    image: u('1512621776951-a57141f2eefd'),
    gallery: [u('1512621776951-a57141f2eefd'), u('1490645935967-10de6ba17061')],
    pairing: { es: 'Agua saborizada de pepino y menta.', en: 'Cucumber-mint flavored water.' },
    reviews: [{ author: 'Sofía L.', rating: 5, es: 'Ideal para el mediodía. Liviano.', en: 'Perfect for midday. Light.' }],
  },

  // ===================== PASTAS =====================
  {
    id: 'ravioles-cordero',
    category: 'pastas',
    model: '/modelos3D/spaghetti.glb',
    modelLight: 'pasta',
    accent: '#B5582F',
    name: { es: 'Ravioles de cordero', en: 'Lamb Ravioli' },
    description: {
      es: 'Pasta fresca rellena de cordero braseado, manteca de salvia y nuez.',
      en: 'Fresh pasta filled with braised lamb, sage butter and walnut.',
    },
    longDescription: {
      es: 'Ravioles de masa fresca al huevo, rellenos de cordero patagónico braseado lentamente con hierbas. Salseados con manteca noisette de salvia, nuez tostada y láminas de grana padano.',
      en: 'Fresh egg-pasta ravioli filled with slow-braised Patagonian lamb and herbs. Dressed in sage brown butter, toasted walnut and grana padano shavings.',
    },
    ingredients: {
      es: ['Masa fresca al huevo', 'Cordero patagónico', 'Manteca', 'Salvia', 'Nuez', 'Grana padano'],
      en: ['Fresh egg pasta', 'Patagonian lamb', 'Butter', 'Sage', 'Walnut', 'Grana padano'],
    },
    nutrition: { kcal: 620, protein: 28, carbs: 52, fat: 32 },
    allergens: { es: ['Gluten', 'Huevo', 'Lácteos', 'Frutos secos'], en: ['Gluten', 'Egg', 'Dairy', 'Tree nuts'] },
    prepTime: 18,
    spice: 0,
    price: 16500,
    tags: ['recommended'],
    image: u('1587740908075-9e245070dfaa'),
    gallery: [u('1587740908075-9e245070dfaa'), u('1473093295043-cdd812d0e601'), u('1621996346565-e3dbc646d9a9')],
    pairing: { es: 'Malbec de guarda, Valle de Uco.', en: 'Aged Malbec from Uco Valley.' },
    reviews: [
      { author: 'Martín D.', rating: 5, es: 'El mejor plato de pasta que comí en años.', en: 'Best pasta dish I’ve had in years.' },
      { author: 'Clara V.', rating: 5, es: 'La manteca de salvia es adictiva.', en: 'The sage butter is addictive.' },
    ],
  },
  {
    id: 'fettuccine-alfredo',
    category: 'pastas',
    model: '/modelos3D/noodle.glb',
    modelLight: 'pasta',
    accent: '#D8A24A',
    name: { es: 'Fettuccine Alfredo', en: 'Fettuccine Alfredo' },
    description: {
      es: 'Cinta fresca, crema de parmesano, manteca y pimienta negra.',
      en: 'Fresh ribbons, parmesan cream, butter and black pepper.',
    },
    longDescription: {
      es: 'Fettuccine de pasta fresca emulsionado al momento con manteca, agua de cocción y parmesano reggiano hasta lograr una crema sedosa. Terminado con pimienta negra recién molida.',
      en: 'Fresh fettuccine emulsified to order with butter, pasta water and parmigiano reggiano into a silky cream. Finished with freshly ground black pepper.',
    },
    ingredients: {
      es: ['Pasta fresca', 'Parmesano reggiano', 'Manteca', 'Pimienta negra'],
      en: ['Fresh pasta', 'Parmigiano reggiano', 'Butter', 'Black pepper'],
    },
    nutrition: { kcal: 580, protein: 19, carbs: 60, fat: 28 },
    allergens: { es: ['Gluten', 'Huevo', 'Lácteos'], en: ['Gluten', 'Egg', 'Dairy'] },
    prepTime: 14,
    spice: 0,
    price: 14200,
    tags: [],
    image: u('1645112411341-6c4fd023714a'),
    gallery: [u('1645112411341-6c4fd023714a'), u('1473093295043-cdd812d0e601')],
    pairing: { es: 'Chardonnay con paso por barrica.', en: 'Barrel-aged Chardonnay.' },
    reviews: [{ author: 'Nico B.', rating: 4, es: 'Cremoso sin ser pesado.', en: 'Creamy without being heavy.' }],
  },

  // ===================== CARNES =====================
  {
    id: 'bife-chorizo',
    category: 'carnes',
    model: '/modelos3D/crispykitchen.glb',
    modelLight: 'meat',
    accent: '#8A3A1E',
    name: { es: 'Bife de chorizo premium', en: 'Premium Sirloin Steak' },
    description: {
      es: '400g de bife de chorizo a la parrilla, sal de mar y chimichurri.',
      en: '400g grilled sirloin, sea salt and chimichurri.',
    },
    longDescription: {
      es: 'Bife de chorizo de 400 gramos, sellado a fuego fuerte sobre brasas de quebracho y terminado a punto. Servido con sal de mar en escamas, chimichurri de la casa y papas rústicas.',
      en: '400-gram sirloin, hard-seared over quebracho embers and finished to your liking. Served with flaky sea salt, house chimichurri and rustic potatoes.',
    },
    ingredients: {
      es: ['Bife de chorizo 400g', 'Sal de mar', 'Chimichurri', 'Papas rústicas'],
      en: ['400g sirloin', 'Sea salt', 'Chimichurri', 'Rustic potatoes'],
    },
    nutrition: { kcal: 720, protein: 58, carbs: 24, fat: 44 },
    allergens: { es: [], en: [] },
    prepTime: 22,
    spice: 1,
    price: 24500,
    tags: ['recommended', 'glutenFree'],
    image: u('1600891964092-4316c288032e'),
    gallery: [u('1600891964092-4316c288032e'), u('1558030006-450675393462'), u('1546964124-0cce460f38ef')],
    pairing: { es: 'Cabernet Sauvignon estructurado.', en: 'A structured Cabernet Sauvignon.' },
    reviews: [
      { author: 'Diego A.', rating: 5, es: 'Punto perfecto, jugoso. Volvería sólo por esto.', en: 'Perfect doneness, juicy. I’d come back just for this.' },
      { author: 'Vale S.', rating: 5, es: 'El chimichurri es otro nivel.', en: 'The chimichurri is next level.' },
    ],
  },
  {
    id: 'ojo-de-bife',
    category: 'carnes',
    model: '/modelos3D/crispykitchen.glb',
    modelLight: 'meat',
    accent: '#7A2E16',
    name: { es: 'Ojo de bife madurado', en: 'Dry-Aged Ribeye' },
    description: {
      es: 'Madurado 30 días en seco, manteca de hierbas y puré trufado.',
      en: '30-day dry-aged, herb butter and truffled mashed potato.',
    },
    longDescription: {
      es: 'Ojo de bife madurado en seco durante 30 días para concentrar sabor y ternura. Sellado a las brasas, pincelado con manteca de hierbas y acompañado de puré trufado.',
      en: 'Ribeye dry-aged for 30 days to concentrate flavor and tenderness. Ember-seared, brushed with herb butter and served with truffled mashed potato.',
    },
    ingredients: {
      es: ['Ojo de bife madurado', 'Manteca de hierbas', 'Puré trufado', 'Sal Maldon'],
      en: ['Dry-aged ribeye', 'Herb butter', 'Truffled mash', 'Maldon salt'],
    },
    nutrition: { kcal: 810, protein: 54, carbs: 28, fat: 56 },
    allergens: { es: ['Lácteos'], en: ['Dairy'] },
    prepTime: 26,
    spice: 0,
    price: 31000,
    tags: ['new', 'recommended'],
    image: u('1546241072-48010ad2862c'),
    gallery: [u('1546241072-48010ad2862c'), u('1558030006-450675393462')],
    pairing: { es: 'Blend Bordelés de guarda.', en: 'An aged Bordeaux blend.' },
    reviews: [{ author: 'Joaquín R.', rating: 5, es: 'La maduración se nota. Manjar.', en: 'You can taste the aging. A delicacy.' }],
  },

  // ===================== PESCADOS =====================
  {
    id: 'salmon-grillado',
    category: 'pescados',
    model: '/modelos3D/polloentero.glb',
    modelLight: 'fish',
    accent: '#D97A4A',
    name: { es: 'Salmón a la parrilla', en: 'Grilled Salmon' },
    description: {
      es: 'Salmón rosado, costra de hierbas, espárragos y beurre blanc.',
      en: 'Pink salmon, herb crust, asparagus and beurre blanc.',
    },
    longDescription: {
      es: 'Suprema de salmón rosado con costra de hierbas frescas, grillada al punto. Sobre cama de espárragos verdes y salsa beurre blanc cítrica.',
      en: 'Pink salmon supreme with a fresh-herb crust, grilled to point. Over a bed of green asparagus and a citrus beurre blanc.',
    },
    ingredients: {
      es: ['Salmón rosado', 'Hierbas frescas', 'Espárragos', 'Beurre blanc', 'Limón'],
      en: ['Pink salmon', 'Fresh herbs', 'Asparagus', 'Beurre blanc', 'Lemon'],
    },
    nutrition: { kcal: 540, protein: 42, carbs: 12, fat: 34 },
    allergens: { es: ['Pescado', 'Lácteos'], en: ['Fish', 'Dairy'] },
    prepTime: 20,
    spice: 0,
    price: 22800,
    tags: ['glutenFree', 'recommended'],
    image: u('1519708227418-c8fd9a32b7a2'),
    gallery: [u('1519708227418-c8fd9a32b7a2'), u('1467003909585-2f8a72700288')],
    pairing: { es: 'Sauvignon Blanc fresco.', en: 'A fresh Sauvignon Blanc.' },
    reviews: [{ author: 'Pao M.', rating: 5, es: 'Punto justo, no seco. Excelente.', en: 'Just right, not dry. Excellent.' }],
  },

  // ===================== HAMBURGUESAS =====================
  {
    id: 'brasa-burger',
    category: 'hamburguesas',
    model: '/modelos3D/BurgerKFC.glb',
    modelLight: 'burger',
    accent: '#A6451F',
    name: { es: 'BRASA Burger', en: 'BRASA Burger' },
    description: {
      es: 'Doble blend madurado, cheddar, panceta y salsa ahumada.',
      en: 'Double aged blend, cheddar, bacon and smoky sauce.',
    },
    longDescription: {
      es: 'Doble medallón de blend madurado de la casa, cheddar fundido, panceta crocante, cebolla caramelizada y nuestra salsa ahumada, en pan brioche artesanal. Con papas pay.',
      en: 'Double house-aged blend patty, melted cheddar, crispy bacon, caramelized onion and our smoky sauce in artisan brioche. With shoestring fries.',
    },
    ingredients: {
      es: ['Doble medallón', 'Cheddar', 'Panceta', 'Cebolla caramelizada', 'Pan brioche', 'Salsa ahumada'],
      en: ['Double patty', 'Cheddar', 'Bacon', 'Caramelized onion', 'Brioche bun', 'Smoky sauce'],
    },
    nutrition: { kcal: 890, protein: 46, carbs: 48, fat: 56 },
    allergens: { es: ['Gluten', 'Lácteos', 'Huevo'], en: ['Gluten', 'Dairy', 'Egg'] },
    prepTime: 18,
    spice: 1,
    price: 15800,
    tags: ['recommended'],
    image: u('1568901346375-23c9450c58cd'),
    gallery: [u('1568901346375-23c9450c58cd'), u('1550547660-d9450f859349')],
    pairing: { es: 'Cerveza IPA artesanal.', en: 'A craft IPA.' },
    reviews: [{ author: 'Lucas T.', rating: 5, es: 'Jugosa, se desarma de buena.', en: 'Juicy, falls apart it’s so good.' }],
  },

  // ===================== PIZZAS =====================
  {
    id: 'pizza-fugazzeta',
    category: 'pizzas',
    model: '/modelos3D/PepperoniPizza.glb',
    modelLight: 'pizza',
    accent: '#C9A23E',
    name: { es: 'Fugazzeta rellena', en: 'Stuffed Fugazzeta' },
    description: {
      es: 'Masa rellena de muzzarella, cebolla dulce y orégano.',
      en: 'Dough stuffed with mozzarella, sweet onion and oregano.',
    },
    longDescription: {
      es: 'Clásico porteño: doble masa de fermentación lenta rellena de muzzarella, coronada con cebolla dulce salteada, orégano y aceite de oliva. Horno a leña.',
      en: 'A Buenos Aires classic: double slow-fermented dough stuffed with mozzarella, topped with sautéed sweet onion, oregano and olive oil. Wood-fired.',
    },
    ingredients: {
      es: ['Masa fermentada', 'Muzzarella', 'Cebolla dulce', 'Orégano', 'Aceite de oliva'],
      en: ['Fermented dough', 'Mozzarella', 'Sweet onion', 'Oregano', 'Olive oil'],
    },
    nutrition: { kcal: 760, protein: 28, carbs: 78, fat: 36 },
    allergens: { es: ['Gluten', 'Lácteos'], en: ['Gluten', 'Dairy'] },
    prepTime: 16,
    spice: 0,
    price: 13900,
    tags: ['recommended'],
    image: u('1513104890138-7c749659a591'),
    gallery: [u('1513104890138-7c749659a591'), u('1574071318508-1cdbab80d002')],
    pairing: { es: 'Bonarda joven, fresca.', en: 'A young, fresh Bonarda.' },
    reviews: [{ author: 'Caro F.', rating: 5, es: 'La cebolla justa, no empalaga.', en: 'The onion is just right, never cloying.' }],
  },

  // ===================== POSTRES =====================
  {
    id: 'cheesecake',
    category: 'postres',
    model: '/modelos3D/cookie.glb',
    modelLight: 'dessert',
    accent: '#C97B5A',
    name: { es: 'Cheesecake de frutos rojos', en: 'Berry Cheesecake' },
    description: {
      es: 'Base de galleta, crema de queso y coulis de frutos rojos.',
      en: 'Cookie base, cream cheese and berry coulis.',
    },
    longDescription: {
      es: 'Cheesecake horneado al baño maría sobre base de galleta de manteca, con un coulis de frutos rojos de estación y frambuesas frescas. Textura cremosa y aterciopelada.',
      en: 'Bain-marie baked cheesecake on a butter-cookie base, with a seasonal berry coulis and fresh raspberries. Creamy, velvety texture.',
    },
    ingredients: {
      es: ['Queso crema', 'Galleta de manteca', 'Frutos rojos', 'Azúcar', 'Huevo'],
      en: ['Cream cheese', 'Butter cookie', 'Mixed berries', 'Sugar', 'Egg'],
    },
    nutrition: { kcal: 480, protein: 9, carbs: 46, fat: 28 },
    allergens: { es: ['Gluten', 'Lácteos', 'Huevo'], en: ['Gluten', 'Dairy', 'Egg'] },
    prepTime: 8,
    spice: 0,
    price: 8900,
    tags: ['recommended'],
    image: u('1533134242443-d4fd215305ad'),
    gallery: [u('1533134242443-d4fd215305ad'), u('1565958011703-44f9829ba187')],
    pairing: { es: 'Cosecha tardía o espumante dulce.', en: 'Late harvest or sweet sparkling.' },
    reviews: [
      { author: 'Romina C.', rating: 5, es: 'Cremoso y nada empalagoso. Perfecto.', en: 'Creamy and not too sweet. Perfect.' },
    ],
  },
  {
    id: 'tiramisu',
    category: 'postres',
    model: '/modelos3D/muffin.glb',
    modelLight: 'dessert',
    accent: '#9C6B3F',
    name: { es: 'Tiramisú clásico', en: 'Classic Tiramisu' },
    description: {
      es: 'Vainillas, café espresso, mascarpone y cacao amargo.',
      en: 'Ladyfingers, espresso, mascarpone and dark cocoa.',
    },
    longDescription: {
      es: 'Receta tradicional italiana: capas de vainillas embebidas en café espresso, crema de mascarpone batida y una nevada generosa de cacao amargo. Reposado 24 horas.',
      en: 'Traditional Italian recipe: layers of espresso-soaked ladyfingers, whipped mascarpone cream and a generous dusting of dark cocoa. Rested for 24 hours.',
    },
    ingredients: {
      es: ['Vainillas', 'Café espresso', 'Mascarpone', 'Cacao amargo', 'Huevo'],
      en: ['Ladyfingers', 'Espresso', 'Mascarpone', 'Dark cocoa', 'Egg'],
    },
    nutrition: { kcal: 450, protein: 8, carbs: 40, fat: 27 },
    allergens: { es: ['Gluten', 'Lácteos', 'Huevo'], en: ['Gluten', 'Dairy', 'Egg'] },
    prepTime: 8,
    spice: 0,
    price: 8600,
    tags: ['new'],
    image: u('1571877227200-a0d98ea607e9'),
    gallery: [u('1571877227200-a0d98ea607e9'), u('1542124948-dc391252a940')],
    pairing: { es: 'Café espresso o un Marsala.', en: 'Espresso or a glass of Marsala.' },
    reviews: [{ author: 'Juan I.', rating: 5, es: 'El equilibrio justo de café y dulzor.', en: 'The right balance of coffee and sweetness.' }],
  },

  // ===================== BEBIDAS =====================
  {
    id: 'limonada-jengibre',
    category: 'bebidas',
    model: '/modelos3D/Croissant.glb',
    modelLight: 'drink',
    accent: '#D9B23A',
    name: { es: 'Limonada de jengibre y menta', en: 'Ginger-Mint Lemonade' },
    description: {
      es: 'Limón exprimido, jengibre fresco, menta y soda artesanal.',
      en: 'Fresh-squeezed lemon, ginger, mint and craft soda.',
    },
    longDescription: {
      es: 'Limonada natural con jengibre fresco rallado, menta de huerta y un toque de soda artesanal. Refrescante, con un final levemente picante del jengibre.',
      en: 'Natural lemonade with grated fresh ginger, garden mint and a splash of craft soda. Refreshing, with a slightly spicy ginger finish.',
    },
    ingredients: {
      es: ['Limón', 'Jengibre', 'Menta', 'Soda artesanal', 'Azúcar mascabo'],
      en: ['Lemon', 'Ginger', 'Mint', 'Craft soda', 'Muscovado sugar'],
    },
    nutrition: { kcal: 110, protein: 0, carbs: 28, fat: 0 },
    allergens: { es: [], en: [] },
    prepTime: 5,
    spice: 1,
    price: 4800,
    tags: ['vegan', 'glutenFree'],
    image: u('1556679343-c7306c1976bc'),
    gallery: [u('1556679343-c7306c1976bc'), u('1497534446932-c925b458314e')],
    pairing: { es: 'Sola, bien fría.', en: 'On its own, ice cold.' },
    reviews: [{ author: 'Mica D.', rating: 5, es: 'El jengibre la hace única.', en: 'The ginger makes it unique.' }],
  },

  // ===================== VINOS =====================
  {
    id: 'malbec-reserva',
    category: 'vinos',
    model: '/modelos3D/BigMac.glb',
    modelLight: 'wine',
    accent: '#6E1E2A',
    name: { es: 'Malbec Reserva · Valle de Uco', en: 'Reserve Malbec · Uco Valley' },
    description: {
      es: 'Guarda 12 meses en roble. Frutos negros, especias y final largo.',
      en: '12 months in oak. Black fruit, spice and a long finish.',
    },
    longDescription: {
      es: 'Malbec de altura del Valle de Uco, con 12 meses de guarda en barricas de roble francés. Notas de ciruela, mora y especias dulces, taninos redondos y un final persistente. Por copa o botella.',
      en: 'High-altitude Malbec from Uco Valley, 12 months in French oak. Notes of plum, blackberry and sweet spice, round tannins and a persistent finish. By glass or bottle.',
    },
    ingredients: {
      es: ['Uva Malbec', 'Roble francés', '14% vol.'],
      en: ['Malbec grape', 'French oak', '14% vol.'],
    },
    nutrition: { kcal: 125, protein: 0, carbs: 4, fat: 0 },
    allergens: { es: ['Sulfitos'], en: ['Sulfites'] },
    prepTime: 2,
    spice: 0,
    price: 7200,
    tags: ['recommended'],
    image: u('1510812431401-41d2bd2722f3'),
    gallery: [u('1510812431401-41d2bd2722f3'), u('1553361371-9b22f78e8b1d')],
    pairing: { es: 'Ideal con los cortes de la parrilla.', en: 'Ideal with the grill cuts.' },
    reviews: [{ author: 'Sommelier BRASA', rating: 5, es: 'Nuestra recomendación de la casa.', en: 'Our house recommendation.' }],
  },
]

// ---- Helpers ----------------------------------------------------------------
export const getDishesByCategory = (categoryId) =>
  dishes.filter((d) => d.category === categoryId)

export const getDishById = (id) => dishes.find((d) => d.id === id)

export const getCategoryById = (id) => categories.find((c) => c.id === id)
