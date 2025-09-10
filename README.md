Davinci Admin Panel (Frontend Developer Web Assignment)

React + Vite + TypeScript ile geliştirilmiş basit bir Admin Paneli.
Kullanıcılar (Users) ve gönderiler (Posts) üzerinde CRUD arayüzü sağlar. Veriler demo amaçlı JSONPlaceholder API’sinden okunur.

🚀 Hızlı Başlangıç

# depoları indir
git clone <repo-url>
cd <proje-klasörü>

# paketleri kur
npm install
pnpm kullanıyorsanız: pnpm install
yarn kullanıyorsanız: yarn

# geliştirme sunucusu
npm run dev

# production build
npm run build

# lint kontrolü (ESLint)
npm run lint


Kullanılan endpoint’ler:

GET /users

GET /posts

POST /posts, PUT /posts/:id, DELETE /posts/:id
(Demo API olduğu için veritabanı yok; create/update yanıtları mock niteliğindedir.)


📝 Komutlar
npm install       # bağımlılıkları kur
npm run dev       # geliştirme sunucusu
npm run build     # production build
npm run preview   # build'i yerelde test et
npm run lint      # eslint kontrolü

