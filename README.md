Davinci Admin Panel (Frontend)

React + Vite + TypeScript ile geliştirilmiş basit bir Admin Paneli.
Kullanıcılar (Users) ve gönderiler (Posts) üzerinde CRUD arayüzü sağlar. Veriler demo amaçlı JSONPlaceholder API’sinden okunur.

🚀 Hızlı Başlangıç
Gereksinimler

Node.js: 18.x veya 20.x (LTS önerilir)

npm (veya tercih edersen pnpm / yarn)

Kurulum
# depoları indir
git clone <repo-url>
cd <proje-klasörü>

# paketleri kur
npm install
# pnpm kullanıyorsanız: pnpm install
# yarn kullanıyorsanız: yarn

Geliştirme Sunucusu
npm run dev

Üretim Derlemesi
# production build
npm run build

Kod Kalitesi
# lint kontrolü (ESLint)
npm run lint


Kullanılan endpoint’ler:

GET /users

GET /posts

POST /posts, PUT /posts/:id, DELETE /posts/:id
(Demo API olduğu için veritabanı yok; create/update yanıtları mock niteliğindedir.)

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

