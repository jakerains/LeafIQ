import { Product, Variant, VibesToTerpenes } from '../types';

export const demoProducts: Product[] = [
  // FLOWER STRAINS
  {
    id: 'p001',
    name: 'Black Roze',
    brand: 'Garden Valley',
    category: 'flower',
    description: 'A potent indica strain with relaxing effects perfect for evening use.',
    image_url: 'https://images.dutchie.com/1c6d2c0fdd67f25aa399b72562234d98?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 26.74,
    cbd_percentage: 0.07,
    price: 12.0,
    created_at: '2023-09-15T14:48:00.000Z',
    strain_type: 'indica'
  },
  {
    id: 'p002',
    name: 'Modified Bananas',
    brand: 'DNG',
    category: 'flower',
    description: 'A sativa-dominant strain with energizing effects and a sweet, tropical flavor profile.',
    image_url: 'https://images.dutchie.com/ba82112dcafec987dbbda8a07761f962?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 27.14,
    cbd_percentage: 0.08,
    price: 12.0,
    created_at: '2023-09-19T13:00:00.000Z',
    strain_type: 'sativa'
  },
  {
    id: 'p003',
    name: 'Gorilla Glue #4',
    brand: 'Pure Bliss',
    category: 'flower',
    description: 'A popular hybrid strain known for its powerful effects and sticky resinous buds.',
    image_url: 'https://images.dutchie.com/fd8e603b9c21fd0e27711cebae5438ba?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 22.77,
    cbd_percentage: 0.0,
    price: 11.0,
    created_at: '2023-09-22T10:12:00.000Z',
    strain_type: 'hybrid'
  },
  {
    id: 'p004',
    name: 'Mad Honey',
    brand: '1889 Farms',
    category: 'flower',
    description: 'New Strain Alert! A stimulating sativa with buzzing effects and sweet honey undertones.',
    image_url: 'https://images.dutchie.com/bdadf97eea2dc34ffb131dc1d45c9dc4?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 22.41,
    cbd_percentage: 0.03,
    price: 11.0,
    created_at: '2023-10-02T10:00:00.000Z',
    strain_type: 'sativa'
  },
  {
    id: 'p005',
    name: 'Sherb Cream Pie',
    brand: 'Pure Bliss',
    category: 'flower',
    description: 'A delectable indica strain with sweet, dessert-like flavors and deeply relaxing effects.',
    image_url: 'https://images.dutchie.com/6b134b34fdf80e14d60c737c981f018d?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 24.69,
    cbd_percentage: 0.0,
    price: 11.0,
    created_at: '2023-09-20T11:24:00.000Z',
    strain_type: 'indica'
  },
  {
    id: 'p006',
    name: 'Biker Kush',
    brand: 'DNG',
    category: 'flower',
    description: 'Staff Pick! A balanced hybrid strain known for its smooth, mellow effects and earthy flavor.',
    image_url: 'https://images.dutchie.com/e453d64605bbc85a46b1fa6b0c8d9ab0?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 17.82,
    cbd_percentage: 0.0,
    price: 10.0,
    created_at: '2023-10-01T10:00:00.000Z',
    strain_type: 'hybrid'
  },
  {
    id: 'p007',
    name: 'Soul Doctor',
    brand: 'Dakota Green',
    category: 'flower',
    description: 'A unique balanced hybrid strain with high CBD content, ideal for therapeutic use without heavy intoxication.',
    image_url: 'https://images.dutchie.com/e4b472ed26f962899437effe4876bf03?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 9.58,
    cbd_percentage: 14.91,
    price: 12.0,
    created_at: '2023-09-29T10:00:00.000Z',
    strain_type: 'hybrid'
  },
  {
    id: 'p008',
    name: 'Lilac Diesel',
    brand: 'DNS',
    category: 'flower',
    description: 'A potent indica-hybrid strain with diesel aromatics and relaxing effects.',
    image_url: 'https://images.dutchie.com/b2d5ed8170e5bc72b7c114774ea2be91?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 25.79,
    cbd_percentage: 0.07,
    price: 10.0,
    created_at: '2023-10-01T10:00:00.000Z',
    strain_type: 'indica'
  },
  {
    id: 'p009',
    name: 'Mandarin Cookies',
    brand: 'Dakota Green',
    category: 'flower',
    description: 'A citrusy sativa strain with uplifting effects and sweet mandarin flavors.',
    image_url: 'https://images.dutchie.com/a849f66d64fb1b82e81c2ed9ebbcdc9d?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 21.7,
    cbd_percentage: 0.06,
    price: 11.0,
    created_at: '2023-10-01T10:00:00.000Z',
    strain_type: 'sativa'
  },
  {
    id: 'p010',
    name: 'Rollupz',
    brand: 'DNG',
    category: 'flower',
    description: 'A premium hybrid strain with potent effects and complex terpene profile.',
    image_url: 'https://images.dutchie.com/43c3d64eb229ed7cf1a671ef5b3fa38a?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 25.85,
    cbd_percentage: 0.03,
    price: 11.0,
    created_at: '2023-10-01T10:00:00.000Z',
    strain_type: 'hybrid'
  },

  // CONCENTRATES
  {
    id: 'p011',
    name: 'Super Boof Live Rosin',
    brand: 'Sodak Selects',
    category: 'concentrate',
    description: 'Premium sativa live rosin concentrate with high terpene content and clear, energizing effects.',
    image_url: 'https://images.dutchie.com/cc45e68a5ed51fb8e79b5885ad7f9623?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 77.01,
    cbd_percentage: 0.0,
    price: 40.0,
    created_at: '2023-10-05T10:00:00.000Z',
    strain_type: 'sativa'
  },
  {
    id: 'p012',
    name: 'Wagyu Live Rosin',
    brand: 'High Hills',
    category: 'concentrate',
    description: 'Ultra-premium indica live rosin with exceptional potency and flavor.',
    image_url: 'https://images.dutchie.com/cc45e68a5ed51fb8e79b5885ad7f9623?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 84.27,
    cbd_percentage: 0.0,
    price: 50.0,
    created_at: '2023-10-05T10:00:00.000Z',
    strain_type: 'indica'
  },
  {
    id: 'p013',
    name: 'Cherry Waves Fresh Press',
    brand: 'Sodak Selects',
    category: 'concentrate',
    description: 'Staff Pick! Fresh press concentrate with fruity cherry notes and balanced hybrid effects.',
    image_url: 'https://images.dutchie.com/cc45e68a5ed51fb8e79b5885ad7f9623?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 73.97,
    cbd_percentage: 0.0,
    price: 50.0,
    created_at: '2023-10-05T10:00:00.000Z',
    strain_type: 'hybrid'
  },
  {
    id: 'p014',
    name: 'RSO Concentrate Syringe',
    brand: 'Big Sioux Extracts',
    category: 'concentrate',
    description: 'Staff Pick! Full-spectrum RSO concentrate for potent therapeutic effects. Special: 2 for $50.',
    image_url: 'https://images.dutchie.com/97c67eb80063ad89b0b8f48c4d705daa?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 30.98,
    cbd_percentage: 0.05,
    price: 30.0,
    created_at: '2023-10-03T10:00:00.000Z',
    strain_type: 'indica'
  },
  {
    id: 'p015',
    name: 'Grape Punch Sugar Batter',
    brand: 'Pure Bliss',
    category: 'concentrate',
    description: 'A flavorful concentrate with fruity notes and hybrid effects. Special: 2 for $60.',
    image_url: 'https://images.dutchie.com/0cb35a1dd54660a3c8acc1475417ef5a?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 89.83,
    cbd_percentage: 0.19,
    price: 35.0,
    created_at: '2023-10-04T10:00:00.000Z',
    strain_type: 'hybrid'
  },

  // EDIBLES
  {
    id: 'p016',
    name: 'Super Boof Strawberry Gummies',
    brand: 'High Hills',
    category: 'edible',
    description: 'Staff Pick! Premium hybrid gummies with strawberry flavor and balanced effects.',
    image_url: 'https://images.dutchie.com/ce243c9f4a234ee581f17305ef8c1d40?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 97.24,
    cbd_percentage: 0.0,
    price: 25.0,
    created_at: '2023-09-25T09:24:00.000Z',
    strain_type: 'hybrid'
  },
  {
    id: 'p017',
    name: 'Grape Live Rosin Gummies',
    brand: '605 Cannabis',
    category: 'edible',
    description: 'Premium live rosin gummies with delicious grape flavor. 2-pack with 54.28mg THC per piece.',
    image_url: 'https://images.dutchie.com/16c4a6481647c39abf4c2d0f63857aff?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 108.6,
    cbd_percentage: 0.0,
    price: 20.0,
    created_at: '2023-09-25T09:24:00.000Z',
    strain_type: 'hybrid'
  },
  {
    id: 'p018',
    name: 'Strawberry Sativa Gummies',
    brand: '605 Cannabis',
    category: 'edible',
    description: 'Energizing sativa gummies with refreshing strawberry flavor. Available in 4-pack and 20-pack.',
    image_url: 'https://images.dutchie.com/c8942884df147454d67c147221a8b2d6?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 106.0,
    cbd_percentage: 0.0,
    price: 20.0,
    created_at: '2023-09-26T15:12:00.000Z',
    strain_type: 'sativa'
  },
  {
    id: 'p019',
    name: 'Sour Grape Sleep Indica Gummies',
    brand: 'Crushmore',
    category: 'edible',
    description: 'Powerful indica gummies designed for sleep and relaxation. 25mg per piece, 4-pack.',
    image_url: 'https://images.dutchie.com/ce243c9f4a234ee581f17305ef8c1d40?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 100.0,
    cbd_percentage: 0.0,
    price: 25.0,
    created_at: '2023-09-26T15:12:00.000Z',
    strain_type: 'indica'
  },
  {
    id: 'p020',
    name: 'Mixed Berry Lolli',
    brand: '605 Cannabis',
    category: 'edible',
    description: 'Staff Pick! Fast-acting lollipop with mixed berry flavor and quick onset effects.',
    image_url: 'https://images.dutchie.com/ce243c9f4a234ee581f17305ef8c1d40?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 24.9,
    cbd_percentage: 0.0,
    price: 10.0,
    created_at: '2023-09-26T15:12:00.000Z',
    strain_type: 'hybrid'
  },

  // VAPORIZERS
  {
    id: 'p021',
    name: 'Acapulco Gold Distillate',
    brand: 'Big Sioux Extracts',
    category: 'vaporizer',
    description: 'High-potency sativa distillate cartridge with clear, energizing effects. Perfect for daytime use.',
    image_url: 'https://images.dutchie.com/c2cdcd05062e79cf02a27f406a50db81?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 82.43,
    cbd_percentage: 0.03,
    price: 55.0,
    created_at: '2023-09-27T11:36:00.000Z',
    strain_type: 'sativa'
  },
  {
    id: 'p022',
    name: 'GMO Liquid Diamond Disposable Pod',
    brand: 'High Hills',
    category: 'vaporizer',
    description: 'Premium indica vaporizer pod featuring GMO strain in liquid diamond form for maximum potency.',
    image_url: 'https://images.dutchie.com/c7b7ac28c428051063c497d57cd8bfc4?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 79.66,
    cbd_percentage: 0.05,
    price: 80.0,
    created_at: '2023-09-28T14:48:00.000Z',
    strain_type: 'indica'
  },
  {
    id: 'p023',
    name: 'Island Cooler Live Rosin',
    brand: 'Sodak Selects',
    category: 'vaporizer',
    description: 'Staff Pick! Tropical sativa live rosin cartridge with exceptional flavor and effects.',
    image_url: 'https://images.dutchie.com/cc45e68a5ed51fb8e79b5885ad7f9623?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 79.59,
    cbd_percentage: 0.0,
    price: 40.0,
    created_at: '2023-09-28T14:48:00.000Z',
    strain_type: 'sativa'
  },
  {
    id: 'p024',
    name: 'Cherry Yogurt Liquid Diamond Pod',
    brand: 'High Hills',
    category: 'vaporizer',
    description: 'Staff Pick! Ultra-premium sativa liquid diamond disposable pod with fruity cherry yogurt flavor.',
    image_url: 'https://images.dutchie.com/c7b7ac28c428051063c497d57cd8bfc4?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 80.44,
    cbd_percentage: 0.16,
    price: 80.0,
    created_at: '2023-09-28T14:48:00.000Z',
    strain_type: 'sativa'
  },

  // PRE-ROLLS
  {
    id: 'p025',
    name: 'Bacio Humantashen Cookies Blunt',
    brand: 'DNG',
    category: 'pre-roll',
    description: 'Staff Pick! Premium hybrid blunt with complex cookie flavors and balanced effects.',
    image_url: 'https://images.dutchie.com/0f572a31ec68b0b16e78ad8822aa8022?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 17.39,
    cbd_percentage: 0.0,
    price: 8.0,
    created_at: '2023-09-28T14:48:00.000Z',
    strain_type: 'hybrid'
  },
  {
    id: 'p026',
    name: 'Hawaiian Style Pre-Roll 6pk',
    brand: '1889 Farms',
    category: 'pre-roll',
    description: 'Tropical sativa pre-roll pack perfect for sharing. Six 0.5g pre-rolls with uplifting effects.',
    image_url: 'https://images.dutchie.com/4a91140d8c5400ea7fe485a1c7113174?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 23.99,
    cbd_percentage: 0.05,
    price: 25.0,
    created_at: '2023-09-28T14:48:00.000Z',
    strain_type: 'sativa'
  },

  // TINCTURES
  {
    id: 'p027',
    name: 'Dosed 605 Tincture - Indica',
    brand: '605 Cannabis',
    category: 'tincture',
    description: 'High-potency indica tincture for precise dosing and long-lasting effects.',
    image_url: 'https://images.dutchie.com/848427d5c67d8e0fbbfcac4385679ff4?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 247.37,
    cbd_percentage: 0.03,
    price: 40.0,
    created_at: '2023-09-28T14:48:00.000Z',
    strain_type: 'indica'
  },
  {
    id: 'p028',
    name: 'THC Tincture - Indica',
    brand: 'DNS',
    category: 'tincture',
    description: 'Ultra-potent indica tincture for experienced users seeking maximum therapeutic benefits.',
    image_url: 'https://images.dutchie.com/d717fbd76149bc80f8d86c5cdd4220ef?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 465.0,
    cbd_percentage: 0.0,
    price: 50.0,
    created_at: '2023-09-28T14:48:00.000Z',
    strain_type: 'indica'
  }
];

