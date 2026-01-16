# 🎨 Тату Мастер | Графический Дизайнер для Твоей Кожи

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

Современный лендинг для тату-мастера, полностью оптимизированный для SEO с использованием Next.js 15 и Server-Side Rendering.

## ✨ Особенности

- 🚀 **Server-Side Rendering (SSR)** - быстрая загрузка и индексация
- 🔍 **SEO оптимизация** - полные мета-теги, Open Graph, Schema.org
- 📱 **Адаптивный дизайн** - идеально работает на всех устройствах
- ⚡ **Высокая производительность** - оптимизация изображений и кода
- 🎨 **Уникальный дизайн** - hand-drawn стиль с Comic Sans MS
- 🌐 **PWA Ready** - Web App Manifest для установки на устройства

## 🛠️ Технологический стек

- **Framework:** Next.js 15 (App Router)
- **UI:** React 18.3 + TypeScript
- **Styling:** Tailwind CSS 3.4
- **Компоненты:** Radix UI (доступность из коробки)
- **Иконки:** Lucide React
- **Деплой:** Поддержка Vercel, Netlify, VPS

## 📦 Быстрый старт

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/your-username/tatushkiii-nextjs.git
cd tatushkiii-nextjs

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Команды

```bash
npm run dev      # Запуск dev сервера (с Turbopack)
npm run build    # Production сборка
npm start        # Запуск production сервера
npm run lint     # Проверка кода
```

## 🎯 SEO оптимизация

### Что реализовано:

✅ **Мета-теги**
- Title, Description, Keywords
- Canonical URLs
- Language tags (ru-RU)

✅ **Social Media**
- Open Graph (VK, Facebook, Telegram)
- Twitter Cards

✅ **Structured Data**
- Schema.org разметка (TattooParlor)
- Aggregate Rating
- Business info (адрес, телефон, часы работы)

✅ **Технические улучшения**
- robots.txt (автогенерация)
- sitemap.xml (автогенерация)
- Web App Manifest
- Semantic HTML

### Метрики производительности:

- ⚡ First Contentful Paint: ~0.5-1s
- ⚡ Time to Interactive: ~1-2s
- 📊 SEO Score: 90-100/100
- 📱 Mobile-Friendly: 100%

## 📝 Настройка перед деплоем

### 1. Обновите метаданные

В файле `app/layout.tsx` обновите:

```typescript
metadataBase: new URL('https://your-domain.com'), // Ваш домен
```

И другие настройки:
- Название сайта
- Описание
- Контактная информация
- Адрес и расписание
- Google/Yandex verification коды

### 2. Обновите контакты

В файле `app/page.tsx` обновите:
- Telegram: `@your_telegram`
- WhatsApp: `+7 (XXX) XXX-XX-XX`
- Email: `your@email.com`

### 3. Добавьте изображения

Поместите в папку `public/`:
- `og-image.jpg` (1200x630) - для Open Graph
- `favicon.ico` - иконка сайта
- `apple-touch-icon.png` - иконка для iOS
- `icon-192.png` и `icon-512.png` - PWA иконки

## 🚀 Деплой

### Vercel (рекомендуется)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
npm install -g vercel
vercel
```

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### VPS / Собственный сервер

См. локальную документацию в папке `docs/` после клонирования

## 📂 Структура проекта

```
tatushkiii-nextjs/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Главный layout с SEO metadata
│   ├── page.tsx             # Главная страница
│   ├── globals.css          # Глобальные стили
│   ├── robots.ts            # robots.txt генератор
│   ├── sitemap.ts           # sitemap.xml генератор
│   └── manifest.ts          # PWA manifest генератор
├── components/              # React компоненты
│   ├── AboutSection.tsx
│   ├── CTAButton.tsx
│   ├── HandDrawnStars.tsx
│   ├── PortfolioSection.tsx
│   └── figma/              # Figma импортированные компоненты
├── public/                  # Статические файлы
├── next.config.ts          # Next.js конфигурация
├── tailwind.config.ts      # Tailwind конфигурация
└── package.json            # Зависимости
```

## 🎨 Кастомизация дизайна

Проект использует **hand-drawn стиль** с Comic Sans MS шрифтом. Цветовая схема:

```css
--color-green: #22C55E;
--color-red: #EF4444;
--color-blue: #4169E1;
```

Для изменения стилей редактируйте:
- `app/globals.css` - основные стили и классы
- `tailwind.config.ts` - цвета и настройки Tailwind

## 📈 После деплоя

1. **Добавьте сайт в поисковые системы:**
   - [Google Search Console](https://search.google.com/search-console)
   - [Yandex Webmaster](https://webmaster.yandex.ru/)

2. **Проверьте SEO:**
   - [PageSpeed Insights](https://pagespeed.web.dev/)
   - [Rich Results Test](https://search.google.com/test/rich-results)
   - [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

3. **Настройте аналитику:**
   - Google Analytics
   - Yandex.Metrika

## 🐛 Troubleshooting

### Build ошибки

```bash
# Очистить кеш
rm -rf .next node_modules
npm install
npm run build
```

### Port уже занят

```bash
# Убить процесс на порту 3000
lsof -ti:3000 | xargs kill -9
```

## 🤝 Contributing

Проект создан для личного использования, но вы можете:
1. Fork репозиторий
2. Создать feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Открыть Pull Request

## 📄 Лицензия

Этот проект создан для личного использования. Свободно используйте для своих целей.

## 📞 Контакты

- Telegram: [@your_telegram](https://t.me/your_telegram)
- Website: [your-domain.com](https://your-domain.com)

---

**Сделано с ❤️ с использованием Next.js 15**
