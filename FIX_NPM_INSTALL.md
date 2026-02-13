# 🔧 Fix: npm install Error (EBUSY)

## Problem
```
npm error code EBUSY
npm error syscall rename
npm error path D:\mentawaifix\mentawai-shores-main\node_modules\lovable-tagger\node_modules\@esbuild\win32-x64\esbuild.exe
npm error errno -4082
npm error EBUSY: resource busy or locked
```

## Penyebab
File `esbuild.exe` terkunci oleh:
- Windows Defender / Antivirus
- Process Node.js yang masih running
- File explorer yang membuka folder node_modules
- IDE/Editor yang mengindex node_modules

## Solusi (Pilih salah satu):

### ✅ Solusi 1: Restart Komputer (PALING MUDAH)
1. Tutup semua aplikasi
2. Restart komputer
3. Buka terminal baru
4. Jalankan:
```bash
cd D:\mentawaifix\mentawai-shores-main
npm install
```

### ✅ Solusi 2: Matikan Antivirus Sementara
1. **Disable Windows Defender Real-time Protection:**
   - Buka Windows Security
   - Virus & threat protection
   - Manage settings
   - Turn OFF "Real-time protection" (sementara)

2. **Jalankan install:**
```bash
cd D:\mentawaifix\mentawai-shores-main
npm install
```

3. **Nyalakan kembali Windows Defender**

### ✅ Solusi 3: Kill Semua Process Node
1. Buka Task Manager (Ctrl + Shift + Esc)
2. Cari dan End Task semua process:
   - Node.js
   - npm
   - vite
   - esbuild

3. Atau gunakan command:
```powershell
taskkill /F /IM node.exe
taskkill /F /IM esbuild.exe
```

4. Jalankan install:
```bash
npm install
```

### ✅ Solusi 4: Hapus Manual & Install Ulang
1. **Tutup semua aplikasi** (VS Code, browser, dll)

2. **Hapus folder node_modules secara manual:**
   - Buka File Explorer
   - Navigate ke `D:\mentawaifix\mentawai-shores-main`
   - Hapus folder `node_modules` (Shift + Delete)
   - Jika gagal, restart komputer dulu

3. **Hapus package-lock.json:**
```bash
del package-lock.json
```

4. **Install ulang:**
```bash
npm install
```

### ✅ Solusi 5: Gunakan Yarn (Alternatif)
Jika npm terus bermasalah, gunakan Yarn:

1. **Install Yarn:**
```bash
npm install -g yarn
```

2. **Hapus node_modules:**
```bash
rmdir /s /q node_modules
del package-lock.json
```

3. **Install dengan Yarn:**
```bash
yarn install
```

4. **Jalankan dev server:**
```bash
yarn dev
```

### ✅ Solusi 6: Exclude Folder dari Antivirus
1. Buka Windows Security
2. Virus & threat protection
3. Manage settings
4. Exclusions → Add or remove exclusions
5. Add folder: `D:\mentawaifix\mentawai-shores-main\node_modules`
6. Jalankan `npm install` lagi

### ✅ Solusi 7: Install di Safe Mode
1. Restart Windows ke Safe Mode
2. Buka terminal
3. Jalankan:
```bash
cd D:\mentawaifix\mentawai-shores-main
npm install
```

## Setelah Berhasil Install

Jalankan dev server:
```bash
npm run dev
```

Atau jika masih error, gunakan npx:
```bash
npx vite
```

## Verifikasi Installation

Check apakah vite terinstall:
```bash
npx vite --version
```

Seharusnya output: `vite/5.4.19` atau versi lainnya

## Troubleshooting Tambahan

### Jika masih error setelah install:
```bash
# Clear npm cache
npm cache clean --force

# Install ulang
npm install
```

### Jika vite tidak ditemukan:
```bash
# Install vite secara global
npm install -g vite

# Atau jalankan dengan npx
npx vite
```

### Jika port 8080 sudah digunakan:
```bash
# Jalankan di port lain
npx vite --port 3000
```

## Prevention (Pencegahan)

Untuk menghindari masalah ini di masa depan:

1. **Exclude folder dari antivirus:**
   - `node_modules`
   - `.vite`
   - `dist`

2. **Tutup aplikasi sebelum npm install:**
   - VS Code
   - Browser dev tools
   - File explorer di folder node_modules

3. **Gunakan Yarn sebagai alternatif npm**

4. **Update npm ke versi terbaru:**
```bash
npm install -g npm@latest
```

## Status Check

Setelah berhasil install, check:
```bash
# Check node version
node --version

# Check npm version
npm --version

# Check vite
npx vite --version

# List installed packages
npm list --depth=0
```

## Kontak Support

Jika semua solusi di atas tidak berhasil:
1. Screenshot error message
2. Check npm log: `C:\Users\WORKPLUS\AppData\Local\npm-cache\_logs\`
3. Hubungi tim development

---

**TL;DR:** Restart komputer → Disable antivirus sementara → `npm install` → Enable antivirus kembali
