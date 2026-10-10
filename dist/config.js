const detectedBase = (typeof window !== 'undefined' && window.location.pathname.startsWith('/Yara-Khamis-Portfolio-Website/'))
  ? '/Yara-Khamis-Portfolio-Website/'
  : '/';

export const config = {
  basePath: (typeof window !== 'undefined' && window.__BASE_PATH__) || detectedBase,
  name: 'Yara Khamis',
  studio: 'YTS Production',
  whatsapp: '201229610096',
  whatsappDisplay: '+20 12 29610096',
  behance: 'https://www.behance.net/Yara-YTS-Khamis',
  email: '',
};
