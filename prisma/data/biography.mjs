// Seed data — biography page entries (trilingual)

export const BIOGRAPHY = [
  // --- main quote (about page) ---
  { section: 'quote', locale: 'ru', sortOrder: 0, title: '', meta: '', content: '«Я пишу не предметы и не пейзажи — я пишу тишину между ними. Свет, который остаётся, когда всё лишнее уходит.»' },
  { section: 'quote', locale: 'en', sortOrder: 0, title: '', meta: '', content: '"I do not paint objects or landscapes — I paint the silence between them. The light that remains when everything superfluous is gone."' },
  { section: 'quote', locale: 'zh', sortOrder: 0, title: '', meta: '', content: '"我画的不是物体，也不是风景——我画的是它们之间的寂静。是当一切多余之物褪去后，留下来的光。"' },

  // --- biography ---
  { section: 'bio', locale: 'ru', sortOrder: 0, title: 'Биография', meta: '', content: 'Julia Bunyakova — современная художница, работающая на стыке фигуративной живописи и лирической абстракции. Родилась в Астрахани, выросла среди волжских пейзажей, которые навсегда определили её главную тему — свет и воду. Окончила Московскую государственную академию живописи, ваяния и зодчества, стажировалась в Париже в Académie de la Grande Chaumière.' },
  { section: 'bio', locale: 'en', sortOrder: 0, title: 'Biography', meta: '', content: 'Julia Bunyakova is a contemporary artist working at the intersection of figurative painting and lyrical abstraction. Born in Astrakhan, she grew up among Volga landscapes that forever defined her central theme — light and water. She graduated from the Moscow State Academy of Painting, Sculpture and Architecture and trained in Paris at the Académie de la Grande Chaumière.' },
  { section: 'bio', locale: 'zh', sortOrder: 0, title: '简历', meta: '', content: 'Julia Bunyakova（尤莉娅·布尼亚科娃）是一位活跃于具象绘画与抒情抽象交汇处的当代艺术家。她出生于阿斯特拉罕，在伏尔加河的风景中长大，这片风景永远地决定了她创作的核心主题——光与水。她毕业于莫斯科国立绘画、雕塑与建筑学院，并曾在巴黎大茅屋艺术学院进修。' },

  // --- creative path ---
  { section: 'path', locale: 'ru', sortOrder: 0, title: 'Творческий путь', meta: '', content: 'Первая персональная выставка прошла в 2014 году и была полностью распродана в первые недели. С тех пор Julia провела более двадцати персональных проектов в России и Европе, а её работы вошли в частные коллекции в двенадцати странах. Художница работает сериями: каждая серия — это многомесячное исследование одного состояния, одного света, одного воспоминания.' },
  { section: 'path', locale: 'en', sortOrder: 0, title: 'Creative Path', meta: '', content: 'Her first solo exhibition took place in 2014 and sold out within weeks. Since then Julia has held more than twenty solo projects in Russia and Europe, and her works have entered private collections in twelve countries. The artist works in series: each series is a months-long exploration of one state of mind, one light, one memory.' },
  { section: 'path', locale: 'zh', sortOrder: 0, title: '艺术历程', meta: '', content: '她的首次个展于2014年举办，开展数周内作品即全部售出。此后，尤莉娅在俄罗斯和欧洲举办了二十余个个人项目，作品被十二个国家的私人收藏。她以系列方式创作：每个系列都是对一种心境、一种光线、一段记忆长达数月的探索。' },

  // --- philosophy ---
  { section: 'philosophy', locale: 'ru', sortOrder: 0, title: 'Философия искусства', meta: '', content: 'Для Julia живопись — это способ замедлить время. Она сознательно избегает громких жестов и визуального шума: её полотна строятся на тонких тональных переходах, дыхании цвета и больших паузах. Зритель не «считывает» картину мгновенно — он остаётся с ней наедине, и именно в этом, по словам художницы, рождается подлинная встреча с искусством.' },
  { section: 'philosophy', locale: 'en', sortOrder: 0, title: 'Philosophy of Art', meta: '', content: 'For Julia, painting is a way of slowing down time. She deliberately avoids loud gestures and visual noise: her canvases are built on subtle tonal transitions, the breathing of colour and long pauses. The viewer does not "read" the painting instantly — they remain alone with it, and it is precisely there, in the artist\u2019s words, that a true encounter with art is born.' },
  { section: 'philosophy', locale: 'zh', sortOrder: 0, title: '艺术哲学', meta: '', content: '对尤莉娅而言，绘画是让时间放慢的方式。她有意回避喧闹的姿态与视觉噪音：她的画面建立在细腻的色调过渡、色彩的呼吸与悠长的停顿之上。观者无法"瞬间读懂"她的画——而是与之独处，正是在这种独处中，用艺术家的话说，与艺术的真正相遇才得以诞生。' },

  // --- exhibitions ---
  { section: 'exhibition', locale: 'ru', sortOrder: 1, meta: '2025', title: '«Тихий свет»', content: 'персональная выставка, Галерея современного искусства, Москва' },
  { section: 'exhibition', locale: 'en', sortOrder: 1, meta: '2025', title: '"Quiet Light"', content: 'solo exhibition, Gallery of Contemporary Art, Moscow' },
  { section: 'exhibition', locale: 'zh', sortOrder: 1, meta: '2025', title: '《静光》', content: '个展，当代艺术画廊，莫斯科' },
  { section: 'exhibition', locale: 'ru', sortOrder: 2, meta: '2024', title: 'Art Paris', content: 'международная ярмарка современного искусства, Grand Palais, Париж' },
  { section: 'exhibition', locale: 'en', sortOrder: 2, meta: '2024', title: 'Art Paris', content: 'international contemporary art fair, Grand Palais, Paris' },
  { section: 'exhibition', locale: 'zh', sortOrder: 2, meta: '2024', title: 'Art Paris', content: '国际当代艺术博览会，大皇宫，巴黎' },
  { section: 'exhibition', locale: 'ru', sortOrder: 3, meta: '2023', title: '«Вода помнит»', content: 'персональный проект, Эрарта, Санкт-Петербург' },
  { section: 'exhibition', locale: 'en', sortOrder: 3, meta: '2023', title: '"Water Remembers"', content: 'solo project, Erarta Museum, Saint Petersburg' },
  { section: 'exhibition', locale: 'zh', sortOrder: 3, meta: '2023', title: '《水的记忆》', content: '个人项目，Erarta当代艺术博物馆，圣彼得堡' },
  { section: 'exhibition', locale: 'ru', sortOrder: 4, meta: '2022', title: 'Biennale di Venezia', content: 'параллельная программа, Палаццо Бембо, Венеция' },
  { section: 'exhibition', locale: 'en', sortOrder: 4, meta: '2022', title: 'Biennale di Venezia', content: 'collateral programme, Palazzo Bembo, Venice' },
  { section: 'exhibition', locale: 'zh', sortOrder: 4, meta: '2022', title: '威尼斯双年展', content: '平行展项目，本博宫，威尼斯' },
  { section: 'exhibition', locale: 'ru', sortOrder: 5, meta: '2021', title: '«Берега»', content: 'персональная выставка, Музей современного искусства, Берлин' },
  { section: 'exhibition', locale: 'en', sortOrder: 5, meta: '2021', title: '"Shores"', content: 'solo exhibition, Museum of Contemporary Art, Berlin' },
  { section: 'exhibition', locale: 'zh', sortOrder: 5, meta: '2021', title: '《海岸》', content: '个展，当代艺术博物馆，柏林' },
  { section: 'exhibition', locale: 'ru', sortOrder: 6, meta: '2019', title: '«Первый свет»', content: 'дебютная европейская выставка, Galerie Minimal, Вена' },
  { section: 'exhibition', locale: 'en', sortOrder: 6, meta: '2019', title: '"First Light"', content: 'debut European exhibition, Galerie Minimal, Vienna' },
  { section: 'exhibition', locale: 'zh', sortOrder: 6, meta: '2019', title: '《初光》', content: '欧洲首展，Galerie Minimal，维也纳' },

  // --- achievements (number + label) ---
  { section: 'achievement', locale: 'ru', sortOrder: 1, meta: '20+', title: '', content: 'персональных выставок' },
  { section: 'achievement', locale: 'en', sortOrder: 1, meta: '20+', title: '', content: 'solo exhibitions' },
  { section: 'achievement', locale: 'zh', sortOrder: 1, meta: '20+', title: '', content: '次个展' },
  { section: 'achievement', locale: 'ru', sortOrder: 2, meta: '300+', title: '', content: 'работ в коллекциях' },
  { section: 'achievement', locale: 'en', sortOrder: 2, meta: '300+', title: '', content: 'works in collections' },
  { section: 'achievement', locale: 'zh', sortOrder: 2, meta: '300+', title: '', content: '件被收藏作品' },
  { section: 'achievement', locale: 'ru', sortOrder: 3, meta: '12', title: '', content: 'стран мира' },
  { section: 'achievement', locale: 'en', sortOrder: 3, meta: '12', title: '', content: 'countries worldwide' },
  { section: 'achievement', locale: 'zh', sortOrder: 3, meta: '12', title: '', content: '个国家' },

  // --- publications ---
  { section: 'publication', locale: 'ru', sortOrder: 1, meta: '2025', title: 'The Art Newspaper Russia', content: '«Тихий свет: живопись медленного времени» — рецензия на персональную выставку' },
  { section: 'publication', locale: 'en', sortOrder: 1, meta: '2025', title: 'The Art Newspaper Russia', content: '"Quiet Light: Painting of Slow Time" — review of the solo exhibition' },
  { section: 'publication', locale: 'zh', sortOrder: 1, meta: '2025', title: 'The Art Newspaper Russia', content: '《静光：慢时间的绘画》——个展评论' },
  { section: 'publication', locale: 'ru', sortOrder: 2, meta: '2024', title: 'ELLE Decoration', content: 'интервью «Свет как материал» о серии «Вода помнит»' },
  { section: 'publication', locale: 'en', sortOrder: 2, meta: '2024', title: 'ELLE Decoration', content: 'interview "Light as Material" on the series "Water Remembers"' },
  { section: 'publication', locale: 'zh', sortOrder: 2, meta: '2024', title: 'ELLE Decoration', content: '专访《作为材料的光》——关于《水的记忆》系列' },
  { section: 'publication', locale: 'ru', sortOrder: 3, meta: '2022', title: 'Arte Fuse', content: '«Russian Lyricism at Palazzo Bembo» — обзор параллельной программы биеннале' },
  { section: 'publication', locale: 'en', sortOrder: 3, meta: '2022', title: 'Arte Fuse', content: '"Russian Lyricism at Palazzo Bembo" — review of the Biennale collateral programme' },
  { section: 'publication', locale: 'zh', sortOrder: 3, meta: '2022', title: 'Arte Fuse', content: '《本博宫中的俄罗斯抒情主义》——双年展平行项目评论' },
];

export const ABOUT_PHOTO = {
  url: 'https://www.artic.edu/iiif/2/91c51644-871f-cda9-82bb-94f4973ae339/full/843,/0/default.jpg',
  captionRu: 'Julia Bunyakova в своей мастерской',
  captionEn: 'Julia Bunyakova in her studio',
  captionZh: '尤莉娅·布尼亚科娃在她的画室中',
};

export const HERO_QUOTES = {
  quote_ru: '«Искусство позволяет увидеть то, что невозможно выразить словами.»',
  quote_en: '"Art lets us see what cannot be put into words."',
  quote_zh: '"艺术让我们看见语言无法表达的东西。"',
};
