export const SITE = 'https://blog.diogomonica.com';
export const APEX = 'https://diogomonica.com';
export const ABOUT = `${APEX}/about`;
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
/** The canonical Person lives on the hub; the blog references it by @id. */
export const PERSON = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: DISPLAY,
  url: APEX,
};
export const WEBSITE_ID = `${SITE}/#website`;
export const WEBSITE = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: DISPLAY,
  url: `${SITE}/`,
  inLanguage: 'en',
  author: { '@id': PERSON_ID },
  publisher: { '@id': PERSON_ID },
};
export const HOME_TITLE = 'Essays on security, AI and digital assets · Diogo Mónica';
export const HOME_DESCRIPTION = 'Essays on security engineering, AI, crypto custody and investing, from a security engineer who led security at Docker and co-founded Anchorage Digital.';
export const SECURITY_BIO = 'Security engineer. Led security at Docker and platform security at Square, served on the Open Container Initiative technical oversight board, and was involved in developing the Notary project, accepted by the Cloud Native Computing Foundation.';
export const DEFAULT_CARD = { src: '/og/default.png', width: 1200, height: 630, alt: 'Diogo Mónica — essays on security, AI and digital assets' };
