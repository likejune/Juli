// Seed data — blog posts (trilingual RU / EN / ZH). Body paragraphs separated by blank lines.

const p = (...paras) => paras.join('\n\n');

export const POSTS = [
  {
    slug: 'quiet-light-series',
    imageUrl: 'https://www.artic.edu/iiif/2/3c27b499-af56-f0d5-93b5-a7f2f1ad5813/full/843,/0/default.jpg',
    publishedAt: '2026-05-12',
    categoryRu: 'Выставки', categoryEn: 'Exhibitions', categoryZh: '展览',
    titleRu: '«Тихий свет»: как рождалась новая серия',
    titleEn: '"Quiet Light": How the New Series Was Born',
    titleZh: '《静光》：新系列的诞生',
    excerptRu: 'Полтора года работы, тридцать холстов и одна простая идея: написать свет, который не слепит, а согревает.',
    excerptEn: 'Eighteen months of work, thirty canvases and one simple idea: to paint light that warms instead of blinding.',
    excerptZh: '一年半的创作，三十幅画布，和一个简单的想法：画出不刺眼、却温暖人心的光。',
    bodyRu: p(
      'Серия «Тихий свет» началась с неудачи. Весной позапрошлого года я уничтожила почти готовую картину — большую, эффектную, «выставочную». Она была громкой, и именно это меня в ней раздражало. В тот вечер я записала в дневнике одну фразу: «Хочу писать свет, который не слепит, а согревает». Из этой фразы выросло всё остальное.',
      'Полтора года я работала только с ранним утром и поздним вечером — двумя часами суток, когда свет не утверждает, а спрашивает. Я почти отказалась от чистого белого: в серии его заменили тёплые жемчужные и льняные тона, которые смешивались на палитре дольше, чем писались на холсте.',
      'Из сорока начатых холстов в финальную экспозицию вошли тридцать. Остальные не были плохими — они были лишними, а в этой серии мне впервые хватило смелости это признать. Кажется, именно умение убирать лишнее и есть то, чему я училась все эти полтора года.',
      'Выставка открыта до конца июля. Приходите утром, в первый час работы галереи: смотрители говорят, что в это время картины «совпадают» с настоящим светом из окон. Я проверила — это правда.'
    ),
    bodyEn: p(
      'The "Quiet Light" series began with a failure. In the spring of the year before last I destroyed an almost finished painting — large, spectacular, "exhibition-ready". It was loud, and that was exactly what irritated me about it. That evening I wrote a single sentence in my diary: "I want to paint light that warms instead of blinding." Everything else grew out of that sentence.',
      'For eighteen months I worked only with early morning and late evening — the two hours of the day when light does not assert, but asks. I almost gave up pure white: in this series it was replaced by warm pearl and linen tones that took longer to mix on the palette than to paint on the canvas.',
      'Of the forty canvases I started, thirty made it into the final exhibition. The others were not bad — they were superfluous, and for the first time in this series I had the courage to admit it. It seems that the ability to remove the unnecessary is precisely what I was learning all those eighteen months.',
      'The exhibition is open until the end of July. Come in the morning, during the gallery\u2019s first hour: the attendants say that at that time the paintings "coincide" with the real light from the windows. I checked — it is true.'
    ),
    bodyZh: p(
      '《静光》系列始于一次失败。前年春天，我毁掉了一幅几乎完成的画——尺幅很大、效果惊人、十足的"展览之作"。它太喧闹了，而这正是让我恼火的地方。那天晚上我在日记里写下一句话："我想画不刺眼、却温暖人心的光。"其余的一切都从这句话生长出来。',
      '一年半里，我只在清晨与黄昏作画——一天中光线不再宣告、而是发问的两个小时。我几乎放弃了纯白色：在这个系列里，它被温暖的珍珠色与亚麻色取代，这些颜色在调色板上调和的时间，比画到画布上的时间还长。',
      '动笔的四十幅画布中，最终有三十幅进入展览。其余的并不差——它们只是多余的，而在这个系列里，我第一次有勇气承认这一点。学会舍弃多余之物，大概正是这一年半我所学到的东西。',
      '展览将持续到七月底。请在清晨、画廊开门后的第一个小时前来：看展人说，那时画作与窗外真实的光"重合"。我去验证过——确实如此。'
    ),
  },
  {
    slug: 'art-paris-diary',
    imageUrl: 'https://www.artic.edu/iiif/2/f8fd76e9-c396-5678-36ed-6a348c904d27/full/843,/0/default.jpg',
    publishedAt: '2026-04-28',
    categoryRu: 'Выставки', categoryEn: 'Exhibitions', categoryZh: '展览',
    titleRu: 'Art Paris: дневник одной ярмарки',
    titleEn: 'Art Paris: Diary of an Art Fair',
    titleZh: 'Art Paris：一场艺博会的日记',
    excerptRu: 'Четыре дня в Grand Palais: что чувствует художник, когда его работы смотрят десять тысяч человек.',
    excerptEn: 'Four days at the Grand Palais: what an artist feels when ten thousand people look at her work.',
    excerptZh: '大皇宫的四天：当一万人观看你的作品时，艺术家的内心感受。',
    bodyRu: p(
      'Ярмарка — странный жанр для художника. В мастерской картина живёт медленно: месяцами стоит лицом к стене, поворачивается, дозревает. На ярмарке у неё есть семь секунд — столько в среднем посетитель смотрит на работу, прежде чем пойти дальше. Сначала это ранит. Потом учит.',
      'В Grand Palais наш стенд стоял между молодой корейской галереей и классиками послевоенной абстракции. Лучшее соседство, которое можно придумать: слева — бесстрашие, справа — дисциплина. Я ходила к соседям как на лекции.',
      'Самый важный разговор случился в последний день. Пожилая женщина простояла у «Тумана над рекой» почти двадцать минут, а потом сказала: «Я не куплю её. Я просто хотела побыть рядом». Ради таких двадцати минут и стоит везти картины через три границы.',
      'Из Парижа я вернулась с двумя проданными работами, одной будущей выставкой и полным блокнотом набросков. Но главный багаж — ощущение, что тихая живопись нужна людям ровно настолько же, насколько громкая. Просто ей нужно чуть больше времени.'
    ),
    bodyEn: p(
      'An art fair is a strange genre for a painter. In the studio a painting lives slowly: it stands facing the wall for months, gets turned around, ripens. At a fair it has seven seconds — that is how long the average visitor looks at a work before moving on. At first it hurts. Then it teaches.',
      'At the Grand Palais our booth stood between a young Korean gallery and the classics of post-war abstraction. The best neighbourhood imaginable: fearlessness on the left, discipline on the right. I visited my neighbours as if attending lectures.',
      'The most important conversation happened on the last day. An elderly woman stood in front of "Mist over the River" for almost twenty minutes and then said: "I will not buy it. I just wanted to be near it." For twenty minutes like these it is worth carrying paintings across three borders.',
      'I returned from Paris with two works sold, one future exhibition and a sketchbook filled to the last page. But the main luggage was the feeling that quiet painting is needed exactly as much as loud painting. It simply needs a little more time.'
    ),
    bodyZh: p(
      '对画家来说，艺博会是一种奇怪的体裁。在画室里，画作活得很慢：面朝墙壁立上几个月，被转过来，慢慢成熟。而在博览会上，它只有七秒钟——这是观众在走向下一件作品前平均停留的时间。起初这让人受伤，后来却让人学会很多。',
      '在大皇宫，我们的展位夹在一家年轻的韩国画廊与战后抽象派经典之间。这是能想到的最好的邻居：左边是无畏，右边是纪律。我像听讲座一样去拜访邻居们。',
      '最重要的对话发生在最后一天。一位年长的女士在《河上雾霭》前站了将近二十分钟，然后说："我不会买它。我只是想在它旁边待一会儿。"为了这样的二十分钟，跨越三个国境运画也是值得的。',
      '我从巴黎带回了两件售出的作品、一个未来的展览和一本画满速写的本子。但最重要的行李，是这样一种感受：人们需要安静的绘画，正如需要喧闹的绘画一样。它只是需要多一点时间。'
    ),
  },
  {
    slug: 'morning-in-the-studio',
    imageUrl: 'https://www.artic.edu/iiif/2/2d484387-2509-5e8e-2c43-22f9981972eb/full/843,/0/default.jpg',
    publishedAt: '2026-03-09',
    categoryRu: 'Мастерская', categoryEn: 'Studio', categoryZh: '工作室',
    titleRu: 'Утро в мастерской: мой ритуал работы',
    titleEn: 'Morning in the Studio: My Working Ritual',
    titleZh: '画室的清晨：我的工作仪式',
    excerptRu: 'Почему я начинаю день не с кисти, а с уборки, и зачем художнику обязательное «время тишины».',
    excerptEn: 'Why I start the day not with a brush but with cleaning, and why an artist needs mandatory "quiet time".',
    excerptZh: '为什么我的一天不是从画笔、而是从打扫开始，以及艺术家为何需要必修的"静默时间"。',
    bodyRu: p(
      'Меня часто спрашивают про вдохновение, и мой ответ всех разочаровывает: моё вдохновение начинается со швабры. Каждое утро я полчаса убираю мастерскую — мою кисти, выравниваю тюбики, протираю подоконники. Это не педантизм. Это способ сказать пространству: я пришла работать.',
      'Потом — кофе и сорок минут тишины перед вчерашним холстом. Без телефона, без музыки, без карандаша в руках. Я просто смотрю. Девять из десяти ошибок в живописи происходят не от неумения, а от спешки: рука начинает работать раньше, чем глаз успел понять.',
      'Пишу я всегда стоя и всегда сериями по три холста: пока один сохнет, второй пишется, третий обдумывается. Этому ритму меня научил мой парижский профессор, и за десять лет он не подвёл ни разу.',
      'А заканчиваю день я единственной строчкой в рабочем дневнике. Иногда это план, иногда жалоба, иногда одно слово. Перечитывать эти тетради спустя годы — отдельное удовольствие: оказывается, все большие серии начинались с очень маленьких слов.'
    ),
    bodyEn: p(
      'People often ask me about inspiration, and my answer disappoints everyone: my inspiration begins with a mop. Every morning I spend half an hour cleaning the studio — washing brushes, lining up tubes, wiping the windowsills. It is not pedantry. It is a way of telling the space: I have come to work.',
      'Then coffee, and forty minutes of silence in front of yesterday\u2019s canvas. No phone, no music, no pencil in hand. I just look. Nine out of ten mistakes in painting come not from lack of skill but from haste: the hand starts working before the eye has had time to understand.',
      'I always paint standing, and always in series of three canvases: while one dries, the second is being painted and the third is being thought through. My Paris professor taught me this rhythm, and in ten years it has never failed me.',
      'And I end the day with a single line in my working diary. Sometimes it is a plan, sometimes a complaint, sometimes one word. Rereading these notebooks years later is a special pleasure: it turns out all the big series began with very small words.'
    ),
    bodyZh: p(
      '人们常问我灵感从何而来，而我的回答总让人失望：我的灵感始于一把拖把。每天早晨我都会花半小时打扫画室——洗画笔、摆整齐颜料管、擦拭窗台。这不是洁癖，而是对这个空间说：我是来工作的。',
      '然后是咖啡，以及在昨天的画布前四十分钟的静默。没有手机，没有音乐，手里也没有铅笔。我只是看。绘画中十之八九的错误并非源于技艺不足，而是源于匆忙：手开始动了，眼睛却还没来得及理解。',
      '我总是站着作画，而且总是三幅一组：一幅在晾干，一幅在画，第三幅在构思。这个节奏是我的巴黎教授教给我的，十年来从未让我失望。',
      '一天的结束，是工作日记里的一行字。有时是计划，有时是抱怨，有时只是一个词。多年后重读这些本子是一种特别的享受：原来所有大的系列，都始于很小很小的词语。'
    ),
  },
  {
    slug: 'colour-of-memory-volga',
    imageUrl: 'https://www.artic.edu/iiif/2/52ac8996-3460-cf71-cb42-5c4d0aa29b74/full/843,/0/default.jpg',
    publishedAt: '2026-02-17',
    categoryRu: 'Эссе', categoryEn: 'Essays', categoryZh: '随笔',
    titleRu: 'Цвет памяти: почему я пишу Волгу всю жизнь',
    titleEn: 'The Colour of Memory: Why I Have Painted the Volga All My Life',
    titleZh: '记忆的颜色：为什么我一生都在画伏尔加河',
    excerptRu: 'О детстве в Астрахани, серебряной воде и о том, как один и тот же пейзаж может не заканчиваться двадцать лет.',
    excerptEn: 'On a childhood in Astrakhan, silver water, and how one and the same landscape can remain unfinished for twenty years.',
    excerptZh: '关于阿斯特拉罕的童年、银色的河水，以及同一片风景如何二十年都画不完。',
    bodyRu: p(
      'Каждый художник всю жизнь пишет одну картину. Моя — это Волга в шесть утра, вид с дебаркадера у дедушкиного дома в Астрахани. Мне было семь, когда я впервые увидела, как река за десять минут меняет цвет с серого на серебряный, а с серебряного — на розовый. С тех пор я, кажется, только и делаю, что пытаюсь догнать те десять минут.',
      'Память — лучший смеситель красок. Реальная вода сложнее любой палитры, но память упрощает её до главного: оставляет два-три тона и одно чувство. Поэтому я почти никогда не пишу с натуры финальные работы — только этюды. Большие холсты пишутся в мастерской, по памяти, иногда через годы после увиденного.',
      'В прошлом году я посчитала: за двадцать лет у меня набралось больше шестидесяти «волжских» работ, и ни одна не повторяет другую. Не потому, что менялась река. Потому что менялась я.',
      'Этой осенью я снова еду в Астрахань — на месяц, с ящиком красок и пустыми холстами. Если у этой поездки получится стать новой серией, вы узнаете о ней первыми.'
    ),
    bodyEn: p(
      'Every artist paints one picture all their life. Mine is the Volga at six in the morning, the view from the landing stage by my grandfather\u2019s house in Astrakhan. I was seven when I first saw the river change colour from grey to silver and from silver to pink within ten minutes. Ever since, it seems, all I have been doing is trying to catch up with those ten minutes.',
      'Memory is the best mixer of paints. Real water is more complex than any palette, but memory simplifies it down to the essential: it keeps two or three tones and one feeling. That is why I almost never paint final works from life — only studies. The large canvases are painted in the studio, from memory, sometimes years after what was seen.',
      'Last year I counted: over twenty years I have accumulated more than sixty "Volga" works, and not one repeats another. Not because the river changed. Because I did.',
      'This autumn I am going to Astrakhan again — for a month, with a box of paints and blank canvases. If this trip manages to become a new series, you will be the first to know.'
    ),
    bodyZh: p(
      '每个艺术家一生都在画同一幅画。我的那幅，是清晨六点的伏尔加河，从阿斯特拉罕外祖父家旁趸船上望去的景色。七岁那年，我第一次看见河水在十分钟内由灰变银、由银变粉。从那以后，我所做的一切，似乎都是在追赶那十分钟。',
      '记忆是最好的调色师。真实的河水比任何调色板都复杂，但记忆会把它简化为最本质的东西：留下两三种色调和一种感觉。所以我几乎从不对景完成正式作品——只画习作。大幅画布是在画室里凭记忆画的，有时距离亲眼所见已过去多年。',
      '去年我数了数：二十年间我积累了六十多幅"伏尔加"作品，没有一幅与另一幅重复。不是因为河变了，而是因为我变了。',
      '今年秋天我将再赴阿斯特拉罕——待一个月，带着一箱颜料和空白的画布。如果这次旅行能孕育出新的系列，你们会是最先知道的人。'
    ),
  },
  {
    slug: 'how-to-start-collecting',
    imageUrl: 'https://www.artic.edu/iiif/2/defb4004-b500-218d-3d9b-9a02423f097d/full/843,/0/default.jpg',
    publishedAt: '2026-01-25',
    categoryRu: 'Коллекционерам', categoryEn: 'For Collectors', categoryZh: '致收藏家',
    titleRu: 'Как начать собирать живопись: советы коллекционерам',
    titleEn: 'How to Start Collecting Paintings: Advice for Collectors',
    titleZh: '如何开始收藏绘画：给收藏家的建议',
    excerptRu: 'Пять простых правил для тех, кто хочет купить первую картину — и не ошибиться.',
    excerptEn: 'Five simple rules for anyone who wants to buy their first painting — and get it right.',
    excerptZh: '五条简单法则，帮你买下第一幅画——并且不买错。',
    bodyRu: p(
      'За десять лет выставок я видела сотни людей, покупающих первую в жизни картину, и почти все они волновались сильнее, чем на собеседовании. Это нормально: искусство — покупка, в которой нет инструкции. Но несколько правил всё же существует.',
      'Первое: покупайте глазами, а не ушами. Не имена, не прогнозы инвестиционного роста, не «модных авторов» — а ту работу, мимо которой вы не смогли пройти. Картина будет висеть в вашем доме годами; рейтинги художника вам с ней не жить.',
      'Второе: смотрите много и бесплатно. Музеи, ярмарки, открытия галерей — насмотренность приходит быстрее, чем кажется, и через полгода вы будете удивляться своим прежним фаворитам. Третье: знакомьтесь с художниками. Большинство из нас охотно рассказывает о работах, и история картины часто оказывается половиной её ценности.',
      'Четвёртое: начинайте с графики и этюдов — это честный способ жить с настоящим искусством за разумные деньги. И пятое, самое важное: первая картина должна радовать, а не «подходить к дивану». Диваны меняются. Хорошая живопись остаётся.'
    ),
    bodyEn: p(
      'Over ten years of exhibitions I have seen hundreds of people buying the first painting of their life, and almost all of them were more nervous than at a job interview. That is normal: art is a purchase that comes without a manual. But a few rules do exist.',
      'First: buy with your eyes, not your ears. Not names, not forecasts of investment growth, not "fashionable artists" — but the work you could not walk past. The painting will hang in your home for years; you will not be living with the artist\u2019s ratings.',
      'Second: look a lot, and look for free. Museums, fairs, gallery openings — a trained eye comes faster than it seems, and in six months you will be surprised by your former favourites. Third: meet the artists. Most of us are happy to talk about our work, and the story of a painting often turns out to be half its value.',
      'Fourth: start with works on paper and studies — an honest way to live with real art for reasonable money. And fifth, most important: the first painting should bring joy, not "match the sofa". Sofas change. Good painting stays.'
    ),
    bodyZh: p(
      '十年展览生涯中，我见过数百位购买人生第一幅画的人，他们几乎都比面试时还紧张。这很正常：艺术是一种没有说明书的购买。但有几条法则确实存在。',
      '第一：用眼睛买，而不是用耳朵买。不要看名气，不要听投资增值的预测，不要追"时髦艺术家"——而要选那幅让你无法走开的作品。这幅画将在你家里挂上多年；陪伴你的不是艺术家的排名。',
      '第二：多看，免费地看。博物馆、博览会、画廊开幕式——眼力的养成比想象中更快，半年后你会惊讶于自己曾经的偏爱。第三：去认识艺术家。我们中的大多数人都乐于谈论自己的作品，而一幅画的故事往往是它价值的一半。',
      '第四：从纸上作品和习作开始——这是用合理的价格与真正的艺术共同生活的诚实方式。第五，也是最重要的一条：第一幅画应该带来喜悦，而不是"配沙发"。沙发会换，好的绘画会留下来。'
    ),
  },
  {
    slug: 'venice-notes',
    imageUrl: 'https://www.artic.edu/iiif/2/b55d836c-ee20-59f8-1f0c-a95e09905361/full/843,/0/default.jpg',
    publishedAt: '2025-11-30',
    categoryRu: 'Путешествия', categoryEn: 'Travel', categoryZh: '旅行',
    titleRu: 'Венеция: город, который пишет себя сам',
    titleEn: 'Venice: The City That Paints Itself',
    titleZh: '威尼斯：一座自己描绘自己的城市',
    excerptRu: 'Заметки с биеннале: о золоте Сан-Марко, усталости от красоты и одном уроке смирения.',
    excerptEn: 'Notes from the Biennale: on the gold of San Marco, fatigue from beauty, and one lesson in humility.',
    excerptZh: '双年展笔记：圣马可的金色、来自美的疲惫，以及一堂谦卑课。',
    bodyRu: p(
      'В Венецию нельзя ехать за вдохновением — она им переполнена до неприличия. Первые три дня я не сделала ни одного наброска: рука отказывалась соревноваться с городом, который сам себя пишет каждые полчаса — приливом, туманом, золотом мозаик.',
      'Урок смирения случился в Сан-Марко. Я стояла под сводами и понимала: безымянные мастера выкладывали это золото веками, не подписывая работ и не зная слова «персональная выставка». А я переживаю, удачно ли висит мой холст в павильоне. Стало смешно и легко.',
      'На биеннале моя «Девушка у окна» висела в зале с видом на канал, и вода за окном весь день перерисовывала картину заново: утром делала её серебряной, к вечеру — медовой. Лучшего куратора у меня не было.',
      'Из Венеции я привезла один-единственный этюд — крошечный, с ладонь. Иногда честный результат месяца — это десять квадратных сантиметров правды. Остальное город оставил себе, и это справедливо.'
    ),
    bodyEn: p(
      'One must not go to Venice for inspiration — the city is indecently overflowing with it. For the first three days I did not make a single sketch: my hand refused to compete with a city that paints itself anew every half hour — with the tide, the fog, the gold of the mosaics.',
      'The lesson in humility happened in San Marco. I stood under the vaults and understood: nameless masters laid this gold for centuries, never signing their work and never knowing the words "solo exhibition". And here I am, worrying whether my canvas hangs well in the pavilion. It suddenly felt funny — and light.',
      'At the Biennale my "Girl at the Window" hung in a room overlooking the canal, and the water outside repainted the picture all day long: in the morning it made it silver, by evening — honey-coloured. I have never had a better curator.',
      'From Venice I brought back one single study — tiny, the size of a palm. Sometimes the honest result of a month is ten square centimetres of truth. The rest the city kept for itself, and that is fair.'
    ),
    bodyZh: p(
      '不要去威尼斯寻找灵感——这座城市的灵感多到近乎失礼。头三天我一张速写也没画：我的手拒绝与这座每半小时就重新描绘自己的城市竞争——用潮水、雾气和马赛克的金色。',
      '谦卑的一课发生在圣马可大教堂。我站在穹顶下忽然明白：无名的工匠们用几个世纪铺设这些金色，从不署名，也不知道"个展"这个词。而我却在担心自己的画布在展馆里挂得是否得体。顿时觉得又好笑又轻松。',
      '在双年展上，我的《窗边的少女》挂在一间能望见运河的展厅里，窗外的水整日重新描绘着这幅画：清晨把它染成银色，傍晚又染成蜜色。我从未有过比这更好的策展人。',
      '我从威尼斯只带回一幅习作——小小的，巴掌大。有时候，一个月的诚实成果就是十平方厘米的真实。其余的，城市留给了自己，这很公平。'
    ),
  },
];
