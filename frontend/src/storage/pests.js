// Pest Alerts Database
export const pestsData = [
  {
    id: 1,
    name: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    severity: 'High',
    affectedCrops: ['Maize', 'Sorghum', 'Rice', 'Sugarcane'],
    symptoms: [
      'Windowing of leaves',
      'Ragged appearance of leaves',
      'Presence of larval frass',
      'Damaged growing points'
    ],
    controlMeasures: {
      cultural: [
        'Early planting',
        'Intercropping with pulses',
        'Remove crop residues',
        'Deep summer ploughing'
      ],
      biological: [
        'Release Trichogramma wasps',
        'Apply NPV (Nuclear Polyhedrosis Virus)',
        'Use pheromone traps',
        'Encourage natural predators'
      ],
      chemical: [
        'Chlorantraniliprole 18.5% SC',
        'Spinetoram 11.7% SC',
        'Emamectin benzoate 5% SG',
        'Apply during early larval stage'
      ]
    },
    identificationTips: 'Look for inverted Y-shaped marking on head capsule of larvae',
    seasonalOccurrence: 'Throughout the year, peak during monsoon',
    economicThreshold: '5% plants with fresh damage symptoms',
    image: '/api/placeholder/300/200'
  },
  {
    id: 2,
    name: 'Brown Plant Hopper',
    scientificName: 'Nilaparvata lugens',
    severity: 'High',
    affectedCrops: ['Rice'],
    symptoms: [
      'Hopper burn',
      'Yellowing of plants',
      'Drying from base upwards',
      'Circular patches in field'
    ],
    controlMeasures: {
      cultural: [
        'Alternate wetting and drying',
        'Avoid excess nitrogen',
        'Use resistant varieties',
        'Maintain field sanitation'
      ],
      biological: [
        'Conserve spiders',
        'Release mirid bugs',
        'Apply Metarhizium anisopliae',
        'Encourage dragonflies'
      ],
      chemical: [
        'Pymetrozine 50% WG',
        'Dinotefuran 20% SG',
        'Flonicamid 50% WG',
        'Avoid prophylactic spraying'
      ]
    },
    identificationTips: 'Brown colored hoppers at base of plants, honeydew secretion',
    seasonalOccurrence: 'July-October',
    economicThreshold: '10-15 hoppers per hill',
    image: '/api/placeholder/300/200'
  },
  {
    id: 3,
    name: 'Pink Bollworm',
    scientificName: 'Pectinophora gossypiella',
    severity: 'Very High',
    affectedCrops: ['Cotton'],
    symptoms: [
      'Rosetted flowers',
      'Damaged bolls with holes',
      'Stained lint',
      'Premature boll opening'
    ],
    controlMeasures: {
      cultural: [
        'Timely sowing',
        'Destroy crop residues',
        'Remove rosette flowers',
        'Crop rotation'
      ],
      biological: [
        'Pheromone traps (8-10/acre)',
        'Release Trichogramma',
        'Bt cotton cultivation',
        'Use of PB rope'
      ],
      chemical: [
        'Profenofos 50% EC',
        'Thiodicarb 75% WP',
        'Cypermethrin 25% EC',
        'Spray at economic threshold'
      ]
    },
    identificationTips: 'Pink colored larvae inside bolls, entry holes on bolls',
    seasonalOccurrence: 'August-December',
    economicThreshold: '8 moths/trap/night for 3 consecutive nights',
    image: '/api/placeholder/300/200'
  },
  {
    id: 4,
    name: 'Aphids',
    scientificName: 'Aphis spp.',
    severity: 'Medium',
    affectedCrops: ['Wheat', 'Mustard', 'Cotton', 'Vegetables'],
    symptoms: [
      'Curling of leaves',
      'Yellowing of plants',
      'Honeydew secretion',
      'Stunted growth'
    ],
    controlMeasures: {
      cultural: [
        'Yellow sticky traps',
        'Reflective mulches',
        'Balanced fertilization',
        'Remove alternate hosts'
      ],
      biological: [
        'Release ladybird beetles',
        'Conserve syrphid flies',
        'Apply neem oil',
        'Use Verticillium lecanii'
      ],
      chemical: [
        'Imidacloprid 17.8% SL',
        'Thiamethoxam 25% WG',
        'Acetamiprid 20% SP',
        'Spray on need basis'
      ]
    },
    identificationTips: 'Small, soft-bodied insects in colonies on tender shoots',
    seasonalOccurrence: 'Winter months (December-February)',
    economicThreshold: '5-10% infested plants',
    image: '/api/placeholder/300/200'
  },
  {
    id: 5,
    name: 'Stem Borer',
    scientificName: 'Scirpophaga incertulas',
    severity: 'High',
    affectedCrops: ['Rice', 'Sugarcane', 'Maize'],
    symptoms: [
      'Dead heart in vegetative stage',
      'White ear in reproductive stage',
      'Bore holes on stem',
      'Presence of frass'
    ],
    controlMeasures: {
      cultural: [
        'Remove and destroy stubbles',
        'Avoid late planting',
        'Maintain proper water level',
        'Use resistant varieties'
      ],
      biological: [
        'Release Trichogramma japonicum',
        'Install pheromone traps',
        'Encourage parasitoids',
        'Apply Beauveria bassiana'
      ],
      chemical: [
        'Cartap hydrochloride 50% SP',
        'Chlorantraniliprole 0.4% GR',
        'Fipronil 5% SC',
        'Apply at ETL'
      ]
    },
    identificationTips: 'Moth laying eggs in masses, larvae boring into stem',
    seasonalOccurrence: 'Throughout crop season',
    economicThreshold: '5% dead hearts or 1% white ears',
    image: '/api/placeholder/300/200'
  }
];

export const pestCategories = [
  'All',
  'Insects',
  'Diseases',
  'Weeds',
  'Nematodes',
  'Rodents',
  'Birds'
];

export const severityLevels = [
  { level: 'Low', color: 'green', action: 'Monitor regularly' },
  { level: 'Medium', color: 'yellow', action: 'Prepare for control measures' },
  { level: 'High', color: 'orange', action: 'Immediate action required' },
  { level: 'Very High', color: 'red', action: 'Emergency measures needed' }
];

export const controlMethods = [
  'Cultural',
  'Biological',
  'Chemical',
  'Mechanical',
  'Integrated'
];
