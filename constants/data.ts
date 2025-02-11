export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  category: string;
  priceCategory: string;
  description: string;
  address: string;
  isOpen: boolean;
  minimumOrder: number;
  menu: MenuItem[];
}

export const POPULAR_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Le Petit Bistrot',
    image: 'https://picsum.photos/200/200?random=1',
    rating: 4.8,
    deliveryTime: '15-25',
    deliveryFee: '2.99',
    category: 'Français',
    priceCategory: '€€',
    description: 'Une cuisine française authentique et raffinée',
    address: '15 rue de la Paix, 75002 Paris',
    isOpen: true,
    minimumOrder: 15,
    menu: [
      {
        id: '1',
        name: 'Entrées',
        category: 'starters',
        description: 'Nos entrées signature',
        price: 0,
      },
      {
        id: '2',
        name: 'Soupe à l\'Oignon',
        category: 'starters',
        description: 'Soupe traditionnelle avec croûtons et fromage gratiné',
        price: 8.90,
        image: 'https://picsum.photos/200/200?random=10',
      },
      {
        id: '3',
        name: 'Plats',
        category: 'main',
        description: 'Nos spécialités',
        price: 0,
      },
      {
        id: '4',
        name: 'Coq au Vin',
        category: 'main',
        description: 'Poulet mijoté au vin rouge avec lardons et champignons',
        price: 22.90,
        image: 'https://picsum.photos/200/200?random=11',
      },
      {
        id: '5',
        name: 'Desserts',
        category: 'desserts',
        description: 'Nos desserts maison',
        price: 0,
      },
      {
        id: '6',
        name: 'Crème Brûlée',
        category: 'desserts',
        description: 'Crème vanille avec caramel croustillant',
        price: 7.90,
        image: 'https://picsum.photos/200/200?random=12',
      },
    ],
  },
  {
    id: '2',
    name: 'Sushi Master',
    image: 'https://picsum.photos/200/200?random=2',
    rating: 4.6,
    deliveryTime: '20-35',
    deliveryFee: '3.99',
    category: 'Japonais',
    priceCategory: '€€€',
    description: 'Les meilleurs sushis de la ville',
    address: '8 rue du Dragon, 75006 Paris',
    isOpen: true,
    minimumOrder: 20,
    menu: [
      {
        id: '1',
        name: 'Entrées',
        category: 'starters',
        description: 'Nos entrées japonaises',
        price: 0,
      },
      {
        id: '2',
        name: 'Edamame',
        category: 'starters',
        description: 'Fèves de soja vapeur au sel de mer',
        price: 5.90,
        image: 'https://picsum.photos/200/200?random=13',
      },
      {
        id: '3',
        name: 'Sushis',
        category: 'main',
        description: 'Nos sushis signature',
        price: 0,
      },
      {
        id: '4',
        name: 'Plateau Royal',
        category: 'main',
        description: '24 pièces : sashimi, maki, nigiri',
        price: 32.90,
        image: 'https://picsum.photos/200/200?random=14',
        options: [
          {
            name: 'Wasabi',
            choices: [
              { id: '1', name: 'Normal', price: 0 },
              { id: '2', name: 'Extra', price: 1 },
              { id: '3', name: 'Sans', price: 0 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Pizza Roma',
    image: 'https://picsum.photos/200/200?random=3',
    rating: 4.5,
    deliveryTime: '25-40',
    deliveryFee: '2.49',
    category: 'Italien',
    priceCategory: '€€',
    description: 'Pizzas authentiques cuites au feu de bois',
    address: '45 rue Oberkampf, 75011 Paris',
    isOpen: true,
    minimumOrder: 15,
    menu: [],
  },
  {
    id: '4',
    name: 'Burger House',
    image: 'https://picsum.photos/200/200?random=4',
    rating: 4.3,
    deliveryTime: '20-30',
    deliveryFee: '2.99',
    category: 'Burgers',
    priceCategory: '€€',
    description: 'Burgers gourmet avec des ingrédients locaux',
    address: '12 rue de la Roquette, 75011 Paris',
    isOpen: true,
    minimumOrder: 15,
    menu: [],
  },
  {
    id: '5',
    name: 'Thai Spices',
    image: 'https://picsum.photos/200/200?random=5',
    rating: 4.7,
    deliveryTime: '25-40',
    deliveryFee: '3.49',
    category: 'Thaïlandais',
    priceCategory: '€€',
    description: 'Saveurs authentiques de Thaïlande',
    address: '3 rue Saintonge, 75003 Paris',
    isOpen: true,
    minimumOrder: 20,
    menu: [],
  },
  {
    id: '6',
    name: 'Le Dragon d\'Or',
    image: 'https://picsum.photos/200/200?random=6',
    rating: 4.4,
    deliveryTime: '30-45',
    deliveryFee: '2.99',
    category: 'Chinois',
    priceCategory: '€€',
    description: 'Spécialités chinoises traditionnelles',
    address: '28 avenue de Choisy, 75013 Paris',
    isOpen: true,
    minimumOrder: 15,
    menu: [],
  },
  {
    id: '7',
    name: 'Veggie Paradise',
    image: 'https://picsum.photos/200/200?random=7',
    rating: 4.6,
    deliveryTime: '20-35',
    deliveryFee: '2.99',
    category: 'Végétarien',
    priceCategory: '€€',
    description: 'Cuisine végétarienne créative et savoureuse',
    address: '67 rue de Charonne, 75011 Paris',
    isOpen: true,
    minimumOrder: 15,
    menu: [],
  },
  {
    id: '8',
    name: 'Le Couscous Royal',
    image: 'https://picsum.photos/200/200?random=8',
    rating: 4.5,
    deliveryTime: '25-40',
    deliveryFee: '3.49',
    category: 'Marocain',
    priceCategory: '€€',
    description: 'Spécialités marocaines traditionnelles',
    address: '22 rue du Faubourg Saint-Denis, 75010 Paris',
    isOpen: true,
    minimumOrder: 20,
    menu: [],
  },
];

export const MENU_CATEGORIES = [
  'all',
  'starters',
  'main',
  'desserts',
  'drinks',
  'specials',
];

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  options?: {
    name: string;
    choices: {
      id: string;
      name: string;
      price: number;
    }[];
  }[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Entrées',
    category: 'starters',
    description: 'Nos entrées signature',
    price: 0,
  },
  {
    id: '2',
    name: 'Salade César',
    category: 'starters',
    description: 'Laitue romaine, croûtons, parmesan, sauce césar maison',
    price: 9.90,
    image: 'https://picsum.photos/200/200?random=7',
    options: [
      {
        name: 'Protéine',
        choices: [
          { id: '1', name: 'Poulet grillé', price: 2 },
          { id: '2', name: 'Crevettes', price: 3 },
          { id: '3', name: 'Saumon fumé', price: 3 },
        ],
      },
    ],
  },
  // ... Ajoutez plus d'éléments de menu ici
]; 