export const demoVariants: Variant[] = [
  // FLOWER VARIANTS
  {
    id: 'v001',
    product_id: 'p001',
    strain_type: 'indica',
    terpene_profile: {
      myrcene: 0.8,
      limonene: 0.2,
      pinene: 0.1,
      caryophyllene: 0.4,
      linalool: 0.5
    },
    inventory_level: 15,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '1g'
  },
  {
    id: 'v002',
    product_id: 'p002',
    strain_type: 'sativa',
    terpene_profile: {
      myrcene: 0.3,
      limonene: 0.7,
      pinene: 0.5,
      terpinolene: 0.4,
      ocimene: 0.3
    },
    inventory_level: 8,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '1g'
  },
  {
    id: 'v003',
    product_id: 'p003',
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0.4,
      limonene: 0.5,
      pinene: 0.3,
      caryophyllene: 0.4,
      terpinolene: 0.2
    },
    inventory_level: 12,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '1g'
  },
  {
    id: 'v004',
    product_id: 'p004',
    strain_type: 'sativa',
    terpene_profile: {
      myrcene: 0.2,
      limonene: 0.8,
      pinene: 0.4,
      terpinolene: 0.5,
      ocimene: 0.4
    },
    inventory_level: 20,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '1g'
  },
  {
    id: 'v005',
    product_id: 'p005',
    strain_type: 'indica',
    terpene_profile: {
      myrcene: 0.7,
      limonene: 0.2,
      pinene: 0.1,
      caryophyllene: 0.5,
      linalool: 0.6
    },
    inventory_level: 10,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '1g'
  },
  {
    id: 'v006',
    product_id: 'p006',
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0.5,
      limonene: 0.4,
      caryophyllene: 0.4,
      linalool: 0.3,
      humulene: 0.2
    },
    inventory_level: 5,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '1g'
  },
  {
    id: 'v007',
    product_id: 'p007',
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0.3,
      limonene: 0.4,
      pinene: 0.3,
      caryophyllene: 0.3,
      linalool: 0.8
    },
    inventory_level: 14,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '1g'
  },
  {
    id: 'v008',
    product_id: 'p008',
    strain_type: 'indica',
    terpene_profile: {
      myrcene: 0.8,
      limonene: 0.2,
      caryophyllene: 0.6,
      linalool: 0.4,
      humulene: 0.3
    },
    inventory_level: 2,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '1g'
  },
  {
    id: 'v009',
    product_id: 'p009',
    strain_type: 'sativa',
    terpene_profile: {
      myrcene: 0.2,
      limonene: 0.9,
      pinene: 0.4,
      terpinolene: 0.3,
      ocimene: 0.5
    },
    inventory_level: 7,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '1g'
  },
  {
    id: 'v010',
    product_id: 'p010',
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0.4,
      limonene: 0.6,
      pinene: 0.3,
      caryophyllene: 0.5,
      terpinolene: 0.3
    },
    inventory_level: 9,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '1g'
  },

  // CONCENTRATE VARIANTS
  {
    id: 'v011',
    product_id: 'p011',
    strain_type: 'sativa',
    terpene_profile: {
      myrcene: 0.2,
      limonene: 0.8,
      pinene: 0.5,
      terpinolene: 0.6,
      ocimene: 0.4
    },
    inventory_level: 25,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '0.5g'
  },
  {
    id: 'v012',
    product_id: 'p012',
    strain_type: 'indica',
    terpene_profile: {
      myrcene: 0.9,
      limonene: 0.1,
      caryophyllene: 0.7,
      linalool: 0.8,
      humulene: 0.4
    },
    inventory_level: 18,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '1g'
  },
  {
    id: 'v013',
    product_id: 'p013',
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0.4,
      limonene: 0.7,
      pinene: 0.3,
      caryophyllene: 0.4,
      terpinolene: 0.2
    },
    inventory_level: 15,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '1g'
  },
  {
    id: 'v014',
    product_id: 'p014',
    strain_type: 'indica',
    terpene_profile: {
      myrcene: 0.8,
      limonene: 0.2,
      caryophyllene: 0.6,
      linalool: 0.7,
      humulene: 0.3
    },
    inventory_level: 22,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '1.86g'
  },
  {
    id: 'v015',
    product_id: 'p015',
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0.3,
      limonene: 0.6,
      pinene: 0.2,
      caryophyllene: 0.4,
      terpinolene: 0.3
    },
    inventory_level: 12,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '1g'
  },

  // EDIBLE VARIANTS
  {
    id: 'v016',
    product_id: 'p016',
    strain_type: 'hybrid',
    terpene_profile: {},
    inventory_level: 30,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '12 pieces'
  },
  {
    id: 'v017',
    product_id: 'p017',
    strain_type: 'hybrid',
    terpene_profile: {},
    inventory_level: 25,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '2 pieces'
  },
  {
    id: 'v018',
    product_id: 'p018',
    strain_type: 'sativa',
    terpene_profile: {},
    inventory_level: 20,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '4 pieces'
  },
  {
    id: 'v019',
    product_id: 'p019',
    strain_type: 'indica',
    terpene_profile: {},
    inventory_level: 15,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '4 pieces'
  },
  {
    id: 'v020',
    product_id: 'p020',
    strain_type: 'hybrid',
    terpene_profile: {},
    inventory_level: 40,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '1 piece'
  },

  // VAPORIZER VARIANTS
  {
    id: 'v021',
    product_id: 'p021',
    strain_type: 'sativa',
    terpene_profile: {
      myrcene: 0.2,
      limonene: 0.7,
      pinene: 0.5,
      terpinolene: 0.4,
      ocimene: 0.3
    },
    inventory_level: 18,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '1g'
  },
  {
    id: 'v022',
    product_id: 'p022',
    strain_type: 'indica',
    terpene_profile: {
      myrcene: 0.8,
      limonene: 0.1,
      caryophyllene: 0.6,
      linalool: 0.5,
      humulene: 0.3
    },
    inventory_level: 8,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '2g'
  },
  {
    id: 'v023',
    product_id: 'p023',
    strain_type: 'sativa',
    terpene_profile: {
      myrcene: 0.1,
      limonene: 0.9,
      pinene: 0.4,
      terpinolene: 0.5,
      ocimene: 0.6
    },
    inventory_level: 12,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '0.5g'
  },
  {
    id: 'v024',
    product_id: 'p024',
    strain_type: 'sativa',
    terpene_profile: {
      myrcene: 0.2,
      limonene: 0.8,
      pinene: 0.3,
      terpinolene: 0.4,
      ocimene: 0.5
    },
    inventory_level: 6,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '2g'
  },

  // PRE-ROLL VARIANTS
  {
    id: 'v025',
    product_id: 'p025',
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0.4,
      limonene: 0.5,
      pinene: 0.3,
      caryophyllene: 0.4,
      terpinolene: 0.2
    },
    inventory_level: 35,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '1g'
  },
  {
    id: 'v026',
    product_id: 'p026',
    strain_type: 'sativa',
    terpene_profile: {
      myrcene: 0.3,
      limonene: 0.7,
      pinene: 0.4,
      terpinolene: 0.5,
      ocimene: 0.4
    },
    inventory_level: 10,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '3g total'
  },

  // TINCTURE VARIANTS
  {
    id: 'v027',
    product_id: 'p027',
    strain_type: 'indica',
    terpene_profile: {},
    inventory_level: 20,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '28g'
  },
  {
    id: 'v028',
    product_id: 'p028',
    strain_type: 'indica',
    terpene_profile: {},
    inventory_level: 15,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '16.47g'
  }
];

