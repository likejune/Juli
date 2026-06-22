# Julia Bunyakova CMS — build plan

- [x] Install Node 20 (sandbox)
- [x] Extract content (artworks, posts, bio) from old single-file site
- [ ] Configs: package.json, next.config, tsconfig, tailwind, vercel.json, .env.example, .gitignore
- [ ] Prisma schema (SQLite default) + schema.postgres + seed (trilingual content RU/EN/ZH)
- [ ] Locales ru/en/zh (flat key JSON) + DB overrides
- [ ] lib: db, auth (jose+bcrypt), i18n, rate-limit, track, validate, storage
- [ ] middleware (admin protection)
- [ ] Public: layout, home, gallery (masonry+modal), about, blog (+post, comments, likes), contacts
- [ ] Admin: login, shell, dashboard, analytics (chart.js + world map), gallery mgr, blog mgr, comments, biography, social, translations, seo, settings, security, media library
- [ ] API routes (auth, track, comments, likes, admin CRUD)
- [ ] npm install → prisma db push → seed → next build (fix until green)
- [ ] Dev server + synthetic traffic → screenshots (public + admin)
- [ ] README, zip, upload to Slack, final message
