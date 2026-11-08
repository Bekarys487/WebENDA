const photo = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;

const sneakers = [
  { id: 1, name: "Air Max Red Edition", brand: "Nike", price: 160, category: "daily", image: photo("1542291026-7eec264c27ff"), desc: "Classic everyday silhouette with maximum cushioned support." },
  { id: 2, name: "Travis Scott x Air Jordan 1", brand: "Jordan", price: 420, category: "rare", image: photo("1511556532299-8f662fc26c06"), desc: "Limited collaboration with signature reverse Swoosh." },
  { id: 3, name: "New Balance 9060", brand: "New Balance", price: 180, category: "performance", image: photo("1539185441755-769473a23570"), desc: "Chunky futuristic design built for high-impact daily wear." },
  { id: 4, name: "Air Jordan 4 Lightning", brand: "Jordan", price: 350, category: "rare", image: photo("1595950653106-6c9ebd614d3a"), desc: "Sought-after collector grail sourced through Beka's vault." },
  { id: 5, name: "Nike Dunk Low Panda", brand: "Nike", price: 130, category: "daily", image: photo("1597045566677-8cf032ed6634"), desc: "Black-and-white staple that fits any streetwear outfit." },
  { id: 6, name: "Adidas Gazelle Indoor", brand: "Adidas", price: 120, category: "daily", image: photo("1549298916-b41d501d3772"), desc: "Suede terrace classic with a slim, easy-to-wear profile." },
  { id: 7, name: "Nike Pegasus Trail", brand: "Nike", price: 140, category: "performance", image: photo("1460353581641-37baddab0fa2"), desc: "Responsive runner with grippy outsole for mixed terrain." },
  { id: 8, name: "ASICS Gel-Kayano 14", brand: "ASICS", price: 150, category: "performance", image: photo("1491553895911-0055eca6402d"), desc: "Y2K stability runner with gel cushioning for long days." },
  { id: 9, name: "Air Force 1 White", brand: "Nike", price: 115, category: "daily", image: photo("1600185365926-3a2ce3cdb9eb"), desc: "Clean all-white leather pair that goes with everything." },
  { id: 10, name: "Yeezy Boost 350", brand: "Adidas", price: 380, category: "rare", image: photo("1606107557195-0e29a4b5b4aa"), desc: "Primeknit upper with the famous zebra stripe pattern." }
];