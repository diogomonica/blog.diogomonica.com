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
export const IST = {
  '@type': 'CollegeOrUniversity',
  name: 'Instituto Superior Técnico',
  url: 'https://tecnico.ulisboa.pt/',
  parentOrganization: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Lisbon',
  },
};
export const DEGREES = [
  {
    years: '2004–2007',
    line: 'BSc, Telecommunications and Informatics Engineering, Instituto Superior Técnico, University of Lisbon.',
    credential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'BSc, Telecommunications and Informatics Engineering',
      credentialCategory: 'bachelor degree',
      recognizedBy: IST,
    },
  },
  {
    years: '2007–2009',
    line: 'MSc, Communication Networks Engineering, Instituto Superior Técnico, University of Lisbon.',
    credential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'MSc, Communication Networks Engineering',
      credentialCategory: 'master degree',
      recognizedBy: IST,
    },
  },
  {
    years: '2009–2015',
    line: 'PhD, Computer Science (network security), Instituto Superior Técnico, University of Lisbon.',
    credential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'PhD, Computer Science (network security)',
      credentialCategory: 'doctorate',
      recognizedBy: IST,
    },
  },
];
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
  alumniOf: IST,
  hasCredential: DEGREES.map((degree) => degree.credential),
  image: `${SITE}/media-kit/Diogo_Monica_Founder_Engineer.web.jpg`,
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
