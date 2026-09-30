# Need for Live

Web-based 2D needle path planning for liver tumors using A\* on CT segmentation masks (3D-IRCADb-01), avoiding bone, lung, and blood vessels.

> **Penting: bukan alat klinis.** Proyek ini adalah alat eksplorasi dan pembelajaran. Perhitungan hanya 2D dan nilai cost belum divalidasi secara medis, sehingga tidak boleh dipakai untuk pengambilan keputusan klinis.

**Demo:** https://starinduu.github.io/Need-for-Live-safe-needle-for-trajectories-planning/

## Fitur

- Pencarian jalur dengan A\*
- Klasifikasi piksel otomatis ke warna terdekat
- Cost dan Forbid tiap kelas yang dapat diubah
- Nilai w yang bisa diubah
- Visualisasi jalur (merah), area dijelajahi (kuning), titik masuk (cyan), serta target (magenta)
- Panel hasil
- Berjalan di browser tanpa instalasi, server, dan tanpa koneksi internet

## Cara Menjalankan

Kebutuhan: browser modern (Chrome, Edge, Firefox, atau Safari versi terbaru).

1. **Unduh Proyek**
   - Dengan Git:

     ```bash
     git clone https://github.com/starinduu/Need-for-Live-safe-needle-for-trajectories-planning.git
     cd Need-for-Live-safe-needle-for-trajectories-planning
     ```

   - Unduh ZIP: klik tombol **Code**, pilih **Download ZIP**, lalu ekstrak.
2. **Buka Aplikasi**
   - Klik dua kali `index.html`, atau seret file ke jendela browser.
   - Pastikan `index.html`, `need4live.css`, dan `need4live.js` berada di folder yang sama.
3. **Gunakan Aplikasi**
   - Unggah label mask (atau pakai **Phantom demo** yang dimuat otomatis)
   - Klik titik masuk di kulit (ditandai **cyan**)
   - Klik target pada tumor (ditandai **magenta**)
   - Klik cari jalur
   - Baca hasil di panel hasil
   - Bandingkan hasil dengan ubah cost, forbid ataupun nilai w

## Struktur Proyek

```
├── index.html      # struktur halaman
├── need4live.css   # tampilan
├── need4live.js    # logika dan algoritma A*
├── LICENSE
└── README.md
```

## Cara Kerja Singkat

Citra dianggap sebagai graf: tiap piksel adalah node yang terhubung ke tetangganya (8 atau 4 arah). Algoritma A\* memilih node berikutnya berdasarkan:

```
f(n) = g(n) + w × h(n)
```

- `g(n)`: biaya nyata dari titik masuk ke node n
- `h(n)`: perkiraan sisa biaya = `cost_min × jarak Euclidean ke target`
- `w`: bobot heuristik (0 = Dijkstra, 1 = A\* standar, lebih dari 1 = lebih cepat tetapi optimalitas tidak dijamin)

Kelas berstatus **forbid** tidak boleh dilewati, sedangkan kelas dengan cost tinggi (misalnya pembuluh darah) dihindari kecuali jalan memutar lebih mahal.

## Keterbatasan

- Hanya 2D, sedangkan jarum nyata bergerak di ruang 3D.
- Resolusi diturunkan menjadi maksimal 192 piksel, sehingga pembuluh halus dapat hilang.
- Jalur A\* berkelok, sedangkan jarum nyata umumnya lurus.
- Nilai cost belum divalidasi secara klinis.

## Sitasi

Data uji berasal dari dataset 3D-IRCADb-01. Data CT dan mask mentah tidak disertakan di repository ini; unduh dari sumber resmi dan patuhi lisensi dataset.

> Soler, L., A. Hostettler, V. Agnus, A. Charnoz, J. Fasquel, J. Moreau, A. Osswald, M. Bouhadjar, and J. Marescaux, "3D image reconstruction for comparison of algorithm database: A patient specific anatomical and medical image database." IRCAD, Strasbourg, France, Tech. Rep (2010).

Referensi algoritma:

> Hart, P. E., Nilsson, N. J., and Raphael, B. (1968). A Formal Basis for the Heuristic Determination of Minimum Cost Paths. *IEEE Transactions on Systems Science and Cybernetics*, 4(2), 100-107.

## Anggota

- Lailatussyifa Rindu Pramestiani (24/538961/TK/59770)
- Nisrina Puspita Nirwana (24/535972/TK/59485)
- Zaitunisa Hartiningciyas (24/544067/TK/60473)
