/**
 * Mock data for Integrations Hub. Replace with API response when backend is available.
 * Data shape is backend-friendly: same structure as expected from GET /api/borrower/settings/integrations
 */

/** @typedef {'connected'|'not_connected'|'required'|'pending'|'error'} IntegrationStatus */

/**
 * @typedef {Object} Integration
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} [icon] - emoji or icon key
 * @property {IntegrationStatus} status
 * @property {boolean} [isRequired]
 * @property {string} type - category e.g. Payment, Accounting
 * @property {string[]} usedBy
 * @property {string} [cost]
 * @property {string[]} [features] - Features list for connect modal
 * @property {string[]} [setupRequirements] - Required fields for setup (e.g. ['API Key', 'API Secret'])
 * @property {string[]} [setupInstructions] - Step-by-step setup instructions
 * @property {string[]} [configSetupRequirements] - Setup requirement labels for Configure modal (e.g. API Key, Sender authentication)
 * @property {string[]} [environmentOptions] - Environment dropdown options (e.g. Production, Staging)
 * @property {Object} [config] - Current configuration (for Configure modal); backend can replace with API
 * @property {string} [config.apiKeyMasked] - Masked API key display
 * @property {string} [config.webhookUrl] - Webhook URL
 * @property {string} [config.environment] - Selected environment
 * @property {string} [config.lastVerified] - Last verified text (e.g. '2 hours ago')
 */

/**
 * @typedef {Object} IntegrationsHubMetrics
 * @property {number} total
 * @property {number} connected
 * @property {number} requiredCurrent
 * @property {number} requiredTotal
 * @property {number} platformHealthPercent
 */

/**
 * @typedef {Object} IntegrationCategory
 * @property {string} id
 * @property {string} label
 * @property {number} count
 */

export const MOCK_INTEGRATIONS_METRICS = {
  total: 36,
  connected: 20,
  requiredCurrent: 6,
  requiredTotal: 6,
  platformHealthPercent: 56,
}

export const MOCK_INTEGRATION_CATEGORIES = [
  { id: 'all', label: 'All Integrations', count: 36 },
  { id: 'payments', label: 'Payments', count: 3 },
  { id: 'accounting', label: 'Accounting', count: 2 },
  { id: 'banking', label: 'Banking', count: 2 },
  { id: 'communications', label: 'Communications', count: 5 },
  { id: 'documents', label: 'Documents', count: 1 },
  { id: 'storage', label: 'Storage', count: 1 },
  { id: 'identity', label: 'Identity/KYC', count: 0 },
  { id: 'credit', label: 'Credit', count: 0 },
  { id: 'property', label: 'Property', count: 0 },
  { id: 'registries', label: 'Registries', count: 0 },
  { id: 'authentication', label: 'Authentication', count: 0 },
  { id: 'notifications', label: 'Notifications', count: 0 },
  { id: 'analytics', label: 'Analytics', count: 0 },
  { id: 'support', label: 'Support', count: 0 },
]