export const vibesToTerpenes: VibesToTerpenes = {
  'relaxed': {
    terpenes: {
      myrcene: 0.8,
      linalool: 0.7,
      caryophyllene: 0.5
    },
    effects: ['Relaxation', 'Stress Relief']
  },
  'sleepy': {
    terpenes: {
      myrcene: 0.9,
      linalool: 0.8,
      terpinolene: 0.2
    },
    effects: ['Sedation', 'Sleep Aid']
  },
  'energized': {
    terpenes: {
      limonene: 0.8,
      pinene: 0.7,
      terpinolene: 0.6
    },
    effects: ['Energy', 'Focus']
  },
  'creative': {
    terpenes: {
      limonene: 0.7,
      pinene: 0.8,
      ocimene: 0.6
    },
    effects: ['Creativity', 'Euphoria']
  },
  'happy': {
    terpenes: {
      limonene: 0.8,
      pinene: 0.5,
      caryophyllene: 0.4
    },
    effects: ['Mood Elevation', 'Euphoria']
  },
  'focused': {
    terpenes: {
      pinene: 0.9,
      limonene: 0.6,
      terpinolene: 0.5
    },
    effects: ['Focus', 'Mental Clarity']
  },
  'pain relief': {
    terpenes: {
      caryophyllene: 0.8,
      myrcene: 0.7,
      humulene: 0.6
    },
    effects: ['Pain Relief', 'Anti-inflammatory']
  },
  'social': {
    terpenes: {
      limonene: 0.7,
      caryophyllene: 0.6,
      pinene: 0.5
    },
    effects: ['Social Ease', 'Mood Elevation']
  },
  'calm': {
    terpenes: {
      linalool: 0.8,
      myrcene: 0.7,
      caryophyllene: 0.5
    },
    effects: ['Calm', 'Relaxation']
  },
  'appetite': {
    terpenes: {
      myrcene: 0.7,
      caryophyllene: 0.6,
      humulene: 0.4
    },
    effects: ['Appetite Stimulation', 'Hunger']
  }
}; 