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
  salesforce: { name: 'Salesforce',       slug: null,          domain: 'salesforce.com',    letter: 'S',  color: '#00A1E0' },
  oracle:     { name: 'Oracle',           slug: null,          domain: 'oracle.com',        letter: 'O',  color: '#F80000' },
  adobe:      { name: 'Adobe',            slug: null,          domain: 'adobe.com',         letter: 'A',  color: '#FA0F00' },
  sap:        { name: 'SAP',              slug: 'sap',         domain: 'sap.com' },
  ibm:        { name: 'IBM',              slug: null,          domain: 'ibm.com',           letter: 'I',  color: '#1F70C1' },
  intel:      { name: 'Intel',            slug: 'intel',       domain: 'intel.com' },
  amd:        { name: 'AMD',              slug: 'amd',         domain: 'amd.com' },
  qualcomm:   { name: 'Qualcomm',         slug: 'qualcomm',    domain: 'qualcomm.com' },
  cisco:      { name: 'Cisco',            slug: 'cisco',       domain: 'cisco.com' },
  vmware:     { name: 'VMware',           slug: 'vmware',      domain: 'vmware.com' },
  servicenow: { name: 'ServiceNow',       slug: null,          domain: 'servicenow.com',    letter: 'S',  color: '#62D84E' },
  workday:    { name: 'Workday',          slug: null,          domain: 'workday.com',       letter: 'W',  color: '#0875E1' },
  atlassian:  { name: 'Atlassian',        slug: 'atlassian',   domain: 'atlassian.com' },
  slack:      { name: 'Slack',            slug: null,          domain: 'slack.com',         letter: 'S',  color: '#4A154B' },
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
  twilio:     { name: 'Twilio',           slug: null,          domain: 'twilio.com',        letter: 'T',  color: '#F22F46' },
  okta:       { name: 'Okta',             slug: 'okta',        domain: 'okta.com' },
  cloudflare: { name: 'Cloudflare',       slug: 'cloudflare',  domain: 'cloudflare.com' },
  hashicorp:  { name: 'HashiCorp',        slug: 'hashicorp',   domain: 'hashicorp.com' },
  palantir:   { name: 'Palantir',         slug: 'palantir',    domain: 'palantir.com' },
  splunk:     { name: 'Splunk',           slug: 'splunk',      domain: 'splunk.com' },
  elastic:    { name: 'Elastic',          slug: 'elastic',     domain: 'elastic.co' },
  confluent:  { name: 'Confluent',        slug: null,          domain: 'confluent.io',      letter: 'C',  color: '#173361' },
  vercel:     { name: 'Vercel',           slug: 'vercel',      domain: 'vercel.com' },
  asana:      { name: 'Asana',            slug: 'asana',       domain: 'asana.com' },
  intuit:     { name: 'Intuit',           slug: 'intuit',      domain: 'intuit.com' },
  docusign:   { name: 'DocuSign',         slug: null,          domain: 'docusign.com',      letter: 'D',  color: '#FFB800' },
  redhat:     { name: 'Red Hat',          slug: 'redhat',      domain: 'redhat.com' },
  arm:        { name: 'Arm',              slug: 'arm',         domain: 'arm.com' },
  dell:       { name: 'Dell',             slug: 'dell',        domain: 'dell.com' },
  hp:         { name: 'HP',               slug: 'hp',          domain: 'hp.com' },
  broadcom:   { name: 'Broadcom',         slug: 'broadcom',    domain: 'broadcom.com' },
  ti:         { name: 'Texas Instruments',slug: null,          domain: 'ti.com',            letter: 'T',  color: '#CC0000' },
  micron:     { name: 'Micron',           slug: null,          domain: 'micron.com',        letter: 'M',  color: '#0066B3' },

  // ── AI ──────────────────────────────────────────────────────
  openai:     { name: 'OpenAI',           slug: null,          domain: 'openai.com',        letter: 'O',  color: '#10A37F' },
  anthropic:  { name: 'Anthropic',        slug: null,          domain: 'anthropic.com',     letter: 'A',  color: '#C4602D' },
  huggingface:{ name: 'Hugging Face',     slug: 'huggingface', domain: 'huggingface.co' },
  scale:      { name: 'Scale AI',         slug: null,          domain: 'scale.com',         letter: 'S',  color: '#1A1A1A' },

  // ── Fintech / Payments ─────────────────────────────────────
  stripe:     { name: 'Stripe',           slug: 'stripe',      domain: 'stripe.com' },
  paypal:     { name: 'PayPal',           slug: 'paypal',      domain: 'paypal.com' },
  block:      { name: 'Block',            slug: null,          domain: 'block.xyz',         letter: 'B',  color: '#000000' },
  robinhood:  { name: 'Robinhood',        slug: 'robinhood',   domain: 'robinhood.com' },
  coinbase:   { name: 'Coinbase',         slug: 'coinbase',    domain: 'coinbase.com' },
  plaid:      { name: 'Plaid',            slug: null,          domain: 'plaid.com',         letter: 'P',  color: '#000000' },
  visa:       { name: 'Visa',             slug: 'visa',        domain: 'visa.com' },
  mastercard: { name: 'Mastercard',       slug: 'mastercard',  domain: 'mastercard.com' },
  amex:       { name: 'American Express',  slug: 'americanexpress', domain: 'americanexpress.com' },
  capitalone: { name: 'Capital One',      slug: null,          domain: null,                letter: 'C',  color: '#004977' }, // no Simple Icon; Google favicon 404s — letter mark

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
  mckinsey:   { name: 'McKinsey',         slug: null,          domain: null,                letter: 'Mc', color: '#051C2C' }, // no Simple Icon; Google favicon 404s — letter mark
  bcg:        { name: 'BCG',              slug: null,          domain: 'bcg.com',           letter: 'B',  color: '#177B57' },
  bain:       { name: 'Bain',             slug: null,          domain: 'bain.com',          letter: 'B',  color: '#CC0000' },
  deloitte:   { name: 'Deloitte',         slug: null,          domain: 'deloitte.com',      letter: 'D',  color: '#86BC25' },
  pwc:        { name: 'PwC',              slug: null,          domain: 'pwc.com',           letter: 'P',  color: '#DC6900' },
  ey:         { name: 'EY',               slug: null,          domain: 'ey.com',            letter: 'E',  color: '#2E2E38' },
  kpmg:       { name: 'KPMG',             slug: null,          domain: 'kpmg.com',          letter: 'K',  color: '#00338D' },
  accenture:  { name: 'Accenture',        slug: 'accenture',   domain: 'accenture.com' },

  // ── Social / Media / Consumer ──────────────────────────────
  tiktok:     { name: 'TikTok',           slug: 'tiktok',      domain: 'tiktok.com' },
  snap:       { name: 'Snap',             slug: 'snapchat',    domain: 'snap.com' },
  pinterest:  { name: 'Pinterest',        slug: 'pinterest',   domain: 'pinterest.com' },
  reddit:     { name: 'Reddit',           slug: 'reddit',      domain: 'reddit.com' },
  discord:    { name: 'Discord',          slug: 'discord',     domain: 'discord.com' },
  spotify:    { name: 'Spotify',          slug: 'spotify',     domain: 'spotify.com' },
  twitch:     { name: 'Twitch',           slug: 'twitch',      domain: 'twitch.tv' },
  linkedin:   { name: 'LinkedIn',         slug: null,          domain: 'linkedin.com',      letter: 'L',  color: '#0A66C2' },
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
  nintendo:   { name: 'Nintendo',         slug: null,          domain: 'nintendo.com',      letter: 'N',  color: '#E60012' },
  riotgames:  { name: 'Riot Games',       slug: 'riotgames',   domain: 'riotgames.com' },

  // ── Retail / CPG ───────────────────────────────────────────
  walmart:    { name: 'Walmart',          slug: null,          domain: 'walmart.com',       letter: 'W',  color: '#0071CE' },
  target:     { name: 'Target',           slug: 'target',      domain: 'target.com' },
  nike:       { name: 'Nike',             slug: 'nike',        domain: 'nike.com' },
  starbucks:  { name: 'Starbucks',        slug: 'starbucks',   domain: 'starbucks.com' },
  mcdonalds:  { name: "McDonald's",       slug: 'mcdonalds',   domain: 'mcdonalds.com' },
  cocacola:   { name: 'Coca-Cola',        slug: 'cocacola',    domain: 'coca-cola.com' },
  disney:     { name: 'Disney',           slug: null,          domain: 'thewaltdisneycompany.com', letter: 'D', color: '#113CCF' },

  // ── Telecom / Aerospace / Auto / Industrial ────────────────
  att:        { name: 'AT&T',             slug: null,          domain: 'att.com',           letter: 'A',  color: '#00A8E0' },
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
