# Gizindir Panel

Gizindir uygulaması için yönetim paneli. Bu panel, kullanıcı yönetimi, eşleşme takibi, mesajlaşma ve kullanıcı etkileşimlerini yönetmek için geliştirilmiş modern bir web uygulamasıdır.

## 🚀 Özellikler

- 🔐 Güvenli oturum yönetimi
- 👥 Kullanıcı yönetimi ve profil düzenleme
- 💌 Mesajlaşma sistemi
- ❤️ Eşleşme yönetimi
- 📊 Kullanıcı etkileşimleri takibi
- 🎨 Modern ve kullanıcı dostu arayüz
- 📱 Responsive tasarım

## 🛠️ Teknolojiler

- [Next.js 14](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Veritabanı ORM
- [Tailwind CSS](https://tailwindcss.com/) - Stil framework'ü
- [NextAuth.js](https://next-auth.js.org/) - Kimlik doğrulama
- [TypeScript](https://www.typescriptlang.org/) - Tip güvenliği
- [PostgreSQL](https://www.postgresql.org/) - Veritabanı

## 📋 Ön Gereksinimler

- Node.js 18.0.0 veya üzeri
- PostgreSQL veritabanı
- npm veya yarn paket yöneticisi

## 🚀 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/your-username/gizindir-panel.git
cd gizindir-panel
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. Çevre değişkenlerini ayarlayın:
`.env` dosyasını oluşturun ve aşağıdaki değişkenleri ekleyin:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/gizindir"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Veritabanı şemasını oluşturun:
```bash
npx prisma migrate dev
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
yarn dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışmaya başlayacaktır.

## 📁 Proje Yapısı

```
gizindir-panel/
├── app/                    # Next.js app router
│   ├── api/               # API endpoint'leri
│   └── (routes)/          # Sayfa rotaları
├── components/            # React bileşenleri
├── lib/                   # Yardımcı fonksiyonlar
├── prisma/               # Veritabanı şeması
└── public/               # Statik dosyalar
```

## 🔧 API Endpoint'leri

- `/api/users` - Kullanıcı yönetimi
- `/api/matches` - Eşleşme yönetimi
- `/api/messages` - Mesajlaşma sistemi
- `/api/interactions` - Kullanıcı etkileşimleri
- `/api/sessions` - Oturum yönetimi

## 🤝 Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

Proje Sahibi - [@your-username](https://github.com/your-username)

Proje Linki: [https://github.com/your-username/gizindir-panel](https://github.com/your-username/gizindir-panel) 
