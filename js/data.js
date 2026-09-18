// 以后接后台接口只改 getPrompts() 这一个函数，其他模块无需调整。
"use strict";

// 内联数据与 data/prompts.json 完全一致，保证 file:// 双击也能读取。
// 更新示例数据时，请同步维护这里和 JSON 文件。
window.PROMPTS_DATA = {
  "version": 1,
  "updatedAt": "2026-09-16",
  "items": [
    {
      "id": "img-0001",
      "title": "雾中的山间小屋",
      "type": "image",
      "prompt": "A quiet wooden cabin rests beside a mountain lake at dawn, photographed through a wide angle lens from the opposite shore. Soft diffused morning light filters through drifting mist, with muted pine greens and warm amber windows. Cinematic landscape photography, realistic wood textures, balanced composition, ultra detailed, high resolution, crisp foreground and atmospheric depth.",
      "promptZh": "黎明时分，一间安静的木屋坐落在山间湖畔，从对岸以广角镜头拍摄。柔和的晨光穿过流动的薄雾，低饱和的松绿色与温暖的琥珀色窗光相映。电影感风景摄影，真实木材纹理，均衡构图，超精细细节，高分辨率，清晰前景与富有层次的空间纵深。",
      "negativePrompt": "blurry, watermark, distorted architecture, oversaturated",
      "model": "Midjourney v7",
      "category": "场景",
      "tags": [
        "山林",
        "薄雾",
        "电影感"
      ],
      "colors": [
        "#344E41",
        "#A3B18A",
        "#DDB892"
      ],
      "cover": "assets/img-0001.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-16"
    },
    {
      "id": "img-0002",
      "title": "窗边的温柔肖像",
      "type": "image",
      "prompt": "An adult woman wearing a cream linen shirt sits beside a tall studio window, captured with an eighty five millimeter portrait lens at eye level. Gentle side lighting shapes her face and creates subtle catchlights. Editorial portrait style, warm beige palette, natural skin texture, shallow depth of field, refined film grain, exceptional detail and high resolution image quality.",
      "promptZh": "一位穿着奶油色亚麻衬衫的成年女性坐在高大的工作室窗边，以八十五毫米人像镜头平视拍摄。柔和的侧光勾勒面部轮廓，并形成细腻的眼神光。杂志人像风格，温暖的米色调，自然皮肤纹理，浅景深，细致胶片颗粒，丰富细节与高分辨率画质。",
      "negativePrompt": "plastic skin, extra fingers, watermark, blurry eyes",
      "model": "即梦",
      "category": "人物",
      "tags": [
        "肖像",
        "自然光",
        "胶片"
      ],
      "colors": [
        "#E6D5C3",
        "#B08968",
        "#7F5539"
      ],
      "cover": "assets/img-0002.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-15"
    },
    {
      "id": "img-0003",
      "title": "雪地里的赤狐",
      "type": "image",
      "prompt": "A red fox stands quietly in fresh snow beneath dark spruce trees, captured from a low camera angle using a telephoto wildlife lens. Overcast winter light softly illuminates individual strands of orange fur. Documentary wildlife photography style, clean white background, gentle falling snow, precise eye focus, realistic anatomy, fine texture detail and professional high resolution quality.",
      "promptZh": "一只赤狐安静地站在深色云杉树下的新雪中，以低机位长焦野生动物镜头拍摄。冬季阴天的柔光照亮每一缕橙色毛发。纪实野生动物摄影风格，干净的白色背景，轻轻飘落的雪花，精准的眼部对焦，真实形体，精细纹理与专业高分辨率画质。",
      "negativePrompt": "extra legs, unnatural fur, cartoon, watermark",
      "model": "Midjourney v7",
      "category": "动物",
      "tags": [
        "狐狸",
        "冬日",
        "写实"
      ],
      "colors": [
        "#CB7832",
        "#EDF2F4",
        "#354F52"
      ],
      "cover": "assets/img-0003.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-14"
    },
    {
      "id": "img-0004",
      "title": "鼠尾草绿香水静物",
      "type": "image",
      "prompt": "A translucent sage green perfume bottle rests on a pale stone pedestal beside a single eucalyptus branch. Shoot with a macro product lens from a three quarter angle, using large softbox lighting and a narrow rim light. Minimal luxury advertising style, controlled glass reflections, delicate shadows, realistic stone pores, sharp label detail and pristine high resolution studio quality.",
      "promptZh": "一只半透明的鼠尾草绿香水瓶置于浅色石台上，旁边放着一枝桉树。使用微距产品镜头，从四分之三角度拍摄，以大型柔光箱配合一束窄轮廓光照明。极简奢华广告风格，受控的玻璃反射，细腻阴影，真实石材孔隙，清晰标签细节与纯净的高分辨率棚拍画质。",
      "negativePrompt": "warped bottle, illegible label, harsh reflections, watermark",
      "model": "即梦",
      "category": "产品",
      "tags": [
        "香水",
        "极简",
        "静物"
      ],
      "colors": [
        "#A3B18A",
        "#DAD7CD",
        "#588157"
      ],
      "cover": "assets/img-0004.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-13"
    },
    {
      "id": "vid-0001",
      "title": "雨夜霓虹街头",
      "type": "video",
      "prompt": "An eight second continuous tracking shot moves slowly along a rainy city street at night, filmed with a thirty five millimeter lens at pedestrian eye level. Neon signs cast cyan and magenta light onto wet pavement while umbrellas pass naturally through frame. Cinematic noir style, realistic rain physics, stable camera motion, coherent reflections, detailed textures and clean four K video quality.",
      "promptZh": "一段八秒的连续跟拍镜头，以三十五毫米镜头在行人视线高度缓慢穿过雨夜街道。霓虹招牌把青色与洋红色光线投射在湿润路面上，雨伞自然经过画面。黑色电影风格，真实雨水运动，稳定镜头，连贯反射，细致纹理与清晰的四K视频画质。",
      "negativePrompt": "flicker, camera jitter, morphing objects, watermark",
      "model": "Sora",
      "category": "场景",
      "tags": [
        "雨夜",
        "霓虹",
        "电影感"
      ],
      "colors": [
        "#14213D",
        "#00B4D8",
        "#D149A0"
      ],
      "cover": "assets/vid-0001.jpg",
      "video": "assets/vid-0001.mp4",
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-12"
    },
    {
      "id": "vid-0002",
      "title": "日光下的橘猫",
      "type": "video",
      "prompt": "A six second close up shows an orange tabby cat waking on a linen sofa and gently stretching its front paws. The camera makes a slow subtle push in with a fifty millimeter lens. Warm afternoon window light reveals soft fur and floating dust. Cozy documentary style, natural feline movement, consistent anatomy, shallow depth of field and highly detailed four K video quality.",
      "promptZh": "一段六秒的特写展现一只橘色虎斑猫在亚麻沙发上醒来，轻轻伸展前爪。镜头使用五十毫米焦段缓慢而轻微地推进。温暖的午后窗光照亮柔软毛发与漂浮尘埃。温馨纪实风格，自然的猫咪动作，连贯的身体形态，浅景深与高细节四K视频画质。",
      "negativePrompt": "flickering fur, extra paws, unnatural motion, watermark",
      "model": "Sora",
      "category": "动物",
      "tags": [
        "猫咪",
        "自然光",
        "治愈"
      ],
      "colors": [
        "#D99559",
        "#F1E3D3",
        "#A68A64"
      ],
      "cover": "assets/vid-0002.jpg",
      "video": "assets/vid-0002.mp4",
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-11"
    },
    {
      "id": "img-0005",
      "title": "蓝调时刻的海岸灯塔",
      "type": "image",
      "prompt": "A solitary white lighthouse stands on a rugged coast during blue hour, photographed from a low cliff with a twenty four millimeter wide angle lens. Cool twilight wraps the rocks while a warm beacon cuts through sea mist. Cinematic coastal photography, long exposure water, crisp architecture, subtle film grain, dramatic atmosphere, ultra detailed textures and high resolution quality.",
      "promptZh": "蓝调时刻，一座孤独的白色灯塔矗立在崎岖海岸，从低矮悬崖处以二十四毫米广角镜头拍摄。冷色暮光笼罩岩石，温暖灯光穿过海雾。电影感海岸摄影，长曝光海水，建筑轮廓清晰，细腻胶片颗粒，氛围浓郁，纹理精细且画质高清。",
      "negativePrompt": "tilted horizon, blurry lighthouse, oversaturated sky, watermark",
      "model": "Midjourney v7",
      "category": "场景",
      "tags": [
        "海岸",
        "灯塔",
        "蓝调"
      ],
      "colors": [
        "#183B56",
        "#6B8FA3",
        "#F2B84B"
      ],
      "cover": "assets/img-0005.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-10"
    },
    {
      "id": "img-0006",
      "title": "末班地铁的红衣舞者",
      "type": "image",
      "prompt": "An adult contemporary dancer in a flowing red coat performs alone on an empty subway platform after midnight, captured at waist height with a thirty five millimeter lens. Fluorescent ceiling lights create repeating highlights and deep shadows. Urban editorial style, controlled motion blur, expressive fabric movement, cinematic symmetry, realistic skin detail, sharp focus and premium high resolution finish.",
      "promptZh": "午夜过后，一位穿流动红色外套的成年现代舞者独自在空旷地铁站台起舞，以腰部高度的三十五毫米镜头拍摄。荧光顶灯形成重复高光与深邃阴影。都市杂志风格，受控动态模糊，衣料动作富有表现力，电影式对称构图，皮肤细节真实，焦点锐利，画质精致。",
      "negativePrompt": "extra limbs, distorted hands, crowded platform, watermark",
      "model": "DALL·E 3",
      "category": "人物",
      "tags": [
        "舞者",
        "地铁",
        "动感"
      ],
      "colors": [
        "#B3261E",
        "#30343F",
        "#D9D9D9"
      ],
      "cover": "assets/img-0006.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-09"
    },
    {
      "id": "img-0007",
      "title": "雨林叶片上的树蛙",
      "type": "image",
      "prompt": "A tiny emerald tree frog rests on a rain covered tropical leaf, photographed at eye level with a one hundred millimeter macro lens. Soft canopy light glows through translucent foliage and highlights sparkling water droplets. Natural history macro photography, realistic moist skin, precise eye detail, shallow depth of field, lush bokeh, balanced composition and exceptionally sharp high resolution quality.",
      "promptZh": "一只微小的翠绿色树蛙停在布满雨滴的热带叶片上，以平视角度的一百毫米微距镜头拍摄。柔和的林冠光穿透半透明叶片，照亮闪烁水珠。自然史微距摄影，湿润皮肤真实，眼部细节精准，浅景深，繁茂散景，构图均衡且画质极为锐利。",
      "negativePrompt": "extra eyes, deformed legs, plastic texture, watermark",
      "model": "Stable Diffusion XL",
      "category": "动物",
      "tags": [
        "树蛙",
        "雨林",
        "微距"
      ],
      "colors": [
        "#2D6A4F",
        "#74C69D",
        "#D8F3DC"
      ],
      "cover": "assets/img-0007.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-08"
    },
    {
      "id": "img-0008",
      "title": "钛金属腕表广告",
      "type": "image",
      "prompt": "A brushed titanium wristwatch floats above a charcoal slate surface with its crown facing the camera, photographed using a macro product lens at a precise three quarter angle. Narrow strip lights carve silver highlights across the case. Premium technology advertising style, controlled reflections, accurate dial markings, crisp metal texture, deep black shadows, clean composition and flawless high resolution studio quality.",
      "promptZh": "一枚拉丝钛金属腕表悬浮在炭黑石板上方，表冠朝向镜头，以微距产品镜头从精确的四分之三角度拍摄。窄条灯在表壳上勾勒银色高光。高端科技广告风格，反射受控，表盘刻度准确，金属纹理清晰，阴影深邃，构图干净，棚拍画质无瑕。",
      "negativePrompt": "warped dial, incorrect hands, unreadable markings, watermark",
      "model": "Midjourney v7",
      "category": "产品",
      "tags": [
        "腕表",
        "金属",
        "商业摄影"
      ],
      "colors": [
        "#1F2329",
        "#8D99AE",
        "#E5E7EB"
      ],
      "cover": "assets/img-0008.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-07"
    },
    {
      "id": "img-0009",
      "title": "春日草莓奶油塔",
      "type": "image",
      "prompt": "A delicate strawberry cream tart sits on a pale pink ceramic plate beside scattered blossoms, photographed from a slightly elevated angle with a fifty millimeter lens. Diffused morning light creates soft shadows and luminous fruit. Fresh spring food editorial style, glossy berries, airy cream texture, fine pastry crumbs, pastel background, elegant styling and appetizing high resolution detail.",
      "promptZh": "一枚精致的草莓奶油塔放在浅粉色陶瓷盘中，旁边散落花朵，以略高视角的五十毫米镜头拍摄。漫射晨光形成柔和阴影，让水果通透发亮。清新春日美食杂志风格，莓果光泽饱满，奶油轻盈，酥皮碎屑细致，粉彩背景优雅，细节诱人。",
      "negativePrompt": "melted cream, rotten fruit, messy crumbs, watermark",
      "model": "即梦",
      "category": "食物",
      "tags": [
        "甜点",
        "草莓",
        "春日"
      ],
      "colors": [
        "#D9485F",
        "#F7CAD0",
        "#FFF1E6"
      ],
      "cover": "assets/img-0009.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-06"
    },
    {
      "id": "img-0010",
      "title": "粗野主义山谷图书馆",
      "type": "image",
      "prompt": "A monumental brutalist library rises from a narrow mountain valley, viewed from the entrance plaza through a tilt shift architectural lens. Late afternoon sunlight grazes raw concrete walls and casts long geometric shadows. Contemporary architecture photography, human scale figures, precise vertical lines, restrained composition, realistic material weathering, atmospheric depth and ultra clean high resolution rendering.",
      "promptZh": "一座宏大的粗野主义图书馆矗立在狭窄山谷中，从入口广场使用移轴建筑镜头观看。午后阳光掠过清水混凝土墙面，投下修长的几何阴影。当代建筑摄影风格，以人物体现尺度，垂直线精准，构图克制，材料风化真实，空间纵深丰富，画面高清洁净。",
      "negativePrompt": "bent walls, leaning verticals, fantasy ornaments, watermark",
      "model": "DALL·E 3",
      "category": "建筑",
      "tags": [
        "粗野主义",
        "图书馆",
        "几何"
      ],
      "colors": [
        "#6C6A67",
        "#C9B79C",
        "#384D48"
      ],
      "cover": "assets/img-0010.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-05"
    },
    {
      "id": "img-0011",
      "title": "沙漠星空下的营地",
      "type": "image",
      "prompt": "A small canvas tent glows beneath the Milky Way among sweeping desert dunes, photographed from ground level with a fourteen millimeter astrophotography lens. Cool starlight meets warm lantern illumination along wind carved sand. Adventurous travel photography, long exposure sky, natural color separation, crisp foreground ridges, subtle footprints, immense scale and noise free high resolution detail.",
      "promptZh": "一顶小帆布帐篷在银河下的沙丘间发光，以贴近地面的十四毫米星空摄影镜头拍摄。冷色星光与温暖灯笼光在风雕沙纹上交汇。冒险旅行摄影风格，长曝光天空，冷暖分离自然，前景沙脊清晰，脚印细微，尺度辽阔，画质纯净无噪点。",
      "negativePrompt": "star trails, noisy sky, multiple moons, watermark",
      "model": "Stable Diffusion XL",
      "category": "场景",
      "tags": [
        "沙漠",
        "星空",
        "露营"
      ],
      "colors": [
        "#172554",
        "#7C3AED",
        "#D6A85F"
      ],
      "cover": "assets/img-0011.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-04"
    },
    {
      "id": "img-0012",
      "title": "京剧后台的定妆时刻",
      "type": "image",
      "prompt": "An adult Peking opera performer adjusts an ornate headdress before a softly lit backstage mirror, captured over the shoulder with an eighty five millimeter lens. Warm tungsten bulbs illuminate precise makeup while cool curtain shadows frame the scene. Intimate documentary portrait, rich textile embroidery, authentic theatrical details, cinematic color contrast, shallow depth of field and refined high resolution clarity.",
      "promptZh": "一位成年京剧演员在柔光后台镜前整理华丽头饰，从肩后用八十五毫米镜头拍摄。温暖钨丝灯照亮精细妆容，冷色帷幕阴影环绕画面。亲密纪实人像，织物刺绣丰富，舞台细节真实，冷暖电影色彩对比，浅景深且画质细腻清晰。",
      "negativePrompt": "distorted face, inaccurate costume, extra fingers, watermark",
      "model": "即梦",
      "category": "人物",
      "tags": [
        "京剧",
        "后台",
        "传统文化"
      ],
      "colors": [
        "#9D0208",
        "#F4C430",
        "#1D3557"
      ],
      "cover": "assets/img-0012.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-03"
    },
    {
      "id": "img-0013",
      "title": "翠鸟掠过晨雾水面",
      "type": "image",
      "prompt": "A brilliant kingfisher skims inches above a misty river with wings fully extended, frozen by a fast shutter through a six hundred millimeter wildlife lens. Golden sunrise backlight outlines blue feathers and suspended droplets. Award winning nature photography, accurate bird anatomy, precise eye focus, smooth background separation, dynamic composition, natural reflections and exceptional high resolution sharpness.",
      "promptZh": "一只鲜艳翠鸟展开双翼贴着晨雾河面掠过，使用六百毫米野生动物镜头和高速快门凝固瞬间。金色日出逆光勾勒蓝色羽毛与悬浮水滴。获奖级自然摄影，鸟类形态准确，眼部对焦精准，背景分离柔和，构图动感，倒影自然且清晰度极高。",
      "negativePrompt": "extra wings, malformed beak, duplicated bird, watermark",
      "model": "Midjourney v7",
      "category": "动物",
      "tags": [
        "翠鸟",
        "飞行",
        "晨光"
      ],
      "colors": [
        "#0077B6",
        "#F4A261",
        "#A8DADC"
      ],
      "cover": "assets/img-0013.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-02"
    },
    {
      "id": "img-0014",
      "title": "透明机械键盘概念图",
      "type": "image",
      "prompt": "A transparent mechanical keyboard with frosted keycaps rests on a reflective acrylic desk, photographed from a low diagonal angle using a fifty millimeter product lens. Cyan and violet edge lights reveal internal switches without harsh glare. Futuristic industrial design campaign, precise geometry, clean legends, realistic translucent materials, controlled reflections, minimal composition and tack sharp high resolution studio rendering.",
      "promptZh": "一把带磨砂键帽的透明机械键盘置于反光亚克力桌面，从低位斜角使用五十毫米产品镜头拍摄。青色与紫色轮廓光照出内部轴体而没有刺眼眩光。未来工业设计广告风格，几何精准，字符清晰，半透明材质真实，反射受控，构图极简，棚拍画面锐利。",
      "negativePrompt": "warped keys, random letters, uneven rows, watermark",
      "model": "DALL·E 3",
      "category": "产品",
      "tags": [
        "键盘",
        "透明材质",
        "未来感"
      ],
      "colors": [
        "#22D3EE",
        "#8B5CF6",
        "#E2E8F0"
      ],
      "cover": "assets/img-0014.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-09-01"
    },
    {
      "id": "img-0015",
      "title": "深夜豚骨拉面",
      "type": "image",
      "prompt": "A steaming bowl of tonkotsu ramen sits on a dark wooden counter in a quiet late night shop, photographed close with a fifty millimeter lens at diner eye level. Warm pendant light catches glossy broth, sliced pork and rising steam. Moody Japanese food photography, authentic ceramic texture, crisp toppings, shallow depth of field, subtle film grain and appetizing high resolution detail.",
      "promptZh": "一碗热气腾腾的豚骨拉面放在安静深夜小店的深色木台上，以食客视线高度的五十毫米镜头近距离拍摄。温暖吊灯照亮油润汤面、叉烧与升腾蒸汽。氛围感日式美食摄影，陶碗质感真实，配料清晰，浅景深，轻微胶片颗粒，细节诱人。",
      "negativePrompt": "plastic noodles, floating ingredients, dirty bowl, watermark",
      "model": "即梦",
      "category": "食物",
      "tags": [
        "拉面",
        "深夜食堂",
        "暖光"
      ],
      "colors": [
        "#5C2C1D",
        "#D99F4C",
        "#F5E6CA"
      ],
      "cover": "assets/img-0015.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-31"
    },
    {
      "id": "img-0016",
      "title": "悬崖边的白色美术馆",
      "type": "image",
      "prompt": "A minimalist white art museum extends over a sunlit Mediterranean cliff, photographed from offshore with a long lens that compresses sea and architecture. Hard noon light creates graphic shadows beneath cantilevered galleries. Contemporary architectural editorial, pure geometric volumes, tiny visitors for scale, turquoise water reflections, realistic concrete finish, precise lines and polished high resolution clarity.",
      "promptZh": "一座极简白色美术馆伸向阳光下的地中海悬崖，从近海处使用长焦镜头压缩海面与建筑关系。正午硬光在悬挑展厅下形成图形化阴影。当代建筑杂志风格，几何体块纯净，游客体现尺度，碧蓝水面反光，混凝土质感真实，线条精准，画质通透。",
      "negativePrompt": "crooked structure, impossible supports, cloudy water, watermark",
      "model": "Midjourney v7",
      "category": "建筑",
      "tags": [
        "美术馆",
        "海边",
        "极简"
      ],
      "colors": [
        "#F8F9FA",
        "#48CAE4",
        "#C9A66B"
      ],
      "cover": "assets/img-0016.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-30"
    },
    {
      "id": "img-0017",
      "title": "清晨的水下珊瑚花园",
      "type": "image",
      "prompt": "A thriving coral garden fills a clear tropical lagoon at sunrise, photographed underwater with a wide dome lens just above the reef. Shafts of golden light ripple through turquoise water around schools of tiny fish. Conservation documentary style, scientifically believable coral forms, natural color balance, suspended particles, expansive depth, crisp foreground detail and pristine high resolution image quality.",
      "promptZh": "日出时分，繁茂珊瑚花园铺满清澈热带泻湖，以广角穹顶镜头在礁石上方进行水下拍摄。金色光束穿过碧绿海水，在小鱼群间摇曳。生态保护纪实风格，珊瑚形态可信，色彩自然，悬浮颗粒细微，空间开阔，前景清晰，画质纯净。",
      "negativePrompt": "plastic coral, murky water, duplicated fish, watermark",
      "model": "Stable Diffusion XL",
      "category": "场景",
      "tags": [
        "海洋",
        "珊瑚",
        "水下"
      ],
      "colors": [
        "#0096C7",
        "#FF7F51",
        "#90E0EF"
      ],
      "cover": "assets/img-0017.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-29"
    },
    {
      "id": "img-0018",
      "title": "月面基地的银发宇航员",
      "type": "image",
      "prompt": "An adult silver haired astronaut stands inside a lunar greenhouse and looks toward Earth through a panoramic window, captured in profile with a seventy millimeter lens. Cool reflected moonlight meets gentle amber grow lamps across the face. Optimistic science fiction portrait, practical suit design, realistic glass reflections, detailed plants, cinematic depth, restrained color grading and premium high resolution finish.",
      "promptZh": "一位银发成年宇航员站在月面温室中，透过全景窗眺望地球，以七十毫米镜头拍摄侧面。冷色月面反光与温柔琥珀植物灯在面部交汇。乐观科幻人像风格，航天服设计实用，玻璃反射真实，植物细节丰富，电影纵深明显，调色克制，画质高级。",
      "negativePrompt": "broken helmet, extra fingers, distorted Earth, watermark",
      "model": "Midjourney v7",
      "category": "人物",
      "tags": [
        "宇航员",
        "科幻",
        "月球"
      ],
      "colors": [
        "#CBD5E1",
        "#1E3A5F",
        "#F2A65A"
      ],
      "cover": "assets/img-0018.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-28"
    },
    {
      "id": "img-0019",
      "title": "花田里奔跑的柯基",
      "type": "image",
      "prompt": "A joyful corgi runs through a field of yellow wildflowers with ears lifted and paws midair, photographed from grass level using a fast eighty five millimeter lens. Clear morning backlight adds a soft rim around the fur. Playful pet lifestyle photography, natural canine anatomy, frozen motion, creamy floral bokeh, bright expression, clean color and crisp high resolution detail.",
      "promptZh": "一只快乐柯基在黄色野花田中奔跑，耳朵扬起、四爪腾空，以贴近草地的高速八十五毫米镜头拍摄。清晨逆光在毛发边缘形成柔和轮廓。活泼宠物生活摄影，犬类形态自然，动作凝固，花朵散景柔滑，表情明亮，色彩干净，细节锐利。",
      "negativePrompt": "extra paws, stretched body, artificial smile, watermark",
      "model": "DALL·E 3",
      "category": "动物",
      "tags": [
        "柯基",
        "花田",
        "活力"
      ],
      "colors": [
        "#E9C46A",
        "#C86B3C",
        "#5F7A3A"
      ],
      "cover": "assets/img-0019.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-27"
    },
    {
      "id": "img-0020",
      "title": "城市折叠电动自行车",
      "type": "image",
      "prompt": "A compact folding electric bicycle is displayed on a clean concrete plaza beside modern transit architecture, photographed at wheel height with a forty millimeter lens. Soft overcast daylight reveals matte olive paint and precise mechanical joints. Sustainable mobility campaign, functional industrial design, realistic rubber and metal textures, balanced negative space, sharp branding area and commercial high resolution quality.",
      "promptZh": "一辆紧凑型折叠电动自行车陈列在现代交通建筑旁的干净混凝土广场上，以车轮高度的四十毫米镜头拍摄。柔和阴天光呈现哑光橄榄绿涂层与精密机械关节。可持续出行广告，工业设计实用，橡胶和金属纹理真实，留白均衡，品牌区域清晰，商业画质精致。",
      "negativePrompt": "bent wheels, impossible frame, missing pedals, watermark",
      "model": "即梦",
      "category": "产品",
      "tags": [
        "电动自行车",
        "工业设计",
        "城市出行"
      ],
      "colors": [
        "#556B2F",
        "#BFC5C2",
        "#2F3437"
      ],
      "cover": "assets/img-0020.jpg",
      "video": null,
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-26"
    },
    {
      "id": "vid-0003",
      "title": "极光掠过冰封湖面",
      "type": "video",
      "prompt": "A ten second time lapse looks across a frozen arctic lake as green aurora curtains sweep above distant mountains. The locked camera uses a twenty four millimeter wide angle view while moonlight reveals cracks in blue ice. Cinematic nature documentary style, smooth sky motion, stable horizon, coherent reflections, realistic exposure transitions, detailed landscape and clean four K video quality.",
      "promptZh": "一段十秒延时镜头越过冰封北极湖面，绿色极光帷幕从远山上空掠过。固定机位采用二十四毫米广角，月光照出蓝冰裂纹。电影感自然纪录片风格，天空运动顺滑，地平线稳定，倒影连贯，曝光变化真实，景观细节丰富，四K画质清晰。",
      "negativePrompt": "flicker, moving camera, broken reflections, watermark",
      "model": "Sora",
      "category": "场景",
      "tags": [
        "极光",
        "冰湖",
        "延时摄影"
      ],
      "colors": [
        "#0B132B",
        "#2EC4B6",
        "#8ECAE6"
      ],
      "cover": "assets/vid-0003.jpg",
      "video": "assets/vid-0003.mp4",
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-25"
    },
    {
      "id": "vid-0004",
      "title": "陶艺师拉坯的一分钟",
      "type": "video",
      "prompt": "An eight second close tracking shot circles an adult potter shaping wet clay on a spinning wheel inside a quiet studio. A fifty millimeter lens stays focused on steady hands while warm window light reveals water and clay texture. Tactile craft documentary style, natural hand movement, consistent vessel shape, gentle camera motion, subtle film grain and detailed four K video quality.",
      "promptZh": "一段八秒近距离环绕跟拍，展现成年陶艺师在安静工作室的旋转陶轮上塑造湿润黏土。五十毫米镜头始终聚焦稳定双手，温暖窗光呈现水与泥的纹理。触感强烈的手工纪录片风格，手部动作自然，器形连贯，运镜柔和，胶片颗粒细微，四K细节清晰。",
      "negativePrompt": "extra fingers, morphing pottery, camera jitter, watermark",
      "model": "Runway Gen-4",
      "category": "人物",
      "tags": [
        "陶艺",
        "手作",
        "纪录片"
      ],
      "colors": [
        "#8C5A3C",
        "#D6B18A",
        "#5B4636"
      ],
      "cover": "assets/vid-0004.jpg",
      "video": "assets/vid-0004.mp4",
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-24"
    },
    {
      "id": "vid-0005",
      "title": "蜂鸟悬停在朱槿花前",
      "type": "video",
      "prompt": "A six second slow motion telephoto shot follows a ruby throated hummingbird hovering before a red hibiscus flower. Soft tropical morning light catches iridescent feathers while the background remains creamy green. High speed wildlife documentary style, physically accurate wing blur, stable body anatomy, precise beak contact, natural flower movement, clean focus tracking and detailed four K quality.",
      "promptZh": "一段六秒长焦慢动作镜头跟随一只红喉蜂鸟悬停在红色朱槿花前。柔和热带晨光照亮虹彩羽毛，背景保持奶油般绿色。高速野生动物纪录片风格，翼部模糊符合物理规律，身体形态稳定，鸟喙接触精准，花朵运动自然，对焦跟随干净，四K细节丰富。",
      "negativePrompt": "extra wings, frozen flower, flicker, watermark",
      "model": "即梦",
      "category": "动物",
      "tags": [
        "蜂鸟",
        "慢动作",
        "花卉"
      ],
      "colors": [
        "#C1121F",
        "#2A9D8F",
        "#F6BD60"
      ],
      "cover": "assets/vid-0005.jpg",
      "video": "assets/vid-0005.mp4",
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-23"
    },
    {
      "id": "vid-0006",
      "title": "冰滴咖啡产品短片",
      "type": "video",
      "prompt": "An eight second macro commercial shot begins on a clear ice cube as dark coffee pours into a ribbed glass, then slowly pulls back to reveal the bottle. Warm side light creates amber gradients and crisp condensation. Premium beverage advertising, controlled liquid physics, coherent reflections, smooth camera motion, elegant dark styling, sharp label detail and polished four K video quality.",
      "promptZh": "一段八秒微距商业镜头从透明冰块开始，深色咖啡注入条纹玻璃杯，随后缓慢拉远露出瓶身。温暖侧光形成琥珀渐变与清晰冷凝水。高端饮品广告风格，液体物理受控，反射连贯，运镜顺滑，深色造型优雅，标签细节锐利，四K成片精致。",
      "negativePrompt": "splash artifacts, warped glass, unreadable label, watermark",
      "model": "Runway Gen-4",
      "category": "产品",
      "tags": [
        "咖啡",
        "饮品广告",
        "微距"
      ],
      "colors": [
        "#3C2415",
        "#B66A2C",
        "#D9C2A7"
      ],
      "cover": "assets/vid-0006.jpg",
      "video": "assets/vid-0006.mp4",
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-22"
    },
    {
      "id": "vid-0007",
      "title": "清晨出炉的可颂",
      "type": "video",
      "prompt": "A seven second cinematic close up shows a baker opening a deck oven as golden croissants rise in gentle steam. The camera slides sideways with a fifty millimeter lens while warm oven light meets cool dawn light from the bakery window. Artisan food film, natural steam behavior, crisp laminated pastry layers, consistent hand motion, rich texture and clean four K video quality.",
      "promptZh": "一段七秒电影感特写展现烘焙师打开层炉，金黄可颂在轻柔蒸汽中出炉。镜头以五十毫米焦段横向滑动，温暖炉光与面包店窗外的清晨冷光交汇。手工美食短片风格，蒸汽自然，酥皮层次清晰，手部动作连贯，质感丰富，四K画质干净。",
      "negativePrompt": "burned pastry, morphing hands, excessive smoke, watermark",
      "model": "Sora",
      "category": "食物",
      "tags": [
        "可颂",
        "烘焙",
        "清晨"
      ],
      "colors": [
        "#C97A2B",
        "#F2CC8F",
        "#6B4F3A"
      ],
      "cover": "assets/vid-0007.jpg",
      "video": "assets/vid-0007.mp4",
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-21"
    },
    {
      "id": "vid-0008",
      "title": "光影穿过螺旋图书馆",
      "type": "video",
      "prompt": "A ten second stabilized crane shot rises through the central atrium of a circular library while afternoon sun travels across curved wooden balconies. A wide angle lens preserves vertical geometry as readers move naturally below. Architectural cinema style, smooth controlled motion, coherent human scale, realistic shifting light, rich material detail, balanced exposure and pristine four K video quality.",
      "promptZh": "一段十秒稳定摇臂镜头从圆形图书馆中央中庭缓缓上升，午后阳光掠过弧形木质栏台。广角镜头保持垂直几何，读者在下方自然移动。建筑电影风格，运动平稳受控，人物尺度连贯，光影变化真实，材料细节丰富，曝光均衡，四K画质纯净。",
      "negativePrompt": "warped balconies, floating people, unstable camera, watermark",
      "model": "可灵 2.1",
      "category": "建筑",
      "tags": [
        "图书馆",
        "螺旋结构",
        "光影"
      ],
      "colors": [
        "#8B5E3C",
        "#E6C79C",
        "#4A5568"
      ],
      "cover": "assets/vid-0008.jpg",
      "video": "assets/vid-0008.mp4",
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-20"
    },
    {
      "id": "vid-0009",
      "title": "黄昏城市滑板追拍",
      "type": "video",
      "prompt": "An eight second low angle tracking shot follows an adult skateboarder carving through a broad city plaza at sunset. A twenty eight millimeter lens stays beside the board as orange light stretches shadows across polished stone. Energetic street film style, realistic wheel rotation, consistent body movement, smooth gimbal motion, subtle motion blur, cinematic contrast and detailed four K video quality.",
      "promptZh": "一段八秒低机位跟拍镜头跟随成年滑板手在日落城市广场流畅转弯。二十八毫米镜头始终贴近滑板，橙色阳光在光滑石面拉出长影。充满能量的街头电影风格，轮子转动真实，身体动作连贯，稳定器运镜平滑，动态模糊细腻，对比电影化，四K细节清晰。",
      "negativePrompt": "broken skateboard, sliding feet, camera shake, watermark",
      "model": "Sora",
      "category": "人物",
      "tags": [
        "滑板",
        "街头",
        "追拍"
      ],
      "colors": [
        "#F77F00",
        "#264653",
        "#A7B0B8"
      ],
      "cover": "assets/vid-0009.jpg",
      "video": "assets/vid-0009.mp4",
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-19"
    },
    {
      "id": "vid-0010",
      "title": "机械臂组装智能腕表",
      "type": "video",
      "prompt": "A nine second precision macro shot follows a compact robotic arm placing a sapphire screen onto a smart watch inside a clean factory cell. Cool white task lights and blue status LEDs reflect across brushed metal. Advanced manufacturing documentary, accurate mechanical timing, stable components, smooth focus pull, realistic micro scratches, crisp industrial detail and immaculate four K video quality.",
      "promptZh": "一段九秒精密微距镜头跟随紧凑机械臂在洁净生产单元中把蓝宝石屏幕安装到智能腕表上。冷白工作灯与蓝色状态灯在拉丝金属上反射。先进制造纪录片风格，机械时序准确，零件稳定，焦点切换顺滑，微小划痕真实，工业细节清晰，四K画质洁净。",
      "negativePrompt": "misaligned parts, impossible machinery, flicker, watermark",
      "model": "Runway Gen-4",
      "category": "产品",
      "tags": [
        "智能腕表",
        "机械臂",
        "制造"
      ],
      "colors": [
        "#2B2D42",
        "#4CC9F0",
        "#CED4DA"
      ],
      "cover": "assets/vid-0010.jpg",
      "video": "assets/vid-0010.mp4",
      "author": "灵感编辑部",
      "sourceUrl": "",
      "createdAt": "2026-08-18"
    }
  ]
};

async function getPrompts() {
  let payload = window.PROMPTS_DATA;
  if (payload == null) {
    const response = await fetch("data/prompts.json");
    if (!response.ok) throw new Error("提示词数据读取失败：" + response.status);
    payload = await response.json();
  }
  // 同时兼容接口直接返回数组和当前带版本信息的对象。
  const items = Array.isArray(payload) ? payload : payload && payload.items;
  if (!Array.isArray(items)) throw new Error("提示词数据格式错误：缺少 items 数组");
  return items;
}
