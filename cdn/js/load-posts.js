// Facebook Community Posts - Dynamic Loader
// Fetches posts from posts.json and renders them dynamically
// Supports all 5 sample templates with unique CSS class names

document.addEventListener('DOMContentLoaded', function() {
    // Detect which template is loaded and get the corresponding class names
    var templates = {
        // Sample 1
        '.posts-grid': {
            grid: '.posts-grid',
            card: 'post-card',
            content: 'post-content',
            header: 'post-header',
            icon: 'post-icon',
            source: 'post-source',
            date: 'post-date',
            link: 'post-link'
        },
        // Sample 2
        '.posts-row': {
            grid: '.posts-row',
            card: 'post-item',
            content: 'post-body',
            header: 'post-top',
            icon: 'post-ico',
            source: 'post-tag',
            date: 'post-date',
            link: 'read-more'
        },
        // Sample 3
        '.posts-wrap': {
            grid: '.posts-wrap',
            card: 'post-card-item',
            content: 'pc-body',
            header: 'pc-head',
            icon: 'pc-emoji',
            source: 'pc-cat',
            date: 'pc-date',
            link: 'pc-link'
        },
        // Sample 4
        '.comm-grid': {
            grid: '.comm-grid',
            card: 'comm-card',
            content: 'cc-body',
            header: 'cc-top',
            icon: 'cc-icon',
            source: 'cc-label',
            date: 'cc-date',
            link: 'cc-link'
        },
        // Sample 5
        '.comm-list': {
            grid: '.comm-list',
            card: 'comm-post',
            content: 'cp-body',
            header: 'cp-top',
            icon: 'cp-emo',
            source: 'cp-cat',
            date: 'cp-date',
            link: 'cp-link'
        }
    };
    
    // Detect current template
    var style = null;
    var gridEl = null;
    for (var selector in templates) {
        if (templates.hasOwnProperty(selector)) {
            gridEl = document.querySelector(selector);
            if (gridEl) {
                style = templates[selector];
                break;
            }
        }
    }
    
    if (!style || !gridEl) {
        console.warn('Posts grid container not found');
        return;
    }
    
    // Clear any existing static posts
    gridEl.innerHTML = '';
    
    // Embedded posts data - uses translation keys (sk=source, tk=title, dk=desc)
    var embeddedPosts = [
      {"icon":"🙌","sk":"p0s","date":"December 7, 2025","tk":"p0t","dk":"p0d","url":"https://www.facebook.com/groups/798617002450170/posts/1163424299302770"},
      {"icon":"🔥","sk":"p1s","date":"December 7, 2025","tk":"p1t","dk":"p1d","url":"https://www.facebook.com/groups/798617002450170/posts/1163420165969850"},
      {"icon":"🏠","sk":"p2s","date":"December 2025","tk":"p2t","dk":"p2d","url":"https://www.facebook.com/groups/798617002450170/posts/1414550454190152"},
      {"icon":"🎶","sk":"p3s","date":"December 2025","tk":"p3t","dk":"p3d","url":"https://www.facebook.com/groups/798617002450170/posts/1160598499585350"},
      {"icon":"🕊️","sk":"p4s","date":"December 2025","tk":"p4t","dk":"p4d","url":"https://www.facebook.com/groups/798617002450170/posts/1160540309591169"},
      {"icon":"⛪","sk":"p5s","date":"December 3, 2025","tk":"p5t","dk":"p5d","url":"https://www.facebook.com/groups/798617002450170/posts/1160528996258967"},
      {"icon":"📅","sk":"p6s","date":"September 2025","tk":"p6t","dk":"p6d","url":"https://www.facebook.com/groups/798617002450170/posts/1092449423066925"},
      {"icon":"⛓️‍💥","sk":"p7s","date":"July 22-26, 2025","tk":"p7t","dk":"p7d","url":"https://www.facebook.com/groups/798617002450170/posts/1342147738097091"},
      {"icon":"🤝","sk":"p8s","date":"2025","tk":"p8t","dk":"p8d","url":"https://www.facebook.com/groups/798617002450170/posts/1330101469301718"},
      {"icon":"📖","sk":"p9s","date":"2025","tk":"p9t","dk":"p9d","url":"https://www.facebook.com/groups/798617002450170/posts/1238249531820246"},
      {"icon":"🙌","sk":"p10s","date":"2025","tk":"p10t","dk":"p10d","url":"https://www.facebook.com/groups/798617002450170/posts/1238066735171859"},
      {"icon":"🔥","sk":"p11s","date":"2025","tk":"p11t","dk":"p11d","url":"https://www.facebook.com/groups/798617002450170/posts/1046593847652483"}
    ];

    // Post translations: en, ha, kan, shu
    var postTr = {
        en: {
            p0s:"Gilgal 2025",p0t:"Gilgal for Dominion Day 2 \u2014 Harvest and Thanksgiving",
            p0d:"Pastor Philip Odola ministering on Gilgal for Total Dominion during the Harvest and Thanksgiving service. A powerful continuation of the Gilgal 2025 program.",
            p1s:"Gilgal 2025",p1t:"Gilgal for Dominion \u2014 Prophet Dr Nathaniel Ministering",
            p1d:"Prophet Dr Nathaniel ministering on the Harvest and Thanksgiving service during Gilgal for Dominion 2025. An unforgettable encounter with God's presence.",
            p2s:"Church History",p2t:"Church Headquarters \u2014 Dominion Villa, Abuja",
            p2d:"On 2nd December 1989, the Church was officially inaugurated at the old parade ground Abuja and God provided the Church a place in Area 1, Garki. Church moved to its present headquarters situated at Dominion Villa, Area 1, Garki, Abuja, Nigeria \u2014 a new milestone in God's plan for the church.",
            p3s:"Gilgal for Total Dominion",p3t:"Gilgal for Total Dominion \u2014 Deliverance",
            p3d:"Pastor Philip Odola ministering deliverance with Pastor Daniel Tula leading worship \u2014 an unforgettable time in God's presence at Gilgal 2025.",
            p4s:"Gilgal 2025",p4t:"Gilgal 2025 \u2014 Total Freedom",
            p4d:"Pastor Philip Odola ministering on Total Freedom at Gilgal 2025. Salvation gives you new life, but deliverance completes the work of setting you free.",
            p5s:"Gilgal for Total Dominion",p5t:"Gilgal for Total Dominion \u2014 First Sunday Service 2025",
            p5d:"First Sunday Service of the year 2025 \u2014 A New beginning. Bibles set on fire in front of church. Sunday, the 9th of February, 2025 at 3:00 pm, Beatrice Memorial Academy Hall Anguldi. May you conquer in Jesus name.",
            p6s:"Special Event",p6t:"September to Remember",
            p6d:"Dominion Global Church presents September to Remember \u2014 a week of powerful services from Sunday 14th. Get ready for Dominion Generation Takeover service. Reserve your seat and join us live.",
            p7s:"Special Event",p7t:"Breaking Generational Family Jealousy",
            p7d:"Breaking Generational Family Jealousy Event at Dominion Global Church. 22nd-26th July, Time: 9:00am, Venue: Dominion Church Auditorium. On Sunday 7:00am-7:30am at UNIMAID Gate 2.",
            p8s:"Men's Fellowship",p8t:"Men's Fellowship \u2014 Solar Ceiling Fans Presentation",
            p8d:"Dominion Men's Fellowship presented solar ceiling fans to the church \u2014 a practical demonstration of godly leadership and community support at Sunday Service in Maiduguri, Nigeria.",
            p9s:"Sunday Service",p9t:"Confronting Wickedness",
            p9d:"Prophet Dr. Nathaniel ministering on confronting wickedness \u2014 a bold and anointed message delivered during Sunday service in Maiduguri, Nigeria.",
            p10s:"Sunday Service",p10t:"Intercessory Prayers",
            p10d:"Powerful intercessory prayers during Sunday service in Maiduguri, Nigeria \u2014 a dedicated time of standing in the gap for our nation and community.",
            p11s:"Sunday Service",p11t:"Prophetic Empowerment Scripture Reference",
            p11d:"Sunday Service in Maiduguri, Nigeria \u2014 a powerful time of prophetic empowerment and scripture reference that strengthened the faith of all present.",
            rm:"Read full post"
        },
        ha: {
            p0s:"Gilgal 2025",p0t:"Gilgal don Dominion Rana 2 \u2014 Gano da Garga\u00e7i",
            p0d:"Malami Philip Odola yana miniyista kan Gilgal don Total Dominion a lokacin ayyukan Gano da Garga\u00e7i. Ci gaba mai \u015farfi na shirin Gilgal 2025.",
            p1s:"Gilgal 2025",p1t:"Gilgal don Dominion \u2014 Annabi Dr Nathaniel Yana Miniwista",
            p1d:"Annabi Dr Nathaniel yana miniwista kan ayyukan Gano da Garga\u00e7i a Gilgal don Dominion 2025. Ha\u00e7uwa da halatta Allah ba a manta ba.",
            p2s:"Tarihin Cocin",p2t:"Shugaban Cocin \u2014 Dominion Villa, Abuja",
            p2d:"A ranar 2 ga Disamba 1989, an bu\u00e7e Cocin a fili a filin shahararren Abuja kuma Allah ya ba Cocin wuri a Area 1, Garki. Cocin ya koma shugaban yanzu da ke Dominion Villa, Area 1, Garki, Abuja, Najeriya \u2014 sabon mataki a cikin shirin Allah ga cocin.",
            p3s:"Gilgal don Total Dominion",p3t:"Gilgal don Total Dominion \u2014 Ciyarawa",
            p3d:"Malami Philip Odola yana miniwista ciyarawa tare da Malami Daniel Tula yana jagorantar ibada \u2014 lokaci ba a manta ba a gaban Allah a Gilgal 2025.",
            p4s:"Gilgal 2025",p4t:"Gilgal 2025 \u2014 Kyauta Gaba \u0175aya",
            p4d:"Malami Philip Odola yana miniwista kan Kyauta Gaba \u0175aya a Gilgal 2025. Falsafa tana ba ku sabuwar rayuwa, amma ciyarawa tana kammala aikin saka ku kyauta.",
            p5s:"Gilgal don Total Dominion",p5t:"Gilgal don Total Dominion \u2014 Farkon Ayyukan Laraba 2025",
            p5d:"Farkon Ayyukan Laraba na shekarar 2025 \u2014 Sabon farawa. Littattafan Allah an konawa a gaban cocin. Laraba, ranar 9 ga Fabrairu, 2025 a 3:00 pm, Beatrice Memorial Academy Hall Anguldi. Don ku yi nasara a sunan Yesu.",
            p6s:"Abin Musamman",p6t:"Satumba Don Tuna",
            p6d:"Dominion Global Church yana gabatar da Satumba Don Tuna \u2014 mako na ayyuka masu \u015farfi daga Laraba 14. Ku shirya don ayyukan Dominion Generation Takeover. Ku adana wurinku ku zo mu a kai.",
            p7s:"Abin Musamman",p7t:"Brye Kyalacewar Iyali",
            p7d:"Brye Kyalacewar Iyali a Dominion Global Church. 22-26 ga Yuli, Lokaci: 9:00am, Wuri: Dominion Church Auditorium. A Laraba 7:00am-7:30am a UNIMAID Gate 2.",
            p8s:"Auwarkin Mata",p8t:"Auwarkin Mata \u2014 Gabatarwar Fans na Solar",
            p8d:"Auwarkin Mata na Dominion ya gabatar da fans na solar ga cocin \u2014 nuna jagorancin addini da tallafin al'umma a Ayyukan Laraba a Maiduguri, Najeriya.",
            p9s:"Ayyukan Laraba",p9t:"Fyace Korau",
            p9d:"Annabi Dr. Nathaniel yana miniwista kan fyace korau \u2014 sa\u015fo mai \u015farfi da an bayar a ayyukan Laraba a Maiduguri, Najeriya.",
            p10s:"Ayyukan Laraba",p10t:"Addu'o'in Ciyarawa",
            p10d:"Addu'o'i masu \u015farfi na ciyarawa a ayyukan Laraba a Maiduguri, Najeriya \u2014 lokaci na musamman na tsayawa a tsakiya ga \u015fasar mu da al'ummarmu.",
            p11s:"Ayyukan Laraba",p11t:"\u015earfafa Wahayi da Littafi Mai Tsarki",
            p11d:"Ayyukan Laraba a Maiduguri, Najeriya \u2014 lokaci mai \u015farfi na \u015farfafa wahayi da Littafi Mai Tsarki da ya \u015farfafa imannin duk wa\u00e7anda ke kanan.",
            rm:"Kara karantawa"
        },
        kan: {
            p0s:"Gilgal 2025",p0t:"Gilgal ro Dominion Kǝrə 2 \u2014 Àbàttə́ Kǝrə",
            p0d:"Malami Philip Odola kǝrə Gilgal ro Total Dominion àbàttə́. Gilgal 2025 kǝrə kǝrə.",
            p1s:"Gilgal 2025",p1t:"Gilgal ro Dominion \u2014 Annabi Dr Nathaniel",
            p1d:"Annabi Dr Nathaniel kǝrə àbàttə́ Gilgal ro Dominion 2025. Álà kǝrə bǝ.",
            p2s:"Cócì Tarihi",p2t:"Cócì Kǝrə \u2014 Dominion Villa, Abuja",
            p2d:"1989 Disamba 2, Cócì Abuja kǝrə. Dominion Villa, Area 1, Garki, Abuja, Nigeria \u2014 Álà kǝrə.",
            p3s:"Gilgal ro Total Dominion",p3t:"Gilgal ro Total Dominion \u2014 Ciyarawa",
            p3d:"Malami Philip Odola ciyarawa, Malami Daniel Tula àbàttə́. Gilgal 2025 Álà kǝrə.",
            p4s:"Gilgal 2025",p4t:"Gilgal 2025 \u2014 Kyauta Gaba",
            p4d:"Malami Philip Odola Total Freedom kǝrə Gilgal 2025. Salvation kǝrə, deliverance kǝrə.",
            p5s:"Gilgal ro Total Dominion",p5t:"Gilgal ro Total Dominion \u2014 Ahad 2025",
            p5d:"2025 Ahad kǝrə \u2014 New beginning. Beatrice Memorial Academy Hall Anguldi. Yesu kǝrə.",
            p6s:"Kǝrə Kǝrə",p6t:"September Kǝrə",
            p6d:"Dominion Global Church September to Remember \u2014 Ahad 14. Dominion Generation Takeover. Kǝrə kǝrə.",
            p7s:"Kǝrə Kǝrə",p7t:"Family Jealousy Kǝrə",
            p7d:"Breaking Generational Family Jealousy, Dominion Global Church. 22-26 July. UNIMAID Gate 2.",
            p8s:"Men's Fellowship",p8t:"Men's Fellowship \u2014 Solar Fans",
            p8d:"Dominion Men's Fellowship solar ceiling fans cócì. Maiduguri, Nigeria.",
            p9s:"Ahad Àbàttə́",p9t:"Wickedness Kǝrə",
            p9d:"Annabi Dr. Nathaniel wickedness kǝrə \u2014 Maiduguri, Nigeria.",
            p10s:"Ahad Àbàttə́",p10t:"Intercessory Prayers",
            p10d:"Intercessory prayers Ahad àbàttə́ Maiduguri, Nigeria \u2014 kǝrə kǝrə.",
            p11s:"Ahad Àbàttə́",p11t:"Prophetic Empowerment Kǝrə",
            p11d:"Ahad àbàttə́ Maiduguri, Nigeria \u2014 prophetic empowerment kǝrə.",
            rm:"Kǝrə kǝrə"
        },
        shu: {
            p0s:"Gilgal 2025",p0t:"Gilgal أودا Dominion رانا 2 \u2014 حصاد و شكر",
            p0d:"القس فليب أودولا يخدم على Gilgal أودا Total Dominion فخدمة حصاد و شكر. قوة كبيرة من Gilgal 2025.",
            p1s:"Gilgal 2025",p1t:"Gilgal أودا Dominion \u2014 النبي Dr Nathaniel يخدم",
            p1d:"النبي Dr Nathaniel يخدم فخدمة حصاد و شكر Gilgal أودا Dominion 2025. لقاء مع الله ما ينسى.",
            p2s:"تاريخ الكنيسة",p2t:"مقر الكنيسة \u2014 Dominion Villa, أبوja",
            p2d:"ف2 ديسمبر 1989، الكنيسة اتافتتحت فأبوجا. Dominion Villa, Area 1, Garki, أبوجا, نيجيريا \u2014 علامة جديدة من خطة الله.",
            p3s:"Gilgal أودا Total Dominion",p3t:"Gilgal أودا Total Dominion \u2014 خلاص",
            p3d:"القس فليب أودولا يخدم خلاص مع القس دانيال تولا يقود العبادة \u2014 وقت ما ينسى مع الله Gilgal 2025.",
            p4s:"Gilgal 2025",p4t:"Gilgal 2025 \u2014 حرية كاملة",
            p4d:"القس فليب أودولا يخدم على حرية كاملة Gilgal 2025. الخلاص يعطي حياة جديدة، الخلاص يكمل العمل.",
            p5s:"Gilgal أودا Total Dominion",p5t:"Gilgal أودا Total Dominion \u2014 أول أحد 2025",
            p5d:"أول خدمة أحد سنة 2025 \u2014 بداية جديدة. Beatrice Memorial Academy Hall Anguldi. يسوع معنا.",
            p6s:"حدث خاص",p6t:"سبتمبر للذكرى",
            p6d:"Dominion Global Church يقدم سبتمبر للذكرى \u2014 أسبوع من الخدمات القوية من أحد 14. Dominion Generation Takeover. انضموا لنا.",
            p7s:"حدث خاص",p7t:"كسر حسد العائلة",
            p7d:"كسر حسد العائلة أودا Dominion Global Church. 22-26 يوليو. UNIMAID Gate 2.",
            p8s:"إخوة الرجال",p8t:"إخوة الرجال \u2014 مراوح شمسية",
            p8d:"إخوة الرجال من Dominion قدموا مراوح شمسية للكنيسة \u2014 Maiduguri, نيجيريا.",
            p9s:"خدمة الأحد",p9t:"مواجهة الشر",
            p9d:"النبي Dr. Nathaniel يخدم على مواجهة الشر \u2014 Maiduguri, نيجيريا.",
            p10s:"خدمة الأحد",p10t:"صلوات الشفاعة",
            p10d:"صلوات شفاعة قوية فخدمة الأحد Maiduguri, نيجيريا \u2014 وقت خاص لأمتنا.",
            p11s:"خدمة الأحد",p11t:"تمكين نبوي",
            p11d:"خدمة الأحد Maiduguri, نيجيريا \u2014 وقت تمكين نبوي قوي.",
            rm:"اقرأ المزيد"
        }
    };
    // Default language for posts
    var currentPostLang = 'en';

    // Function to get translated text for a post
    var getPostText = function(key) {
        var lang = postTr[currentPostLang] || postTr['en'];
        return lang[key] || postTr['en'][key] || '';
    };

    // Function to render posts with current language
    var renderPosts = function(posts) {
        gridEl.innerHTML = '';
        posts.forEach(function(post) {
            var card = document.createElement('div');
            card.className = style.card;
            var source = getPostText(post.sk);
            var title = getPostText(post.tk);
            var desc = getPostText(post.dk);
            var readMore = getPostText('rm');
            card.innerHTML =
                '<div class="' + style.content + '">' +
                    '<div class="' + style.header + '">' +
                        '<div class="' + style.icon + '">' + post.icon + '</div>' +
                        '<div class="' + style.source + '">' + source + '</div>' +
                    '</div>' +
                    '<div class="' + style.date + '">📅 ' + post.date + '</div>' +
                    '<h3>' + title + '</h3>' +
                    '<p>' + desc + '</p>' +
                    '<a class="' + style.link + '" href="' + post.url + '" target="_blank" rel="noopener noreferrer">' + readMore + '</a>' +
                '</div>';
            gridEl.appendChild(card);
        });
    };

    // Global function to refresh posts when language changes
    window.refreshPosts = function(lang) {
        if (postTr[lang]) {
            currentPostLang = lang;
        } else {
            currentPostLang = 'en';
        }
        renderPosts(embeddedPosts);
    };

    // Try to fetch from posts.json first, fall back to embedded data
    var jsonPath = '/posts.json';
    fetch(jsonPath)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            return response.json();
        })
        .then(function(posts) {
            renderPosts(posts);
        })
        .catch(function(error) {
            console.warn('Could not fetch posts.json (' + error.message + '), using embedded posts instead.');
            // Fallback to embedded posts
            renderPosts(embeddedPosts);
        });
});
