Davinci Admin Panel (Frontend)

React + Vite + TypeScript ile geliştirilmiş basit bir Admin Paneli.
Kullanıcılar (Users) ve gönderiler (Posts) üzerinde CRUD arayüzü sağlar. Veriler demo amaçlı JSONPlaceholder API’sinden okunur.

🚀 Hızlı Başlangıç
Gereksinimler

Node.js: 18.x veya 20.x (LTS önerilir)

npm (veya tercih edersen pnpm / yarn)

Kurulum
# depoları indir
git clone <sizin-repo-urliniz>
cd <proje-klasörü>

# paketleri kur
npm install
# pnpm kullanıyorsanız: pnpm install
# yarn kullanıyorsanız: yarn

Geliştirme Sunucusu
npm run dev


Varsayılan adres: http://localhost:5173/

Üretim Derlemesi
# production build
npm run build

# yerelde üretim derlemesini test et
npm run preview

Kod Kalitesi
# lint kontrolü (ESLint)
npm run lint


Projede CSS Modules, clean code prensipleri ve temel pagination yapısı kullanılır.

📂 Proje Yapısı (özet)
src/
  api/
    client.ts        # axios instance (baseURL + headers)
    posts.ts         # Posts API çağrıları
    users.ts         # Users API çağrıları
  components/
    Pagination.tsx   # sayfalama bileşeni
    Footer.tsx       # (opsiyonel) footer
  pages/
    Home.tsx
    Home.module.css
    posts/
      PostsPage.tsx
      PostsPage.module.css
    users/
      UsersPage.tsx
      UsersPage.module.css
  types.ts           # tip tanımları (Post, User vs.)
  App.tsx            # layout / <Outlet/>
  main.tsx           # router kurulumu
  index.css          # global stiller

🔌 API

Kaynak: JSONPlaceholder

Base URL: https://jsonplaceholder.typicode.com

Kullanılan endpoint’ler:

GET /users

GET /posts

POST /posts, PUT /posts/:id, DELETE /posts/:id
(Demo API olduğu için veritabanı yok; create/update yanıtları mock niteliğindedir.)

💡 İpuçları

Users ve Posts sayfalarında sayfalama (pagination) mevcuttur.

Tüm sayfalar İngilizce UI ve CSS Modules ile tasarlandı.

Geliştirme sırasında StrictMode açık olabilir; bu, yalnızca development’ta ek kontroller içindir.

🧪 Sık Karşılaşılan Sorunlar

Port dolu: npm run dev başka bir port önerirse onu kullanın veya --port verin.

Node sürümü: Hata alırsanız Node’u LTS sürüme güncelleyin.

CORS / API: JSONPlaceholder genelde sorun çıkarmaz; ağ hatalarında devtools’u kontrol edin.

📝 Komutlar (özet)
npm install       # bağımlılıkları kur
npm run dev       # geliştirme sunucusu
npm run build     # production build
npm run preview   # build'i yerelde test et
npm run lint      # eslint kontrolü
