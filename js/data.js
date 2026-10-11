const dailyAyat = [
  {
    surah: 'Ash-Sharh',
    number: 94,
    verse: 5,
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: '“For indeed, with hardship comes ease.”',
    translationSource: 'The Quran, 94:5',
    reflection:
      'This verse reminds us that Allah does not leave difficulty without relief. Every hardship is followed by ease when we trust Him and remain patient.',
    audioUrl: ''
  },
  {
    surah: 'Ar-Ra\'d',
    number: 13,
    verse: 28,
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: '“Surely in the remembrance of Allah do hearts find comfort.”',
    translationSource: 'The Quran, 13:28',
    reflection:
      'When our hearts feel heavy, remembrance brings clarity, calm, and hope. A few sincere moments of dhikr can restore peace.',
    audioUrl: ''
  },
  {
    surah: 'Al-Baqarah',
    number: 2,
    verse: 286,
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    translation: '“Allah does not burden a soul beyond that it can bear.”',
    translationSource: 'The Quran, 2:286',
    reflection:
      'This verse reassures us that our struggles are measured with mercy. Allah knows our capacity and never places more upon us than we can carry.',
    audioUrl: ''
  },
  {
    surah: 'Al-Mulk',
    number: 67,
    verse: 2,
    arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا',
    translation: '“He who created death and life to test you as to which of you is best in deed.”',
    translationSource: 'The Quran, 67:2',
    reflection:
      'Our lives are a test of sincerity, action, and trust. Every day is an opportunity to draw nearer to Allah through good intentions and righteous deeds.',
    audioUrl: ''
  }
];

