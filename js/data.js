// MOCKUP SNAPSHOT — every value below is copied from an existing, verified source. Nothing is invented.
// Sources: government register export (docs/data/publications.json, 22 Nov 2026), docs/data/world-state.json,
// press-release manifest, institutions' own page titles/descriptions, UBC Standard v2.0.0 (calendar-engine.js).
window.BW = {
  asOf: { label: '22 November 2026', note: 'Government register export, World Day 42,820' },
  gov: 'https://gov.binodworld.in/',
  motto: 'One World • Many Nations • Shared Prosperity',
  president: { handle: 'ROLEX5834', nation: 'Bavaria', term: 'Term 1 of 3', sinceDay: 42820 },
  counts: { nations: 6, laws: 8, whitePapers: 7, pressReleases: 6, amendments: 3, constitution: 1 },
  institutions: [
    { id: 'gov', name: 'Binod World Government', short: 'Government', status: 'live', accent: '#c9a84c', seal: 'seal-gov.webp',
      line: 'The official government portal of the Binod World Government.', url: 'https://gov.binodworld.in/', host: 'gov.binodworld.in' },
    { id: 'biasr', name: 'BIASR', full: 'Binodian Institute for Astronomical and Space Research', status: 'live', accent: '#5b83ff', seal: 'seal-biasr.webp',
      line: 'Official scientific research authority — astronomy, space research and temporal physics. Keeper of the Unified Binod Calendar.', url: 'https://gov.binodworld.in/biasr/', host: 'gov.binodworld.in/biasr' },
    { id: 'riid', name: 'RIID', full: 'Research, Intelligence, Investigation & Defense', status: 'live', accent: '#1fd6c9', seal: 'seal-riid.webp',
      line: 'Official intelligence, scientific security and federal investigation authority of the Binod World Government.', url: 'https://gov.binodworld.in/riid/', host: 'gov.binodworld.in/riid' },
    { id: 'vanta', name: 'VANTA', full: 'Search Binod World', status: 'live', accent: '#9b7cff', seal: null,
      line: 'The public search engine for Binod World: government publications, BIASR research, declassified RIID records and registered organisations.', url: 'https://gov.binodworld.in/vanta/', host: 'gov.binodworld.in/vanta' },
    { id: 'binova', name: 'BINOVA', full: 'Binod Institute for Novel Observation, Vision & Advancement', status: 'opening', accent: '#d9b86a', seal: 'seal-binova.webp',
      line: 'An institution devoted to discovery, rigorous learning, research and the advancement of knowledge.', url: null, host: null },
    { id: 'bwse', name: 'BWSE', full: 'Binod World Stock Exchange', status: 'system', accent: '#7aa7c7', seal: null,
      line: 'The Binod World Stock Exchange — a system that exists inside the world itself.', url: null, host: null }
  ],
  nations: [
    { id: 'bavaria', name: 'Bavaria', capital: 'New Bavaria', role: 'Finance & Central Administration', type: 'Parliamentary Republic', est: 2014, badge: 'Founding Nation', leader: 'ROLEX5834' },
    { id: 'port-mafia', name: 'Port Mafia', capital: 'Port City', role: 'Maritime Trade & Shipping', type: 'City-State Council', est: 2014, badge: 'Member State', leader: 'Franky boy3746' },
    { id: 'kasukabey', name: 'Kasukabey', capital: 'Kasukabey City', role: 'Agriculture & Food Security', type: 'Democratic Republic', est: 2014, badge: 'Member State', leader: 'MrAdolfo6067' },
    { id: 'veromia', name: 'Veromia', capital: 'Veromia Central', role: 'Trade, Commerce & Border Markets', type: 'Trading Republic', est: 2015, badge: 'Member State', leader: 'Sussy baka9975' },
    { id: 'aquriass', name: 'Aquriass', capital: 'Aquriass Harbour', role: 'Water Resources & Naval Operations', type: 'Maritime Republic', est: 2016, badge: 'Member State', leader: 'Cubro2284' },
    { id: 'noctyria', name: 'Noctyria', capital: 'Noctyr Prime', role: 'Strategic Security & National Intelligence', type: 'Strategic Directorate', est: 2024, badge: 'Newest Nation', leader: 'pewberttyhitter' }
  ],
  developments: [
    { when: 'World Day 42,820', tag: 'Law', title: 'LAW-008 — Official Calendar and Records Act', by: 'Published by ROLEX5834', href: 'https://gov.binodworld.in/laws.html' },
    { when: 'World Day 42,820', tag: 'Election', title: 'Election #12 — ROLEX5834 Elected', by: 'Binod World Government', href: 'https://gov.binodworld.in/president.html' },
    { when: '14 Nov 2026', tag: 'Press release', title: 'PR-006 — Announcement on Research Progress, the RIDD Organisation, VANTA, and the Proposed BINOVA and ERPA', by: 'Presidential Press Release', href: 'https://gov.binodworld.in/press-releases.html' },
    { when: '9 Aug 2026', tag: 'Press release', title: 'PR-005 — Presidential Report on the Plague Period, the Isolation of Nations, Earth Journeys and the State of Binod World', by: 'Presidential Press Release', href: 'https://gov.binodworld.in/press-releases.html' },
    { when: '1 Jul 2026', tag: 'Press release', title: 'PR-004 — Unified Binod Calendar (UBC) Officially Implemented', by: 'Presidential Press Release', href: 'https://gov.binodworld.in/press-releases.html' }
  ],
  timeline: [
    { y: '2014', t: 'Foundation of the Binod World' }, { y: '2016', t: 'First National Administration' },
    { y: '2018', t: 'Constitution Drafted' }, { y: '2020', t: 'National Treasury' },
    { y: '2021', t: 'Founding Epoch of the Unified Binod Calendar — 23 April 2021, 20:00 IST', ubc: true },
    { y: '2022', t: 'Foreign Affairs' }, { y: '2024', t: 'Sixth Nation Admitted' },
    { y: '2026', t: 'Unified Binod Calendar officially implemented (PR-004, 1 July 2026)', ubc: true }
  ],
  records: [
    { n: 'Laws', c: '8 on record', u: 'https://gov.binodworld.in/laws.html' },
    { n: 'White Papers', c: '7 on record', u: 'https://gov.binodworld.in/white-papers.html' },
    { n: 'Constitution', c: 'with 3 amendments', u: 'https://gov.binodworld.in/constitution.html' },
    { n: 'Press Releases', c: '6 on record', u: 'https://gov.binodworld.in/press-releases.html' },
    { n: 'Notices', c: 'Public notices', u: 'https://gov.binodworld.in/notices.html' },
    { n: 'Archives', c: 'Government archive', u: 'https://gov.binodworld.in/archives.html' }
  ]
};
