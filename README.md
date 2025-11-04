# BMI Health Tracker

BMI Health Tracker adalah aplikasi web ringan untuk menghitung Body Mass Index (BMI) sekaligus memberikan wawasan kesehatan yang mudah dipahami. Versi terbaru ini memanfaatkan Tailwind CSS dan modul JavaScript terpisah agar kode lebih rapi, mudah dirawat, serta siap dikembangkan lebih lanjut.

## Fitur Utama

- ⚡️ **Perhitungan BMI instan** dengan pembaruan hasil real time dan indikator visual pada skala warna.
- 🌗 **Mode terang/gelap** yang disimpan pada perangkat pengguna sehingga tampilan tetap konsisten.
- 💡 **Insight personal** seperti kisaran berat ideal, estimasi kebutuhan cairan, rekomendasi makronutrien, dan tips cepat.
- 🧠 **Tantangan kesehatan mingguan** yang dapat diacak untuk menjaga motivasi.
- 🗂️ **Riwayat perhitungan** hingga 10 entri terakhir lengkap dengan tombol untuk mengisi ulang formulir secara instan.

## Struktur Proyek

```
├── index.html          # Halaman utama dan struktur antarmuka
├── assets/
│   └── js/
│       ├── data.js     # Data statis dan konfigurasi insight
│       ├── main.js     # Logika utama aplikasi dan manipulasi DOM
│       └── theme.js    # Pengelolaan mode terang/gelap dengan localStorage
└── README.md
```

## Cara Menjalankan

1. Buka berkas `index.html` langsung di peramban favorit Anda.
2. Isi formulir data pribadi, lalu tekan tombol **Hitung & Dapatkan Rekomendasi**.
3. Gunakan tombol mode terang/gelap untuk menyesuaikan tema, tekan ikon putar ulang pada kartu tantangan untuk mendapatkan inspirasi baru, dan pantau progres melalui panel riwayat.

Semua data disimpan secara lokal di peramban (localStorage) sehingga aman dan hanya dapat diakses oleh Anda.
