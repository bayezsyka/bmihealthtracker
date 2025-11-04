export const BMI_CATEGORIES = [
  {
    label: 'Kurus',
    min: 0,
    max: 18.4,
    tone: 'text-sky-400',
    advice:
      'Fokus pada makanan kaya nutrisi dan kalori sehat seperti kacang-kacangan, alpukat, dan protein tanpa lemak.',
  },
  {
    label: 'Normal',
    min: 18.5,
    max: 22.9,
    tone: 'text-emerald-400',
    advice:
      'Pertahankan pola makan seimbang, tetap aktif, dan jaga kualitas tidur agar tubuh tetap bugar.',
  },
  {
    label: 'Berlebih',
    min: 23,
    max: 24.9,
    tone: 'text-amber-400',
    advice:
      'Kurangi makanan olahan, tingkatkan porsi sayur dan buah, serta tambahkan latihan kekuatan ringan.',
  },
  {
    label: 'Obesitas',
    min: 25,
    max: Infinity,
    tone: 'text-rose-400',
    advice:
      'Konsultasikan rencana penurunan berat badan, prioritaskan olahraga teratur, dan atur pola makan harian.',
  },
];

export const HYDRATION_MULTIPLIER = {
  sedentary: 30,
  light: 32,
  moderate: 35,
  intense: 40,
};

export const ACTIVITY_LABELS = {
  sedentary: 'Jarang bergerak',
  light: 'Aktif ringan',
  moderate: 'Aktif sedang',
  intense: 'Sangat aktif',
};

export const FOCUS_MACROS = {
  balance: '50% karbo • 25% protein • 25% lemak',
  'weight-loss': '40% karbo • 35% protein • 25% lemak',
  muscle: '35% karbo • 35% protein • 30% lemak',
  endurance: '55% karbo • 25% protein • 20% lemak',
};

export const FOCUS_LABELS = {
  balance: 'Seimbang',
  'weight-loss': 'Turun berat',
  muscle: 'Massa otot',
  endurance: 'Stamina',
};

export const QUICK_TIPS = [
  'Prioritaskan tidur berkualitas 7-8 jam per malam.',
  'Sisipkan 10 menit peregangan ringan setiap 2 jam duduk.',
  'Siapkan camilan sehat seperti yogurt, buah, atau kacang tanpa garam.',
  'Minum segelas air putih sebelum setiap makan untuk membantu kontrol porsi.',
  'Catat aktivitas fisik harian Anda untuk menjaga konsistensi.',
];

export const WEEKLY_CHALLENGES = [
  'Lakukan 3 sesi latihan kekuatan selama 30 menit minggu ini.',
  'Tambahkan 5 porsi sayuran berwarna dalam menu harian Anda.',
  'Jadwalkan 2 sesi yoga atau meditasi berdurasi 15 menit.',
  'Coba resep baru rendah gula dan tinggi protein sebanyak 2 kali.',
  'Kurangi minuman manis selama 5 hari berturut-turut.',
  'Tambahkan 1.500 langkah ekstra setiap hari selama seminggu.',
  'Luangkan 20 menit berjalan kaki setelah makan malam selama 4 hari.',
];
