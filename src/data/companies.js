// Central company catalog shared by the resume features (directory + filters).
//
// Per entry:
//   name   - display name
//   slug   - Simple Icons slug for a crisp brand mark, when one exists.
//            Simple Icons has REMOVED several big brands (e.g. Microsoft,
//            Amazon) over trademark policy, so those are left null and fall
//            back to the favicon source below.
//   domain - used for a real-logo favicon (Google's favicon service). This is
//            the reliable universal source: it works for every company with a
//            website, including brands Simple Icons dropped.
//   letter/color - final fallback mark shown only if both image sources fail.
//
// Logo resolution order (see CompanyLogo): slug -> favicon(domain) -> letter.
export const COMPANIES = {
  // ── Big Tech ────────────────────────────────────────────────
  google:     { name: 'Google',           slug: 'google',      domain: 'google.com' },
  microsoft:  { name: 'Microsoft',        slug: null,          domain: 'microsoft.com',     letter: 'M',  color: '#5E5E5E' },
  apple:      { name: 'Apple',            slug: 'apple',       domain: 'apple.com' },
  amazon:     { name: 'Amazon',           slug: null,          domain: 'amazon.com',        letter: 'a',  color: '#FF9900' },
  meta:       { name: 'Meta',             slug: 'meta',        domain: 'meta.com' },
  netflix:    { name: 'Netflix',          slug: 'netflix',     domain: 'netflix.com' },
  nvidia:     { name: 'NVIDIA',           slug: 'nvidia',      domain: 'nvidia.com' },
  tesla:      { name: 'Tesla',            slug: 'tesla',       domain: 'tesla.com' },
  samsung:    { name: 'Samsung',          slug: 'samsung',     domain: 'samsung.com' },
  sony:       { name: 'Sony',             slug: 'sony',        domain: 'sony.com' },

  // ── Software / SaaS / Cloud ────────────────────────────────
  salesforce: { name: 'Salesforce',       slug: 'salesforce',  domain: 'salesforce.com' },
  oracle:     { name: 'Oracle',           slug: 'oracle',      domain: 'oracle.com' },
  adobe:      { name: 'Adobe',            slug: 'adobe',       domain: 'adobe.com' },
  sap:        { name: 'SAP',              slug: 'sap',         domain: 'sap.com' },
  ibm:        { name: 'IBM',              slug: 'ibm',         domain: 'ibm.com' },
  intel:      { name: 'Intel',            slug: 'intel',       domain: 'intel.com' },
  amd:        { name: 'AMD',              slug: 'amd',         domain: 'amd.com' },
  qualcomm:   { name: 'Qualcomm',         slug: 'qualcomm',    domain: 'qualcomm.com' },
  cisco:      { name: 'Cisco',            slug: 'cisco',       domain: 'cisco.com' },
  vmware:     { name: 'VMware',           slug: 'vmware',      domain: 'vmware.com' },
  servicenow: { name: 'ServiceNow',       slug: 'servicenow',  domain: 'servicenow.com' },
  workday:    { name: 'Workday',          slug: 'workday',     domain: 'workday.com' },
  atlassian:  { name: 'Atlassian',        slug: 'atlassian',   domain: 'atlassian.com' },
  slack:      { name: 'Slack',            slug: 'slack',       domain: 'slack.com' },
  zoom:       { name: 'Zoom',             slug: 'zoom',        domain: 'zoom.us' },
  dropbox:    { name: 'Dropbox',          slug: 'dropbox',     domain: 'dropbox.com' },
  box:        { name: 'Box',              slug: 'box',         domain: 'box.com' },
  figma:      { name: 'Figma',            slug: 'figma',       domain: 'figma.com' },
  notion:     { name: 'Notion',           slug: 'notion',      domain: 'notion.so' },
  airtable:   { name: 'Airtable',         slug: 'airtable',    domain: 'airtable.com' },
  github:     { name: 'GitHub',           slug: 'github',      domain: 'github.com' },
  gitlab:     { name: 'GitLab',           slug: 'gitlab',      domain: 'gitlab.com' },
  mongodb:    { name: 'MongoDB',          slug: 'mongodb',     domain: 'mongodb.com' },
  snowflake:  { name: 'Snowflake',        slug: 'snowflake',   domain: 'snowflake.com' },
  databricks: { name: 'Databricks',       slug: 'databricks',  domain: 'databricks.com' },
  datadog:    { name: 'Datadog',          slug: 'datadog',     domain: 'datadoghq.com' },
  twilio:     { name: 'Twilio',           slug: 'twilio',      domain: 'twilio.com' },
  okta:       { name: 'Okta',             slug: 'okta',        domain: 'okta.com' },
  cloudflare: { name: 'Cloudflare',       slug: 'cloudflare',  domain: 'cloudflare.com' },
  hashicorp:  { name: 'HashiCorp',        slug: 'hashicorp',   domain: 'hashicorp.com' },
  palantir:   { name: 'Palantir',         slug: 'palantir',    domain: 'palantir.com' },
  splunk:     { name: 'Splunk',           slug: 'splunk',      domain: 'splunk.com' },
  elastic:    { name: 'Elastic',          slug: 'elastic',     domain: 'elastic.co' },
  confluent:  { name: 'Confluent',        slug: 'confluent',   domain: 'confluent.io' },
  vercel:     { name: 'Vercel',           slug: 'vercel',      domain: 'vercel.com' },
  asana:      { name: 'Asana',            slug: 'asana',       domain: 'asana.com' },
  intuit:     { name: 'Intuit',           slug: 'intuit',      domain: 'intuit.com' },
  docusign:   { name: 'DocuSign',         slug: 'docusign',    domain: 'docusign.com' },
  redhat:     { name: 'Red Hat',          slug: 'redhat',      domain: 'redhat.com' },
  arm:        { name: 'Arm',              slug: 'arm',         domain: 'arm.com' },
  dell:       { name: 'Dell',             slug: 'dell',        domain: 'dell.com' },
  hp:         { name: 'HP',               slug: 'hp',          domain: 'hp.com' },
  broadcom:   { name: 'Broadcom',         slug: 'broadcom',    domain: 'broadcom.com' },
  ti:         { name: 'Texas Instruments',slug: 'texasinstruments', domain: 'ti.com' },
  micron:     { name: 'Micron',           slug: null,          domain: 'micron.com',        letter: 'M',  color: '#0066B3' },

  // ── AI ──────────────────────────────────────────────────────
  openai:     { name: 'OpenAI',           slug: 'openai',      domain: 'openai.com' },
  anthropic:  { name: 'Anthropic',        slug: null,          domain: 'anthropic.com',     letter: 'A',  color: '#C4602D' },
  huggingface:{ name: 'Hugging Face',     slug: 'huggingface', domain: 'huggingface.co' },
  scale:      { name: 'Scale AI',         slug: null,          domain: 'scale.com',         letter: 'S',  color: '#1A1A1A' },

  // ── Fintech / Payments ─────────────────────────────────────
  stripe:     { name: 'Stripe',           slug: 'stripe',      domain: 'stripe.com' },
  paypal:     { name: 'PayPal',           slug: 'paypal',      domain: 'paypal.com' },
  block:      { name: 'Block',            slug: 'block',       domain: 'block.xyz' },
  robinhood:  { name: 'Robinhood',        slug: 'robinhood',   domain: 'robinhood.com' },
  coinbase:   { name: 'Coinbase',         slug: 'coinbase',    domain: 'coinbase.com' },
  plaid:      { name: 'Plaid',            slug: 'plaid',       domain: 'plaid.com' },
  visa:       { name: 'Visa',             slug: 'visa',        domain: 'visa.com' },
  mastercard: { name: 'Mastercard',       slug: 'mastercard',  domain: 'mastercard.com' },
  amex:       { name: 'American Express',  slug: 'americanexpress', domain: 'americanexpress.com' },
  capitalone: { name: 'Capital One',      slug: 'capitalone',  domain: 'capitalone.com' },

  // ── Banks / Finance / Quant ────────────────────────────────
  jpmorgan:   { name: 'JPMorgan Chase',   slug: null,          domain: 'jpmorganchase.com', letter: 'JP', color: '#003087' },
  goldman:    { name: 'Goldman Sachs',    slug: null,          domain: 'goldmansachs.com',  letter: 'GS', color: '#6E7B8B' },
  morganstanley:{ name: 'Morgan Stanley', slug: null,          domain: 'morganstanley.com', letter: 'MS', color: '#00A3E0' },
  bofa:       { name: 'Bank of America',  slug: null,          domain: 'bankofamerica.com', letter: 'B',  color: '#012169' },
  wellsfargo: { name: 'Wells Fargo',      slug: null,          domain: 'wellsfargo.com',    letter: 'WF', color: '#D71E28' },
  citi:       { name: 'Citi',             slug: null,          domain: 'citigroup.com',     letter: 'C',  color: '#003B70' },
  fidelity:   { name: 'Fidelity',         slug: null,          domain: 'fidelity.com',      letter: 'F',  color: '#006633' },
  blackrock:  { name: 'BlackRock',        slug: null,          domain: 'blackrock.com',     letter: 'B',  color: '#000000' },
  citadel:    { name: 'Citadel',          slug: null,          domain: 'citadel.com',       letter: 'C',  color: '#0B1F3A' },
  twosigma:   { name: 'Two Sigma',        slug: null,          domain: 'twosigma.com',      letter: '2S', color: '#1A1A1A' },
  janestreet: { name: 'Jane Street',      slug: null,          domain: 'janestreet.com',    letter: 'J',  color: '#1A1A1A' },

  // ── Consulting ──────────────────────────────────────────────
  mckinsey:   { name: 'McKinsey',         slug: null,          domain: 'mckinsey.com',      letter: 'Mc', color: '#051C2C' },
  bcg:        { name: 'BCG',              slug: null,          domain: 'bcg.com',           letter: 'B',  color: '#177B57' },
  bain:       { name: 'Bain',             slug: null,          domain: 'bain.com',          letter: 'B',  color: '#CC0000' },
  deloitte:   { name: 'Deloitte',         slug: 'deloitte',    domain: 'deloitte.com' },
  pwc:        { name: 'PwC',              slug: 'pwc',         domain: 'pwc.com' },
  ey:         { name: 'EY',               slug: 'ey',          domain: 'ey.com' },
  kpmg:       { name: 'KPMG',             slug: 'kpmg',        domain: 'kpmg.com' },
  accenture:  { name: 'Accenture',        slug: 'accenture',   domain: 'accenture.com' },

  // ── Social / Media / Consumer ──────────────────────────────
  tiktok:     { name: 'TikTok',           slug: 'tiktok',      domain: 'tiktok.com' },
  snap:       { name: 'Snap',             slug: 'snapchat',    domain: 'snap.com' },
  pinterest:  { name: 'Pinterest',        slug: 'pinterest',   domain: 'pinterest.com' },
  reddit:     { name: 'Reddit',           slug: 'reddit',      domain: 'reddit.com' },
  discord:    { name: 'Discord',          slug: 'discord',     domain: 'discord.com' },
  spotify:    { name: 'Spotify',          slug: 'spotify',     domain: 'spotify.com' },
  twitch:     { name: 'Twitch',           slug: 'twitch',      domain: 'twitch.tv' },
  linkedin:   { name: 'LinkedIn',         slug: 'linkedin',    domain: 'linkedin.com' },
  x:          { name: 'X',                slug: 'x',           domain: 'x.com' },
  youtube:    { name: 'YouTube',          slug: 'youtube',     domain: 'youtube.com' },

  // ── Marketplaces / Gig / Travel ────────────────────────────
  airbnb:     { name: 'Airbnb',           slug: 'airbnb',      domain: 'airbnb.com' },
  uber:       { name: 'Uber',             slug: 'uber',        domain: 'uber.com' },
  lyft:       { name: 'Lyft',             slug: 'lyft',        domain: 'lyft.com' },
  doordash:   { name: 'DoorDash',         slug: 'doordash',    domain: 'doordash.com' },
  instacart:  { name: 'Instacart',        slug: 'instacart',   domain: 'instacart.com' },
  booking:    { name: 'Booking.com',      slug: 'bookingdotcom', domain: 'booking.com' },

  // ── Education / Learning ───────────────────────────────────
  coursera:   { name: 'Coursera',         slug: 'coursera',    domain: 'coursera.org' },
  duolingo:   { name: 'Duolingo',         slug: 'duolingo',    domain: 'duolingo.com' },

  // ── Gaming ──────────────────────────────────────────────────
  roblox:     { name: 'Roblox',           slug: 'roblox',      domain: 'roblox.com' },
  ea:         { name: 'Electronic Arts',  slug: 'ea',          domain: 'ea.com' },
  epicgames:  { name: 'Epic Games',       slug: 'epicgames',   domain: 'epicgames.com' },
  nintendo:   { name: 'Nintendo',         slug: 'nintendo',    domain: 'nintendo.com' },
  riotgames:  { name: 'Riot Games',       slug: 'riotgames',   domain: 'riotgames.com' },

  // ── Retail / CPG ───────────────────────────────────────────
  walmart:    { name: 'Walmart',          slug: 'walmart',     domain: 'walmart.com' },
  target:     { name: 'Target',           slug: 'target',      domain: 'target.com' },
  nike:       { name: 'Nike',             slug: 'nike',        domain: 'nike.com' },
  starbucks:  { name: 'Starbucks',        slug: 'starbucks',   domain: 'starbucks.com' },
  mcdonalds:  { name: "McDonald's",       slug: 'mcdonalds',   domain: 'mcdonalds.com' },
  cocacola:   { name: 'Coca-Cola',        slug: 'cocacola',    domain: 'coca-cola.com' },
  disney:     { name: 'Disney',           slug: null,          domain: 'thewaltdisneycompany.com', letter: 'D', color: '#113CCF' },

  // ── Telecom / Aerospace / Auto / Industrial ────────────────
  att:        { name: 'AT&T',             slug: 'att',         domain: 'att.com' },
  verizon:    { name: 'Verizon',          slug: 'verizon',     domain: 'verizon.com' },
  tmobile:    { name: 'T-Mobile',         slug: null,          domain: 't-mobile.com',      letter: 'T',  color: '#E20074' },
  boeing:     { name: 'Boeing',           slug: 'boeing',      domain: 'boeing.com' },
  spacex:     { name: 'SpaceX',           slug: 'spacex',      domain: 'spacex.com' },
  ford:       { name: 'Ford',             slug: 'ford',        domain: 'ford.com' },
  gm:         { name: 'General Motors',   slug: null,          domain: 'gm.com',            letter: 'GM', color: '#0170CE' },
  lockheed:   { name: 'Lockheed Martin',  slug: null,          domain: 'lockheedmartin.com',letter: 'LM', color: '#002F6C' },
}

// Simple Icons brand mark (crisp). Pass a hex `tint` (no #) to recolor it.
export function simpleIconUrl(slug, tint) {
  return tint ? `https://cdn.simpleicons.org/${slug}/${tint}` : `https://cdn.simpleicons.org/${slug}`
}

// Real-logo favicon for any domain. Reliable fallback / universal source.
export function faviconUrl(domain, size = 64) {
  return `https://www.google.com/s2/favicons?sz=${size}&domain=${domain}`
}
