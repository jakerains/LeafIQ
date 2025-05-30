import { Product, Variant, VibesToTerpenes } from '../types';

export const demoProducts: Product[] = [
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
    name: '818 Fire OG x Kosher Kitty',
    brand: '605 Cannabis',
    category: 'flower',
    description: 'A premium indica strain known for its potent effects and distinctive aroma.',
    image_url: 'https://images.dutchie.com/2bae20574b9a59e52b32e63b4684e57a?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 21.36,
    cbd_percentage: 0.0,
    price: 25.0,
    created_at: '2023-09-16T10:24:00.000Z',
    strain_type: 'indica'
  },
  {
    id: 'p003',
    name: 'Jealousy',
    brand: 'Big Sioux Bud',
    category: 'flower',
    description: 'A balanced hybrid strain with a complex terpene profile and smooth effects.',
    image_url: 'https://images.dutchie.com/d2704c0844892d3e88e768c26534eb6e?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 16.67,
    cbd_percentage: 0.04,
    price: 15.0,
    created_at: '2023-09-17T16:12:00.000Z',
    strain_type: 'hybrid'
  },
  {
    id: 'p004',
    name: 'Dantes Inferno',
    brand: '605 Cannabis',
    category: 'flower',
    description: 'A fiery hybrid strain that delivers a balanced and uplifting experience.',
    image_url: 'https://images.dutchie.com/46023702c2b7fe914607bbb7402b314a?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 21.83,
    cbd_percentage: 0.06,
    price: 25.0,
    created_at: '2023-09-18T09:36:00.000Z',
    strain_type: 'hybrid'
  },
  {
    id: 'p005',
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
    id: 'p006',
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
    id: 'p007',
    name: 'White Fire 43 BX2',
    brand: 'DNG',
    category: 'flower',
    description: 'A hybrid strain with a balanced blend of potent effects and a complex aroma profile.',
    image_url: 'https://images.dutchie.com/d8421f5ebad25c1bf30ae57a24ae2d07?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 21.87,
    cbd_percentage: 0.05,
    price: 25.0,
    created_at: '2023-09-21T15:48:00.000Z',
    strain_type: 'hybrid'
  },
  {
    id: 'p008',
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
    id: 'p009',
    name: 'Wagyu',
    brand: '1889 Farms',
    category: 'flower',
    description: 'A premium indica strain currently on sale. Known for its high THC content and relaxing effects.',
    image_url: 'https://images.dutchie.com/bc796652a76189d36e93f9c55e061ef4?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 25.94,
    cbd_percentage: 0.07,
    price: 10.20,
    created_at: '2023-09-23T14:36:00.000Z',
    strain_type: 'indica'
  },
  {
    id: 'p010',
    name: 'Friendly Fire',
    brand: 'Big Sioux Bud',
    category: 'flower',
    description: 'An energizing sativa strain with uplifting effects and a bright flavor profile.',
    image_url: 'https://images.dutchie.com/b92f52f56a25073328965086e785b681?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 24.12,
    cbd_percentage: 0.06,
    price: 12.0,
    created_at: '2023-09-24T12:00:00.000Z',
    strain_type: 'sativa'
  },
  {
    id: 'p011',
    name: 'Grape Live Rosin Gummies',
    brand: '605 Cannabis',
    category: 'edible',
    description: 'Premium live rosin gummies with a delicious grape flavor. 2-pack with 54.28mg THC per piece.',
    image_url: 'https://images.dutchie.com/16c4a6481647c39abf4c2d0f63857aff?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 54.28,
    cbd_percentage: 0.0,
    price: 20.0,
    created_at: '2023-09-25T09:24:00.000Z',
    strain_type: 'hybrid'
  },
  {
    id: 'p012',
    name: 'Strawberry Sativa Gummies',
    brand: '605 Cannabis',
    category: 'edible',
    description: 'Sativa-specific gummies with a refreshing strawberry flavor. 20-pack with 26.5mg THC per piece.',
    image_url: 'https://images.dutchie.com/c8942884df147454d67c147221a8b2d6?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 26.5,
    cbd_percentage: 0.0,
    price: 80.0,
    created_at: '2023-09-26T15:12:00.000Z',
    strain_type: 'sativa'
  },
  {
    id: 'p013',
    name: 'Acapulco Gold Distillate',
    brand: 'Big Sioux Extracts',
    category: 'concentrate',
    description: 'High-potency sativa distillate with clear, energizing effects. Perfect for daytime use.',
    image_url: 'https://images.dutchie.com/c2cdcd05062e79cf02a27f406a50db81?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 82.43,
    cbd_percentage: 0.03,
    price: 55.0,
    created_at: '2023-09-27T11:36:00.000Z',
    strain_type: 'sativa'
  },
  {
    id: 'p014',
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
    id: 'p015',
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
    id: 'p016',
    name: 'Black Maple',
    brand: 'DNG',
    category: 'flower',
    description: 'Weed of the Week! A balanced hybrid with complex flavors and effects for versatile use.',
    image_url: 'https://images.dutchie.com/c9ab19daa3cd4184c8648367a00898af?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 20.49,
    cbd_percentage: 0.0,
    price: 25.0,
    created_at: '2023-10-01T10:00:00.000Z',
    strain_type: 'hybrid'
  },
  {
    id: 'p017',
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
    id: 'p018',
    name: 'RSO Concentrate Syringe',
    brand: 'Big Sioux Extracts',
    category: 'concentrate',
    description: 'Staff Pick! Full-spectrum RSO concentrate for potent therapeutic effects. On special: 2 for $50.',
    image_url: 'https://images.dutchie.com/97c67eb80063ad89b0b8f48c4d705daa?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 30.98,
    cbd_percentage: 0.05,
    price: 30.0,
    created_at: '2023-10-03T10:00:00.000Z',
    strain_type: 'indica'
  },
  {
    id: 'p019',
    name: 'Grape Punch Sugar Batter',
    brand: 'Pure Bliss',
    category: 'concentrate',
    description: 'A flavorful concentrate with fruity notes and hybrid effects. On special: 2 for $60.',
    image_url: 'https://images.dutchie.com/0cb35a1dd54660a3c8acc1475417ef5a?auto=format%2Ccompress&cs=srgb&fit=max&fill=solid&fillColor=%23fff&ixlib=react-9.8.1&w=188&h=188&dpr=5&q=20',
    thc_percentage: 89.83,
    cbd_percentage: 0.19,
    price: 35.0,
    created_at: '2023-10-04T10:00:00.000Z',
    strain_type: 'hybrid'
  },
  {
    id: 'p020',
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
  }
];