export const MOCK_INTEGRATIONS = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and subscription billing',
    icon: '💳',
    status: 'connected',
    isRequired: true,
    type: 'Payment',
    usedBy: ['payments', 'sales', 'CRM'],
    cost: '2.0% + 30¢ per transaction',
  },
  {
    id: 'square',
    name: 'Square',
    description: 'In-person and online payments',
    icon: '📦',
    status: 'not_connected',
    type: 'Payment',
    usedBy: ['payments'],
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Cloud accounting and invoicing',
    icon: '📊',
    status: 'connected',
    type: 'Accounting',
    usedBy: ['accounting', 'trust'],
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks Online',
    description: 'Accounting and bookkeeping',
    icon: '📒',
    status: 'not_connected',
    type: 'Accounting',
    usedBy: ['accounting', 'loans'],
  },
  {
    id: 'myob',
    name: 'MYOB AccountRight',
    description: 'Australian accounting software',
    icon: '🔢',
    status: 'not_connected',
    type: 'Accounting',
    usedBy: ['accounting'],
  },
  {
    id: 'plaid',
    name: 'Plaid',
    description: 'Bank account linking and verification',
    icon: '🏦',
    status: 'connected',
    type: 'Banking',
    usedBy: ['trust', 'accounting', 'lending'],
    cost: '$0.10-0.50 per verification',
  },
  {
    id: 'yodlee',
    name: 'Yodlee',
    description: 'Financial data aggregation',
    icon: '📈',
    status: 'not_connected',
    type: 'Banking',
    usedBy: ['banking'],
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Transactional and marketing emails',
    icon: '✉️',
    status: 'connected',
    isRequired: true,
    type: 'Communication',
    usedBy: ['All'],
    cost: 'Free tier: 100 emails/day, Paid: from $19.95/mo',
    features: ['Transactional emails', 'Delivery tracking', 'Email templates', 'Bounce management'],
    configSetupRequirements: ['API Key', 'Sender authentication', 'Domain verification'],
    environmentOptions: ['Production', 'Staging', 'Sandbox'],
    config: {
      apiKeyMasked: '************',
      webhookUrl: 'https://api.growplatform.com/webhooks/sendgrid',
      environment: 'Production',
      lastVerified: '2 hours ago',
    },
  },
  {
    id: 'gmail',
    name: 'Gmail / Google Workspace',
    description: 'Email and calendar integration',
    icon: '📧',
    status: 'connected',
    type: 'Communication',
    usedBy: ['CRM', 'accounting', 'lending'],
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook/365',
    description: 'Email and calendar sync',
    icon: '📬',
    status: 'not_connected',
    type: 'Communication',
    usedBy: ['CRM', 'accounting', 'lending'],
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'SMS, voice, and 2FA services',
    icon: '📱',
    status: 'connected',
    isRequired: true,
    type: 'Communication',
    usedBy: ['All'],
    cost: 'Pay as you go - $0.015 per SMS',
  },
  {
    id: 'messagemedia',
    name: 'MessageMedia',
    description: 'Australian SMS provider',
    icon: '💬',
    status: 'not_connected',
    type: 'Communication',
    usedBy: ['All'],
    features: ['SMS notifications', 'Australian numbers', 'Delivery reports'],
    setupRequirements: ['API Key', 'API Secret'],
    setupInstructions: [
      'Create an account with MessageMedia',
      'Obtain your API credentials from their dashboard',
      'Enter the credentials below',
      'Test the connection to verify',
    ],
  },
  {
    id: 'docusign',
    name: 'DocuSign',
    description: 'Electronic signature platform',
    icon: '✍️',
    status: 'connected',
    type: 'Document',
    usedBy: ['documents', 'onboarding', 'settlement'],
  },
  {
    id: 'adobe-sign',
    name: 'Adobe Sign',
    description: 'Adobe e-signature solution',
    icon: '📄',
    status: 'not_connected',
    type: 'Document',
    usedBy: ['documents', 'lending', 'onboarding', 'settlement'],
  },
  {
    id: 's3',
    name: 'Amazon S3',
    description: 'Primary document storage',
    icon: '☁️',
    status: 'connected',
    isRequired: true,
    type: 'Storage',
    usedBy: ['All'],
    cost: '10-20$ per GB/month',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Google cloud storage integration',
    icon: '📁',
    status: 'connected',
    type: 'Storage',
    usedBy: ['storage', 'documents'],
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Cloud file storage and sharing',
    icon: '📂',
    status: 'not_connected',
    type: 'Storage',
    usedBy: ['storage', 'documents'],
  },
  {
    id: 'greenid',
    name: 'GreenID',
    description: 'Australian identity verification (AML/CTF)',
    icon: '🛡️',
    status: 'connected',
    isRequired: true,
    type: 'Identity',
    usedBy: ['All', 'Identity Verification', 'lending', 'trust'],
    cost: 'B2B per verification',
  },
  {
    id: 'onfido',
    name: 'Onfido',
    description: 'Global identity verification',
    icon: '🪪',
    status: 'not_connected',
    type: 'Identity',
    usedBy: ['AML/CTF', 'onboarding'],
  },
  {
    id: 'ocr-space',
    name: 'OCR.space',
    description: 'Document OCR and data extraction',
    icon: '🔍',
    status: 'connected',
    type: 'Identity',
    usedBy: ['documents', 'accounting'],
    cost: 'Free tier available, paid from $XXX/mo',
  },
  {
    id: 'equifax',
    name: 'Equifax',
    description: 'Credit reporting and risk assessment',
    icon: '📋',
    status: 'connected',
    type: 'Credit',
    usedBy: ['lending', 'onboarding'],
    cost: '$2-50 per check',
  },
  {
    id: 'illion',
    name: 'illion (Dun & Bradstreet)',
    description: 'Business and consumer credit',
    icon: '📊',
    status: 'not_connected',
    type: 'Credit',
    usedBy: ['lending', 'onboarding'],
  },
  {
    id: 'corelogic',
    name: 'CoreLogic',
    description: 'Property data and valuations',
    icon: '🏠',
    status: 'connected',
    type: 'Property',
    usedBy: ['lending', 'onboarding', 'settlement'],
    cost: 'Per report pricing',
  },
  {
    id: 'domain',
    name: 'Domain.com.au',
    description: 'Property listings and data',
    icon: '🏡',
    status: 'not_connected',
    type: 'Property',
    usedBy: ['lending', 'onboarding'],
  },
  {
    id: 'abr',
    name: 'ABR (ABN Lookup)',
    description: 'Australian Business Register lookup',
    icon: '🏛️',
    status: 'connected',
    type: 'Registry',
    usedBy: ['KYC', 'accounting', 'onboarding'],
    cost: 'Free',
  },
  {
    id: 'asic',
    name: 'ASIC Connect',
    description: 'Company and search registry',
    icon: '📑',
    status: 'connected',
    type: 'Registry',
    usedBy: ['KYC', 'onboarding', 'accounting', 'investments'],
  },
  {
    id: 'ppsr',
    name: 'PPSR',
    description: 'Personal Property Securities Register',
    icon: '📜',
    status: 'not_connected',
    type: 'Registry',
    usedBy: ['KYC', 'onboarding'],
  },
  {
    id: 'azure-ad',
    name: 'Azure Active Directory',
    description: 'Enterprise SSO and identity',
    icon: '🔐',
    status: 'not_connected',
    type: 'Auth',
    usedBy: ['KYC', 'HR'],
  },
  {
    id: 'google-sso',
    name: 'Google Workspace SSO',
    description: 'Google single sign-on',
    icon: '🔑',
    status: 'not_connected',
    type: 'Auth',
    usedBy: ['KYC', 'HR'],
  },
  {
    id: 'auth0',
    name: 'Auth0',
    description: 'Authentication and authorization',
    icon: '🛡️',
    status: 'connected',
    isRequired: true,
    type: 'Auth',
    usedBy: ['KYC', 'HR'],
    cost: 'Free up to 7,000 active users, Paid from $20/mo',
  },
]
