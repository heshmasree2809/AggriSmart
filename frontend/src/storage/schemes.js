// Government Schemes Database
export const governmentSchemes = [
  {
    id: 1,
    name: 'PM-KISAN',
    fullName: 'Pradhan Mantri Kisan Samman Nidhi',
    description: 'Direct income support of ₹6,000 per year to farmer families',
    benefits: [
      '₹6,000 per year in three installments',
      'Direct transfer to bank account',
      'For small and marginal farmers',
      'No middlemen involved'
    ],
    eligibility: [
      'Small and marginal farmers',
      'Landholding up to 2 hectares',
      'Valid Aadhaar card',
      'Active bank account'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Land ownership papers',
      'Bank account details',
      'Mobile number'
    ],
    howToApply: 'Apply online at pmkisan.gov.in or visit nearest CSC center',
    lastDate: 'Open throughout the year',
    status: 'Active',
    link: 'https://pmkisan.gov.in',
    category: 'Income Support'
  },
  {
    id: 2,
    name: 'PM Fasal Bima Yojana',
    fullName: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme providing financial support against crop failure',
    benefits: [
      'Coverage for crop loss due to natural calamities',
      'Premium: 2% for Kharif, 1.5% for Rabi crops',
      'Post-harvest losses covered',
      'Technology-based claim assessment'
    ],
    eligibility: [
      'All farmers including sharecroppers',
      'Both loanee and non-loanee farmers',
      'Growing notified crops',
      'In notified areas'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Land records',
      'Bank passbook',
      'Sowing certificate'
    ],
    howToApply: 'Through banks, insurance companies, or online portal',
    lastDate: 'Within cut-off dates for each season',
    status: 'Active',
    link: 'https://pmfby.gov.in',
    category: 'Crop Insurance'
  },
  {
    id: 3,
    name: 'Soil Health Card Scheme',
    fullName: 'Soil Health Card Scheme',
    description: 'Provides soil health cards to farmers with crop-wise fertilizer recommendations',
    benefits: [
      'Free soil testing',
      'Customized fertilizer recommendations',
      'Improves soil fertility',
      'Reduces cultivation cost'
    ],
    eligibility: [
      'All farmers',
      'Land owners',
      'Tenant farmers'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Land documents',
      'Mobile number'
    ],
    howToApply: 'Contact local agriculture office or apply online',
    lastDate: 'Ongoing scheme',
    status: 'Active',
    link: 'https://soilhealth.dac.gov.in',
    category: 'Soil Management'
  },
  {
    id: 4,
    name: 'Kisan Credit Card',
    fullName: 'Kisan Credit Card Scheme',
    description: 'Provides timely credit support to farmers for agricultural needs',
    benefits: [
      'Credit limit based on landholding',
      'Interest subvention of 2%',
      'ATM enabled RuPay card',
      'Personal accident insurance coverage'
    ],
    eligibility: [
      'Farmers (individual/joint)',
      'Tenant farmers',
      'Share croppers',
      'SHGs or Joint Liability Groups'
    ],
    documentsRequired: [
      'Application form',
      'Identity proof',
      'Address proof',
      'Land documents'
    ],
    howToApply: 'Apply at any bank branch',
    lastDate: 'Available throughout the year',
    status: 'Active',
    link: 'https://www.pm-kisan.gov.in/kcc',
    category: 'Credit Facility'
  },
  {
    id: 5,
    name: 'PMKSY',
    fullName: 'Pradhan Mantri Krishi Sinchayee Yojana',
    description: 'Irrigation scheme focusing on water conservation and management',
    benefits: [
      'Subsidy on drip/sprinkler irrigation',
      'Water harvesting structures',
      'Per drop more crop',
      'Integrated water management'
    ],
    eligibility: [
      'All farmers',
      'Groups of farmers',
      'Cooperatives',
      'Water user associations'
    ],
    documentsRequired: [
      'Land ownership documents',
      'Aadhaar Card',
      'Bank details',
      'Project proposal'
    ],
    howToApply: 'Through state agriculture department',
    lastDate: 'As per state notification',
    status: 'Active',
    link: 'https://pmksy.gov.in',
    category: 'Irrigation'
  },
  {
    id: 6,
    name: 'e-NAM',
    fullName: 'Electronic National Agriculture Market',
    description: 'Online trading platform for agricultural commodities',
    benefits: [
      'Better price discovery',
      'Transparent auction process',
      'Online payment',
      'Quality assaying'
    ],
    eligibility: [
      'Licensed traders',
      'Farmers',
      'Commission agents',
      'Registered buyers'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Bank account',
      'PAN card (for traders)',
      'License (for traders)'
    ],
    howToApply: 'Register on e-NAM portal or nearest APMC',
    lastDate: 'Registration open',
    status: 'Active',
    link: 'https://enam.gov.in',
    category: 'Marketing'
  },
  {
    id: 7,
    name: 'Paramparagat Krishi Vikas Yojana',
    fullName: 'Paramparagat Krishi Vikas Yojana',
    description: 'Promotes organic farming through cluster approach',
    benefits: [
      '₹50,000 per hectare for 3 years',
      'Support for certification',
      'Training and capacity building',
      'Marketing support'
    ],
    eligibility: [
      'Groups of farmers (minimum 50)',
      'Contiguous area of 50 acres',
      'Willingness to adopt organic farming'
    ],
    documentsRequired: [
      'Group formation documents',
      'Land records',
      'Bank account details',
      'Undertaking for organic farming'
    ],
    howToApply: 'Through Regional Councils or State department',
    lastDate: 'As per annual allocation',
    status: 'Active',
    link: 'https://pgsindia-ncof.gov.in/pkvy',
    category: 'Organic Farming'
  },
  {
    id: 8,
    name: 'RKVY',
    fullName: 'Rashtriya Krishi Vikas Yojana',
    description: 'Supports states in increasing agricultural productivity',
    benefits: [
      'Infrastructure development',
      'Asset creation',
      'Agri-business promotion',
      'Innovation support'
    ],
    eligibility: [
      'State governments',
      'Farmer groups',
      'Agricultural institutions',
      'Agri-entrepreneurs'
    ],
    documentsRequired: [
      'Project proposal',
      'DPR (Detailed Project Report)',
      'State recommendation',
      'Beneficiary details'
    ],
    howToApply: 'Through State Agriculture Department',
    lastDate: 'Based on state guidelines',
    status: 'Active',
    link: 'https://rkvy.nic.in',
    category: 'Development'
  }
];

export const schemeCategories = [
  'All',
  'Income Support',
  'Crop Insurance',
  'Credit Facility',
  'Irrigation',
  'Marketing',
  'Organic Farming',
  'Soil Management',
  'Development'
];

export const applySteps = [
  {
    step: 1,
    title: 'Check Eligibility',
    description: 'Verify if you meet the scheme requirements'
  },
  {
    step: 2,
    title: 'Gather Documents',
    description: 'Collect all required documents'
  },
  {
    step: 3,
    title: 'Fill Application',
    description: 'Complete the application form online or offline'
  },
  {
    step: 4,
    title: 'Submit Documents',
    description: 'Upload or submit physical documents'
  },
  {
    step: 5,
    title: 'Track Status',
    description: 'Monitor your application status'
  }
];
