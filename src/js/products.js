/*
 * Catálogo de produtos (dados de exemplo, enquanto não há API).
 * price em centavos. O id da URL é gerado a partir do nome (ver script.js).
 */
const PRODUCTS = [
  {
    name: "PlayStation 5 Slim",
    price: 399990,
    image: "/public/images/products/ps5.jpg",
    category: "consoles",
    brand: "Sony",
    spec: "1 TB",
    description:
      "Console PlayStation 5 Slim com 1 TB de armazenamento, acompanhado do controle sem fio DualSense.",
  },
  {
    name: "Xbox Series S",
    price: 269990,
    image: "/public/images/products/xbox-series-s.jpg",
    category: "consoles",
    brand: "Microsoft",
    spec: "512 GB",
    description:
      "Console Xbox Series S com 512 GB de armazenamento, acompanhado de um controle sem fio.",
  },
  {
    name: "Nintendo Switch OLED",
    price: 229990,
    image: "/public/images/products/switch-oled.png",
    category: "consoles",
    brand: "Nintendo",
    spec: "64 GB",
    description:
      "Nintendo Switch com tela OLED e 64 GB de armazenamento. Joga na TV, no modo portátil ou de mesa.",
  },
  {
    name: "Headset Gamer RGB",
    price: 24990,
    image: "/public/images/products/headset.jpg",
    category: "acessorios",
    brand: "Multiplataforma",
    spec: "Som Surround",
    description:
      "Headset gamer com som surround e iluminação RGB, compatível com várias plataformas.",
  },
  {
    name: "Teclado Mecânico RGB",
    price: 32990,
    image: "/public/images/products/keyboard.jpg",
    category: "acessorios",
    brand: "Logitech",
    spec: "Switch Red",
    description:
      "Teclado mecânico com switches Red e iluminação RGB, para jogar e trabalhar com conforto.",
  },
  {
    name: "Marvel's Spider-Man 2",
    price: 34990,
    image: "/public/images/games/game-1.jpg",
    category: "jogos",
    brand: "PS5",
    spec: "PS5",
    description: "Jogo de ação e aventura para PlayStation 5.",
  },
  {
    name: "Forza Horizon 5",
    price: 29990,
    image: "/public/images/games/game-2.jpg",
    category: "jogos",
    brand: "Xbox",
    spec: "Xbox",
    description: "Jogo de corrida em mundo aberto para Xbox.",
  },
  {
    name: "Final Fantasy XVI",
    price: 34990,
    image: "/public/images/games/game-3.jpg",
    category: "jogos",
    brand: "PS5",
    spec: "PS5",
    description: "RPG de ação para PlayStation 5.",
  },
  {
    name: "The Legend of Zelda: Tears of the Kingdom",
    price: 32990,
    image: "/public/images/games/game-4.jpg",
    category: "jogos",
    brand: "Switch",
    spec: "Switch",
    description: "Aventura em mundo aberto para Nintendo Switch.",
  },
  {
    name: "Starfield",
    price: 29990,
    image: "/public/images/games/game-5.jpg",
    category: "jogos",
    brand: "Xbox",
    spec: "Xbox",
    description: "RPG de exploração espacial para Xbox.",
  },
  {
    name: "Xbox Series X",
    price: 549990,
    image: "/public/images/products/xbox-series-x.jpg",
    category: "consoles",
    brand: "Microsoft",
    spec: "1 TB",
    description:
      "Console Xbox Series X com 1 TB de armazenamento, o mais potente da família Xbox.",
  },
  {
    name: "Nintendo Switch Lite",
    price: 169990,
    image: "/public/images/products/switch-lite.jpg",
    category: "consoles",
    brand: "Nintendo",
    spec: "32 GB",
    description:
      "Versão portátil do Nintendo Switch, compacta e feita para jogar em qualquer lugar.",
  },
  {
    name: "Steam Deck",
    price: 449990,
    image: "/public/images/products/steam-deck.jpg",
    category: "consoles",
    brand: "Valve",
    spec: "Portátil",
    description:
      "Console portátil da Valve para jogar a sua biblioteca do Steam onde estiver.",
  },
  {
    name: "Meta Quest 3",
    price: 379990,
    image: "/public/images/products/quest-3.jpg",
    category: "consoles",
    brand: "Meta",
    spec: "Realidade mista",
    description:
      "Headset de realidade virtual e mista, sem fios, para jogar e explorar mundos virtuais.",
  },
  {
    name: "Controle DualSense",
    price: 49990,
    image: "/public/images/products/dualsense.jpg",
    category: "acessorios",
    brand: "Sony",
    spec: "PS5",
    description:
      "Controle sem fio DualSense para PlayStation 5, com gatilhos adaptáveis e feedback tátil.",
  },
  {
    name: "Controle Xbox sem fio",
    price: 44990,
    image: "/public/images/products/xbox-controller.jpg",
    category: "acessorios",
    brand: "Microsoft",
    spec: "Xbox / PC",
    description:
      "Controle sem fio para Xbox e PC, com pegada confortável e resposta precisa.",
  },
  {
    name: "Mouse Gamer sem fio",
    price: 59990,
    image: "/public/images/products/mouse.jpg",
    category: "acessorios",
    brand: "Logitech",
    spec: "Sem fio",
    description:
      "Mouse gamer sem fio, leve e preciso, para jogar com agilidade.",
  },
  {
    name: "PC Gamer RGB",
    price: 899990,
    image: "/public/images/promos/pc.jpg",
    category: "pc-gamer",
    spec: "Refrigeração líquida",
    description:
      "PC gamer com iluminação RGB e refrigeração líquida do processador, pronto para os jogos mais exigentes.",
  },
  {
    name: "Super Nintendo (SNES)",
    price: 79990,
    image: "/public/images/collectibles/snes.jpg",
    category: "colecionaveis",
    brand: "Nintendo",
    spec: "Console clássico",
    description:
      "Console clássico de 16 bits da Nintendo, item de coleção para quem gosta de games retrô.",
  },
  {
    name: "Nintendo 64",
    price: 99990,
    image: "/public/images/collectibles/n64.jpg",
    category: "colecionaveis",
    brand: "Nintendo",
    spec: "Console clássico",
    description:
      "Console Nintendo 64, que levou o 3D para os jogos de casa. Um clássico para colecionadores.",
  },
  {
    name: "Game Boy Original",
    price: 59990,
    image: "/public/images/collectibles/game-boy.jpg",
    category: "colecionaveis",
    brand: "Nintendo",
    spec: "Portátil clássico",
    description:
      "Portátil original da Nintendo, ícone dos anos 90 e peça de coleção.",
  },
  {
    name: "Sega Genesis",
    price: 69990,
    image: "/public/images/collectibles/genesis.jpg",
    category: "colecionaveis",
    brand: "Sega",
    spec: "Console clássico",
    description:
      "Console Sega Genesis (Mega Drive), clássico dos 16 bits para colecionadores.",
  },
  {
    name: "Atari 2600",
    price: 74990,
    image: "/public/images/collectibles/atari-2600.jpg",
    category: "colecionaveis",
    brand: "Atari",
    spec: "Console clássico",
    description:
      "Atari 2600, um dos primeiros consoles domésticos. Peça histórica para a coleção.",
  },
  {
    name: "PlayStation 1",
    price: 64990,
    image: "/public/images/collectibles/playstation-1.jpg",
    category: "colecionaveis",
    brand: "Sony",
    spec: "Console clássico",
    description:
      "PlayStation original, que marcou a chegada dos jogos em CD. Item de coleção.",
  },
  {
    name: "PlayStation 4",
    price: 199990,
    image: "/public/images/products/ps4.jpg",
    category: "consoles",
    brand: "Sony",
    spec: "Com controle",
    description:
      "Console PlayStation 4 acompanhado do controle DualShock 4.",
  },
  {
    name: "Xbox 360",
    price: 129990,
    image: "/public/images/products/xbox-360.jpg",
    category: "consoles",
    brand: "Microsoft",
    spec: "Com controle",
    description:
      "Console Xbox 360 acompanhado de um controle sem fio.",
  },
  {
    name: "Controle DualShock 4",
    price: 34990,
    image: "/public/images/products/dualshock-4.jpg",
    category: "acessorios",
    brand: "Sony",
    spec: "PS4",
    description:
      "Controle sem fio DualShock 4 para PlayStation 4.",
  },
  {
    name: "Controle Switch Pro",
    price: 49990,
    image: "/public/images/products/switch-pro-controller.jpg",
    category: "acessorios",
    brand: "Nintendo",
    spec: "Switch",
    description:
      "Controle Pro para Nintendo Switch, com pegada de console de mesa.",
  },
  {
    name: "Wii Remote com Nunchuk",
    price: 19990,
    image: "/public/images/products/wii-remote.jpg",
    category: "acessorios",
    brand: "Nintendo",
    spec: "Wii",
    description:
      "Controle Wii Remote acompanhado do Nunchuk, para jogar com movimento.",
  },
  {
    name: "Nintendo Entertainment System (NES)",
    price: 89990,
    image: "/public/images/collectibles/nes.jpg",
    category: "colecionaveis",
    brand: "Nintendo",
    spec: "Console clássico",
    description:
      "O NES, console 8 bits que marcou uma geração. Item de coleção.",
  },
  {
    name: "Nintendo GameCube",
    price: 74990,
    image: "/public/images/collectibles/gamecube.jpg",
    category: "colecionaveis",
    brand: "Nintendo",
    spec: "Console clássico",
    description:
      "Console Nintendo GameCube, compacto e cheio de clássicos. Peça de coleção.",
  },
  {
    name: "Sega Dreamcast",
    price: 84990,
    image: "/public/images/collectibles/dreamcast.jpg",
    category: "colecionaveis",
    brand: "Sega",
    spec: "Console clássico",
    description:
      "O último console da Sega, ícone dos anos 2000 e peça para colecionadores.",
  },
  {
    name: "PlayStation 2",
    price: 59990,
    image: "/public/images/collectibles/ps2.jpg",
    category: "colecionaveis",
    brand: "Sony",
    spec: "Console clássico",
    description:
      "PlayStation 2, o console mais vendido da história. Item de coleção.",
  },
  {
    name: "Nintendo Wii",
    price: 54990,
    image: "/public/images/collectibles/wii.jpg",
    category: "colecionaveis",
    brand: "Nintendo",
    spec: "Console clássico",
    description:
      "Console Nintendo Wii, que popularizou os jogos por movimento. Peça de coleção.",
  },
];
