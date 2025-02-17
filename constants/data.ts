export interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  tags: string[];
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
    id: 1,
    name: "Sushi Master",
    image: "https://picsum.photos/200/200?random=1",
    rating: 4.6,
    deliveryTime: "20-35",
    deliveryFee: "3.99",
    tags: ["asian", "vegan", "healthy"],
    category: "Japonais",
    priceCategory: "€€€",
    description: "Les meilleurs sushis de la ville",
    address: "8 rue du Dragon, 75006 Paris",
    isOpen: true,
    minimumOrder: 20,
    menu: [
      {
        id: "1-1",
        name: "Entrées",
        category: "Entrées",
        description: "Nos entrées japonaises",
        price: 0
      },
      {
        id: "1-2",
        name: "Edamame",
        category: "Entrées",
        description: "Fèves de soja vapeur au sel de mer",
        price: 5.90,
        image: "https://picsum.photos/200/200?random=2"
      },
      {
        id: "1-3",
        name: "Gyoza",
        category: "Entrées",
        description: "Raviolis japonais grillés aux légumes",
        price: 7.90,
        image: "https://picsum.photos/200/200?random=3"
      },
      {
        id: "1-4",
        name: "Sushis",
        category: "Plats",
        description: "Nos sushis signature",
        price: 0
      },
      {
        id: "1-5",
        name: "Plateau Royal",
        category: "Plats",
        description: "24 pièces : sashimi, maki, nigiri",
        price: 32.90,
        image: "https://picsum.photos/200/200?random=4",
        options: [
          {
            name: "Wasabi",
            choices: [
              { id: 1, name: "Normal", price: 0 },
              { id: 2, name: "Extra", price: 1 },
              { id: 3, name: "Sans", price: 0 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Bella Pizza",
    image: "https://picsum.photos/200/200?random=5",
    rating: 4.3,
    deliveryTime: "25-40",
    deliveryFee: "2.99",
    tags: ["italian"],
    category: "Italien",
    priceCategory: "€€",
    description: "Pizzas authentiques cuites au feu de bois",
    address: "15 rue de la Roquette, 75011 Paris",
    isOpen: true,
    minimumOrder: 15,
    menu: [
      {
        id: "2-1",
        name: "Antipasti",
        category: "Entrées",
        description: "Nos entrées italiennes",
        price: 0
      },
      {
        id: "2-2",
        name: "Bruschetta",
        category: "Entrées",
        description: "Pain grillé, tomates, basilic, huile d'olive",
        price: 6.90,
        image: "https://picsum.photos/200/200?random=6"
      },
      {
        id: "2-3",
        name: "Pizzas",
        category: "Plats",
        description: "Nos pizzas artisanales",
        price: 0
      },
      {
        id: "2-4",
        name: "Margherita",
        category: "Plats",
        description: "Sauce tomate, mozzarella, basilic frais",
        price: 12.90,
        image: "https://picsum.photos/200/200?random=7",
        options: [
          {
            name: "Taille",
            choices: [
              { id: 1, name: "Medium", price: 0 },
              { id: 2, name: "Large", price: 3 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Green Garden",
    image: "https://picsum.photos/200/200?random=8",
    rating: 4.7,
    deliveryTime: "15-30",
    deliveryFee: "2.49",
    tags: ["vegan", "healthy"],
    category: "Healthy",
    priceCategory: "€€",
    description: "Restaurant végétalien et healthy",
    address: "22 rue des Martyrs, 75009 Paris",
    isOpen: true,
    minimumOrder: 15,
    menu: [
      {
        id: "3-1",
        name: "Bowls",
        category: "Plats",
        description: "Nos bowls healthy",
        price: 0
      },
      {
        id: "3-2",
        name: "Buddha Bowl",
        category: "Plats",
        description: "Quinoa, avocat, pois chiches, légumes de saison",
        price: 14.90,
        image: "https://picsum.photos/200/200?random=9",
        options: [
          {
            name: "Protéine",
            choices: [
              { id: 1, name: "Tofu", price: 0 },
              { id: 2, name: "Tempeh", price: 1 }
            ]
          }
        ]
      },
      {
        id: "3-3",
        name: "Desserts",
        category: "Desserts",
        description: "Nos desserts vegan",
        price: 0
      },
      {
        id: "3-4",
        name: "Cheesecake",
        category: "Desserts",
        description: "Cheesecake végétal aux fruits rouges",
        price: 6.90,
        image: "https://picsum.photos/200/200?random=10"
      }
    ]
  },
  {
    id: 4,
    name: "Le Coq Français",
    image: "https://picsum.photos/200/200?random=20",
    rating: 4.8,
    deliveryTime: "30-45",
    deliveryFee: "3.99",
    tags: ["french"],
    category: "Français",
    priceCategory: "€€€",
    description: "Cuisine française raffinée et traditionnelle",
    address: "12 rue Saint-Honoré, 75001 Paris",
    isOpen: true,
    minimumOrder: 25,
    menu: [
      {
        id: "4-1",
        name: "Entrées",
        category: "Entrées",
        description: "Les classiques de la gastronomie française",
        price: 0
      },
      {
        id: "4-2",
        name: "Foie Gras Maison",
        category: "Entrées",
        description: "Foie gras mi-cuit, chutney de figues, pain brioché",
        price: 18.90,
        image: "https://picsum.photos/200/200?random=21"
      },
      {
        id: "4-3",
        name: "Plats",
        category: "Plats",
        description: "Nos spécialités",
        price: 0
      },
      {
        id: "4-4",
        name: "Coq au Vin",
        category: "Plats",
        description: "Coq mijoté au vin rouge, lardons, champignons",
        price: 24.90,
        image: "https://picsum.photos/200/200?random=22",
        options: [
          {
            name: "Accompagnement",
            choices: [
              { id: 1, name: "Pommes purée", price: 0 },
              { id: 2, name: "Gratin dauphinois", price: 2 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Spice Paradise",
    image: "https://picsum.photos/200/200?random=23",
    rating: 4.5,
    deliveryTime: "25-40",
    deliveryFee: "2.99",
    tags: ["indian", "vegan"],
    category: "Indien",
    priceCategory: "€€",
    description: "Saveurs authentiques de l'Inde",
    address: "5 rue du Faubourg Poissonnière, 75010 Paris",
    isOpen: true,
    minimumOrder: 20,
    menu: [
      {
        id: "5-1",
        name: "Entrées",
        category: "Entrées",
        description: "Nos entrées épicées",
        price: 0
      },
      {
        id: "5-2",
        name: "Pakoras Mix",
        category: "Entrées",
        description: "Assortiment de légumes frits aux épices",
        price: 8.90,
        image: "https://picsum.photos/200/200?random=24"
      },
      {
        id: "5-3",
        name: "Plats",
        category: "Plats",
        description: "Nos currys maison",
        price: 0
      },
      {
        id: "5-4",
        name: "Dal Makhani",
        category: "Plats",
        description: "Lentilles noires mijotées, sauce crémeuse",
        price: 16.90,
        image: "https://picsum.photos/200/200?random=25",
        options: [
          {
            name: "Niveau d'épices",
            choices: [
              { id: 1, name: "Doux", price: 0 },
              { id: 2, name: "Moyen", price: 0 },
              { id: 3, name: "Fort", price: 0 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Sweet Factory",
    image: "https://picsum.photos/200/200?random=26",
    rating: 4.6,
    deliveryTime: "15-30",
    deliveryFee: "3.49",
    tags: ["dessert", "drinks"],
    category: "Desserts",
    priceCategory: "€€",
    description: "Les meilleurs desserts de Paris",
    address: "18 rue des Abbesses, 75018 Paris",
    isOpen: true,
    minimumOrder: 15,
    menu: [
      {
        id: "6-1",
        name: "Desserts Classiques",
        category: "Desserts",
        description: "Nos desserts signatures",
        price: 0
      },
      {
        id: "6-2",
        name: "Moelleux au Chocolat",
        category: "Desserts",
        description: "Cœur coulant au chocolat noir, glace vanille",
        price: 8.90,
        image: "https://picsum.photos/200/200?random=27",
        options: [
          {
            name: "Extra",
            choices: [
              { id: 1, name: "Sauce caramel", price: 1 },
              { id: 2, name: "Chantilly", price: 0.5 }
            ]
          }
        ]
      },
      {
        id: "6-3",
        name: "Boissons",
        category: "Drinks",
        description: "Nos boissons maison",
        price: 0
      },
      {
        id: "6-4",
        name: "Milkshake",
        category: "Drinks",
        description: "Milkshake crémeux",
        price: 6.90,
        image: "https://picsum.photos/200/200?random=28",
        options: [
          {
            name: "Parfum",
            choices: [
              { id: 1, name: "Vanille", price: 0 },
              { id: 2, name: "Chocolat", price: 0 },
              { id: 3, name: "Fraise", price: 0 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 7,
    name: "Quick Burger",
    image: "https://picsum.photos/200/200?random=29",
    rating: 4.2,
    deliveryTime: "15-25",
    deliveryFee: "2.99",
    tags: ["fastfood"],
    category: "Burgers",
    priceCategory: "€",
    description: "Burgers gourmets et frites maison",
    address: "33 rue Oberkampf, 75011 Paris",
    isOpen: true,
    minimumOrder: 12,
    menu: [
      {
        id: "7-1",
        name: "Nos Burgers",
        category: "Burgers",
        description: "Burgers signature",
        price: 0
      },
      {
        id: "7-2",
        name: "Classic Cheese",
        category: "Burgers",
        description: "Bœuf, cheddar, salade, tomate, oignon, sauce maison",
        price: 9.90,
        image: "https://picsum.photos/200/200?random=30",
        options: [
          {
            name: "Cuisson",
            choices: [
              { id: 1, name: "Saignant", price: 0 },
              { id: 2, name: "À point", price: 0 },
              { id: 3, name: "Bien cuit", price: 0 }
            ]
          },
          {
            name: "Extra",
            choices: [
              { id: 4, name: "Double steak", price: 3 },
              { id: 5, name: "Bacon", price: 1 }
            ]
          }
        ]
      },
      {
        id: "7-3",
        name: "Accompagnements",
        category: "Sides",
        description: "Nos sides maison",
        price: 0
      },
      {
        id: "7-4",
        name: "Frites Maison",
        category: "Sides",
        description: "Frites fraîches, sel aux herbes",
        price: 3.90,
        image: "https://picsum.photos/200/200?random=31",
        options: [
          {
            name: "Sauce",
            choices: [
              { id: 1, name: "Ketchup", price: 0 },
              { id: 2, name: "Mayo", price: 0 },
              { id: 3, name: "BBQ", price: 0 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 8,
    name: "Oriental Palace",
    image: "https://picsum.photos/200/200?random=40",
    rating: 4.4,
    deliveryTime: "25-45",
    deliveryFee: "3.49",
    tags: ["oriental", "vegan"],
    category: "Libanais",
    priceCategory: "€€",
    description: "Spécialités libanaises authentiques",
    address: "14 rue de la Fontaine au Roi, 75011 Paris",
    isOpen: true,
    minimumOrder: 18,
    menu: [
      {
        id: "8-1",
        name: "Mezze",
        category: "Entrées",
        description: "Nos mezze traditionnels",
        price: 0
      },
      {
        id: "8-2",
        name: "Plateau Mezze",
        category: "Entrées",
        description: "Houmous, moutabal, taboulé, falafel",
        price: 16.90,
        image: "https://picsum.photos/200/200?random=41",
        options: [
          {
            name: "Taille",
            choices: [
              { id: 1, name: "2 personnes", price: 0 },
              { id: 2, name: "4 personnes", price: 15 }
            ]
          }
        ]
      },
      {
        id: "8-3",
        name: "Grillades",
        category: "Plats",
        description: "Nos grillades signature",
        price: 0
      },
      {
        id: "8-4",
        name: "Mixed Grill",
        category: "Plats",
        description: "Assortiment de viandes grillées, riz aux vermicelles",
        price: 22.90,
        image: "https://picsum.photos/200/200?random=42"
      }
    ]
  },
  {
    id: 9,
    name: "Healthy Bowl",
    image: "https://picsum.photos/200/200?random=43",
    rating: 4.7,
    deliveryTime: "15-30",
    deliveryFee: "2.99",
    tags: ["healthy", "vegan"],
    category: "Healthy",
    priceCategory: "€€",
    description: "Bowls healthy et personnalisables",
    address: "28 rue du Temple, 75004 Paris",
    isOpen: true,
    minimumOrder: 15,
    menu: [
      {
        id: "9-1",
        name: "Nos Bowls",
        category: "Bowls",
        description: "Bowls équilibrés et savoureux",
        price: 0
      },
      {
        id: "9-2",
        name: "Super Green Bowl",
        category: "Bowls",
        description: "Quinoa, avocat, épinards, edamame, graines",
        price: 13.90,
        image: "https://picsum.photos/200/200?random=44",
        options: [
          {
            name: "Base",
            choices: [
              { id: 1, name: "Quinoa", price: 0 },
              { id: 2, name: "Riz complet", price: 0 },
              { id: 3, name: "Boulgour", price: 0 }
            ]
          },
          {
            name: "Protéine",
            choices: [
              { id: 4, name: "Tofu mariné", price: 0 },
              { id: 5, name: "Falafels", price: 0 },
              { id: 6, name: "Tempeh", price: 1 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 10,
    name: "Bubble Tea House",
    image: "https://picsum.photos/200/200?random=45",
    rating: 4.5,
    deliveryTime: "15-25",
    deliveryFee: "2.99",
    tags: ["drinks", "dessert"],
    category: "Boissons",
    priceCategory: "€",
    description: "Bubble tea et desserts asiatiques",
    address: "9 rue Sainte-Anne, 75001 Paris",
    isOpen: true,
    minimumOrder: 10,
    menu: [
      {
        id: "10-1",
        name: "Bubble Tea",
        category: "Drinks",
        description: "Nos bubble teas signature",
        price: 0
      },
      {
        id: "10-2",
        name: "Classic Milk Tea",
        category: "Drinks",
        description: "Thé noir, lait, perles de tapioca",
        price: 5.90,
        image: "https://picsum.photos/200/200?random=46",
        options: [
          {
            name: "Sucre",
            choices: [
              { id: 1, name: "Normal", price: 0 },
              { id: 2, name: "Peu sucré", price: 0 },
              { id: 3, name: "Sans sucre", price: 0 }
            ]
          },
          {
            name: "Toppings",
            choices: [
              { id: 4, name: "Perles classiques", price: 0 },
              { id: 5, name: "Perles au fruit", price: 0.5 },
              { id: 6, name: "Gelée de lychee", price: 0.5 }
            ]
          }
        ]
      },
      {
        id: "10-3",
        name: "Desserts",
        category: "Desserts",
        description: "Nos desserts asiatiques",
        price: 0
      },
      {
        id: "10-4",
        name: "Mochi Mix",
        category: "Desserts",
        description: "Assortiment de 3 mochis",
        price: 6.90,
        image: "https://picsum.photos/200/200?random=47"
      }
    ]
  },
  {
    id: 11,
    name: "Pasta Express",
    image: "https://picsum.photos/200/200?random=48",
    rating: 4.3,
    deliveryTime: "20-35",
    deliveryFee: "2.99",
    tags: ["italian", "fastfood"],
    category: "Italien",
    priceCategory: "€€",
    description: "Pâtes fraîches maison",
    address: "55 rue de la Convention, 75015 Paris",
    isOpen: true,
    minimumOrder: 12,
    menu: [
      {
        id: "11-1",
        name: "Pâtes",
        category: "Plats",
        description: "Nos pâtes fraîches",
        price: 0
      },
      {
        id: "11-2",
        name: "Carbonara",
        category: "Plats",
        description: "Pâtes fraîches, crème, lardons, œuf, parmesan",
        price: 13.90,
        image: "https://picsum.photos/200/200?random=49",
        options: [
          {
            name: "Type de pâtes",
            choices: [
              { id: 1, name: "Spaghetti", price: 0 },
              { id: 2, name: "Penne", price: 0 },
              { id: 3, name: "Tagliatelle", price: 0 }
            ]
          },
          {
            name: "Extra",
            choices: [
              { id: 4, name: "Parmesan râpé", price: 1 },
              { id: 5, name: "Champignons", price: 1.5 }
            ]
          }
        ]
      },
      {
        id: "11-3",
        name: "Desserts",
        category: "Desserts",
        description: "Nos desserts italiens",
        price: 0
      },
      {
        id: "11-4",
        name: "Tiramisu",
        category: "Desserts",
        description: "Tiramisu traditionnel au café",
        price: 6.90,
        image: "https://picsum.photos/200/200?random=50"
      }
    ]
  },
  {
    id: 12,
    name: "Asian Street Food",
    image: "https://picsum.photos/200/200?random=60",
    rating: 4.4,
    deliveryTime: "20-35",
    deliveryFee: "2.99",
    tags: ["asian", "fastfood"],
    category: "Street Food",
    priceCategory: "€",
    description: "Le meilleur de la street food asiatique",
    address: "45 rue de Belleville, 75019 Paris",
    isOpen: true,
    minimumOrder: 15,
    menu: [
      {
        id: "12-1",
        name: "Bao Buns",
        category: "Entrées",
        description: "Nos bao buns moelleux",
        price: 0
      },
      {
        id: "12-2",
        name: "Bao Porc Caramélisé",
        category: "Entrées",
        description: "Porc mijoté, concombre mariné, cacahuètes",
        price: 6.90,
        image: "https://picsum.photos/200/200?random=61",
        options: [
          {
            name: "Épices",
            choices: [
              { id: 1, name: "Normal", price: 0 },
              { id: 2, name: "Épicé", price: 0 }
            ]
          }
        ]
      },
      {
        id: "12-3",
        name: "Plats",
        category: "Plats",
        description: "Nos spécialités",
        price: 0
      },
      {
        id: "12-4",
        name: "Pad Thai",
        category: "Plats",
        description: "Nouilles de riz sautées aux légumes et cacahuètes",
        price: 12.90,
        image: "https://picsum.photos/200/200?random=62",
        options: [
          {
            name: "Protéine",
            choices: [
              { id: 1, name: "Poulet", price: 0 },
              { id: 2, name: "Crevettes", price: 2 },
              { id: 3, name: "Tofu", price: 0 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 13,
    name: "Délices de Provence",
    image: "https://picsum.photos/200/200?random=63",
    rating: 4.7,
    deliveryTime: "25-40",
    deliveryFee: "3.49",
    tags: ["french", "healthy"],
    category: "Français",
    priceCategory: "€€",
    description: "Cuisine provençale authentique",
    address: "17 rue Montorgueil, 75002 Paris",
    isOpen: true,
    minimumOrder: 20,
    menu: [
      {
        id: "13-1",
        name: "Entrées Provençales",
        category: "Entrées",
        description: "Nos entrées du Sud",
        price: 0
      },
      {
        id: "13-2",
        name: "Tapenade & Crudités",
        category: "Entrées",
        description: "Assortiment de tapenades maison et légumes frais",
        price: 8.90,
        image: "https://picsum.photos/200/200?random=64"
      },
      {
        id: "13-3",
        name: "Plats",
        category: "Plats",
        description: "Nos spécialités provençales",
        price: 0
      },
      {
        id: "13-4",
        name: "Ratatouille",
        category: "Plats",
        description: "Légumes du soleil mijotés à l'huile d'olive",
        price: 16.90,
        image: "https://picsum.photos/200/200?random=65",
        options: [
          {
            name: "Accompagnement",
            choices: [
              { id: 1, name: "Riz de Camargue", price: 0 },
              { id: 2, name: "Quinoa", price: 0 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 14,
    name: "Sweet & Coffee",
    image: "https://picsum.photos/200/200?random=66",
    rating: 4.6,
    deliveryTime: "15-25",
    deliveryFee: "2.99",
    tags: ["drinks", "dessert"],
    category: "Café",
    priceCategory: "€€",
    description: "Pâtisseries maison et cafés de spécialité",
    address: "88 rue des Martyrs, 75018 Paris",
    isOpen: true,
    minimumOrder: 12,
    menu: [
      {
        id: "14-1",
        name: "Boissons Chaudes",
        category: "Drinks",
        description: "Nos cafés et chocolats chauds",
        price: 0
      },
      {
        id: "14-2",
        name: "Latte Artisanal",
        category: "Drinks",
        description: "Café signature avec lait mousseux",
        price: 4.90,
        image: "https://picsum.photos/200/200?random=67",
        options: [
          {
            name: "Lait",
            choices: [
              { id: 1, name: "Lait de vache", price: 0 },
              { id: 2, name: "Lait d'amande", price: 0.5 },
              { id: 3, name: "Lait d'avoine", price: 0.5 }
            ]
          },
          {
            name: "Sirop",
            choices: [
              { id: 4, name: "Vanille", price: 0.5 },
              { id: 5, name: "Caramel", price: 0.5 },
              { id: 6, name: "Noisette", price: 0.5 }
            ]
          }
        ]
      },
      {
        id: "14-3",
        name: "Pâtisseries",
        category: "Desserts",
        description: "Nos pâtisseries maison",
        price: 0
      },
      {
        id: "14-4",
        name: "Carrot Cake",
        category: "Desserts",
        description: "Gâteau aux carottes, cream cheese, noix",
        price: 5.90,
        image: "https://picsum.photos/200/200?random=68"
      }
    ]
  },
  {
    id: 15,
    name: "Veggie World",
    image: "https://picsum.photos/200/200?random=69",
    rating: 4.8,
    deliveryTime: "20-35",
    deliveryFee: "2.99",
    tags: ["vegan", "healthy"],
    category: "Végétarien",
    priceCategory: "€€",
    description: "Restaurant 100% végétal et healthy",
    address: "32 rue de Paradis, 75010 Paris",
    isOpen: true,
    minimumOrder: 15,
    menu: [
      {
        id: "15-1",
        name: "Salades",
        category: "Entrées",
        description: "Nos salades composées",
        price: 0
      },
      {
        id: "15-2",
        name: "Super Kale",
        category: "Entrées",
        description: "Kale, avocat, grenade, graines de courge",
        price: 9.90,
        image: "https://picsum.photos/200/200?random=70",
        options: [
          {
            name: "Extra",
            choices: [
              { id: 1, name: "Tofu fumé", price: 2 },
              { id: 2, name: "Avocat", price: 1.5 }
            ]
          }
        ]
      },
      {
        id: "15-3",
        name: "Burgers Vegan",
        category: "Plats",
        description: "Nos burgers végétaux",
        price: 0
      },
      {
        id: "15-4",
        name: "Beyond Burger",
        category: "Plats",
        description: "Steak végétal, cheddar végétal, sauce spéciale",
        price: 14.90,
        image: "https://picsum.photos/200/200?random=71",
        options: [
          {
            name: "Accompagnement",
            choices: [
              { id: 1, name: "Frites de patates douces", price: 0 },
              { id: 2, name: "Salade", price: 0 }
            ]
          }
        ]
      }
    ]
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
  category: string;
  description: string;
  price: number;
  image?: string;
  options?: {
    name: string;
    choices: {
      id: number;
      name: string;
      price: number;
    }[];
  }[];
}