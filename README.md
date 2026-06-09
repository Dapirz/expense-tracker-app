# 💸 Money Expense Tracker

A modern web-based application designed to help users track their income, expenses, and manage financial accounts with ease. This application is built as a fullstack JavaScript application featuring a React-based frontend and an Express-based backend with a local JSON database.

---

## 🚀 Fitur Utama

- **📊 Dashboard Utama**: Menampilkan ringkasan total saldo, total pemasukan, total pengeluaran, serta grafik analisis keuangan secara real-time.
- **📝 Riwayat Transaksi**: Catatan pemasukan dan pengeluaran yang detail, lengkap dengan kategori, akun sumber dana, tanggal transaksi, catatan/deskripsi, dan nominal.
- **🏷️ Kelola Kategori & Ikon Emoji**: Pengguna dapat menambahkan kategori baru dengan dukungan ikon emoji (dibatasi 1 emoji) untuk klasifikasi yang lebih personal.
- **🏦 Manajemen Akun**: Kelola beberapa akun/rekening bank sekaligus dengan saldo awal dan tracking dinamis.
- **👥 Profil Tim**: Halaman khusus yang menampilkan informasi profil anggota tim pengembang aplikasi.
- **🎨 UI Modern & Responsif**: Antarmuka bersih, elegan, dan ramah pengguna dengan nuansa warna modern dan tata letak yang adaptif (responsive).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS (kustomisasi desain premium, glassmorphism, dan transisi halus)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Middleware**: CORS & Express JSON Parser
- **Database**: Local JSON File Database (`backend/data/database.json`)

---

## 📁 Struktur Proyek

```text
expense-tracker-app/
├── backend/                  # REST API Backend (Node.js & Express)
│   ├── controllers/          # Logika pemrosesan request & response API
│   ├── data/                 # Penyimpanan database JSON lokal
│   │   └── database.json     # File database utama (akun, kategori, transaksi)
│   ├── routes/               # Definisi rute API (akun, kategori, transaksi)
│   ├── .gitignore            # Konfigurasi ignore file backend
│   ├── index.js              # Entrypoint server backend
│   └── package.json          # Package dependensi backend
│
├── frontend/                 # Client-side UI (React + Vite)
│   ├── public/               # Asset statis publik
│   ├── src/                  # Source code React
│   │   ├── components/       # Komponen UI reusable (Navbar, dll)
│   │   ├── views/            # Halaman utama (Dashboard, Transaksi, Akun, Kategori, Profil)
│   │   ├── App.css           # Styling global & layout
│   │   ├── App.jsx           # Rute dan layout utama aplikasi
│   │   ├── index.css         # Token desain CSS
│   │   └── main.jsx          # Entrypoint frontend React
│   ├── .gitignore            # Konfigurasi ignore file frontend
│   ├── package.json          # Package dependensi frontend
│   └── vite.config.js        # Konfigurasi Vite
│
└── README.md                 # Dokumentasi proyek (file ini)
```

---

## ⚡ Cara Menjalankan Aplikasi

### Persyaratan Awal
Pastikan Anda sudah menginstal **Node.js** (rekomendasi versi LTS terbaru) di komputer Anda.

### Langkah 1: Clone Repository
```bash
git clone <url-repository-anda>
cd expense-tracker-app
```

### Langkah 2: Jalankan Backend Server
1. Buka terminal baru dan masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan server:
   ```bash
   npm run dev
   ```
   Server backend secara default berjalan di **`http://localhost:5000`**.

### Langkah 3: Jalankan Frontend App
1. Buka terminal baru lainnya dan masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan aplikasi web:
   ```bash
   npm run dev
   ```
   Aplikasi frontend akan berjalan dan dapat diakses melalui browser Anda di **`http://localhost:5173`** (atau port lain yang ditunjukkan di terminal).

---

## 🔗 Endpoint API Utama

Backend menyediakan endpoint REST API berikut:

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| **GET** | `/api/transaksi` | Mengambil seluruh riwayat transaksi |
| **POST** | `/api/transaksi` | Membuat transaksi baru (otomatis menyesuaikan saldo akun terkait) |
| **GET** | `/api/akun` | Mengambil daftar akun keuangan beserta saldo |
| **GET** | `/api/kategori` | Mengambil semua kategori pengeluaran/pemasukan |
| **POST** | `/api/kategori` | Menambahkan kategori baru beserta ikon emoji |

---

## 🏛️ Penerapan 12-Factor App Methodology

Aplikasi ini dirancang dan dikembangkan dengan mengadopsi prinsip-prinsip **Twelve-Factor App Methodology** untuk memastikan skalabilitas, kebersihan kode, dan kemudahan deployment:

### 1. Codebase (Satu basis kode yang dilacak dalam revisi kontrol, banyak implementasi)
- **Implementasi**: Seluruh kode aplikasi (frontend dan backend) dilacak dalam **satu repository Git yang sama** (monorepo). 
- Dari satu codebase ini, kode dapat di-deploy ke berbagai tahapan/environment (Development, Staging, Production) tanpa mengubah source code.

### 2. Dependencies (Deklarasikan dan isolasi dependensi secara eksplisit)
- **Implementasi**: Aplikasi ini secara eksplisit mendeklarasikan semua pustaka/dependensi eksternal di dalam manifest file:
  - `backend/package.json` untuk sisi Express backend (menggunakan `express`, `cors`, dan `dotenv`).
  - `frontend/package.json` untuk sisi React frontend (menggunakan `react`, `axios`, dll).
- Dependensi diisolasi secara penuh dalam folder lokal `node_modules` yang diabaikan oleh Git via `.gitignore` sehingga tidak bergantung pada package global yang terinstal di OS sistem.

### 3. Configuration / Config (Simpan konfigurasi dalam environment/lingkungan)
- **Implementasi**: Semua konfigurasi yang cenderung berubah antar environment disimpan dalam file `.env` (atau sistem environment variables) dan diakses secara dinamis saat runtime:
  - **Backend**: Port server (`PORT`) dan path penyimpanan data (`DATABASE_PATH`) dibaca secara dinamis menggunakan modul `dotenv` melalui `process.env`.
  - **Frontend**: Base URL API (`VITE_API_URL`) diatur dalam file `.env` dan diakses menggunakan fitur environment variable dari Vite (`import.meta.env`).
- File `.env` bersifat privat dan diabaikan dari Git via `.gitignore`. Sebagai gantinya, disediakan file template `.env.example` sebagai dokumentasi konfigurasi bagi developer lain.
