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
  tags: string[];
}

export const POPULAR_RESTAURANTS: Restaurant[] = [
  
  {
    id: '2',
    name: 'Sushi Master',
    image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGphcG9uYWlzfGVufDB8fDB8fHww',
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
    tags: ['Asian', 'Japanese'],
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
    tags: ['Italian', 'Fast Food'],
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
    tags: ['Fast Food', 'American'],
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
    tags: ['Asian', 'Spicy'],
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
    tags: ['Asian', 'Chinese'],
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
    tags: ['Vegan', 'Healthy'],
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
    tags: ['Oriental', 'Gourmet'],
  },
  {
    id: "9",
    name: "The French Touch",
    image: "https://picsum.photos/200/200?random=1",
    rating: 4.8,
    deliveryTime: "30-40",
    category: "FastFood • French • Gourmet",
    priceCategory: "€€",
    description: "Des burgers à la française avec une touche gastronomique",
    isOpen: true,
    minimumOrder: 15,
    menu: [
      {
        id: "1",
        name: "Burgers",
        category: "main",
        description: "Nos burgers signature",
        price: 0
      },
      {
        id: "2",
        name: "Burger Bleu",
        category: "main",
        description: "Steak haché, fromage bleu, oignons caramélisés",
        price: 16.90,
        image: "https://picsum.photos/200/200?random=2"
      }
    ],
    deliveryFee: '2.99',
    address: '123 rue Example, 75001 Paris',
  },
  {
    id: "10",
    name: "Black Bun Factory",
    image: "https://picsum.photos/200/200?random=3",
    rating: 4.9,
    deliveryTime: "30-40",
    category: "FastFood • Oriental Bun • Gourmet",
    priceCategory: "€€",
    description: "Burgers créatifs avec pains noirs artisanaux",
    isOpen: true,
    minimumOrder: 15,
    menu: [
      {
        id: "1",
        name: "Signatures",
        category: "main",
        description: "Nos créations exclusives",
        price: 0
      },
      {
        id: "2",
        name: "Black Truffle",
        category: "main",
        description: "Pain noir, steak, truffe, roquette",
        price: 18.90,
        image: "https://picsum.photos/200/200?random=4"
      }
    ],
    deliveryFee: '2.99',
    address: '123 rue Example, 75001 Paris',
  },
  {
    id: "12",
    name: "Poke Bowl Bar",
    image: "https://picsum.photos/200/200?random=5",
    rating: 4.7,
    deliveryTime: "15-20",
    category: "FastFood • Végétarien • Healthy",
    priceCategory: "€€",
    description: "Burgers végétariens et options healthy",
    isOpen: true,
    minimumOrder: 12,
    menu: [
      {
        id: "1",
        name: "Veggie Burgers",
        category: "main",
        description: "Nos burgers végétariens",
        price: 0
      },
      {
        id: "2",
        name: "Beyond Burger",
        category: "main",
        description: "Steak végétal, avocat, cheddar végétal",
        price: 15.90,
        image: "https://picsum.photos/200/200?random=6"
      }
    ],
    deliveryFee: '2.99',
    address: '123 rue Example, 75001 Paris',
    tags: ['Healthy', 'Asian', 'Vegan'],
  },
  {
    id: "13",
    name: "Vegan Corner",
    image: "https://picsum.photos/200/200?random=7",
    rating: 4.4,
    deliveryTime: "15-30",
    category: "FastFood • Cheese Lovers • Vegan",
    priceCategory: "€€",
    description: "Le paradis des amateurs de fromage végétal",
    isOpen: true,
    minimumOrder: 10,
    menu: [
      {
        id: "1",
        name: "Burgers",
        category: "main",
        description: "Nos burgers fromagers",
        price: 0
      },
      {
        id: "2",
        name: "Triple Cheese",
        category: "main",
        description: "Trois fromages différents végétaux, steak végétal double",
        price: 17.90,
        image: "https://picsum.photos/200/200?random=8"
      }
    ],
    deliveryFee: '2.99',
    address: '123 rue Example, 75001 Paris',
    tags: ['Vegan', 'Fast Food'],
  },
  {
    id: "14",
    name: "Burger Palace",
    image: "https://picsum.photos/200/200?random=9",
    rating: 4.5,
    deliveryTime: "20-30",
    category: "FastFood • American • Burgers",
    priceCategory: "€€",
    description: "L'authentique burger américain",
    isOpen: true,
    minimumOrder: 12,
    menu: [
      {
        id: "1",
        name: "Classics",
        category: "main",
        description: "Nos burgers classiques",
        price: 0
      },
      {
        id: "2",
        name: "Palace Burger",
        category: "main",
        description: "Le burger signature de la maison",
        price: 16.90,
        image: "https://picsum.photos/200/200?random=10"
      }
    ],
    deliveryFee: '2.99',
    address: '123 rue Example, 75001 Paris',
    tags: ['Fast Food', 'American'],
  },
  {
    id: "15",
    name: "Smash & Grill",
    image: "https://picsum.photos/200/200?random=11",
    rating: 4.8,
    deliveryTime: "20-30",
    category: "FastFood • Grilled • Burgers",
    priceCategory: "€€",
    description: "Spécialiste du smash burger",
    isOpen: true,
    minimumOrder: 15,
    menu: [
      {
        id: "1",
        name: "Smash Burgers",
        category: "main",
        description: "Nos smash burgers signature",
        price: 0
      },
      {
        id: "2",
        name: "Double Smash",
        category: "main",
        description: "Double viande smashée, cheddar fondant",
        price: 15.90,
        image: "https://picsum.photos/200/200?random=12"
      }
    ],
    deliveryFee: '2.99',
    address: '123 rue Example, 75001 Paris',
    tags: ['Fast Food', 'American', 'Gourmet'],
  },
  {
    id: "16",
    name: "American Road House",
    image: "https://picsum.photos/200/200?random=13",
    rating: 4.3,
    deliveryTime: "20-30",
    category: "FastFood • American • Burgers",
    priceCategory: "€€",
    description: "L'esprit des diners américains",
    isOpen: true,
    minimumOrder: 10,
    menu: [
      {
        id: "1",
        name: "House Burgers",
        category: "main",
        description: "Nos burgers maison",
        price: 0
      },
      {
        id: "2",
        name: "Road Trip Burger",
        category: "main",
        description: "Le burger qui vous fait voyager",
        price: 14.90,
        image: "https://picsum.photos/200/200?random=14"
      }
    ],
    deliveryFee: '2.99',
    address: '123 rue Example, 75001 Paris',
    tags: ['Fast Food', 'American', 'Dessert'],
  },
  {
    id: "17",
    name: "Wild West Burgers",
    image: "https://picsum.photos/200/200?random=15",
    rating: 4.6,
    deliveryTime: "20-30",
    category: "FastFood • Western • BBQ",
    priceCategory: "€€",
    description: "L'authentique saveur du Far West",
    isOpen: true,
    minimumOrder: 15,
    menu: [
      {
        id: "1",
        name: "Western Specials",
        category: "main",
        description: "Nos spécialités western",
        price: 0
      },
      {
        id: "2",
        name: "Rodeo Burger",
        category: "main",
        description: "Triple viande, sauce BBQ maison",
        price: 19.90,
        image: "https://picsum.photos/200/200?random=16"
      }
    ],
    deliveryFee: '2.99',
    address: '123 rue Example, 75001 Paris',
    tags: ['Fast Food', 'American', 'BBQ'],
  }
];

export const MENU_CATEGORIES = [
  'Tout',
  'Entrées',
  'Plats',
  'Desserts',
  'Boissons',
  'Specialités',
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
};