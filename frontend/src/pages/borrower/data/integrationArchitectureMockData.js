/**
 * Mock data for Integration Architecture page.
 * Replace with API response when backend is available.
 */

export const MOCK_INTEGRATION_DATA = {
  coreModules: [
    {
      id: 'grow-crm',
      name: 'Grow CRM',
      icon: '👥',
      color: 'blue',
      description: 'Unified contacts and CRM across modules',
      tagline: 'Adds cross-module integration',
      price: 99,
      features: [
        'Unified contacts',
        'Client portal',
      ],
    },
    {
      id: 'grow-documents',
      name: 'Grow Documents',
      icon: '📄',
      color: 'purple',
      description: 'Centralized document management',
      tagline: 'Adds cross-module integration',
      price: 149,
      features: [
        'Document Suite',
        'Version Control',
      ],
    },
    {
      id: 'grow-time-billings',
      name: 'Grow Time & Billings',
      icon: '⏱️',
      color: 'green',
      description: 'Time tracking & invoicing management',
      tagline: 'Adds cross-module integration',
      price: 129,
      features: [
        'Time tracking',
        'Automated billing',
      ],
    },
    {
      id: 'grow-hq',
      name: 'Grow HQ',
      icon: '🏢',
      color: 'orange',
      description: 'Unified admin dashboard center',
      tagline: 'Adds cross-module integration',
      price: 0,
      features: [
        'Unified console',
        'Module manager',
        'Module installation',
      ],
    },
  ],

  specializedModules: [
    { id: 'brickbanq', name: 'Brickbanq', category: 'Virtual MIP Platform', icon: '📦' },
    { id: 'grow-accounting', name: 'Grow Accounting', category: 'Financial Management', icon: '📦' },
    { id: 'grow-lending', name: 'Grow Lending', category: 'Facilitates Lending', icon: '📦' },
    { id: 'grow-trust', name: 'Grow Trust', category: 'Trust Funds Management', icon: '📦' },
    { id: 'grow-househomes', name: 'Grow HouseHomes', category: 'House Management', icon: '📦' },
    { id: 'grow-receivership', name: 'Grow Receivership', category: 'Receivership Suite', icon: '📦' },
    { id: 'grow-settlement', name: 'Grow Settlement', category: 'Property Settlement', icon: '📦' },
    { id: 'grow-payments', name: 'Grow Payments', category: 'Deposit Solutions', icon: '📦' },
  ],

  pricingTiers: {
    specialized: {
      basePrice: 199,
      period: '/per module per month',
      includes: [
        'Module-specific functionality',
        'Base integrations from system contact',
        'API access for custom integrations',
      ],
    },
    bundles: {
      small: { name: 'Small Practice', price: 298, period: '/month', label: '💸 Example Bundle Pricing', includes: 'Grow CRM, Grow Settlement, Grow Time & Billing, Grow Documents, Grow Trust' },
      mid: { name: 'Mid-Size Firm', price: 974, period: '/month', label: 'Mid-Size Firm', includes: 'Grow CRM, Grow Settlement, Grow Time & Billing, Grow Documents, Grow Trust' },
      enterprise: { name: 'Enterprise', price: 2566, period: '/month', label: 'Enterprise', includes: 'Grow CRM, Grow Settlement, Grow Time & Billing, Grow Documents, Grow Trust' },
    },
  },

  implementationPhases: [
    {
      phase: 1,
      title: 'Core Setup',
      tasks: [
        'Evaluate core specialized modules (e.g., Trust, Grow Settlement)',
        'Import existing contact; document databases if needed',
        'Configure organization branding and custom domain',
        'Setup user roles and access; add users',
        'Test and define your Grow setup and roles',
      ],
    },
    {
      phase: 2,
      title: 'Add Module',
      tasks: [
        'Test Grow CRM or Grow Doc; existing contacts from specialized modules',
        'Enable these documents (1-2 modules)',
        'Test document uploads for relationships modules',
        'Continue to add features and modules as appropriate',
        'All modules have share unified data level',
      ],
    },
    {
      phase: 3,
      title: 'Integration',
      tasks: [
        'UI components in specialized modules now show CRM/Docs/Time features',
        'Setup imported from specialized modules via import/settings',
        'Test document templates',
        'Customize document templates',
      ],
    },
    {
      phase: 4,
      title: 'Optimization',
      tasks: [
        'Set up automated billing rules',
        'Customize document templates',
        'Set up advanced billing rules',
      ],
    },
  ],

  compatibilityMatrix: {
    modules: [
      'Brickbanq',
      'Grow Accounting',
      'Grow Lending',
      'Grow Trust',
      'Grow HouseHomes',
      'Grow Receivership',
      'Grow Settlement',
      'Grow Payments',
    ],
    coreModules: ['Grow CRM', 'Grow Documents', 'Grow Time', 'Grow HQ'],
    compatibility: 'full',
  },

  recommendations: {
    highPriority: {
      title: 'High Priority',
      subtitle: 'Operators using 2+ specialized modules',
      recommendations: [
        'Enable Grow CRM',
        'Enable Grow Documents',
        'estimated data loss and saves 50-70% manual tracking',
      ],
    },
    mediumPriority: {
      title: 'Medium Priority',
      subtitle: 'Operators with billable services',
      recommendations: [
        'Enable Grow Time & Revenue',
        'Captures 95% of billable time vs. 60-70% manual tracking',
      ],
    },
    alwaysIncluded: {
      title: 'Always Included',
      subtitle: 'Every operator gets Grow HQ',
      recommendations: [
        'Module management',
        'User administration',
        'White-label control',
      ],
    },
  },
}