const starterSurahs = [
  {
    number: 1,
    name: 'Al-Fatihah',
    english: 'The Opening',
    arabic: 'الفاتحة',
    verses: 7,
    references: 'Opening supplication and guidance',
    text: [
      { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', english: 'In the name of Allah, the Most Compassionate, the Most Merciful.', reference: '1:1' },
      { arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', english: 'All praise is for Allah, Lord of the worlds.', reference: '1:2' },
      { arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', english: 'The Most Compassionate, the Most Merciful.', reference: '1:3' },
      { arabic: 'مَالِكِ يَوْمِ الدِّينِ', english: 'Master of the Day of Judgment.', reference: '1:4' },
      { arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', english: 'You alone we worship, and You alone we ask for help.', reference: '1:5' },
      { arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', english: 'Guide us along the straight path.', reference: '1:6' },
      { arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ', english: 'The path of those You have blessed.', reference: '1:7' }
    ]
  },
  {
    number: 94,
    name: 'Ash-Sharh',
    english: 'The Consolation',
    arabic: 'الشرح',
    verses: 8,
    references: 'Comfort and ease in hardship',
    text: [
      { arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ', english: 'Did We not expand your breast for you?', reference: '94:1' },
      { arabic: 'وَوَضَعْنَا عَنْكَ وِزْرَكَ', english: 'And removed from you your burden?', reference: '94:2' },
      { arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', english: 'For indeed, with hardship comes ease.', reference: '94:5' },
      { arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', english: 'Indeed, with hardship comes ease.', reference: '94:6' }
    ]
  },
  {
    number: 13,
    name: 'Ar-Ra\'d',
    english: 'The Thunder',
    arabic: 'الرعد',
    verses: 43,
    references: 'Heart comfort in Allah\'s remembrance',
    text: [
      { arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', english: 'Surely in the remembrance of Allah do hearts find comfort.', reference: '13:28' },
      { arabic: 'إِنَّ اللَّهَ يَفْعَلُ مَا يَشَاءُ', english: 'Indeed, Allah does what He wills.', reference: '13:27' }
    ]
  },
  {
    number: 2,
    name: 'Al-Baqarah',
    english: 'The Cow',
    arabic: 'البقرة',
    verses: 286,
    references: 'Mercy and balance in life',
    text: [
      { arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', english: 'Allah does not burden a soul beyond that it can bear.', reference: '2:286' },
      { arabic: 'وَاتَّقُوا اللَّهَ لَعَلَّكُمْ تُفْلِحُونَ', english: 'And fear Allah so that you may be successful.', reference: '2:278' }
    ]
  },
  {
    number: 36,
    name: 'Ya-Sin',
    english: 'Ya-Sin',
    arabic: 'يس',
    verses: 83,
    references: 'Guidance and mercy',
    text: [
      { arabic: 'إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَنْ يَقُولَ لَهُ كُنْ فَيَكُونُ', english: 'When He wills a thing, He only says: “Be,” and it is.', reference: '36:82' },
      { arabic: 'قَدْ أَفْلَحَ الْمُؤْمِنُونَ', english: 'Successful indeed are the believers.', reference: '23:1' }
    ]
  }
];

const reminders = [
  {
    category: 'Sabr',
    title: 'Patience is part of the path.',
    reflection: 'When trials arrive, meet them with calm remembrance and trust that Allah sees your effort.',
    reference: 'Quran: Surah Al-Baqarah 2:153 — “Seek help through patience and prayer.”'
  },
  {
    category: 'Shukr',
    title: 'Gratitude opens the heart.',
    reflection: 'Notice the small mercies of Allah each day; gratitude softens the heart and deepens contentment.',
    reference: 'Quran: Surah Ibrahim 14:7 — “If you are grateful, I will surely increase you.”'
  },
  {
    category: 'Tawakkul',
    title: 'Trust Allah, but keep moving.',
    reflection: 'Tawakkul is not passivity. It is sincere reliance on Allah while we act with diligence and intention.',
    reference: 'Quran: Surah Al-Talaq 65:3 — “And whoever relies upon Allah, He is sufficient for him.”'
  },
  {
    category: 'Salah',
    title: 'Prayer anchors the soul.',
    reflection: 'A brief return to prayer can reset the heart and bring a sense of stillness, intention, and purpose.',
    reference: 'Quran: Surah Al-Ma\'un 107:4 — “But woe to the worshippers.”'
  },
  {
    category: 'Akhlaq',
    title: 'Let your character reflect your faith.',
    reflection: 'Kindness, honesty, and gentleness are not extra acts of worship; they are part of the beauty of iman.',
    reference: 'Quran: Surah Al-Anam 6:152 — “Do not wrong yourselves.”'
  },
  {
    category: 'Quran',
    title: 'Return to the Quran often.',
    reflection: 'Even a few verses read with sincerity can bring light to the heart and clarity to the mind.',
    reference: 'Quran: Surah Al-Muzzammil 73:4 — “And recite the Quran with measured recitation.”'
  },
  {
    category: 'Kindness',
    title: 'Speak gently, live gently.',
    reflection: 'Gentle words protect relationships and create a peaceful atmosphere for those around you.',
    reference: 'Quran: Surah Al-Isra 17:53 — “Speak to people with kindness.”'
  },
  {
    category: 'Forgiveness',
    title: 'Let go without bitterness.',
    reflection: 'Forgiveness is a form of inner peace. It does not deny hurt, but it protects the heart from carrying it forever.',
    reference: 'Quran: Surah Ash-Shura 42:43 — “And whoever pardons and makes peace, then his reward is with Allah.”'
  }
];

const duas = [
  {
    title: 'Dua for knowledge',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidni ilma.',
    meaning: '“My Lord, increase me in knowledge.”',
    reference: 'Quran: Surah Taha 20:114',
    type: 'Quran'
  },
  {
    title: 'Dua for guidance',
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا',
    transliteration: 'Rabbanā lā tuzigh qulūbanā.',
    meaning: '“Our Lord, do not let our hearts deviate.”',
    reference: 'Quran: Surah Al-Imran 3:8',
    type: 'Quran'
  },
  {
    title: 'Dua for forgiveness',
    arabic: 'رَبَّنَا اغْفِرْ لَنَا',
    transliteration: 'Rabbana ighfir lana.',
    meaning: '“Our Lord, forgive us.”',
    reference: 'Quran: Surah Al-Baqarah 2:286',
    type: 'Quran'
  },
  {
    title: 'Dua for parents',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbi irhamhuma kama rabbayani saghira.',
    meaning: '“My Lord, have mercy upon them as they raised me when I was small.”',
    reference: 'Quran: Surah Al-Isra 17:24',
    type: 'Quran'
  },
  {
    title: 'Dua for peace and steadfastness',
    arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا',
    transliteration: 'Rabbana afrig alayna sabran.',
    meaning: '“Our Lord, pour upon us patience.”',
    reference: 'Quran: Surah Al-Baqarah 2:250',
    type: 'Quran'
  },
  {
    title: 'Dua for ease',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي',
    transliteration: 'Rabbi israh li sadri.',
    meaning: '“My Lord, expand for me my chest.”',
    reference: 'Quran: Surah Ta-Ha 20:25',
    type: 'Quran'
  }
];

const hafizaSteps = [
  'Make a sincere intention.',
  'Revise previously memorized ayat.',
  'Listen to the correct recitation.',
  'Memorize a manageable passage.',
  'Repeat and revise.',
  'Recite to a qualified teacher when possible.',
  'End with dua and gratitude.'
];

const nasheedTracks = [
  {
    title: 'Light of the Heart',
    artist: 'Nasheed Collection',
    cover: 'L',
    color: 'emerald',
    image: 'assets/download (1).jpg'
  },
  {
    title: 'Guidance in Silence',
    artist: 'Reflective Recitation',
    cover: 'G',
    color: 'gold',
    image: 'assets/download (2).jpg'
  },
  {
    title: 'O Allah, Keep Us Steadfast',
    artist: 'Peaceful Melodies',
    cover: 'P',
    color: 'forest',
    image: 'assets/download (3).jpg'
  }
];

const configuredAudioTracks = [
  { title: 'Surah Al-Mulk', reciter: 'Add a valid source URL to enable playback', source: '', duration: 0 },
  { title: 'Surah Al-Fatihah', reciter: 'Add a valid source URL to enable playback', source: '', duration: 0 },
  { title: 'Surah Maryam', reciter: 'Add a valid source URL to enable playback', source: '', duration: 0 }
];
