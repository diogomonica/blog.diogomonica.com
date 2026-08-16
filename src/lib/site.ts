export const SITE = 'https://blog.diogomonica.com';
export const APEX = 'https://diogomonica.com';
export const NAME = 'Diogo Monica';
export const DISPLAY = 'Diogo Mónica';
export const ROLES = [
  'General Partner, Haun Ventures',
  'Co-founder and Executive Chairman, Anchorage Digital',
  'Chairman, NEAR Foundation',
  'Director, Erebor',
];
export const BIO = 'General Partner at Haun Ventures. Co-founder and Executive Chairman of Anchorage Digital. Chairman of the NEAR Foundation. Director at Erebor.';
export const SAME_AS = [
  'https://x.com/diogomonica',
  'https://www.linkedin.com/in/diogomonica',
  'https://en.wikipedia.org/wiki/Diogo_Mónica',
  'https://www.wikidata.org/wiki/Q111948997',
  'https://www.haun.co/team/diogo-monica',
];
export const PERSON_ID = `${APEX}/#person`;
export const PERSON = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: DISPLAY,
  alternateName: NAME,
  url: APEX,
  description: BIO,
  jobTitle: ROLES,
  sameAs: [...SAME_AS, SITE],
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'Google Knowledge Graph ID',
    value: '/g/11q96pmchp',
  },
  knowsAbout: [
    'security engineering',
    'digital-asset custody',
    'stablecoins',
    'cryptographic infrastructure',
    'fintech regulation',
    'venture capital',
  ],
  subjectOf: `${SITE}/media-timeline/`,
};