export const demoVariants: Variant[] = [
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
    weight: '3.5g'
  },
  {
    id: 'v002',
    product_id: 'p002',
    strain_type: 'indica',
    terpene_profile: {
      myrcene: 0.7,
      limonene: 0.3,
      pinene: 0.2,
      caryophyllene: 0.5,
      linalool: 0.3
    },
    inventory_level: 8,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '3.5g'
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
    weight: '3.5g'
  },
  {
    id: 'v004',
    product_id: 'p004',
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0.5,
      limonene: 0.4,
      pinene: 0.3,
      caryophyllene: 0.6,
      humulene: 0.2
    },
    inventory_level: 20,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '3.5g'
  },
  {
    id: 'v005',
    product_id: 'p005',
    strain_type: 'sativa',
    terpene_profile: {
      myrcene: 0.3,
      limonene: 0.7,
      pinene: 0.5,
      terpinolene: 0.4,
      ocimene: 0.3
    },
    inventory_level: 10,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '3.5g'
  },
  {
    id: 'v006',
    product_id: 'p006',
    strain_type: 'indica',
    terpene_profile: {
      myrcene: 0.7,
      limonene: 0.2,
      caryophyllene: 0.4,
      linalool: 0.5,
      humulene: 0.1
    },
    inventory_level: 5,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '3.5g'
  },
  {
    id: 'v007',
    product_id: 'p007',
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0.4,
      limonene: 0.4,
      pinene: 0.5,
      caryophyllene: 0.5,
      terpinolene: 0.3
    },
    inventory_level: 14,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '3.5g'
  },
  {
    id: 'v008',
    product_id: 'p008',
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0.6,
      limonene: 0.3,
      caryophyllene: 0.7,
      linalool: 0.2,
      humulene: 0.4
    },
    inventory_level: 2,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '3.5g'
  },
  {
    id: 'v009',
    product_id: 'p009',
    strain_type: 'indica',
    terpene_profile: {
      myrcene: 0.7,
      limonene: 0.2,
      pinene: 0.2,
      caryophyllene: 0.5,
      linalool: 0.4
    },
    inventory_level: 7,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '3.5g'
  },
  {
    id: 'v010',
    product_id: 'p010',
    strain_type: 'sativa',
    terpene_profile: {
      myrcene: 0.3,
      limonene: 0.6,
      pinene: 0.5,
      terpinolene: 0.3,
      ocimene: 0.4
    },
    inventory_level: 9,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '3.5g'
  },
  {
    id: 'v011',
    product_id: 'p011',
    strain_type: 'hybrid',
    terpene_profile: {},
    inventory_level: 25,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '2 pieces'
  },
  {
    id: 'v012',
    product_id: 'p012',
    strain_type: 'sativa',
    terpene_profile: {},
    inventory_level: 18,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '20 pieces'
  },
  {
    id: 'v013',
    product_id: 'p013',
    strain_type: 'sativa',
    terpene_profile: {
      myrcene: 0.1,
      limonene: 0.9,
      pinene: 0.5,
      terpinolene: 0.4
    },
    inventory_level: 6,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '1g'
  },
  {
    id: 'v014',
    product_id: 'p014',
    strain_type: 'indica',
    terpene_profile: {
      myrcene: 0.6,
      limonene: 0.2,
      caryophyllene: 0.7,
      linalool: 0.4
    },
    inventory_level: 4,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '1g'
  },
  {
    id: 'v015',
    product_id: 'p015',
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0.3,
      limonene: 0.3,
      pinene: 0.3,
      caryophyllene: 0.3,
      linalool: 0.2
    },
    inventory_level: 12,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '3.5g'
  },
  {
    id: 'v016',
    product_id: 'p016',
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0.5,
      limonene: 0.4,
      pinene: 0.3,
      caryophyllene: 0.5,
      humulene: 0.2
    },
    inventory_level: 15,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '3.5g'
  },
  {
    id: 'v017',
    product_id: 'p017',
    strain_type: 'sativa',
    terpene_profile: {
      myrcene: 0.2,
      limonene: 0.7,
      pinene: 0.4,
      terpinolene: 0.4,
      ocimene: 0.4
    },
    inventory_level: 11,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '3.5g'
  },
  {
    id: 'v018',
    product_id: 'p018',
    strain_type: 'indica',
    terpene_profile: {
      myrcene: 0.7,
      caryophyllene: 0.6,
      humulene: 0.4,
      linalool: 0.3
    },
    inventory_level: 8,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    size: '1g'
  },
  {
    id: 'v019',
    product_id: 'p019',
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0.4,
      limonene: 0.5,
      caryophyllene: 0.4,
      linalool: 0.2
    },
    inventory_level: 5,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '1g'
  },
  {
    id: 'v020',
    product_id: 'p020',
    strain_type: 'sativa',
    terpene_profile: {
      myrcene: 0.2,
      limonene: 0.7,
      pinene: 0.6,
      terpinolene: 0.4,
      ocimene: 0.3
    },
    inventory_level: 6,
    last_updated: '2023-10-01T12:00:00.000Z',
    is_available: true,
    weight: '1g'
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
    effects: ['Anxiety Relief', 'Relaxation']
  },
  'euphoric': {
    terpenes: {
      myrcene: 0.6,
      limonene: 0.7,
      terpinolene: 0.5
    },
    effects: ['Euphoria', 'Mood Elevation']
  }
};