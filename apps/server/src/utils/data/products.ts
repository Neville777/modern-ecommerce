import { faker } from '@faker-js/faker';

export function generateProducts(count: number = 6) {
  const baseProducts = [
    {
      name: 'Airpods Wireless Bluetooth Headphones',
      description:
        'Bluetooth technology lets you connect it with compatible devices wirelessly. High-quality AAC audio offers immersive listening experience. Built-in microphone allows you to take calls while working.',
      brand: 'Apple',
      category: 'Electronics',
      price: 89.99,
      countInStock: 10,
      rating: 4.5,
      numReviews: 12,
      images: [
        'https://accesspress.co.ke/wp-content/uploads/2025/02/iPhone-16-Pro-Max-a-1-300x300.jpg',
        'https://accesspress.co.ke/wp-content/uploads/2025/02/iPhone-16-Pro-Max-1-1-300x300.jpg',
      ],
    },
    {
      name: 'iPhone 11 Pro 256GB Memory',
      description:
        'Introducing the iPhone 11 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life.',
      brand: 'Apple',
      category: 'Electronics',
      price: 599.99,
      countInStock: 7,
      rating: 4.0,
      numReviews: 8,
      images: [
        'https://accesspress.co.ke/wp-content/uploads/2025/02/iPhone-16-Pro-Max-b-300x300.jpg',
        'https://accesspress.co.ke/wp-content/uploads/2025/02/iPhone-16-Pro-Max-c-300x300.jpg',
      ],
    },
    {
      name: 'Cannon EOS 80D DSLR Camera',
      description:
        'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design.',
      brand: 'Cannon',
      category: 'Electronics',
      price: 929.99,
      countInStock: 5,
      rating: 3,
      numReviews: 12,
      images: [
        'https://accesspress.co.ke/wp-content/uploads/2025/02/Low-Banner-A.png',
        'https://accesspress.co.ke/wp-content/uploads/2025/02/Low-Banner-B.png',
      ],
    },
    {
      name: 'Sony Playstation 4 Pro White Version',
      description:
        'The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music.',
      brand: 'Sony',
      category: 'Electronics',
      price: 399.99,
      countInStock: 11,
      rating: 5,
      numReviews: 12,
      images: [
        'https://accesspress.co.ke/wp-content/uploads/2025/02/Low-Banner-C.png',
        'https://motta.uix.store/wp-content/uploads/2022/08/discoverzone.svg',
      ],
    },
    {
      name: 'Logitech G-Series Gaming Mouse',
      description:
        'Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience.',
      brand: 'Logitech',
      category: 'Electronics',
      price: 49.99,
      countInStock: 7,
      rating: 3.5,
      numReviews: 10,
      images: [
        'https://accesspress.co.ke/wp-content/uploads/2025/02/Web-Logo-2.png',
        'https://accesspress.co.ke/wp-content/uploads/elementor/thumbs/homev8-emc01-r1eciefd38a0g64v1x6k1o1e7dupt3r9l25btkwari.png',
      ],
    },
    {
      name: 'Amazon Echo Dot 3rd Generation',
      description:
        'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space.',
      brand: 'Amazon',
      category: 'Electronics',
      price: 29.99,
      countInStock: 0,
      rating: 4,
      numReviews: 12,
      images: [
        'https://accesspress.co.ke/wp-content/uploads/2025/02/Low-Banner-A.png',
        'https://accesspress.co.ke/wp-content/uploads/2025/02/Low-Banner-B.png',
      ],
    },
  ];

  // If we need more products, generate additional ones
  const additionalProducts = Array.from({
    length: Math.max(0, count - baseProducts.length),
  }).map(() => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    brand: faker.company.name(),
    category: faker.commerce.department(),
    price: parseFloat(faker.commerce.price()),
    countInStock: faker.number.int({ min: 0, max: 100 }),
    rating: Number((Math.random() * 4 + 1).toFixed(1)),
    numReviews: faker.number.int({ min: 0, max: 50 }),
    images: [
      'https://accesspress.co.ke/wp-content/uploads/2025/02/Low-Banner-C.png',
      'https://motta.uix.store/wp-content/uploads/2022/08/discoverzone.svg',
    ],
  }));

  return [...baseProducts.slice(0, count), ...additionalProducts];
}
