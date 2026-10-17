import * as THREE from 'three';
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

/* ---------------- content ---------------- */
const STOPS = [
  { id: 'work', title: 'Work', cta: 'See the work', deg: 0 },          // Ken's hero view: sun behind the F
  { id: 'capabilities', title: 'Capabilities', cta: 'What we do', deg: -35 },
  { id: 'ai', title: 'AI', cta: 'Explore Freak Lab', deg: -52 },       // between Capabilities and Contact, so the other views stay as tuned
  { id: 'contact', title: 'Contact', cta: 'Get in touch', deg: -70 },
  { id: 'about', title: 'About', cta: 'Meet Freak', deg: -105 },
  { id: 'resources', title: 'Resource Centre', cta: 'Read the guides', deg: -118 },   // just past About, before the F turns its back
];

/* Case studies. Modules render in this order and are skipped when empty:
   hero image, video, text, numbers, quote, carousel. */
const CS = 'img/cs/';
const WORK = [{"id":"hoover","client":"Hoover","title":"From live shoot to listing","tags":["Live Production","Ecommerce","Amazon","Photography","Film"],"img":"img/hoover.webp","video":{"src":"vid/hoover.mp4","poster":"vid/hoover.webp"},"text":["Hoover needed new photography and film for 15 of its vacuum cleaners, from cordless sticks and uprights to cylinders, a robot and a wet and dry floor washer. Its existing imagery felt dark and sterile and didn't look like the homes of the 20 to 40 year olds it wanted to reach. The brief asked for more colour, a lived in feel and more dynamic angles.","We produced the shoot end to end. The location, casting, set design, props and wardrobe, a film crew and a stills team, all planned product by product in a shot matrix. Before filming we tested debris on every machine, to find the cereal, coffee and crumbs that picked up cleanly on camera and reset quickly between takes. Over five days in a London family home we shot product films for web and Amazon and more than 120 retouched lifestyle images.","Then we turned the shoot into ecommerce. For every product we wrote search led titles and listing copy, and designed the image stack above the fold and the A+ content below it for desktop and mobile, then reformatted it all for Argos and other retailers. We're now taking the work into Amazon DSP advertising and retailer campaigns."],"numbers":[["30%","sales increase"],["15","products shot and listed"],["120+","retouched lifestyle images"]],"quote":["I just wanted to give you the good news that sales are already up 30%, fantastic work as always.","Caitlyn May, Head of Commercial, Hoover"],"carousel":["hoover_1","hoover_2","hoover_3","hoover_4","hoover_5","hoover_6","hoover_7","hoover_8","hoover_9"]},{"id":"rnib","client":"RNIB","title":"A learning portal for sight loss awareness","tags":["LMS","Online learning","UX/UI Design","Accessibility","Gamification","Web Build"],"img":"img/rnib.webp","text":["RNIB wanted the public and its corporate partners to understand sight loss and know what to do differently. That called for a learning platform anyone could use, with short, practical modules that turn awareness into action and accessibility built in from the first screen. It builds on four years of work together, including the social action quiz that now sits inside the platform.","We designed and built the RNIB Learning Portal, a learning management system with four modules. Living independently, how small everyday actions create or remove barriers, how to offer assistance and how sight loss is experienced. Each one mixes film, quizzes and hands on tasks, from a matching game about everyday tools to a sight simulator that compares 20/20 vision with glaucoma, macular degeneration, cataracts and diabetic retinopathy, with an accessibility mode on every activity.","Points, levels, an anonymised leaderboard and shareable certificates keep people learning. A digital pledge wall turns what they've learned into commitments. We tested the portal with RNIB's user panels and refined it from their feedback, then built a secure back end on AWS. RNIB's strategy team has signed it off ahead of a pilot launch."],"numbers":[["4","learning modules"],["4","eye conditions in the sight simulator"]],"quote":["We had a look at the content you shared and we all agree, it is looking really good. It looks clean, professional, engaging and on-brand!","Lisa Hughes, RNIB"],"carousel":["rnib_1","rnib_2","rnib_3","rnib_4","rnib_5","rnib_6"]},{"id":"hovis","client":"Hovis","title":"Strength Baked In","tags":["Social Media","Creative Ideation","Strategy","Film"],"img":"img/hovis.webp","text":["Hovis is a much loved British brand with a rich heritage and a loyal following. The job was to connect it with a new generation online, and to keep it connecting as the social algorithms kept shifting underneath it.","We built a fresh social strategy and content programme around the Strength Baked In platform. Its centrepiece was London's ghost signs, the faded Hovis adverts painted onto brick walls generations ago. We filmed their restoration and used them to tell a story about heritage and the strength of everyday people.","It's an ongoing partnership. We've more than doubled Hovis's Instagram following, bringing in thousands of new followers, and since the new website launched in 2024 organic page visits have more than doubled too."],"numbers":[["4.5m","people reached"],["5.2m","impressions"],["2.5m","video plays"]],"quote":["Other agencies you feel like you are towing them along. Freak land their expertise well and confidently and leave you with a feeling that all is covered.","Marketing Manager, Hovis"],"carousel":["hovis_main","hovis_secondary1","hovis_secondary2"]},{"id":"va","client":"V&A","title":"Mapping Glastonbury","tags":["Interactive","3D","Web App"],"img":"img/va.webp","video":{"src":"vid/va.mp4","poster":"vid/va.webp"},"text":["The V&A wanted to open up its Glastonbury Festival archive to everyone, from posters and photographs to interviews and recordings gathered across the festival's history.","We designed and built Mapping Glastonbury, an interactive web app with five 3D maps of the festival site across the decades. Visitors fly over the fields, move through the years and open memories, sounds, visions and locations pinned to the landscape, including stories sent in by festival goers themselves.","Built with Three.js and Nuxt, the maps link to more than 500 archive items, and the app is still live on the V&A website."],"numbers":[["5","3D maps of the festival"],["500+","archive items"]],"carousel":["va_1","va_2","va_3","va_4"]},{"id":"drscholls","client":"Dr Scholl's","title":"Marketing across social and ecommerce","tags":["Social Media","Ecommerce","Visual Identity","Influencer"],"img":"img/drscholls.webp","video":{"src":"vid/drscholls.mp4","poster":"vid/drscholls.webp","portrait":true},"text":["Part of the job was carrying the brand through its global change of name from Scholl to Dr. Scholl's, refreshing packaging and website messaging so customers knew it was the same trusted product. We also built a proper Amazon presence from the ground up, with Brand Registry in every EU market, a dedicated Brand Store in each one and listings optimised for both Amazon search and Google.","On top of that we ran influencer campaigns across six markets. The partnership started in 2022 and its scope has grown every year since."],"numbers":[["£2.7m+","sales increase"],["120m","impressions"],["4x","return on ad spend"]],"quote":["Freak always show agility and adaptation to your strategy. They are a game changer for content.","Global eComm Director"],"carousel":["drscholls_2","drscholls_3","drscholls_4"],"challenge":"Dr. Scholl's needed one partner to run its marketing across social, ecommerce and creative strategy, for a range that goes from everyday comfort insoles to specialist pain relief. The creative has to speak to runners, to people on their feet all day at work and to everyone in between, while every piece stays unmistakably Dr. Scholl's."},{"id":"feliway","client":"Feliway","title":"Amazon content that doubled sales","tags":["Ecommerce","Amazon","Design","Copywriting","Localisation"],"img":"img/feliway.webp","text":["Feliway's diffusers help cats feel calm at home. We were asked to grow the brand's sales on Amazon, where the listings needed to work harder in search and explain the product far more clearly.","We researched what cat owners actually search for and built a content toolkit around Amazon's search algorithm, then rewrote every product page with clearer headlines and tighter bullet points. New A+ and B+ content, the enhanced modules on an Amazon product page, explains the science simply, compares Feliway with the alternatives and shows set up in three steps.","We localised the content for other markets, including a French Brand Store, and added a new brand story to Amazon UK. Monthly sales doubled."],"numbers":[["2x","monthly sales"],["+30%","ordered revenue"],["8,000","units a month"]],"carousel":["feliway_atf1","feliway_atf2","feliway_atf3","feliway_btf1","feliway_btf2"]},{"id":"macmillan","client":"Macmillan Cancer Support","title":"Check Your Balls","tags":["Social Media","Copywriting","Real time"],"img":"img/macmillan.webp","video":{"src":"vid/macmillan.mp4","poster":"vid/macmillan.webp"},"text":["Macmillan Cancer Support wanted more men talking about testicular cancer and checking themselves for it. The brief was short. Encourage men to check their balls.","We timed it to Wimbledon. With the tournament as a real time hook, we made six pieces of lighthearted social content, from tennis balls on court to people on the street holding up the balls they'd checked. We took it from brief to delivery in ten days on a £1,000 promotion budget.","The posts averaged a 28% engagement rate, passed 1.2m views and won the Drum Award for Content Marketing."],"numbers":[["1.2m","views"],["28%","average engagement rate"],["2","industry awards"]],"quote":["Freak turned a simple insight into an incredibly impactful creative idea. They then implemented this within a very limited budget and delivered a campaign that punched well above its weight, as the awards show.","Alex Betti, Macmillan Cancer Support"],"carousel":["macmillan_1","macmillan_2","macmillan_3","macmillan_4"]},{"id":"evermix","client":"Evermix","title":"Making Sound Resound","tags":["Rebrand","Visual Identity","Social Media","Motion Design"],"img":"img/evermix.webp","video":{"src":"vid/evermix.mp4","poster":"vid/evermix.webp"},"text":["Evermix makes portable audio kit for artists, DJs and performers. It needed a brand as loud as the scene it sells into.","We started with a full brand audit, then rebuilt the identity with a new type system, a high energy palette and motion and social guidelines built around the feel of nightlife and music, carried by the line Making Sound Resound.","Since the refresh we've run Evermix's social month to month, from behind the scenes studio sessions to creator campaigns, alongside its ecommerce content and website. Reach across its socials is up five times."],"numbers":[["5x","reach across socials"],["387%","follower growth"],["23k","followers"]],"quote":["Freak understood our brand from day one. Rather than changing who we are, they elevated what already made Evermix special. They're creative, commercially minded and a genuinely great team to work with.","Macky Drese, Co-Founder and CEO, Evermix"],"carousel":["evermix_1","evermix_2","evermix_3","evermix_4","evermix_5"]},{"id":"astus","client":"Astus","title":"Advertising, amplified","tags":["Rebrand","Visual Identity","Website","Social Templates","Motion Graphics"],"img":"img/astus.webp","video":{"src":"vid/astus.mp4","poster":"vid/astus.webp"},"text":["Astus needed a sharper, bolder brand that matched its ambition and stood out in a crowded advertising and media market. We started with one workshop question. Who is Astus? The answer was a message that needed simplifying.","We led a full rebrand, from a new logo and colour system to a complete set of brand guidelines, flexible enough to work everywhere from business cards to shipping containers. The result is a bold system built around a punchy palette and a mark with the same energy as the brand's own pitch of advertising, amplified.","We carried the identity through a full website build, a library of social templates and a 60 second explainer film, so Astus could launch the rebrand on every channel at once."],"carousel":["astus_car1","astus_car2","astus_car3","astus_cap"]},{"id":"gnetwork","client":"G.Network","title":"The Fibre of London","tags":["Social Media","Paid Social","Lead Generation","Out of Home"],"img":"img/gnetwork.webp","text":["G.Network is building full fibre broadband street by street across London, so its marketing has to feel local to each neighbourhood it reaches.","We built the social strategy and creative around those neighbourhoods. We champion local businesses on G.Network's channels, run competitions and giveaways and celebrate milestones such as its place in The Sunday Times 100 Tech. Alongside that we produce monthly campaigns across paid social, out of home and direct mail.","Location targeted lead campaigns have brought in 2,322 leads at 43p each."],"numbers":[["2,322","leads"],["£0.43","cost per lead"]],"carousel":["gnet_sq1","gnet_sq2","gnet_sq3","gnet_mockups"]},{"id":"nyb","client":"New York Bakery","title":"Channel 4 idents and Philly Deli","tags":["Film Production","Creative Direction","Motion Graphics","Social Media"],"img":"img/nyb.webp","video":{"src":"vid/nyb.mp4","poster":"vid/nyb.webp","portrait":true},"text":["New York Bakery came to us for a TV sponsorship package of three Channel 4 idents, and then for the campaign world behind Philly Deli, its bagel partnership with Philadelphia.","The idents had under a month of planning and a single day to shoot all three. We ran casting, creative direction, pre production, filming and post ourselves, with no handoffs. They reached 50m people, and New York Bakery has since come back to run another TV sponsorship.","For Philly Deli we created the campaign's visual world and carried it into recipe films and motion graphics for social and designs for out of home and in store. We also led creative direction for the website."],"numbers":[["1","month to prepare"],["3","films shot in one day"],["50m","people reached"]],"carousel":["nyb_ooh","nyb_cafe","nyb_web","nyb_window"]},{"id":"yutaka","client":"Yutaka","title":"Make Mealtimes Blossom","tags":["Illustration","Out of Home","Motion Graphics","Artworking"],"img":"img/yutaka.webp","video":{"src":"vid/yutaka.mp4","poster":"vid/yutaka.webp","portrait":true},"text":["We brought Yutaka's Japanese heritage to life across London, wrapping Tube escalators and bus shelters in seasonal illustration built around the brand's Make Mealtimes Blossom platform. Soft landscapes, cherry blossom and hand painted detail turned everyday commuter spaces into a moment of calm.","Each execution was made for its site, from full height escalator panels at Tottenham Court Road to bus shelter posters, so the artwork felt considered rather than resized. Bold Yutaka red kept the brand unmistakable against the softness of the watercolour.","The same world carried into social banners, Instagram and in store ads for Tesco, translated into motion for feed and story formats. Yutaka told one seasonal story from the street to the scroll, and came in 25% under its media budget."],"numbers":[["20m","views"],["2m","views for one organic ad"],["25%","under media budget"]],"quote":["Freak is a valued extension of the Yutaka team, demonstrating passion and ownership for our brand.","Na Wang, Head of Marketing, Yutaka"],"carousel":["yutaka_live_escalator","yutaka_live_leicester_sq","yutaka_live_ceiling","yutaka_live_run","yutaka_mk_platform","yutaka_mk_street","yutaka_mk_busstop","yutaka_mk_night","yutaka_mk_phone","yutaka_art_seasonal","yutaka_mockup","yutaka_hand"],"challenge":"Yutaka wanted consumers to discover its Japanese heritage, with one seasonal story that carried from their commute to the supermarket shelf and their social feeds."}];
const PAGES = {"":{"title":"Freak | Independent creative, data and AI agency","desc":"Freak is an independent creative, data and AI agency. Head office in London, with global hubs in Barcelona and Abu Dhabi."},"work":{"title":"Work | Freak","desc":"Campaigns, ecommerce, film and interactive work for clients across food, health, culture and tech, from Freak."},"capabilities":{"title":"Full service creative and marketing agency | Freak","desc":"Full service creative, data and AI under one roof. Amazon, content and live production, influencer campaigns and our own AI tools, from Freak in London, Barcelona and Abu Dhabi."},"about":{"title":"About | Freak","desc":"A multidisciplinary agency for bold brands with stories worth telling. Meet Freak, with a head office in London and hubs in Barcelona and Abu Dhabi."},"contact":{"title":"Contact | Freak","desc":"Talk to Freak about a new project. Email sales@wearefreak.com or visit the studio at 22 Ash Ave, London SE17 1HS."},"terms":{"title":"Terms of use | Freak","desc":"The terms that apply to using wearefreak.com."},"privacy":{"title":"Privacy policy | Freak","desc":"How Freak collects and uses personal information and what your rights are."},"cookies":{"title":"Cookie policy | Freak","desc":"How wearefreak.com uses cookies and what it stores on your device."},"work-hoover":{"title":"From live shoot to listing | Hoover case study | Freak","desc":"Hoover needed new photography and film for 15 of its vacuum cleaners, from cordless sticks and uprights to cylinders, a robot and a wet and dry floor washer."},"work-rnib":{"title":"A learning portal for sight loss awareness | RNIB case study | Freak","desc":"RNIB wanted the public and its corporate partners to understand sight loss and know what to do differently."},"work-hovis":{"title":"Strength Baked In | Hovis case study | Freak","desc":"Hovis is a much loved British brand with a rich heritage and a loyal following."},"work-va":{"title":"Mapping Glastonbury | V&A case study | Freak","desc":"The V&A wanted to open up its Glastonbury Festival archive to everyone, from posters and photographs to interviews and recordings gathered across the…"},"work-drscholls":{"title":"Marketing across social and ecommerce | Dr Scholl's case study | Freak","desc":"Dr."},"work-feliway":{"title":"Amazon content that doubled sales | Feliway case study | Freak","desc":"Feliway's diffusers help cats feel calm at home."},"work-macmillan":{"title":"Check Your Balls | Macmillan Cancer Support case study | Freak","desc":"Macmillan Cancer Support wanted more men talking about testicular cancer and checking themselves for it. The brief was short."},"work-evermix":{"title":"Making Sound Resound | Evermix case study | Freak","desc":"Evermix makes portable audio kit for artists, DJs and performers. It needed a brand as loud as the scene it sells into."},"work-astus":{"title":"Advertising, amplified | Astus case study | Freak","desc":"Astus needed a sharper, bolder brand that matched its ambition and stood out in a crowded advertising and media market. We started with one workshop question."},"work-gnetwork":{"title":"The Fibre of London | G.Network case study | Freak","desc":"G.Network is building full fibre broadband street by street across London, so its marketing has to feel local to each neighbourhood it reaches."},"work-nyb":{"title":"Channel 4 idents and Philly Deli | New York Bakery case study | Freak","desc":"New York Bakery came to us for a TV sponsorship package of three Channel 4 idents, and then for the campaign world behind Philly Deli, its bagel partnership…"},"work-yutaka":{"title":"Make Mealtimes Blossom | Yutaka case study | Freak","desc":"Yutaka wanted consumers to discover its Japanese heritage, with one seasonal story that carried from their commute to the supermarket shelf and their social…"},"ai":{"title":"AI marketing agency | Freak Lab AI tools | Freak","desc":"Freak Lab is our everytool AI kit for marketing. Image analysis from our neural marketing framework, Amazon copy and review moderation, built on paid data.","page":1},"resources":{"title":"Resource Centre | Guides on Amazon, AI and content | Freak","desc":"Guides, white papers and behind the scenes stories from Freak on Amazon, AI tools, ecommerce content, creators and the advertising rules brands work within.","page":1},"capabilities/abu-dhabi":{"title":"Creative and advertising agency in Abu Dhabi | Freak","desc":"Freak's Abu Dhabi hub brings campaigns, content, ecommerce and AI tools to brands across the MENA and APAC regions, backed by our global team of experts.","page":1},"capabilities/amazon-agency":{"title":"Amazon agency | Account management, PPC and DSP | Freak","desc":"Freak is a full service Amazon agency. Account setup, terms negotiation, catalogue management, A+ content, Brand Stores and advertising including Amazon DSP.","page":1},"capabilities/content-production":{"title":"Content creation agency and global transcreation | Freak","desc":"Content creation agency and global transcreation partner. UGC, social media and video, localised for 100+ countries a year by our native speaking creatives.","page":1},"capabilities/influencer-marketing":{"title":"Influencer marketing agency | Seeding and gifting | Freak","desc":"Influencer campaigns, creator seeding and gifting across Europe, North America and Australia. Vetted creators, clear contracts and #ad compliance.","page":1},"capabilities/live-production":{"title":"Video production and ecommerce photography in London | Freak","desc":"Videography and photography for campaigns, social and ecommerce. Casting, locations, crews, our own London studio and post production, all in house.","page":1},"resources/ai-brand-value-risk":{"title":"AI in marketing | Brand value is the biggest risk | Freak","desc":"Brands count AI's cost savings and miss its effect on revenue. What Freak's impact assessments found, the rules now in force and six steps to use AI safely.","page":1},"resources/amazon-a-plus-content-guide":{"title":"Amazon A+ content guide, with the Feliway example | Freak","desc":"How to plan Amazon A+ content and the image stack above it, from information hierarchy to testing, with the changes that doubled Feliway's sales.","page":1},"resources/amazon-alexa-for-shopping":{"title":"Alexa for Shopping and AI shopping assistants | Freak","desc":"Amazon replaced Rufus with Alexa for Shopping in May 2026. AI assistants answer with a few picks, not pages of results. What it means and how to adapt listings.","page":1},"resources/amazon-image-visual-engagement-framework":{"title":"Scoring Amazon images with eye tracking AI | Freak","desc":"Shoppers decide in seconds. Freak's neural marketing framework scores Amazon images on five measures, from visual saliency to colour, and shows how to fix them.","page":1},"resources/amazon-listing-copy":{"title":"Amazon listing copy written from evidence | Freak","desc":"How we write Amazon titles, bullets and descriptions from reviews, search and question data and approved claims, with the Feliway and Douxo examples.","page":1},"resources/amazon-review-moderation":{"title":"Amazon review moderation | Protect your star rating | Freak","desc":"Four star ratings drive Amazon sales and one early review can sink a launch. How Freak finds and reports reviews that break Amazon's guidelines.","page":1},"resources/creator-seeding-process":{"title":"Creator seeding and gifting process | Freak","desc":"Sending product to creators is easy. Getting posts back is the job. The nine stages, vetting checks and two tiers we use to run seeding and gifting.","page":1},"resources/ecommerce-product-shoot-planning":{"title":"Planning an ecommerce product shoot | Freak","desc":"How to plan one product shoot for Amazon, retailers and social. The shot matrix, location, casting and product tests behind Freak's Hoover shoot.","page":1},"resources/hfss-advertising-rules-2026":{"title":"HFSS advertising rules in 2026, explained | Freak","desc":"The UK's less healthy food ad rules have applied since 5th Jan 2026. What's banned on TV and online, what's exempt and how food brands are adapting.","page":1},"resources/making-mapping-glastonbury":{"title":"The making of Mapping Glastonbury for the V&A | Freak","desc":"How Freak built Mapping Glastonbury for the V&A, five 3D maps of the festival that link to more than 500 archive items, running in the browser on any phone.","page":1},"resources/neuromarketing-ai-image-analysis":{"title":"Neuromarketing and AI image analysis | How we weight the score | Freak","desc":"The eye tracking research behind our AI image analysis, our path since building VR eye tracking in 2019 and the rule we use to weight the score by where an image is seen.","page":1},"resources/product-content-ai-shopping-agents":{"title":"Product content for AI shopping agents | Freak","desc":"AI shopping agents compare what Amazon, retailers and brand sites say about a product. How to give them one claims checked product story, in every market.","page":1},"resources/reddit-seo-ai-search":{"title":"Reddit SEO and AI search in 2026 | What still works | Freak","desc":"Reddit, Google and ChatGPT all moved against brand seeding this summer. What changed, why planted posts stopped working and what still earns a mention.","page":1},"resources/ugc-for-amazon-and-social":{"title":"UGC for Amazon and social media | Freak","desc":"How to brief, cast and cut UGC that works on TikTok, Reels and Amazon product pages, with usage rights agreed first and versions for organic and paid.","page":1}};

/* ---------------- 3D world ---------------- */
const F_SHAPE = {"stem":[[0.7622,2.0],[-0.8026,2.0],[-0.8026,1.9885],[-0.7565,1.9856],[-0.7075,1.9712],[-0.6643,1.9395],[-0.6412,1.9078],[-0.621,1.8559],[-0.6066,1.7579],[-0.6066,0.2536],[-0.621,0.1556],[-0.6412,0.1037],[-0.6671,0.072],[-0.6095,0.1239],[-0.5403,0.2075],[-0.2032,0.7176],[-0.2032,1.9597],[0.2695,1.9625],[0.3761,1.9481],[0.4539,1.9251],[0.5432,1.8761],[0.6326,1.7925],[0.719,1.6715],[0.7882,1.5418],[0.8026,1.5418]],"chevron":[[-0.2003,1.9597],[-0.2003,1.3026],[-0.1138,1.1671],[-0.0245,1.0173],[-0.0187,1.0],[-0.3559,0.4755],[-0.5346,0.2104],[-0.5951,0.1354],[-0.6441,0.0865],[-0.7133,0.0403],[-0.7104,0.0144],[-0.4827,0.0],[-0.3588,0.0086],[-0.2406,0.0403],[-0.1715,0.0749],[-0.1311,0.1037],[-0.0735,0.1614],[-0.0245,0.2277],[0.0187,0.3026],[0.4712,1.0],[-0.0389,1.8127],[-0.0793,1.8646],[-0.1282,1.9135]]};
/* ---------------- addresses ----------------
   Every page has a real address (/work, /work/hoover, /capabilities ...). Moving between them never
   reloads: the address bar changes and the app opens the page in place. Links shared before used #work-hoover. */
const SITE_URL = 'https://www.wearefreak.com';
const SHEETS = ['capabilities', 'contact', 'about', 'terms', 'privacy', 'cookies'];
// content pages (capability specialisms, AI, the Resource Centre) share one sheet and load their body on demand
const PAGE_NAMES = Object.keys(PAGES).filter(k => PAGES[k].page);
const isPage = h => PAGE_NAMES.includes(h);
const stopOf = h => h.split('/')[0];   // capabilities/amazon-agency belongs to the Capabilities card and world
function pathOf(name) { return !name ? '/' : name.startsWith('work-') ? '/work/' + name.slice(5) : '/' + name; }
function routeOfPath(p) {
  try { p = decodeURIComponent(p); } catch (e) {}
  p = p.replace(/\/+$/, '').replace(/\.html$/, '').replace(/\/index$/, '');
  if (!p) return '';
  const m = p.match(/^\/work\/([\w-]+)$/);
  return m ? 'work-' + m[1] : p.slice(1);
}
function currentRoute() { return routeOfPath(location.pathname); }
function plainClick(e) { return e.button === 0 && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey); }
(() => {   // an old #work-hoover link: move to /work/hoover before anything reads the address
  const h = location.hash.replace('#', '');
  if (h && /^[\w-]+$/.test(h)) { try { history.replaceState(null, '', pathOf(h)); } catch (e) {} }
})();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('world');
const still = document.getElementById('still');
const note = document.getElementById('loadingNote');
let renderer, scene, camera, skybox, fGroup, panoTex;
let gl = true;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) { gl = false; }
if (!gl || !renderer.getContext()) { gl = false; document.documentElement.classList.add('no-gl'); note.textContent = ''; }

let angle = STOPS[0].deg, target = STOPS[0].deg, velocity = 0;   // degrees from Ken's hero view
/* The world turns to its card on a critically damped spring: it keeps the speed a swipe or flick
   left it with and settles on the card without passing it. rate sets how quickly (higher is snappier). */
const SPIN = { rate: 8.5 };
let spin = 0, sway = 1;   // spin: degrees a second. sway: how much of the idle drift is showing
let stopIndex = 0;
const clock = new THREE.Clock();
let paused = false;

function fit() {
  const w = innerWidth, h = innerHeight;
  if (!gl) return;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // On narrower desktop screens, slide the picture right so the F clears the card on the left.
  const shift = w > h ? Math.min(Math.max(0, 660 - w / 2), w * 0.2) : 0;
  if (shift) camera.setViewOffset(w, h, -shift, 0, w, h); else camera.clearViewOffset();
  camera.updateProjectionMatrix();
  for (const k in WORLDS) WORLDS[k].resize?.(w, h);
}

const BASE = 0;       // degrees: 0 is Ken's hero view, looking at the F's front with the sun behind it

/* Intro shot: on first load the camera starts high, wide and swung round, then sweeps down
   to the Work card's view. Skipped for reduced motion and for deep links straight to a page. */
const INTRO = { dur: 5.0, swing: 150, radius: 14, height: 3.2, look: 3.4 };   // circles 150° from behind the F and cranes down into the sun
INTRO.start = Math.cbrt(0.25 / 4);   // skip the first 25% of that move: start mid-flight, already travelling (about 3s left)
let introP = 1, introStart = -1, introSpeed = 1, revealed = false;
const easeInOut = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const lerp = THREE.MathUtils.lerp;
function revealUI() {
  if (revealed) return;
  revealed = true;
  const root = document.documentElement;
  root.classList.add('revealing');
  root.classList.remove('intro');
  setTimeout(() => setTitle(document.getElementById('cardTitle'), STOPS[stopIndex].title), 420);   // letters rise as the card arrives
  setTimeout(() => root.classList.remove('revealing'), 1600);
}

const CAM = { radius: 6.6, height: 0.9, look: 1.45, lookPhone: 0.6 };

/* Cursor tilt: the camera leans a couple of degrees towards the pointer, slowly, on mouse and
   trackpad only. Small on purpose so it reads as depth, not motion. */
const TILT = { yaw: 2.4, lift: 0.14, ease: 2.2 };
const tilt = { x: 0, y: 0, gx: 0, gy: 0 };
const fineHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
if (fineHover && !reduced) {
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    tilt.gx = (e.clientX / innerWidth) * 2 - 1;
    tilt.gy = (e.clientY / innerHeight) * 2 - 1;
  });
  document.documentElement.addEventListener('pointerleave', () => { tilt.gx = 0; tilt.gy = 0; });
  addEventListener('blur', () => { tilt.gx = 0; tilt.gy = 0; });
}   // slightly low angle, so the sky and sun sit behind the F
function placeCamera(t) {
  const a = camera.aspect, C = activeCam(), yaw = WORLD_YAW[worldKey] || 0;
  const radius = a < 1 ? C.radius / Math.max(a, 0.48) * 0.62 : C.radius;
  const look = a < 1 ? (C.lookPhone ?? C.look) : C.look;
  const k = easeInOut(introP);
  const drift = reduced ? 0 : Math.sin(t * 0.22) * 1.2 * k * sway;   // slow idle sway so the world feels alive, eased out while it's being turned
  const swing = (1 - k) * INTRO.swing;
  const r = lerp(INTRO.radius * (a < 1 ? 1.35 : 1), radius, k);
  const tk = k * (1 - (diveHit ? easeIn(diveP) : 0));   // tilt fades out during the intro and the dive
  const phi = Math.PI + THREE.MathUtils.degToRad(BASE + angle - yaw + drift + swing + tilt.x * TILT.yaw * tk);
  camera.position.set(Math.cos(phi) * r, lerp(INTRO.height, C.height, k) - tilt.y * TILT.lift * tk, Math.sin(phi) * r);
  lookAt.set(0, lerp(INTRO.look, look, k), 0);
  if (diveP > 0 && diveHit) {
    const f = easeIn(diveP);
    camera.position.lerp(diveHit.end, f);
    lookAt.lerp(diveHit.point, Math.min(1, f * 1.6));
  }
  const fov = lerp(38, 30, diveHit ? easeIn(diveP) : 0);
  if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
  camera.lookAt(lookAt);
}

/* Dive-in: opening a page from the world pushes the camera into the F's chrome while the page
   rises over it; closing pulls back out to the card's view. */
const DIVE = { inDur: 0.95, outDur: 1.3, openAfter: 480 };   // ms into the dive when the page starts rising
let diveP = 0, diveTo = 0, diveHit = null;
const lookAt = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
const easeIn = x => x * x * x;
const canDive = () => gl && fGroup && !reduced && revealed;
function aimDive() {
  // Fly at the widest flat part of the F, the middle of the stem, so the chrome fills the screen.
  const tries = [[0.95, -0.52], [1.15, -0.5], [0.75, -0.52], [1.35, -0.48], [0.95, 0.1]];
  for (const [y, z] of tries) {
    const dir = new THREE.Vector3(LOGO.x, y, z).sub(camera.position).normalize();
    raycaster.set(camera.position, dir); raycaster.camera = camera;   // sprites (the orbit's lights) need the camera
    const hit = raycaster.intersectObject(diveTarget(), true)[0];
    if (hit) return { point: hit.point.clone(), end: hit.point.clone().addScaledVector(dir, -0.13) };
  }
  const p = new THREE.Vector3(0, 1.1, 0), dir = p.clone().sub(camera.position).normalize();   // nothing solid to hit: fly into the middle
  return { point: p, end: p.clone().addScaledVector(dir, -0.35) };
}
function startDive() {
  diveP = 0; placeCamera(clock.elapsedTime);    // aim from the card's resting view
  diveHit = aimDive(); diveTo = 1;
  document.documentElement.classList.add('diving');
  Sound.whoosh(1); Sound.duck(true);
}
function startSurface() {
  if (!canDive()) { diveP = 0; diveHit = null; document.documentElement.classList.remove('diving'); return; }
  if (!diveHit || diveP === 0) { diveP = 0; placeCamera(clock.elapsedTime); diveHit = aimDive(); diveP = diveHit ? 1 : 0; }
  diveTo = 0;
  Sound.whoosh(-1);
  setTimeout(() => { if (!openSheet) document.documentElement.classList.remove('diving'); }, 650);
}

function buildF() {
  const g = new THREE.Group();
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xf4f2ee, metalness: 1, roughness: 0.07, envMapIntensity: 1.35 });
  const lime = new THREE.MeshPhysicalMaterial({ color: 0xa6f20a, metalness: 0.15, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.05, emissive: 0x3d6600, envMapIntensity: 1.0 });
  const opts = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.032, bevelSegments: 2, curveSegments: 16 };
  for (const [key, mat] of [['stem', chrome], ['chevron', lime]]) {
    const shape = new THREE.Shape(F_SHAPE[key].map(([x, y]) => new THREE.Vector2(x, y)));
    const geo = new THREE.ExtrudeGeometry(shape, opts);
    geo.translate(0, 0, -0.15);
    geo.computeVertexNormals();
    addGlint(mat);
    g.add(new THREE.Mesh(geo, mat));
  }
  // Fixed pose: this is where the F stands in Ken's render, so it lines up with the baked shadow.
  g.rotation.y = -Math.PI / 2;   // front faces -X, the sun is behind it at +X
  g.position.set(-0.1, 0, 0);
  return g;
}

/* Ken's logo (logoENV.glb, stripped to the three logo meshes). All chrome, so its look comes
   entirely from the panorama, which is used as the environment map below.
   Pose and scale were fitted to the shadow baked into the panorama: the F stands at the origin,
   front facing -X with the sun behind it, 1.91 units tall when the projection height is 1.4. */
// The .glb is shipped as base64 text (img/freak-logo.txt) because the prototype host only serves web file types.
const LOGO = { url: 'img/freak-logo.txt', scale: 3.416, minY: -0.0476, x: -0.056, z: -0.056 };
async function loadLogo() {
  const b64 = (await (await fetch(LOGO.url)).text()).trim();
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const gltf = await new GLTFLoader().parseAsync(bytes.buffer, '');
  const logo = gltf.scene;
  logo.scale.setScalar(LOGO.scale);
  logo.position.y = -LOGO.minY * LOGO.scale;   // sit the lowest point on the ground
  logo.traverse(o => {
    if (o.isMesh) { o.material.envMapIntensity = 1.15; o.material.roughness = 0.06; o.material.metalness = 1; addGlint(o.material); }
  });
  const g = new THREE.Group();
  g.add(logo);
  g.rotation.y = -Math.PI / 2;
  g.position.set(LOGO.x, 0, LOGO.z);
  return g;
}

/* Heat haze: a faint, rising shimmer on the far desert just below the horizon. It bends the
   panorama lookup inside the skybox shader, so the F in front stays crisp and it costs almost nothing. */
const HAZE = { strength: 0.0013 };
function addHeatHaze(m) {
  m.uniforms.uTime = { value: 0 };
  m.uniforms.uHaze = { value: reduced ? 0 : HAZE.strength };
  m.fragmentShader = m.fragmentShader
    .replace('uniform float radius;', 'uniform float radius;\nuniform float uTime;\nuniform float uHaze;')
    .replace('vec2 uv = equirectUv( direction );', `
      // strongest on the distant ground, fading out above the horizon and towards the foreground
      float el = direction.y;
      float w = smoothstep( -0.085, -0.02, el ) * ( 1.0 - smoothstep( -0.004, 0.022, el ) );
      float az = atan( direction.z, direction.x );
      float rise = el * 460.0 - uTime * 2.2;                 // ripples drift upwards
      float n = sin( az * 240.0 + sin( rise ) * 1.2 + uTime * 0.6 ) * 0.6
              + sin( az * 410.0 - rise * 0.9 + uTime * 0.4 ) * 0.4;
      direction.y += n * w * uHaze;
      direction.x += sin( rise * 0.6 + az * 170.0 ) * w * uHaze * 0.3;
      direction = normalize( direction );
      vec2 uv = equirectUv( direction );`);
  m.needsUpdate = true;
}

/* Sun glint: a warm band of light slides diagonally across the chrome whenever the camera turns
   to a new card, once when the intro lands, and now and then while the visitor lingers.
   It is strongest on the edges and bevels, where real chrome catches the sun. */
const GLINT = { dur: 1.3, idle: 16, width: 0.08, amp: 0.9 };
const glintU = { p: { value: -1 }, from: { value: -0.9 }, to: { value: 1.8 }, amp: { value: GLINT.amp } };
let glintT = -1, glintIdle = 0;
function addGlint(m) {
  m.onBeforeCompile = shader => {
    shader.uniforms.uGlintP = glintU.p; shader.uniforms.uGlintFrom = glintU.from;
    shader.uniforms.uGlintTo = glintU.to; shader.uniforms.uGlintAmp = glintU.amp;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGlintPos;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvGlintPos = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGlintPos;\nuniform float uGlintP, uGlintFrom, uGlintTo, uGlintAmp;')
      .replace('#include <opaque_fragment>', `
        if ( uGlintP >= 0.0 ) {
          float s = dot( vGlintPos, normalize( vec3( 0.0, 0.6, 1.0 ) ) );   // diagonal across the F's face
          float c = mix( uGlintFrom, uGlintTo, uGlintP );
          float d = ( s - c ) / ${GLINT.width.toFixed(3)};
          float band = exp( - d * d ) * 0.4 + exp( - d * d * 14.0 ) * 0.5;    // soft glow with a slightly brighter core
          float edge = 1.0 - abs( dot( normalize( normal ), normalize( vViewPosition ) ) );
          float env = sin( 3.14159 * uGlintP );
          outgoingLight += vec3( 1.0, 0.94, 0.84 ) * band * ( 0.35 + 0.65 * edge ) * env * uGlintAmp;
        }
        #include <opaque_fragment>`);
  };
  m.needsUpdate = true;
}
function glint(dir = 1) {
  if (reduced || !fGroup) return;
  glintU.from.value = dir > 0 ? -0.9 : 1.8;
  glintU.to.value = dir > 0 ? 1.8 : -0.9;
  glintT = 0; glintIdle = 0;
}

/* Dust: warm motes drifting on the breeze around the F. They sparkle when you look towards the sun,
   the ones right by the camera blur into soft bokeh, and on desktop a gentle force field around the
   cursor pushes them aside, harder when the mouse moves quickly. All of it runs in the shader. */
const DUST = { count: matchMedia('(max-width: 720px)').matches ? 720 : 1760, box: 10, top: 4.2, size: 0.024, radius: 1.1 };
const dustU = {
  uTime: { value: 0 }, uPush: { value: 0 }, uRadius: { value: DUST.radius }, uFocal: { value: 1000 },
  uRayO: { value: new THREE.Vector3() }, uRayD: { value: new THREE.Vector3(0, 0, -1) },
  uSun: { value: new THREE.Vector3(0.89, 0.45, 0.02).normalize() },
};
const dustPointer = { ndc: new THREE.Vector2(), over: false, speed: 0, lastX: 0, lastY: 0, lastT: 0 };
let dust = null;
function addDust() {
  const n = DUST.count, pos = new Float32Array(n * 3), seed = new Float32Array(n), scale = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() * 2 - 1) * DUST.box;
    pos[i * 3 + 1] = 0.05 + Math.pow(Math.random(), 1.6) * DUST.top;   // denser near the ground
    pos[i * 3 + 2] = (Math.random() * 2 - 1) * DUST.box;
    seed[i] = Math.random();
    scale[i] = 0.5 + Math.pow(Math.random(), 2.5) * 2.2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
  const B = DUST.box.toFixed(1), B2 = (DUST.box * 2).toFixed(1), BF = (DUST.box - 3).toFixed(1);
  const mat = new THREE.ShaderMaterial({
    uniforms: dustU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime, uPush, uRadius, uFocal;
      uniform vec3 uRayO, uRayD, uSun;
      attribute float aSeed, aScale;
      varying float vAlpha, vGlint, vBlur;
      void main() {
        vec3 p = position;
        float tw = 0.5 + 0.5 * sin(uTime * (0.5 + aSeed * 1.6) + aSeed * 40.0);   // tumbling motes catch the light
        tw = 0.3 + 0.7 * tw * tw;
        float t = uTime * 0.15 + aSeed * 50.0;
        p.x = mod(p.x + uTime * 0.07 * (0.4 + aSeed) + ${B}, ${B2}) - ${B};   // breeze, wrapping round
        p.y += sin(t * 1.3) * 0.14 + sin(t * 0.37) * 0.08;
        p.z += cos(t * 0.8 + aSeed * 3.0) * 0.28;
        // cursor: push motes away from the line under the pointer, with a slight swirl
        vec3 toP = p - uRayO;
        float along = dot(toP, uRayD);
        vec3 off = toP - uRayD * along;
        float d = length(off);
        float f = uPush * (1.0 - smoothstep(0.0, uRadius, d)) * step(0.0, along);
        vec3 dir = d > 0.0001 ? off / d : vec3(0.0, 1.0, 0.0);
        p += dir * f * 0.85 + cross(uRayD, dir) * f * 0.4;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float dist = -mv.z;
        float blur = 1.0 - smoothstep(0.7, 2.6, dist);            // close to the lens: out of focus
        gl_PointSize = clamp(${DUST.size} * aScale * uFocal / dist * (1.0 + blur * 1.8), 1.5, 80.0);
        vBlur = blur;
        vGlint = pow(max(dot(normalize(p - cameraPosition), uSun), 0.0), 5.0);   // backlit by the sun
        vAlpha = smoothstep(0.35, 1.1, dist) * (1.0 - smoothstep(15.0, 24.0, dist))
               * (1.0 - smoothstep(${BF}, ${B}, length(p.xz)))
               * (0.2 + 0.8 * aSeed * aSeed) * tw * (1.0 + f * 0.6) * mix(1.0, 0.08, blur);
      }`,
    fragmentShader: `
      varying float vAlpha, vGlint, vBlur;
      void main() {
        float r = length(gl_PointCoord - 0.5) * 2.0;
        float dot_ = 1.0 - smoothstep(0.3, 1.0, r); dot_ *= dot_;
        float disc = (1.0 - smoothstep(0.5, 1.0, r)) * (0.75 + 0.25 * smoothstep(0.3, 0.8, r));   // bokeh, faint rim
        float a = mix(dot_, disc, vBlur);
        vec3 col = mix(vec3(1.0, 0.84, 0.64), vec3(1.0, 0.95, 0.85), vGlint);
        gl_FragColor = vec4(col * (0.6 + vGlint * 1.5), a * vAlpha * (0.65 + vGlint * 0.9));
      }`,
  });
  dust = new THREE.Points(geo, mat);
  dust.frustumCulled = false;
  scene.add(dust);
}
if (fineHover && !reduced) {
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    dustPointer.over = e.target === canvas;
    dustPointer.ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    const now = performance.now(), dt = Math.max(now - dustPointer.lastT, 8);
    const v = Math.hypot(e.clientX - dustPointer.lastX, e.clientY - dustPointer.lastY) / dt;   // px per ms
    dustPointer.speed = Math.max(dustPointer.speed, Math.min(1, v / 2.2));
    if (dustPointer.over && dustPointer.speed > 0.25 && revealed) { try { Sound.spark(dustPointer.speed); } catch (e) {} }
    dustPointer.lastX = e.clientX; dustPointer.lastY = e.clientY; dustPointer.lastT = now;
  });
  document.documentElement.addEventListener('pointerleave', () => { dustPointer.over = false; });
}
const dustRay = new THREE.Raycaster();
function updateDust(t, dt) {
  if (!dust) return;
  dustU.uTime.value = reduced ? 0 : t;
  dustU.uFocal.value = renderer.domElement.height * 0.5 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  // a gentle bubble follows the cursor; quick movements push harder, then it settles
  const goal = dustPointer.over && revealed && !dragging ? 0.45 + dustPointer.speed * 0.75 : 0;
  dustU.uPush.value += (goal - dustU.uPush.value) * (1 - Math.exp(-dt * 6));
  dustPointer.speed *= Math.exp(-dt * 2.5);
  if (dustU.uPush.value > 0.001) {
    dustRay.setFromCamera(dustPointer.ndc, camera);
    dustU.uRayO.value.copy(dustRay.ray.origin); dustU.uRayD.value.copy(dustRay.ray.direction);
  }
}

function loadTexture(url) {
  return new Promise((res, rej) => new THREE.TextureLoader().load(url, t => {
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.colorSpace = THREE.SRGBColorSpace;
    t.generateMipmaps = false;           // mipmaps leave a dashed seam where the panorama wraps
    t.minFilter = THREE.LinearFilter;
    res(t);
  }, undefined, rej));
}

/* Desktop: once the intro has landed, the desert sky swaps to its 8k version, so clouds stay sharp on large and
   retina screens. Everyone sees the 4k sky first, and phones keep it.
   The 8k image is 128 MB once decoded. Loading it as a plain image left the decode and the whole upload to the
   first frame that drew it, which froze the world for a third of a second or more just after the intro landed.
   So it's decoded off the main thread (createImageBitmap), sent to the GPU a strip per frame, then swapped in.
   Browsers that can't do that keep the 4k sky. */
let sharpened = false;
const SKY_ROWS = 64;   // rows sent per frame: 2 MB, about a millisecond on an Intel laptop GPU, so the 8k takes about a second
async function bitmapFlips() {   // the panorama has to arrive upside down for WebGL, so check the browser honours imageOrientation
  const c = document.createElement('canvas'); c.width = 1; c.height = 2;
  const g = c.getContext('2d'); g.fillStyle = '#f00'; g.fillRect(0, 0, 1, 1); g.fillStyle = '#00f'; g.fillRect(0, 1, 1, 1);
  const b = await createImageBitmap(c, { imageOrientation: 'flipY' });
  const d = document.createElement('canvas'); d.width = 1; d.height = 2;
  const h = d.getContext('2d', { willReadFrequently: true }); h.drawImage(b, 0, 0); b.close();
  return h.getImageData(0, 0, 1, 1).data[2] > 128;   // blue is on top now
}
async function sharpenSky() {
  if (sharpened || !skybox || !renderer) return;
  sharpened = true;
  const desk = matchMedia('(min-width: 900px) and (pointer: fine)').matches;
  const room = renderer.capabilities.maxTextureSize >= 8192 && (navigator.deviceMemory || 8) >= 4;
  if (!desk || !room || !window.createImageBitmap || !renderer.capabilities.isWebGL2) return;
  let bmp, rt;
  try {
    if (!(await bitmapFlips())) return;
    const blob = await (await fetch('img/pano-8k.webp')).blob();
    bmp = await createImageBitmap(blob, { imageOrientation: 'flipY', premultiplyAlpha: 'none' });   // WebGL ignores flipY for bitmaps
    const W = bmp.width, H = bmp.height;
    // An empty sRGB texture to fill: a render target is the simple way to have three.js allocate one without data
    rt = new THREE.WebGLRenderTarget(W, H, { colorSpace: THREE.SRGBColorSpace, mapping: THREE.EquirectangularReflectionMapping,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false });
    renderer.setRenderTarget(rt); renderer.setRenderTarget(null);   // allocates it, draws nothing
    const g = renderer.getContext(), tex = renderer.properties.get(rt.texture).__webglTexture;
    for (let y = 0; y < H; y += SKY_ROWS) {
      const strip = await createImageBitmap(bmp, 0, y, W, Math.min(SKY_ROWS, H - y));
      await new Promise(requestAnimationFrame);
      renderer.state.bindTexture(g.TEXTURE_2D, tex);
      g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, false);
      g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      g.pixelStorei(g.UNPACK_ALIGNMENT, 4);
      g.pixelStorei(g.UNPACK_ROW_LENGTH, 0); g.pixelStorei(g.UNPACK_SKIP_ROWS, 0); g.pixelStorei(g.UNPACK_SKIP_PIXELS, 0);
      g.texSubImage2D(g.TEXTURE_2D, 0, 0, y, g.RGBA, g.UNSIGNED_BYTE, strip);
      renderer.state.unbindTexture();
      strip.close();
    }
    const old = skybox.material.uniforms.map.value;
    skybox.material.uniforms.map.value = rt.texture;
    if (old && old !== rt.texture) old.dispose();   // the reflections were made from it already
    document.documentElement.dataset.sky = '8k';
  } catch (e) { rt?.dispose(); }   // keep the 4k sky
  finally { bmp?.close(); }   // the GPU has its copy, free the 128 MB one
}

async function initWorld() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 400);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  fit();
  try { panoTex = await loadTexture('img/pano.webp'); }   // Ken's render with the F's shadow baked in, sky cleaned (Oct 2026, original in backup/)
  catch (e) { note.textContent = 'The desert image did not load. Refresh to try again.'; revealUI(); return; }
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(panoTex).texture;
  skybox = new GroundProjectedSkybox(panoTex);
  skybox.scale.setScalar(120);
  skybox.height = 1.4;   // camera height that makes the baked shadow match a 2-unit F
  skybox.radius = 120;
  skybox.material.toneMapped = false;
  addHeatHaze(skybox.material);
  scene.add(skybox);
  try { fGroup = await loadLogo(); }
  catch (e) { fGroup = buildF(); }             // traced stand-in if the model fails to load
  scene.add(fGroup);
  addDust();
  if (!reduced && !currentRoute()) introP = INTRO.start; else revealUI();
  placeCamera(0);
  renderer.compile(scene, camera);
  renderer.render(scene, camera);
  requestAnimationFrame(() => { still.classList.add('gone'); if (introP >= 1) note.classList.add('gone'); });
  desertUp();
  if (introP >= 1) { setTimeout(prefetchWorlds, 2500); setTimeout(sharpenSky, 1500); }
  loop();
}

function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  if (introP < 1) {
    if (introStart < 0) introStart = t;
    introP = Math.min(1, introP + dt * introSpeed / INTRO.dur);
    if (introP > 0.62 && performance.now() > 1800) note.classList.add('gone');   // the welcome holds over the opening of the shot
    if (introP > 0.62) revealUI();
    if (introP >= 1) { glint(1); setTimeout(prefetchWorlds, 1200); setTimeout(sharpenSky, 600); }   // the intro has landed: fetch the other worlds quietly
  }
  if (!dragging) {
    if (reduced) { angle = target; spin = 0; }
    else {   // the exact step of a critically damped spring, so it stays smooth however long the frame
      const w = SPIN.rate, x = angle - target, e = Math.exp(-w * dt), c = spin + w * x;
      angle = target + (x + c * dt) * e;
      spin = (spin - w * c * dt) * e;
      if (Math.abs(target - angle) < 0.02 && Math.abs(spin) < 0.05) { angle = target; spin = 0; }
    }
  }
  sway += ((dragging || wheeling ? 0 : 1) - sway) * (1 - Math.exp(-dt * 1.5));
  const te = 1 - Math.exp(-dt * TILT.ease);
  const hold = dragging ? 0 : 1;                  // settle back to centre while dragging
  tilt.x += (tilt.gx * hold - tilt.x) * te;
  tilt.y += (tilt.gy * hold - tilt.y) * te;
  if (diveTo > diveP) diveP = Math.min(1, diveP + dt / DIVE.inDur);
  else if (diveTo < diveP) diveP = Math.max(0, diveP - dt / DIVE.outDur);
  if (paused) return;
  if (glintT >= 0) { glintT += dt / GLINT.dur; if (glintT >= 1) glintT = -1; }
  else if (revealed && !dragging && !openSheet && (glintIdle += dt) > GLINT.idle) glint(Math.random() < 0.5 ? 1 : -1);
  glintU.p.value = glintT;
  if (worldKey === 'desert') {
    if (skybox) skybox.material.uniforms.uTime.value = t;
    updateDust(t, dt);
    placeCamera(t);
    renderer.render(scene, camera);
  } else {
    const w = WORLDS[worldKey];
    placeCamera(t);
    w.update(t, dt);
    if (w.render) w.render(renderer, camera); else renderer.render(w.scene, camera);
  }
}

/* ---------------- interaction ---------------- */
const card = document.getElementById('card');
const swap = document.getElementById('cardSwap');
const dots = [...document.querySelectorAll('#dots span')];
const prevBtn = document.getElementById('prevStop');
const nextBtn = document.getElementById('nextStop');
const navButtons = [...document.querySelectorAll('.top .nav a')];
const lineEls = [...document.querySelectorAll('#cardLine span')];

function showStop(i, instant, live) {
  // live: called while the visitor drags, so the menu and card follow the world; light and music wait for the release
  const prevIndex = stopIndex;
  stopIndex = Math.max(0, Math.min(STOPS.length - 1, i));
  if (!instant && stopIndex !== prevIndex) { if (!live) glint(stopIndex > prevIndex ? -1 : 1); Sound.tick(); }   // light slides against the turn
  if (!live) { try { Sound.chord(stopIndex); } catch (e) {} }   // each card has its own chord
  const s = STOPS[stopIndex];
  target = s.deg;
  const titleEl = document.getElementById('cardTitle');
  const fill = () => {
    document.getElementById('cardCount').textContent = (stopIndex + 1) + ' / ' + STOPS.length;
    if (titleEl.dataset.title !== s.title) setTitle(titleEl, s.title);   // releasing on the card already shown must not replay the letters
    else titleEl.classList.remove('out');
    document.getElementById('cardCta').textContent = s.cta;
    lineEls.forEach(l => { const on = l.dataset.stop === s.id; l.classList.toggle('on', on); l.toggleAttribute('aria-hidden', !on); });
    card.classList.remove('swapping');
  };
  clearTimeout(showStop.t);
  if (instant || reduced || titleEl.dataset.title === s.title) fill();
  else { titleEl.classList.add('out'); card.classList.add('swapping'); showStop.t = setTimeout(fill, 230); }
  dots.forEach((d, j) => d.classList.toggle('on', j === stopIndex));
  prevBtn.disabled = stopIndex === 0;
  nextBtn.disabled = stopIndex === STOPS.length - 1;
  navButtons.forEach(b => b.setAttribute('aria-current', String(b.dataset.open === s.id)));
}
function setTitle(el, text) {
  el.classList.remove('out');
  el.dataset.title = text;
  el.setAttribute('aria-label', text);
  let i = 0;   // letters are grouped by word, so a long title like Resource Centre breaks between words
  el.innerHTML = text.split(' ').map(w => `<span class="word">${[...w].map(c => `<span class="ltr" aria-hidden="true" style="--i:${i++}">${esc(c)}</span>`).join('')}</span>`).join(`<span class="ltr" aria-hidden="true" style="--i:${0}"> </span>`);
}

/* Magnetic buttons on the card (mouse and trackpad only) */
if (fineHover && !reduced) {
  const magnets = [...document.querySelectorAll('.card .magnet')];
  const RANGE = 70, PULL = 0.28, LABEL = 0.18;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    for (const m of magnets) {
      const r = m.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const reach = RANGE + Math.max(r.width, r.height) / 2;
      const d = Math.hypot(dx, dy);
      if (d < reach && !m.disabled) {
        const f = 1 - d / reach;
        m.classList.add('near');
        m.style.transform = `translate(${dx * PULL * f}px, ${dy * PULL * f}px)`;
        for (const c of m.children) c.style.transform = `translate(${dx * LABEL * f}px, ${dy * LABEL * f}px)`;
      } else if (m.classList.contains('near')) {
        m.classList.remove('near'); m.style.transform = '';
        for (const c of m.children) c.style.transform = '';
      }
    }
  });
}

prevBtn.addEventListener('click', () => showStop(stopIndex - 1));
nextBtn.addEventListener('click', () => showStop(stopIndex + 1));
document.getElementById('cardOpen').addEventListener('click', () => go(STOPS[stopIndex].id));

/* The cards sit at uneven angles round the F (AI and Resource Centre were slotted in between the
   original four, 13° to 35° apart), so drags, flicks and the wheel are measured in cards, not degrees.
   The same swipe then moves one card wherever you are, and never swings past a close neighbour.
   posOf turns an angle into a card position (1.5 is halfway from the second card to the third)
   and degOf turns it back, in straight lines between cards and past the two ends. */
const LAST = STOPS.length - 1;
function degOf(p) {
  const i = Math.max(0, Math.min(LAST - 1, Math.floor(p)));
  return STOPS[i].deg + (STOPS[i + 1].deg - STOPS[i].deg) * (p - i);
}
function posOf(a) {
  for (let i = 0; i < LAST; i++) {
    const a0 = STOPS[i].deg, a1 = STOPS[i + 1].deg;   // degrees fall as the cards go on
    if (a >= a1 || i === LAST - 1) return i + (a - a0) / (a1 - a0);
  }
  return 0;
}
let dragging = false, dragId = null, startX = 0, startPos = 0, lastX = 0, lastT = 0, startStop = 0, dragTouch = false;
canvas.addEventListener('pointerdown', e => {
  if (!gl) return;
  if (introP < 1) { introSpeed = 4; return; }   // a tap during the intro hurries it to the end
  if (dragging) return;                         // a second finger doesn't restart the drag
  dragging = true; dragId = e.pointerId; startX = lastX = e.clientX; startPos = posOf(angle); lastT = performance.now();
  velocity = 0; spin = 0;                       // a grab catches the world where it is
  startStop = stopIndex; dragTouch = e.pointerType !== 'mouse';
  try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
  canvas.classList.add('dragging'); card.classList.add('moving');
});
canvas.addEventListener('pointermove', e => {
  if (!dragging || e.pointerId !== dragId) return;
  // Touch: a swipe across about a third of the screen moves one card, and one swipe never goes
  // further than the next card. Mouse keeps the freer drag, about four cards across the screen.
  const per = dragTouch ? 1 / (Math.max(innerWidth, 320) * 0.34) : 4.3 / Math.max(innerWidth, 360);   // cards per pixel
  let p = startPos - (e.clientX - startX) * per;          // drag left for the next card
  if (dragTouch) {
    const lo = startStop - 1, hi = startStop + 1;          // soft stop just past the neighbouring card
    if (p > hi) p = hi + (p - hi) * 0.2;
    if (p < lo) p = lo + (p - lo) * 0.2;
  }
  if (p < 0) p *= 0.3;                                   // rubber band at the ends
  if (p > LAST) p = LAST + (p - LAST) * 0.3;
  const now = performance.now(), dt = Math.max(now - lastT, 1);
  const v = -(e.clientX - lastX) * per / dt * 1000;       // cards a second
  velocity = dt > 80 ? v : velocity + (v - velocity) * Math.min(1, dt / 40);   // smoothed, so one jumpy event can't fake a flick
  lastX = e.clientX; lastT = now; angle = degOf(p);
  const live = landing(p, 0);
  if (live !== stopIndex) showStop(live, false, true);   // the menu, dots and title follow as you drag
});
// The card a drag would land on: the nearest one, but a deliberate swipe or flick always moves at least
// one card, and on touch one swipe never goes further than the next card. p and vel are in cards.
function landing(p, vel) {
  let best = Math.max(0, Math.min(LAST, Math.round(p)));
  const moved = p - startPos;
  const intent = Math.abs(moved) > 0.18 ? Math.sign(moved) : (Math.abs(vel) > 0.85 ? Math.sign(vel) : 0);
  if (best === startStop && intent) best = startStop + intent;
  if (dragTouch) best = Math.max(startStop - 1, Math.min(startStop + 1, best));
  return Math.max(0, Math.min(LAST, best));
}
function endDrag(e) {
  if (!dragging || (e && e.pointerId !== dragId)) return;
  dragging = false; dragId = null; canvas.classList.remove('dragging'); card.classList.remove('moving');
  if (performance.now() - lastT > 90) velocity = 0;       // finger paused before lifting: no flick
  const p = posOf(angle), best = landing(p, velocity), shown = stopIndex;
  showStop(best);
  // The world carries on at the finger's speed and eases into the card, without passing it.
  const towards = Math.sign(target - angle), cap = SPIN.rate * Math.abs(target - angle);
  const flick = -velocity * (degOf(p + 0.5) - degOf(p - 0.5));   // cards a second to degrees a second here
  spin = Math.sign(flick) === towards ? towards * Math.min(Math.abs(flick), cap) : 0;
  if (best === shown && best !== startStop) glint(best > startStop ? -1 : 1);   // the menu already moved during the drag
}
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
// Desktop: the scroll wheel or a two finger swipe turns the world like a drag, then settles on a card.
// One notch moves at least one card, a longer scroll keeps turning, and the release lands on the nearest card.
let wheeling = false, wheelGoal = 0, wheelTimer = 0;
addEventListener('wheel', e => {
  if (openSheet || !gl || dragging || e.ctrlKey) return;   // sheets scroll themselves, and ctrl + wheel is the browser's zoom
  if (e.target.closest && e.target.closest('.moods')) return;
  e.preventDefault();
  if (introP < 1) { introSpeed = 4; return; }
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  const px = d * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? innerHeight : 1);
  if (!wheeling) { wheeling = true; wheelGoal = posOf(angle); startPos = wheelGoal; startStop = stopIndex; dragTouch = false; card.classList.add('moving'); }
  wheelGoal += Math.max(-160, Math.min(160, px)) * 0.0035;   // in cards: scroll down, next card
  wheelGoal = Math.max(-0.25, Math.min(LAST + 0.25, wheelGoal)); // a little give at the ends
  const live = landing(wheelGoal, 0);
  if (live !== stopIndex) showStop(live, false, true);
  target = degOf(wheelGoal);                                 // the world eases towards the wheel, not the card, until it settles
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => {
    wheeling = false; card.classList.remove('moving');
    const best = landing(wheelGoal, 0), shown = stopIndex;
    showStop(best);
    if (best === shown && best !== startStop) glint(best > startStop ? -1 : 1);
  }, 180);
}, { passive: false });
addEventListener('keydown', e => {
  if (openSheet) { if (e.key === 'Escape') closeAll(); return; }
  if (e.key === 'ArrowLeft') showStop(stopIndex - 1);
  if (e.key === 'ArrowRight') showStop(stopIndex + 1);
});

/* ---------------- sheets and routes ---------------- */
let openSheet = null, lastFocus = null;
const tiles = document.getElementById('tiles');
tiles.innerHTML = WORK.map(w => `
  <a class="tile" href="/work/${w.id}" data-case="${w.id}" data-cursor="View" data-preview="${w.preview || `vid/${w.id}-preview.mp4`}">
    <div class="tile-img"><img src="${w.img}" alt="${esc(w.client)}, ${esc(w.title)}" loading="lazy" width="960" height="503"></div>
    <div class="tile-meta"><strong>${esc(w.client)}</strong><span>${esc(w.title)}</span></div>
  </a>`).join('');
tiles.addEventListener('click', e => { const b = e.target.closest('[data-case]'); if (b && plainClick(e)) { e.preventDefault(); go('work-' + b.dataset.case); } });

function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
const arrowL = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 8H3M7 4 3 8l4 4"/></svg>';
const arrowR = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';

function renderCase(id) {
  const i = WORK.findIndex(w => w.id === id);
  const w = WORK[i];
  if (!w) return false;
  const prev = WORK[(i - 1 + WORK.length) % WORK.length], next = WORK[(i + 1) % WORK.length];
  const fx = w.fx !== false, rv = fx ? ' rv' : '', up = fx ? ' up' : '';   // page effects on every case study (set fx: false to opt one out)
  const delay = ms => fx ? ` style="transition-delay:${ms}ms"` : '';
  const mods = [];
  mods.push(`<div class="cs-hero${rv}"><img src="${w.img}" alt="${esc(w.client)}, ${esc(w.title)}" width="960" height="503"></div>`);
  mods.push(`<header class="cs-head${up}"${delay(150)}><span class="client">${esc(w.client)}</span><h1 id="csTitle">${esc(w.title)}</h1><div class="tags">${w.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div></header>`);
  if (w.video) mods.push(`<section class="mod mod-video${w.video.portrait ? ' portrait' : ''}${rv}"><video src="${w.video.src}" poster="${w.video.poster}" controls playsinline preload="none" aria-label="${esc(w.client)} film"></video></section>`);
  // challenge, idea, results, quote, gallery, next step: the same order on every case study
  const paras = [].concat(w.text || []);
  const challenge = w.challenge || paras[0], idea = w.challenge ? paras : paras.slice(1);
  if (challenge) mods.push(`<section class="mod mod-story"><span class="label${up}">The challenge</span><div class="story"><p class="lead${up}"${delay(90)}>${esc(challenge)}</p></div></section>`);
  if (idea.length) mods.push(`<section class="mod mod-story"><span class="label${up}">The idea</span><div class="story">${idea.map((t, k) => `<p class="${up.trim()}"${delay(k * 90)}>${esc(t)}</p>`).join('')}</div></section>`);
  if (w.numbers && w.numbers.length) mods.push(`<section class="mod mod-results"><span class="label${up}">The results</span><div class="numbers">${w.numbers.map(([n, l], k) => `<div class="${up.trim()}"${delay(k * 120)}><b${fx ? ` data-count="${esc(n)}"` : ''}>${esc(n)}</b><span>${esc(l)}</span></div>`).join('')}</div></section>`);
  if (w.quote) mods.push(fx
    ? `<section class="mod mod-quote"><blockquote><q data-lines>“${esc(w.quote[0])}”</q><cite class="up"${delay(450)}>${esc(w.quote[1])}</cite></blockquote></section>`
    : `<section class="mod mod-quote"><blockquote><q>${esc(w.quote[0])}</q><cite>${esc(w.quote[1])}</cite></blockquote></section>`);
  if (w.carousel && w.carousel.length) mods.push(`<section class="mod"><div class="carousel" tabindex="0" aria-label="${esc(w.client)} gallery">${w.carousel.map((n, k) => fx
      ? `<div class="cimg rv"${delay(k * 120)}><img src="${CS}${n}.webp" alt="${esc(w.client)} work, image ${k + 1}" loading="lazy"></div>`
      : `<img src="${CS}${n}.webp" alt="${esc(w.client)} work, image ${k + 1}" loading="lazy">`).join('')}</div>
      <div class="carousel-nav"><button data-slide="-1" aria-label="Previous images">${arrowL}</button><button data-slide="1" aria-label="More images">${arrowR}</button></div></section>`);
  mods.push(`<section class="mod mod-cta"><h2 class="${up.trim()}">Got a brief like this?</h2><a class="cta" href="/contact" data-open="contact">Start a project${arrowR}</a></section>`);
  if (fx) {
    mods.push(`<nav class="cs-nav slim" aria-label="Case studies">
        <a class="prev" href="/work/${prev.id}" data-case="${prev.id}">${arrowL}${esc(prev.client)}</a>
        <a class="back" href="/work" data-back>Back to case studies</a></nav>`);
    mods.push(`<a class="cs-next" href="/work/${next.id}" data-case="${next.id}" data-cursor="Next" aria-label="Next project: ${esc(next.client)}, ${esc(next.title)}">
        <div class="cs-next-frame rv"><img src="${next.img}" alt="" loading="lazy">
          <div class="cs-next-meta"><span class="label" style="color:#fff;opacity:.85">Next project</span><h2>${esc(next.client)}</h2><p>${esc(next.title)}</p></div></div>
        <div class="cs-next-bar" aria-hidden="true"><i></i><span>${fineHover ? 'Keep scrolling, or click' : 'Tap to open'}</span></div></a>`);
  } else {
    mods.push(`<nav class="cs-nav" aria-label="Case studies">
      <a class="prev" href="/work/${prev.id}" data-case="${prev.id}">${arrowL}${esc(prev.client)}</a>
      <a class="back" href="/work" data-back>Back to case studies</a>
      <a class="next" href="/work/${next.id}" data-case="${next.id}">${esc(next.client)}${arrowR}</a></nav>`);
  }
  const art = document.getElementById('caseStudy');
  art.classList.remove('fx');
  art.innerHTML = mods.join('');
  art.setAttribute('aria-labelledby', 'csTitle');
  return true;
}
document.getElementById('caseStudy').addEventListener('click', e => {
  const b = e.target.closest('[data-case]');
  if (b) { if (!plainClick(e)) return; e.preventDefault(); Sound.tick(); if (b.classList.contains('cs-next')) nextCase(b.dataset.case); else go('work-' + b.dataset.case); return; }
  if (e.target.closest('[data-back]')) { if (!plainClick(e)) return; e.preventDefault(); Sound.tick(); go('work'); }
  const sl = e.target.closest('[data-slide]');
  if (sl) { const c = sl.closest('.mod').querySelector('.carousel'); c.scrollBy({ left: Number(sl.dataset.slide) * c.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' }); }
});

function showSheet(name, instant, stop = name) {
  const el = document.getElementById('sheet-' + name);
  if (openSheet && openSheet !== el) { openSheet.classList.remove('open'); const old = openSheet; setTimeout(() => { if (old !== openSheet) old.hidden = true; }, 600); }
  const i = STOPS.findIndex(s => s.id === stop);
  if (openSheet !== el) {
    const fromWorld = !openSheet;
    lastFocus = lastFocus || document.activeElement;
    el.hidden = false;
    openSheet = el;
    let delay = 0;
    if (fromWorld && canDive() && !instant) {
      if (i >= 0) showStop(i, true);              // turn to the page's card while diving
      startDive(); delay = DIVE.openAfter;
    }
    setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(() => { if (openSheet === el) el.classList.add('open'); })), delay);
    setTimeout(() => { if (openSheet === el) { paused = true; el.querySelector('.close').focus({ preventScroll: true }); requestWorld(WORLD_OF[stop] || 'desert', el); } }, reduced ? 0 : delay + 640);
  }
  if (i >= 0) showStop(i, true);
  return el;
}
function closeAll(fromRoute) {
  if (!openSheet) return;
  const el = openSheet; openSheet = null; paused = false;
  el.classList.remove('open');
  teardownFx(); teardownCapFx(); Sound.duck(false);
  try { if (worldKey !== 'desert') WORLDS[worldKey].reveal?.(); } catch (e) {}   // e.g. the orbit starts at night as you come back out
  startSurface();
  setTimeout(() => { if (openSheet !== el) el.hidden = true; }, reduced ? 0 : 600);
  if (!fromRoute && location.pathname !== '/') { try { history.pushState(null, '', '/'); } catch (e) {} setHead(''); dispatchEvent(new Event('freak:route')); }
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  lastFocus = null;
}
let bootPre = !!document.querySelector('.sheet.open');   // the page arrived with its sheet already open
function setHead(name) {
  const p = PAGES[name] || PAGES[''];
  if (!p) return;
  document.title = p.title;
  const d = document.querySelector('meta[name="description"]'); if (d) d.setAttribute('content', p.desc);
  const c = document.querySelector('link[rel="canonical"]'); if (c) c.setAttribute('href', SITE_URL + pathOf(name));
}
function route() {
  let h = currentRoute();
  const instant = bootPre; bootPre = false;
  if (h && h !== 'work' && !h.startsWith('work-') && !SHEETS.includes(h) && !isPage(h)) { h = ''; try { history.replaceState(null, '', '/'); } catch (e) {} }
  if (h.startsWith('work-') && !WORK.some(w => 'work-' + w.id === h)) { h = 'work'; try { history.replaceState(null, '', '/work'); } catch (e) {} }
  setHead(h);
  dispatchEvent(new Event('freak:route'));
  if (!h) { if (openSheet) closeAll(true); return; }
  if (h === 'work' || h.startsWith('work-')) {
    const el = showSheet('work', instant);
    const isCase = h.startsWith('work-') && renderCase(h.slice(5));
    document.getElementById('workGrid').hidden = isCase;
    document.getElementById('caseStudy').hidden = !isCase;
    if (!instant) el.scrollTop = 0;
    teardownCapFx();
    if (isCase) setupCaseFx(h.slice(5), instant); else teardownFx();
    return;
  }
  teardownFx(); teardownCapFx();
  if (isPage(h)) {
    const el = showSheet('page', instant, stopOf(h));
    loadPage(h, el, instant);
    return;
  }
  const el = showSheet(h, instant);
  if (!instant) el.scrollTop = 0;
  if (h === 'capabilities') setupCapFx(instant);
}

/* ---------------- content pages ----------------
   Each page's body is prerendered into its own HTML file and also published on its own at /f/<address>,
   so moving between pages inside the app fetches only the body. Links to pages are fetched on hover. */
const pageSheet = document.getElementById('sheet-page'), pageBody = document.getElementById('pageBody');
const pageCache = new Map();
function fetchPage(h) {
  if (!pageCache.has(h)) pageCache.set(h, fetch('/f/' + h).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); }).catch(e => { pageCache.delete(h); throw e; }));
  return pageCache.get(h);
}
function markPageNav(h) {
  const top = stopOf(h);
  pageSheet.querySelectorAll('.sheet-bar nav a').forEach(a => { if (a.dataset.open === top) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
}
function loadPage(h, el, instant) {
  markPageNav(h);
  if (pageBody.dataset.route === h) { if (!instant) el.scrollTop = 0; return; }   // arrived prerendered, or already showing
  pageBody.dataset.route = h;
  fetchPage(h).then(html => {
    if (pageBody.dataset.route !== h) return;   // moved on while it loaded
    pageBody.innerHTML = html;
    el.scrollTop = 0;
    if (!reduced) { pageBody.classList.remove('swap'); void pageBody.offsetWidth; pageBody.classList.add('swap'); }
  }, () => { location.href = pathOf(h); });   // offline or a stale app: load the page itself
}
document.addEventListener('pointerover', e => {
  const a = e.target.closest && e.target.closest('a[data-open]');
  if (a && isPage(a.dataset.open)) fetchPage(a.dataset.open).catch(() => {});
}, { passive: true });
// links to a part of the same page (an article's contents, a page's own sections) scroll the sheet, not the address
document.addEventListener('click', e => {
  const a = e.target.closest('#pageBody a[href^="#"]');
  if (!a || !plainClick(e)) return;
  const el = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
  if (!el) return;
  e.preventDefault();
  const top = el.getBoundingClientRect().top - pageSheet.getBoundingClientRect().top + pageSheet.scrollTop - 84;
  pageSheet.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
});
// Resource Centre: filter the articles by topic
document.addEventListener('click', e => {
  const b = e.target.closest('.res-filter button');
  if (!b) return;
  const cat = b.dataset.cat;
  b.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  pageBody.querySelectorAll('.res-grid .res-card').forEach(c => { c.hidden = cat !== 'all' && c.dataset.cat !== cat; });
});
function go(name) {
  const p = pathOf(name);
  if (location.pathname !== p) { try { history.pushState(null, '', p); } catch (e) { location.href = p; return; } }
  route();
}
addEventListener('popstate', route);
document.addEventListener('click', e => {
  const open = e.target.closest('[data-open]');
  if (open) { if (open.tagName === 'A' && !plainClick(e)) return; e.preventDefault(); go(open.dataset.open); return; }
  const shut = e.target.closest('[data-close]');
  if (shut) { if (shut.tagName === 'A' && !plainClick(e)) return; e.preventDefault(); closeAll(); }
  const cp = e.target.closest('[data-copy]');
  if (cp) {
    const text = cp.dataset.copy;
    const done = () => { cp.textContent = 'Copied'; setTimeout(() => cp.textContent = 'Copy', 1600); };
    const fallback = () => { const r = document.createRange(); r.selectNodeContents(cp.previousElementSibling); const s = getSelection(); s.removeAllRanges(); s.addRange(r); cp.textContent = 'Selected'; };
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch (err) { fallback(); }
  }
});
document.getElementById('homeBtn').addEventListener('click', () => showStop(0));


/* ---------------- page effects (all case studies) ---------------- */
function formatCount(str, t) {
  const m = String(str).match(/^(.*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return str;
  const [, pre, num, post] = m;
  const val = parseFloat(num.replace(/,/g, ''));
  const dec = (num.split('.')[1] || '').length;
  let out = (val * t).toFixed(dec);
  if (num.includes(',')) out = out.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return pre + out + post;
}
function countUp(el) {
  const final = el.dataset.count, start = performance.now(), dur = 1600;
  const step = now => {
    const p = Math.min(1, (now - start) / dur);
    el.textContent = formatCount(final, 1 - Math.pow(1 - p, 3));
    if (p < 1) requestAnimationFrame(step); else el.textContent = final;
  };
  requestAnimationFrame(step);
}
function splitLines(q) {
  const text = q.dataset.text || q.textContent;
  q.dataset.text = text;
  const words = text.split(/\s+/).filter(Boolean);
  q.innerHTML = words.map(w => `<span class="w">${esc(w)}</span>`).join(' ');
  const lines = []; let top = null;
  for (const s of q.querySelectorAll('.w')) {
    if (s.offsetTop !== top) { lines.push([]); top = s.offsetTop; }
    lines[lines.length - 1].push(s.textContent);
  }
  q.innerHTML = lines.map((ws, i) => `<span class="ql"><span style="--l:${i}">${ws.map(esc).join(' ')}</span></span>`).join('');
}
function reveal(el) {
  el.classList.add('in');
  if (el.classList.contains('carousel')) el.querySelectorAll('.cimg').forEach(c => c.classList.add('in'));   // whole strip, staggered
  if (el.dataset.count) countUp(el);
}

/* Smooth scrolling for a page: the wheel sets a target and the page glides to it. Scrollbar,
   keyboard and touch scrolling stay native. At the bottom, extra scrolling fills the
   next-project bar and then opens the next case study. */
const smooth = { el: null, cur: 0, tgt: 0, pull: 0, pullEl: null, lastWheel: 0, busy: false, raf: 0, last: 0 };
const PULL_MAX = 650;
function smoothWheel(e) {
  if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;   // pinch-zoom or a sideways carousel swipe
  e.preventDefault();
  const el = smooth.el;
  const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * el.clientHeight : e.deltaY;
  const max = el.scrollHeight - el.clientHeight;
  const nt = smooth.tgt + d;
  if (smooth.pullEl && d > 0 && smooth.cur >= max - 4) smooth.pull += d;   // only once the page has actually reached the bottom
  else if (d < 0) smooth.pull = Math.max(0, smooth.pull + d * 2);
  smooth.tgt = Math.max(0, Math.min(max, nt));
  smooth.lastWheel = performance.now();
}
function smoothScroll() {
  if (Math.abs(smooth.el.scrollTop - smooth.cur) > 3) smooth.cur = smooth.tgt = smooth.el.scrollTop;   // moved by scrollbar or keys
}
function smoothTick(now) {
  if (!smooth.el) return;
  const dt = Math.min((now - smooth.last) / 1000 || 0.016, 0.05); smooth.last = now;
  // something else moved the page (scrollbar, keys, a link): follow it instead of fighting it
  if (Math.abs(smooth.el.scrollTop - smooth.set) > 2) smooth.cur = smooth.tgt = smooth.el.scrollTop;
  smooth.cur += (smooth.tgt - smooth.cur) * (1 - Math.exp(-dt * 9));
  if (Math.abs(smooth.tgt - smooth.cur) < 0.4) smooth.cur = smooth.tgt;
  smooth.el.scrollTop = smooth.cur;
  smooth.set = smooth.el.scrollTop;
  if (smooth.pullEl) {
    if (now - smooth.lastWheel > 450) smooth.pull *= Math.exp(-dt * 4);
    const p = Math.min(1, smooth.pull / PULL_MAX);
    smooth.pullEl.style.setProperty('--pull', p.toFixed(3));
    if (p >= 1 && !smooth.busy) { smooth.busy = true; Sound.whoosh(1); nextCase(smooth.pullEl.dataset.case); }
  }
  smooth.raf = requestAnimationFrame(smoothTick);
}
function smoothOn(el, pullEl) {
  smoothOff();
  Object.assign(smooth, { el, pullEl, cur: el.scrollTop, tgt: el.scrollTop, set: el.scrollTop, pull: 0, busy: false, last: performance.now() });
  el.addEventListener('wheel', smoothWheel, { passive: false });
  el.addEventListener('scroll', smoothScroll);
  smooth.raf = requestAnimationFrame(smoothTick);
}
function smoothOff() {
  if (!smooth.el) return;
  smooth.el.removeEventListener('wheel', smoothWheel);
  smooth.el.removeEventListener('scroll', smoothScroll);
  cancelAnimationFrame(smooth.raf);
  smooth.el = null;
}
function nextCase(id) {
  const art = document.getElementById('caseStudy');
  if (reduced) { go('work-' + id); return; }
  art.classList.add('leaving');
  setTimeout(() => go('work-' + id), 360);
}

let fxIO = null, fxResize = null;
function teardownFx() {
  if (fxIO) { fxIO.disconnect(); fxIO = null; }
  if (fxResize) { removeEventListener('resize', fxResize); fxResize = null; }
  smoothOff();
}
function shownNow(root, scroller, sel) {
  const h = scroller.clientHeight;
  root.querySelectorAll(sel).forEach(el => { const r = el.getBoundingClientRect(); if (r.top < h && r.bottom > 0) { el.classList.add('in'); el.dataset.shown = '1'; } });
}
function setupCaseFx(id, instant) {
  teardownFx();
  const w = WORK.find(x => x.id === id);
  const art = document.getElementById('caseStudy'), sheet = document.getElementById('sheet-work');
  art.classList.remove('leaving');
  if (!reduced && !instant) { art.classList.remove('enter'); void art.offsetWidth; art.classList.add('enter'); }
  if (!w || w.fx === false || reduced) return;
  if (instant) shownNow(art, sheet, '.rv:not(.cimg), .up, [data-count], [data-lines], .carousel, .cimg');
  art.classList.add('fx');
  art.querySelectorAll('[data-count]:not([data-shown])').forEach(b => { b.textContent = formatCount(b.dataset.count, 0); });
  art.querySelectorAll('[data-lines]').forEach(splitLines);
  if (document.fonts) document.fonts.ready.then(() => art.querySelectorAll('[data-lines]').forEach(splitLines));
  fxIO = new IntersectionObserver(entries => {
    for (const en of entries) if (en.isIntersecting) { reveal(en.target); fxIO.unobserve(en.target); }
  }, { root: sheet, threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  art.querySelectorAll('.rv:not(.cimg), .up, [data-count], [data-lines], .carousel').forEach(el => { if (!el.dataset.shown) fxIO.observe(el); });
  let rt = 0;
  fxResize = () => { clearTimeout(rt); rt = setTimeout(() => art.querySelectorAll('[data-lines]').forEach(splitLines), 200); };
  addEventListener('resize', fxResize);
  if (fineHover) smoothOn(sheet, art.querySelector('.cs-next'));
}

/* Work grid: hovering a tile plays a few silent seconds of the project's film */
tiles.addEventListener('pointerover', e => {
  if (e.pointerType !== 'mouse' || reduced) return;
  const t = e.target.closest('.tile[data-preview]');
  if (!t || t._film) return;
  const v = document.createElement('video');
  Object.assign(v, { src: t.dataset.preview, muted: true, loop: true, playsInline: true, className: 'tile-film' });
  v.setAttribute('aria-hidden', 'true');
  t.querySelector('.tile-img').appendChild(v); t._film = v;
  v.play().then(() => v.classList.add('on')).catch(() => {});
});
tiles.addEventListener('pointerout', e => {
  const t = e.target.closest('.tile[data-preview]');
  if (!t || !t._film || t.contains(e.relatedTarget)) return;
  const v = t._film; t._film = null;
  v.classList.remove('on');
  setTimeout(() => { v.pause(); v.remove(); }, 450);
});

/* ---------------- custom cursor ---------------- */
if (fineHover && !reduced) {
  const root = document.documentElement;
  const cur = document.createElement('div');
  cur.className = 'cursor gone'; cur.setAttribute('aria-hidden', 'true');
  cur.innerHTML = '<span class="cursor-ring"><b></b></span><span class="cursor-dot"></span>';
  document.body.appendChild(cur);
  root.classList.add('has-cursor');
  const dot = cur.querySelector('.cursor-dot'), ring = cur.querySelector('.cursor-ring'), label = ring.querySelector('b');
  let mx = -100, my = -100, rx = -100, ry = -100, last = performance.now();
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY; cur.classList.remove('gone');
    const t = e.target;
    const lab = t === canvas && revealed && !openSheet ? 'Drag' : (t.closest && t.closest('[data-cursor]') ? t.closest('[data-cursor]').dataset.cursor : '');
    const link = !lab && t.closest && t.closest('a, button, [data-case], [data-copy], video, .carousel');
    cur.classList.toggle('label', !!lab);
    cur.classList.toggle('link', !!link);
    cur.classList.toggle('paper', !!(t.closest && t.closest('.sheet')));
    if (lab && label.textContent !== lab) label.textContent = lab;
  });
  addEventListener('pointerdown', () => cur.classList.add('down'));
  addEventListener('freak:route', () => cur.classList.remove('label', 'link'));   // the page changed under a still pointer
  addEventListener('pointerup', () => cur.classList.remove('down'));
  document.addEventListener('pointerleave', () => cur.classList.add('gone'));
  addEventListener('blur', () => cur.classList.add('gone'));
  const follow = now => {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    const k = 1 - Math.exp(-dt * 18);
    rx += (mx - rx) * k; ry += (my - ry) * k;
    dot.style.transform = `translate(${mx}px, ${my}px)` + (cur.classList.contains('link') ? ' scale(.5)' : '');
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(follow);
  };
  requestAnimationFrame(follow);
}

/* ---------------- sound moods ----------------
   Everything is generated in the browser, no audio files. Each of the four cards has its own chord,
   so turning the world changes the harmony; the moods differ in what plays over it. */
const SoundKit = (() => {
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const curve = f => { const c = new Float32Array(64); for (let i = 0; i < 64; i++) c[i] = f(i / 63); return c; };
  const RISE = curve(x => Math.sin(x * Math.PI / 2)), FALL = curve(x => Math.cos(x * Math.PI / 2));   // equal-power crossfades
  // Work, Capabilities, AI, Contact, About. Melody notes ("top") stay inside D major pentatonic plus colour tones.
  const CHORDS = [
    { bass: 38, notes: [50, 54, 57, 61, 64], top: [69, 73, 76, 78, 81] },   // Dmaj9
    { bass: 35, notes: [47, 54, 57, 62, 64], top: [66, 69, 71, 74, 76] },   // Bm11
    { bass: 33, notes: [45, 52, 57, 59, 64], top: [69, 71, 73, 76, 78] },   // Aadd9, for AI
    { bass: 31, notes: [50, 54, 57, 59, 61], top: [66, 69, 71, 73, 74, 78] },   // Gmaj9#11
    { bass: 40, notes: [47, 54, 55, 59, 62], top: [66, 67, 71, 74, 78] },   // Em9
    { bass: 42, notes: [49, 54, 57, 59, 64], top: [66, 69, 71, 73, 76] },   // F#m11, for the Resource Centre
  ];

  function noiseBuffer(ctx) {
    const len = ctx.sampleRate * 4, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + w * 0.029; b1 = 0.985 * b1 + w * 0.032; b2 = 0.95 * b2 + w * 0.048;
        d[i] = (b0 + b1 + b2) * 0.9;
      }
    }
    return b;
  }
  function impulse(ctx, secs, decay) {   // a soft, dark hall
    const len = Math.floor(ctx.sampleRate * secs), b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let lp = 0;
      for (let i = 0; i < len; i++) {
        const x = i / len; lp += ((Math.random() * 2 - 1) - lp) * (0.62 - 0.5 * x);
        d[i] = lp * Math.pow(1 - x, decay) * (i < ctx.sampleRate * 0.012 ? i / (ctx.sampleRate * 0.012) : 1);
      }
    }
    return b;
  }

  // shared effects: compressor, reverb and a ping-pong delay; each mood gets its own level into them
  function bus(ctx, dest) {
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 14; comp.ratio.value = 3; comp.attack.value = 0.02; comp.release.value = 0.4;
    comp.connect(dest);
    const dry = ctx.createGain(); dry.connect(comp);
    const verb = ctx.createConvolver(); verb.buffer = impulse(ctx, 5, 2.6);
    const verbIn = ctx.createGain(), verbOut = ctx.createGain(); verbOut.gain.value = 0.85;
    verbIn.connect(verb); verb.connect(verbOut); verbOut.connect(comp);
    const dIn = ctx.createGain(), tone = ctx.createBiquadFilter(), dl = ctx.createDelay(2), dr = ctx.createDelay(2);
    const fb = ctx.createGain(), merge = ctx.createChannelMerger(2), dOut = ctx.createGain(), dVerb = ctx.createGain();
    tone.type = 'lowpass'; tone.frequency.value = 2400; fb.gain.value = 0.36; dOut.gain.value = 0.7; dVerb.gain.value = 0.35;
    dl.delayTime.value = dr.delayTime.value = 0.42;
    dIn.connect(tone); tone.connect(dl); dl.connect(dr); dr.connect(fb); fb.connect(tone);
    dl.connect(merge, 0, 0); dr.connect(merge, 0, 1); merge.connect(dOut); dOut.connect(comp); dOut.connect(dVerb); dVerb.connect(verbIn);
    const noise = noiseBuffer(ctx);
    const A = {
      ctx, noise,
      delayTime(s) { const t = ctx.currentTime; dl.delayTime.setTargetAtTime(s, t, 0.05); dr.delayTime.setTargetAtTime(s, t, 0.05); },
      sub(level) {   // a mood's own entry points into the shared effects
        const g = [ctx.createGain(), ctx.createGain(), ctx.createGain()];
        g.forEach(x => { x.gain.value = level; }); g[0].connect(dry); g[1].connect(verbIn); g[2].connect(dIn);
        return { ctx, noise, dry: g[0], verbIn: g[1], dIn: g[2], delayTime: A.delayTime, dispose(at) { setTimeout(() => g.forEach(x => x.disconnect()), Math.max(0, (at - ctx.currentTime) * 1000) + 8000); } };
      },
    };
    return A;
  }
  function route(S, node, dry = 1, verb = 0, delay = 0) {
    const c = S.ctx;
    if (dry) { const g = c.createGain(); g.gain.value = dry; node.connect(g); g.connect(S.dry); }
    if (verb) { const g = c.createGain(); g.gain.value = verb; node.connect(g); g.connect(S.verbIn); }
    if (delay) { const g = c.createGain(); g.gain.value = delay; node.connect(g); g.connect(S.dIn); }
  }

  // ---- instruments ----
  function pad(S, chord, t, o) {
    const ctx = S.ctx, env = ctx.createGain(), rel = ctx.createGain(), lp = ctx.createBiquadFilter();
    if (o.eq) { env.gain.value = 0; env.gain.setValueCurveAtTime(RISE.map(v => v * o.vol), t, o.attack); }
    else { env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(o.vol, t + o.attack); }
    lp.type = 'lowpass'; lp.frequency.value = o.cutoff; lp.Q.value = o.q || 0.5;
    const lfo = ctx.createOscillator(), lfoG = ctx.createGain();
    lfo.frequency.value = rnd(0.03, 0.07); lfoG.gain.value = o.cutoff * 0.4; lfo.connect(lfoG); lfoG.connect(lp.frequency);
    const srcs = [lfo], notes = o.notes || chord.notes;
    notes.forEach((m, i) => {
      [-1, 1].forEach(side => {
        const osc = ctx.createOscillator(), g = ctx.createGain(), p = ctx.createStereoPanner();
        osc.type = o.wave || 'sawtooth'; osc.frequency.value = mtof(m);
        osc.detune.value = side * (o.detune == null ? 7 : o.detune) + rnd(-2, 2);
        g.gain.value = 1 / (notes.length * 2);
        p.pan.value = side * (0.2 + 0.5 * i / Math.max(1, notes.length - 1));
        osc.connect(g); g.connect(p); p.connect(lp); srcs.push(osc);
      });
    });
    lp.connect(env);
    if (o.sub) {
      const s = ctx.createOscillator(), sg = ctx.createGain();
      s.type = 'sine'; s.frequency.value = mtof(chord.bass); sg.gain.value = o.sub * 0.3; s.connect(sg); sg.connect(env); srcs.push(s);
      const h = ctx.createOscillator(), hg = ctx.createGain();   // an octave up so small speakers hear the root
      h.type = 'triangle'; h.frequency.value = mtof(chord.bass + 12); hg.gain.value = o.sub * 0.3; h.connect(hg); hg.connect(env); srcs.push(h);
    }
    env.connect(rel); route(S, rel, 1, o.verb == null ? 0.5 : o.verb, o.delay || 0);
    srcs.forEach(s => s.start(t));
    let done = false;
    return {
      release(t2, r = 3) {
        if (done) return; done = true;
        if (o.eq) rel.gain.setValueCurveAtTime(FALL, t2, r);
        else { rel.gain.setValueAtTime(1, t2); rel.gain.linearRampToValueAtTime(0, t2 + r); }
        srcs.forEach(s => s.stop(t2 + r + 0.1)); srcs[1].onended = () => rel.disconnect();
      },
    };
  }
  function bell(S, m, t, o = {}) {   // FM: glassy, a little metallic
    const ctx = S.ctx, f = mtof(m), car = ctx.createOscillator(), mod = ctx.createOscillator();
    const mg = ctx.createGain(), g = ctx.createGain(), p = ctx.createStereoPanner();
    const dur = o.dur || 3, vol = o.vol || 0.08, idx = o.index == null ? 1.5 : o.index;
    car.frequency.value = f; mod.frequency.value = f * (o.ratio || 3.5);
    mg.gain.setValueAtTime(f * idx, t); mg.gain.exponentialRampToValueAtTime(f * idx * 0.02 + 0.01, t + dur * 0.5);
    mod.connect(mg); mg.connect(car.frequency);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (o.att || 0.005)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    p.pan.value = o.pan || 0;
    car.connect(g); g.connect(p); route(S, p, o.dry == null ? 1 : o.dry, o.verb == null ? 0.6 : o.verb, o.delay || 0);
    car.start(t); mod.start(t); car.stop(t + dur + 0.05); mod.stop(t + dur + 0.05);
    car.onended = () => p.disconnect();
  }
  function pluck(S, m, t, o = {}) {
    const ctx = S.ctx, a = ctx.createOscillator(), b = ctx.createOscillator(), bg = ctx.createGain();
    const lp = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner();
    const dec = o.dec || 0.4, vol = o.vol || 0.06;
    a.type = 'sawtooth'; a.frequency.value = mtof(m); a.detune.value = rnd(-4, 4);
    b.type = 'triangle'; b.frequency.value = mtof(m) * (o.low ? 0.5 : 1); bg.gain.value = 0.6;
    lp.type = 'lowpass'; lp.Q.value = o.q || 4;
    lp.frequency.setValueAtTime(o.cut || 2400, t); lp.frequency.exponentialRampToValueAtTime(220, t + dec * 0.7);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    a.connect(lp); b.connect(bg); bg.connect(lp); lp.connect(g); g.connect(p); p.pan.value = o.pan || 0;
    route(S, p, 1, o.verb == null ? 0.25 : o.verb, o.delay || 0);
    a.start(t); b.start(t); a.stop(t + dec + 0.05); b.stop(t + dec + 0.05);
    a.onended = () => p.disconnect();
  }
  function thump(S, t, vol = 0.2) {   // a soft, rounded kick
    const ctx = S.ctx, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.12);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.connect(g); route(S, g, 1, 0.04);
    o.start(t); o.stop(t + 0.55); o.onended = () => g.disconnect();
  }
  function shaker(S, t, vol = 0.02) {
    const ctx = S.ctx, s = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner();
    s.buffer = S.noise; hp.type = 'highpass'; hp.frequency.value = 6500;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * 6, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    p.pan.value = rnd(-0.35, 0.35);
    s.connect(hp); hp.connect(g); g.connect(p); route(S, p, 1, 0.12);
    s.start(t, rnd(0, 3)); s.stop(t + 0.1); s.onended = () => p.disconnect();
  }
  function swell(S, m, t, o = {}) {   // a slow bowed tone that blooms and fades
    const ctx = S.ctx, a = ctx.createOscillator(), b = ctx.createOscillator(), bg = ctx.createGain();
    const lp = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner(), vib = ctx.createOscillator(), vg = ctx.createGain();
    const att = o.att || 4, rel = o.rel || 6, vol = o.vol || 0.04;
    a.type = 'triangle'; b.type = 'sine'; a.frequency.value = mtof(m); b.frequency.value = mtof(m) * 2; bg.gain.value = 0.25;
    vib.frequency.value = rnd(4, 5.2); vg.gain.value = 5; vib.connect(vg); vg.connect(a.detune); vg.connect(b.detune);
    lp.type = 'lowpass'; lp.frequency.value = o.cut || 1600;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + att); g.gain.linearRampToValueAtTime(0, t + att + rel);
    a.connect(lp); b.connect(bg); bg.connect(lp); lp.connect(g); g.connect(p); p.pan.value = o.pan || 0;
    route(S, p, 0.6, 0.9, o.delay || 0);
    [a, b, vib].forEach(x => { x.start(t); x.stop(t + att + rel + 0.1); });
    a.onended = () => p.disconnect();
  }
  function boom(S, t, vol = 0.2) {   // a distant, soft cinematic hit
    const ctx = S.ctx, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(38, t + 1.6);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
    o.connect(g); route(S, g, 1, 0.5); o.start(t); o.stop(t + 2.7); o.onended = () => g.disconnect();
    const s = ctx.createBufferSource(), lp = ctx.createBiquadFilter(), ng = ctx.createGain();
    s.buffer = S.noise; lp.type = 'lowpass'; lp.frequency.setValueAtTime(900, t); lp.frequency.exponentialRampToValueAtTime(120, t + 1.4);
    ng.gain.setValueAtTime(0.0001, t); ng.gain.exponentialRampToValueAtTime(vol * 1.4, t + 0.02); ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    s.connect(lp); lp.connect(ng); route(S, ng, 0.7, 0.8); s.start(t, rnd(0, 2)); s.stop(t + 1.7); s.onended = () => ng.disconnect();
  }
  function wind(S, level, t, o = {}) {   // a quiet bed of desert air under the music
    const ctx = S.ctx, s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), lp = ctx.createBiquadFilter(), g = ctx.createGain(), rel = ctx.createGain();
    s.buffer = S.noise; s.loop = true; bp.type = 'bandpass'; bp.frequency.value = 480; bp.Q.value = 0.55; lp.type = 'lowpass'; lp.frequency.value = 1500;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + (o.quick ? 0.5 : 3));
    s.connect(bp); bp.connect(lp); lp.connect(g); g.connect(rel); route(S, rel, 1, 0.2);
    s.start(t, rnd(0, 3));
    let next = t + (o.quick ? 0.5 : 3);
    return {
      schedule(t0, t1) {
        if (next < t0 - 1) next = t0;
        while (next < t1) { bp.frequency.setTargetAtTime(rnd(280, 900), next, 1.4); g.gain.setTargetAtTime(level * rnd(0.72, 1.1), next, 2.2); next += rnd(1.8, 4.6); }
      },
      stop(at) { rel.gain.setValueAtTime(1, at); rel.gain.linearRampToValueAtTime(0, at + 2); s.stop(at + 2.1); s.onended = () => rel.disconnect(); },
    };
  }

  // ---- more instruments, for the city and orbit worlds ----
  function brass(S, m, t, o = {}) {   // a CS-80 style brass swell: detuned saws, the filter opening slowly, late vibrato
    const ctx = S.ctx, a = ctx.createOscillator(), b = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner();
    const vib = ctx.createOscillator(), vg = ctx.createGain();
    const att = o.att || 1.6, hold = o.hold || 1.5, rel = o.rel || 3, vol = o.vol || 0.05;
    a.type = b.type = 'sawtooth'; a.frequency.value = b.frequency.value = mtof(m); a.detune.value = -9; b.detune.value = 9;
    vib.frequency.value = rnd(4.6, 5.6); vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(9, t + att + 0.6); vib.connect(vg); vg.connect(a.detune); vg.connect(b.detune);
    lp.type = 'lowpass'; lp.Q.value = 3.5;
    lp.frequency.setValueAtTime(260, t); lp.frequency.linearRampToValueAtTime(o.cut || 2400, t + att); lp.frequency.linearRampToValueAtTime((o.cut || 2400) * 0.45, t + att + hold + rel);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + att); g.gain.setValueAtTime(vol, t + att + hold); g.gain.linearRampToValueAtTime(0, t + att + hold + rel);
    a.connect(lp); b.connect(lp); lp.connect(g); g.connect(p); p.pan.value = o.pan || 0;
    route(S, p, 0.55, 1.0, o.delay || 0.2);
    [a, b, vib].forEach(x => { x.start(t); x.stop(t + att + hold + rel + 0.1); }); a.onended = () => p.disconnect();
  }
  function rain(S, level, t) {   // rain on a roof: a hiss, a softer roar under it, and drips close by
    const ctx = S.ctx, rel = ctx.createGain(); route(S, rel, 1, 0.15);
    const hiss = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), hg = ctx.createGain();
    hiss.buffer = S.noise; hiss.loop = true; hiss.playbackRate.value = 2.2; hp.type = 'highpass'; hp.frequency.value = 2600; hg.gain.value = level * 0.45;
    hiss.connect(hp); hp.connect(hg); hg.connect(rel);
    const roar = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), rg = ctx.createGain();
    roar.buffer = S.noise; roar.loop = true; bp.type = 'bandpass'; bp.frequency.value = 600; bp.Q.value = 0.5; rg.gain.value = level * 1.1;
    roar.connect(bp); bp.connect(rg); rg.connect(rel);
    hiss.start(t, rnd(0, 3)); roar.start(t, rnd(0, 3));
    rel.gain.setValueAtTime(0, t); rel.gain.linearRampToValueAtTime(1, t + 1.2);
    let next = t + 0.2;
    return {
      schedule(t0, t1) {
        if (next < t0 - 0.5) next = t0;
        while (next < t1) {
          const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), pn = ctx.createStereoPanner();
          s.buffer = S.noise; f.type = 'bandpass'; f.frequency.value = rnd(1800, 5200); f.Q.value = rnd(6, 14);
          g.gain.setValueAtTime(0.0001, next); g.gain.exponentialRampToValueAtTime(level * rnd(2, 7), next + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, next + rnd(0.03, 0.08));
          pn.pan.value = rnd(-0.9, 0.9); s.connect(f); f.connect(g); g.connect(pn); pn.connect(rel);
          s.start(next, rnd(0, 3)); s.stop(next + 0.1); s.onended = () => pn.disconnect();
          next += rnd(0.03, 0.22);
        }
      },
      stop(at) { rel.gain.setValueAtTime(1, at); rel.gain.linearRampToValueAtTime(0, at + 2); hiss.stop(at + 2.1); roar.stop(at + 2.1); hiss.onended = () => rel.disconnect(); },
    };
  }
  function snare(S, t, vol = 0.1) {   // a big eighties snare: noise and a short tone into a long reverb
    const ctx = S.ctx, s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = S.noise; s.playbackRate.value = 1.8; bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = 0.6;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * 4, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    s.connect(bp); bp.connect(g); route(S, g, 1, 0.9); s.start(t, rnd(0, 3)); s.stop(t + 0.25); s.onended = () => g.disconnect();
    const o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(150, t + 0.08);
    og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(vol, t + 0.002); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(og); route(S, og, 1, 0.5); o.start(t); o.stop(t + 0.14); o.onended = () => og.disconnect();
  }
  function bleep(S, f, t, o = {}) {   // a short telemetry tone
    const ctx = S.ctx, osc = ctx.createOscillator(), g = ctx.createGain(), p = ctx.createStereoPanner(), d = o.dur || 0.07;
    osc.type = o.wave || 'sine'; osc.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.vol || 0.03, t + 0.004); g.gain.setValueAtTime(o.vol || 0.03, t + d); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.03);
    p.pan.value = o.pan || 0; osc.connect(g); g.connect(p); route(S, p, 0.8, o.verb == null ? 0.5 : o.verb, o.delay || 0.35);
    osc.start(t); osc.stop(t + d + 0.05); osc.onended = () => p.disconnect();
  }
  function sonar(S, m, t, vol = 0.05) {   // a slow ping that rings out into the delay
    bell(S, m, t, { vol, dur: 4.5, ratio: 1, index: 0.25, att: 0.01, pan: rnd(-0.4, 0.4), verb: 1, delay: 0.7, dry: 0.5 });
  }
  function crackle(S, t, vol = 0.01) {   // a burst of radio static
    const ctx = S.ctx, s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner(), d = rnd(0.15, 0.6);
    s.buffer = S.noise; s.playbackRate.value = 3; bp.type = 'bandpass'; bp.frequency.value = rnd(1200, 3200); bp.Q.value = 1.5;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    p.pan.value = rnd(-0.7, 0.7); s.connect(bp); bp.connect(g); g.connect(p); route(S, p, 1, 0.3);
    s.start(t, rnd(0, 3)); s.stop(t + d + 0.02); s.onended = () => p.disconnect();
  }
  function subPulse(S, m, t, vol = 0.16, dec = 0.32) {   // a pitched, rounded sub hit
    const ctx = S.ctx, o = ctx.createOscillator(), g = ctx.createGain(), sh = ctx.createWaveShaper();
    const c = new Float32Array(256); for (let i = 0; i < 256; i++) { const x = i / 127.5 - 1; c[i] = Math.tanh(x * 1.6); } sh.curve = c;
    o.type = 'sine'; o.frequency.setValueAtTime(mtof(m) * 2, t); o.frequency.exponentialRampToValueAtTime(mtof(m), t + 0.04);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    o.connect(sh); sh.connect(g); route(S, g, 1, 0.05); o.start(t); o.stop(t + dec + 0.05); o.onended = () => g.disconnect();
  }
  // a chord sequence that moves on by itself, with equal-power crossfades between pads
  function cycler(S, chords, secs, padOpts, t) {
    let p = null, i = -1, next = t;
    return {
      get chord() { return chords[Math.max(0, i)]; },
      schedule(t0, t1) {
        if (next < t0 - 1) next = t0;
        while (next < t1) {
          i = (i + 1) % chords.length; const c = chords[i];
          if (p) p.release(next, padOpts.xfade || 4);
          p = pad(S, c, next, Object.assign({ eq: true }, padOpts, { attack: p ? (padOpts.xfade || 4) : (padOpts.first || 1.5) }));
          next += secs;
        }
      },
      stop(at) { if (p) p.release(at, 2.5); },
    };
  }
  // ---- moods ----
  const MOODS = {
    golden: {
      label: 'Golden hour', note: 'Warm, slow chords that change as you turn the world, with the odd glint of a bell', level: 1.38,
      make(S, t) {
        let p = null, cur = 0, next = t + 2.5; const w = wind(S, 0.05, t);
        return {
          chord(i, at) {
            cur = i; if (p) p.release(at, 4.5);
            p = pad(S, CHORDS[i], at, { vol: 0.2, cutoff: 900, attack: 3.2, wave: 'sawtooth', detune: 8, sub: 0.35, verb: 0.55 });
          },
          schedule(t0, t1) {
            if (next < t0 - 0.5) next = t0 + 0.5;
            while (next < t1) {
              const up = Math.random() < 0.3 ? 12 : 0;
              bell(S, pick(CHORDS[cur].top) + up, next, { vol: 0.03, dur: 5, ratio: 2, index: 0.8, att: 0.03, pan: rnd(-0.6, 0.6), verb: 0.9, delay: 0.3, dry: 0.6 });
              next += rnd(3.5, 8);
            }
            w.schedule(t0, t1);
          },
          spark(v, at) { bell(S, pick(CHORDS[cur].top) + 12, at, { vol: 0.008 + 0.016 * v, dur: 2.5, ratio: 2, index: 0.6, att: 0.01, pan: rnd(-0.7, 0.7), verb: 0.9, delay: 0.3, dry: 0.4 }); },
          sparkGap: 260,
          stop(at) { if (p) p.release(at, 2.5); w.stop(at); },
        };
      },
    },
    mirage: {
      label: 'Mirage', note: 'Glassy notes shimmering in the heat. The dust chimes as your cursor moves through it', level: 1.36,
      make(S, t) {
        let d = null, cur = 0, next = t + 0.6;
        return {
          chord(i, at) {
            cur = i; const c = CHORDS[i];
            if (d) d.release(at, 4);
            d = pad(S, c, at, { notes: [c.bass + 12, c.bass + 19, c.bass + 24], vol: 0.13, cutoff: 520, attack: 3, wave: 'triangle', detune: 5, sub: 0.4, verb: 0.6 });
            if (at > t + 0.2) c.top.slice(0, 3).forEach((m, k) => bell(S, m + 12, at + k * 0.11, { vol: 0.04, dur: 2.5, ratio: 3.5, index: 1.1, pan: -0.4 + k * 0.4, verb: 0.7, delay: 0.35 }));
          },
          schedule(t0, t1) {
            if (next < t0 - 0.5) next = t0 + 0.2;
            while (next < t1) {
              const c = CHORDS[cur], m = pick(c.top) + (Math.random() < 0.35 ? 12 : 0);
              bell(S, m, next, { vol: rnd(0.03, 0.06), dur: rnd(2.5, 4.5), ratio: 3.5, index: rnd(0.9, 1.7), pan: rnd(-0.7, 0.7), verb: 0.75, delay: 0.4 });
              if (Math.random() < 0.18) bell(S, pick(c.top) + 12, next + 0.14, { vol: 0.025, dur: 2.5, ratio: 3.5, index: 1, pan: rnd(-0.7, 0.7), verb: 0.8, delay: 0.4 });
              next += Math.random() < 0.2 ? rnd(2.4, 4) : rnd(0.55, 1.6);
            }
          },
          spark(v, at) { bell(S, pick(CHORDS[cur].top) + 12, at, { vol: 0.012 + 0.03 * v, dur: 1.6, ratio: 3.5, index: 0.8, pan: rnd(-0.8, 0.8), verb: 0.8, delay: 0.3, dry: 0.6 }); },
          sparkGap: 120,
          stop(at) { if (d) d.release(at, 2.5); },
        };
      },
    },
    pulse: {
      label: 'Pulse', note: 'A soft beat under a plucked arpeggio. More forward energy, still relaxed', level: 1.9,
      make(S, t) {
        const E = 60 / 88 / 2, PAT = [0, 2, 4, 2, 1, 3, 5, 3];
        S.delayTime(E * 1.5);
        let p = null, cur = 0, want = 0, step = 0, nextT = t + 0.1;
        const tones = c => [...c.notes.map(m => m + 12), c.notes[1] + 24].sort((a, b) => a - b);
        return {
          chord(i) { want = i; },   // lands on the next bar line
          schedule(t0, t1) {
            if (nextT < t0 - 0.3) { step = Math.ceil(step / 8) * 8; nextT = t0 + 0.05; }
            while (nextT < t1) {
              const s = step % 8, bar = Math.floor(step / 8);
              if (s === 0 && (want !== cur || !p)) {
                cur = want; if (p) p.release(nextT, 2.5);
                p = pad(S, CHORDS[cur], nextT, { vol: 0.08, cutoff: 650, attack: 1.2, wave: 'sawtooth', detune: 9, sub: 0.45, verb: 0.45 });
              }
              const c = CHORDS[cur], tn = tones(c), idx = (bar % 4 === 3 ? [...PAT].reverse() : PAT)[s];
              pluck(S, tn[idx], nextT, { vol: s % 2 ? 0.055 : 0.075, dec: 0.36, cut: 2100 + 700 * Math.sin(bar * 0.7), pan: (idx / 5 - 0.5) * 0.8, verb: 0.25, delay: 0.3 });
              if (s === 0 || s === 3) pluck(S, c.bass + 12, nextT, { vol: 0.05, dec: 0.7, cut: 650, q: 2, low: true, verb: 0.08 });
              if (bar >= 1 && (s === 0 || s === 4)) thump(S, nextT, 0.15);
              if (bar >= 2 && s % 2 === 1) shaker(S, nextT, s === 3 || s === 7 ? 0.022 : 0.013);
              step++; nextT += E;
            }
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { if (p) p.release(at, 2); S.delayTime(0.42); },
        };
      },
    },
    heat: {
      label: 'Heat', note: 'A deep, cinematic drone with slow swells, like a film score. Turning the world lands with a soft boom', level: 0.94,
      make(S, t) {
        let d = null, cur = 0, next = t + 1.5; const w = wind(S, 0.08, t, { quick: true });
        return {
          chord(i, at) {
            cur = i; const c = CHORDS[i];
            const first = !d;
            if (d) d.release(at, 4);
            d = pad(S, c, at, { notes: [c.bass, c.bass + 7, c.bass + 12, c.bass + 19, c.bass + 24], vol: 0.26, cutoff: 520, q: 1.2, attack: first ? 0.5 : 4, eq: true, wave: 'sawtooth', detune: 10, sub: 0.5, verb: 0.7 });
            if (at > t + 0.2) boom(S, at, 0.2);
          },
          schedule(t0, t1) {
            if (next < t0 - 0.5) next = t0 + 1;
            while (next < t1) {
              const c = CHORDS[cur];
              swell(S, pick(c.notes) + 12, next, { vol: 0.045, att: rnd(3, 5), rel: rnd(5, 7), pan: rnd(-0.5, 0.5) });
              if (Math.random() < 0.4) swell(S, pick(c.top), next + rnd(1, 2.5), { vol: 0.025, att: rnd(3, 4), rel: rnd(5, 7), pan: rnd(-0.6, 0.6), cut: 2200 });
              next += rnd(6, 10);
            }
            w.schedule(t0, t1);
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { if (d) d.release(at, 3); w.stop(at); },
        };
      },
    },
    // ---- the city ----
    neonrain: {
      label: 'Neon rain', note: 'Lush, slow synth chords and brass swells over the rain, in the spirit of an eighties sci-fi score', level: 1.1,
      make(S, t) {
        const CH = [
          { bass: 37, notes: [49, 56, 59, 63, 64], top: [68, 71, 73, 75, 76, 80] },   // C#m9
          { bass: 33, notes: [45, 52, 56, 59, 61], top: [68, 71, 73, 76, 80] },       // Amaj9
          { bass: 30, notes: [54, 57, 59, 61, 64], top: [66, 69, 73, 76, 78] },       // F#m11
          { bass: 32, notes: [52, 56, 59, 63, 66], top: [68, 71, 75, 78, 80] },       // E/G#
        ];
        const cyc = cycler(S, CH, 11, { vol: 0.2, cutoff: 1150, q: 1.6, wave: 'sawtooth', detune: 14, sub: 0.5, verb: 0.85, xfade: 4.5, first: 2.5 }, t + 0.1);
        const r = rain(S, 0.035, t); let next = t + 4, thunder = t + rnd(20, 35);
        return {
          chord() {},
          schedule(t0, t1) {
            cyc.schedule(t0, t1); r.schedule(t0, t1);
            if (next < t0 - 0.5) next = t0 + 2;
            while (next < t1) {   // a short brass phrase now and then
              const c = cyc.chord, n = 1 + Math.floor(Math.random() * 3); let at = next;
              for (let k = 0; k < n; k++) { const d = rnd(1.4, 2.6); brass(S, pick(c.top) - (Math.random() < 0.5 ? 12 : 0), at, { vol: 0.045, att: d * 0.6, hold: d * 0.5, rel: 3.5, pan: rnd(-0.4, 0.4) }); at += d; }
              next = at + rnd(5, 10);
            }
            if (thunder < t1) { boom(S, thunder, 0.13); thunder += rnd(30, 55); }
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { cyc.stop(at); r.stop(at); },
        };
      },
    },
    nightdrive: {
      label: 'Night drive', note: 'Synthwave: a driving bass line, gated chords, an echoing arpeggio and a big snare', level: 2.2,
      make(S, t) {
        const BPM = 96, E = 60 / BPM / 4;   // sixteenths
        S.delayTime(E * 3);
        const CH = [
          { bass: 33, notes: [57, 60, 64, 67], top: [69, 72, 76, 79] },   // Am7
          { bass: 29, notes: [57, 60, 65, 69], top: [69, 72, 77, 81] },   // Fmaj7
          { bass: 36, notes: [55, 60, 64, 67], top: [67, 72, 76, 79] },   // C
          { bass: 31, notes: [55, 59, 62, 67], top: [67, 71, 74, 79] },   // G
        ];
        let step = 0, nextT = t + 0.1, p = null;
        const BASS = [0, 0, 12, 0, 0, 12, 0, 7, 0, 0, 12, 0, 0, 12, 7, 12];
        return {
          chord() {},
          schedule(t0, t1) {
            if (nextT < t0 - 0.3) { step = Math.ceil(step / 16) * 16; nextT = t0 + 0.05; }
            while (nextT < t1) {
              const s = step % 16, bar = Math.floor(step / 16), c = CH[Math.floor(bar / 2) % 4];
              if (s === 0 && bar % 2 === 0) { if (p) p.release(nextT, 0.6); p = pad(S, c, nextT, { vol: 0.07, cutoff: 1500, q: 1, attack: 0.4, wave: 'sawtooth', detune: 12, verb: 0.6 }); }
              pluck(S, c.bass + 12 + BASS[s], nextT, { vol: 0.07, dec: 0.18, cut: 900 + 500 * Math.sin(bar * 0.9 + s * 0.2), q: 6, low: true, verb: 0.05 });
              if (bar >= 1 && s % 2 === 0) { const tn = c.top, k = (s / 2) % tn.length; pluck(S, tn[(k * 2) % tn.length] + (s % 8 === 6 ? 12 : 0), nextT, { vol: 0.035, dec: 0.25, cut: 3200, pan: ((s % 4) - 1.5) * 0.4, verb: 0.3, delay: 0.5 }); }
              if (bar >= 2 && (s === 0 || s === 8)) thump(S, nextT, 0.17);
              if (bar >= 2 && (s === 4 || s === 12)) snare(S, nextT, 0.07);
              if (bar >= 3 && s % 2 === 1) shaker(S, nextT, 0.012);
              step++; nextT += E;
            }
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { if (p) p.release(at, 1.5); S.delayTime(0.42); },
        };
      },
    },
    wire: {
      label: 'Wire', note: 'Dark and minimal: a low pulse, metallic pings in the echo and the rain, like a signal in the network', level: 1.7,
      make(S, t) {
        const E = 60 / 112 / 4; S.delayTime(E * 3);
        const D = { bass: 26, notes: [38, 45, 50, 52, 53], top: [62, 65, 67, 69, 72, 74] };   // Dm(add9)
        const drone = pad(S, D, t + 0.1, { vol: 0.12, cutoff: 420, q: 2.5, attack: 2, eq: true, wave: 'triangle', detune: 6, sub: 0.3, verb: 0.6 });
        const r = rain(S, 0.02, t); let step = 0, nextT = t + 0.2;
        return {
          chord() {},
          schedule(t0, t1) {
            r.schedule(t0, t1);
            if (nextT < t0 - 0.3) { step = Math.ceil(step / 16) * 16; nextT = t0 + 0.05; }
            while (nextT < t1) {
              const s = step % 16, bar = Math.floor(step / 16);
              if (s % 4 === 0) subPulse(S, 38, nextT, s === 0 ? 0.17 : 0.11, 0.3);
              if (s === 14 && bar % 2) subPulse(S, 38, nextT, 0.08, 0.2);
              if (bar >= 1 && Math.random() < (s % 4 === 2 ? 0.45 : 0.12)) bell(S, pick(D.top) + (Math.random() < 0.3 ? 12 : 0), nextT, { vol: 0.03, dur: 1.4, ratio: 1.41, index: 2.6, pan: rnd(-0.8, 0.8), verb: 0.4, delay: 0.55, dry: 0.7 });
              if (bar >= 2 && s % 2 === 1) shaker(S, nextT, s % 4 === 3 ? 0.012 : 0.006);
              step++; nextT += E;
            }
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { drone.release(at, 2.5); r.stop(at); S.delayTime(0.42); },
        };
      },
    },
    // ---- orbit ----
    orbit: {
      label: 'Orbit', note: 'Vast, slow organ-like chords with shimmering high notes. No beat, just space', level: 1.35,
      make(S, t) {
        const CH = [
          { bass: 40, notes: [52, 59, 63, 66, 71], top: [75, 78, 80, 83, 87] },   // Emaj9
          { bass: 36, notes: [48, 55, 59, 62, 66], top: [74, 78, 79, 83, 86] },   // Cmaj7#11
          { bass: 33, notes: [45, 52, 56, 59, 64], top: [71, 73, 76, 80, 83] },   // Amaj9
          { bass: 35, notes: [47, 54, 59, 61, 66], top: [73, 75, 78, 83, 85] },   // Bsus
        ];
        const cyc = cycler(S, CH, 14, { vol: 0.17, cutoff: 1400, q: 0.7, wave: 'triangle', detune: 4, sub: 0.45, verb: 0.9, xfade: 6, first: 3 }, t + 0.1);
        let next = t + 3;
        return {
          chord() {},
          schedule(t0, t1) {
            cyc.schedule(t0, t1);
            if (next < t0 - 0.5) next = t0 + 1;
            while (next < t1) {
              const c = cyc.chord;
              bell(S, pick(c.top), next, { vol: 0.022, dur: 6, ratio: 2, index: 0.5, att: 0.08, pan: rnd(-0.7, 0.7), verb: 1, delay: 0.5, dry: 0.4 });
              if (Math.random() < 0.3) swell(S, pick(c.notes) + 12, next + rnd(0.5, 2), { vol: 0.03, att: 5, rel: 7, pan: rnd(-0.5, 0.5), cut: 1800 });
              next += rnd(3, 7);
            }
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { cyc.stop(at); },
        };
      },
    },
    signal: {
      label: 'Signal', note: 'A warm drone with telemetry bleeps, sonar pings and the odd crackle of radio, the sound of reaching out', level: 1.85,
      make(S, t) {
        const D = { bass: 38, notes: [50, 57, 62, 64, 69], top: [74, 76, 78, 81, 83, 86] };
        const drone = pad(S, D, t + 0.1, { vol: 0.15, cutoff: 700, q: 1, attack: 2.5, eq: true, wave: 'sawtooth', detune: 8, sub: 0.45, verb: 0.75 });
        let nextB = t + 1.5, nextS = t + 4, nextC = t + 6;
        return {
          chord() {},
          schedule(t0, t1) {
            if (nextB < t0 - 0.5) nextB = t0 + 0.5;
            while (nextB < t1) {   // a little burst of data
              const n = 2 + Math.floor(Math.random() * 5), base = pick([1760, 2093, 2349, 2637]), pan = rnd(-0.7, 0.7);
              for (let k = 0; k < n; k++) bleep(S, base * (Math.random() < 0.3 ? 1.5 : 1), nextB + k * 0.11, { vol: 0.018, dur: 0.05, pan, delay: 0.3 });
              nextB += rnd(2.5, 6);
            }
            if (nextS < t1) { sonar(S, pick(D.top), nextS, 0.045); nextS += rnd(7, 12); }
            if (nextC < t1) { crackle(S, nextC, 0.012); nextC += rnd(5, 14); }
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { drone.release(at, 2.5); },
        };
      },
    },
  };
  return { MOODS, bus, CHORDS };
})();
const WORLD_MOODS = { desert: ['golden', 'mirage', 'pulse', 'heat'], studio: ['heat', 'golden'], city: ['neonrain', 'nightdrive', 'wire'], orbit: ['orbit', 'signal'] };
const Sound = (() => {
  let ctx = null, A = null, master, duckGain, eng = null, engChord = -1, on = false, timer = 0, lastSpark = 0;
  let mood = 'heat', soundWorld = 'desert', engKey = null;   // mood: the desert's choice; the other worlds remember theirs in chosen
  const chosen = {};
  try { const m = localStorage.getItem('freak-sound-mood'); if (m && WORLD_MOODS.desert.includes(m)) mood = m; } catch (e) {}
  try { Object.assign(chosen, JSON.parse(localStorage.getItem('freak-world-sound') || '{}')); } catch (e) {}
  const current = () => soundWorld === 'desert' ? mood : (WORLD_MOODS[soundWorld].includes(chosen[soundWorld]) ? chosen[soundWorld] : WORLD_MOODS[soundWorld][0]);
  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    duckGain = ctx.createGain(); duckGain.gain.value = 1; duckGain.connect(master);
    A = SoundKit.bus(ctx, duckGain);
    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      if (document.hidden) ctx.suspend(); else if (on) ctx.resume();
    });
  }
  function startMood(key) {
    const t = ctx.currentTime + 0.05;
    if (eng) { eng.stop(t); eng.S.dispose(t); }
    const M = SoundKit.MOODS[key], S = A.sub(M.level);
    eng = M.make(S, t); eng.S = S; eng.chord(stopIndex, t); engChord = stopIndex; engKey = key;
  }
  function loop() { if (on && eng) { const t = ctx.currentTime; eng.schedule(t, t + 0.35); } }
  function set(v) {
    if (!ctx) build();
    on = v;
    if (on) {
      ctx.resume();
      if (!eng || engKey !== current()) startMood(current()); else if (engChord !== stopIndex) { eng.chord(stopIndex, ctx.currentTime + 0.05); engChord = stopIndex; }
      clearInterval(timer); timer = setInterval(loop, 100); loop();
    } else {
      clearInterval(timer);
      setTimeout(() => { if (!on && ctx) ctx.suspend(); }, 900);
    }
    master.gain.setTargetAtTime(on ? 0.8 : 0, ctx.currentTime, on ? 0.08 : 0.35);
    return on;
  }
  function setMood(key) {
    if (!SoundKit.MOODS[key] || key === engKey && eng) return;
    if (soundWorld === 'desert') { mood = key; try { localStorage.setItem('freak-sound-mood', key); } catch (e) {} }
    else { chosen[soundWorld] = key; try { localStorage.setItem('freak-world-sound', JSON.stringify(chosen)); } catch (e) {} }
    if (ctx && on) startMood(key);
  }
  function setWorld(key) { soundWorld = key; if (ctx && on && current() !== engKey) startMood(current()); }   // a new world brings its own music
  function chord(i) { if (on && eng && engChord !== i) { eng.chord(i, ctx.currentTime + 0.03); engChord = i; } }
  function spark(v) {   // the cursor moving through the dust
    if (!on || !eng) return;
    const now = performance.now();
    if (now - lastSpark < eng.sparkGap) return;
    lastSpark = now; eng.spark(Math.min(1, v), ctx.currentTime + 0.01);
  }
  function tick(freq = 1174.7, vol = 0.035) {   // a small, tuned tap for clicks
    if (!on) return;
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.2);
  }
  function whoosh(dir = 1) {
    if (!on) return;
    const t = ctx.currentTime, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = A.noise; f.type = 'bandpass'; f.Q.value = 1.1;
    f.frequency.setValueAtTime(dir > 0 ? 260 : 1900, t); f.frequency.exponentialRampToValueAtTime(dir > 0 ? 1900 : 260, t + 0.9);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.32, t + 0.28); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
    s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random() * 2); s.stop(t + 1.05);
  }
  function duck(down) { if (ctx) duckGain.gain.setTargetAtTime(down ? 0.35 : 1, ctx.currentTime, 0.4); }
  return { set, setMood, setWorld, chord, spark, tick, whoosh, duck, get on() { return on; }, get mood() { return current(); }, get world() { return soundWorld; } };
})();
const soundBtn = document.getElementById('soundBtn'), moodsEl = document.getElementById('moods');
function renderMoods() {   // the options for the world you are in
  moodsEl.innerHTML = '<div class="moods-top"><p class="moods-h">Sound options</p><button type="button" class="moods-x" aria-label="Close sound options">'
    + '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8"/></svg></button></div>'
    + WORLD_MOODS[Sound.world].map(k => { const m = SoundKit.MOODS[k];
      return `<button type="button" role="radio" data-mood="${k}" aria-checked="${k === Sound.mood}"><b>${m.label}</b><small>${m.note}</small></button>`; }).join('');
}
renderMoods();
let moodsOpen = false;   // opens each time sound is turned on; the X, Escape or a click outside closes it, and the sound keeps playing
function showMoods() { moodsEl.hidden = !Sound.on || !moodsOpen || !!openSheet; }
moodsEl.addEventListener('click', e => {
  if (e.target.closest('.moods-x')) { moodsOpen = false; showMoods(); soundBtn.focus(); return; }
  const b = e.target.closest('[data-mood]'); if (!b) return;
  Sound.setMood(b.dataset.mood);
  moodsEl.querySelectorAll('[data-mood]').forEach(x => x.setAttribute('aria-checked', String(x === b)));
});
addEventListener('freak:route', () => setTimeout(showMoods, 60));
addEventListener('keydown', e => { if (e.key === 'Escape' && !moodsEl.hidden) { moodsOpen = false; showMoods(); } });
addEventListener('pointerdown', e => {   // a press anywhere outside the panel (or the sound button) closes it
  if (moodsEl.hidden || moodsEl.contains(e.target) || soundBtn.contains(e.target)) return;
  moodsOpen = false; showMoods();
}, true);
soundBtn.addEventListener('click', () => {
  const v = Sound.set(!Sound.on);
  soundBtn.setAttribute('aria-pressed', String(v));
  soundBtn.setAttribute('aria-label', v ? 'Sound on. Turn off ambient sound' : 'Sound off. Turn on ambient sound');
  soundBtn.querySelector('.sound-label').textContent = v ? 'Sound on' : 'Sound off';
  moodsOpen = v; showMoods();
});


/* ---------------- capabilities page ---------------- */
const PROOF = [
  { c: 'feliway', stat: '2x', label: 'monthly Amazon sales for Feliway' },
  { c: 'macmillan', stat: '1.2m', label: 'views for Macmillan, from a £1,000 promotion budget' },
  { c: 'nyb', stat: '3', label: 'Channel 4 idents for New York Bakery, shot in one day' },
  { c: 'drscholls', stat: '120m', label: "impressions for Dr Scholl's across Europe" },
  { c: 'va', stat: '500+', label: 'archive items mapped in 3D for the V&A' },
  { c: 'feliway', stat: '48%', label: 'more ordered revenue across 64 Ceva products, with images scored in Freak Lab' },
];
const capPage = document.getElementById('capPage');
const capSheet = document.getElementById('sheet-capabilities');
const clientOf = id => (WORK.find(w => w.id === id) || {}).client || id;
// phones: each section carries its own proof underneath
capPage.querySelectorAll('.pillar').forEach(li => {
  const p = PROOF[+li.dataset.proof];
  li.querySelector('.pillar-body').insertAdjacentHTML('beforeend', `<div class="pillar-proof">
    <div class="pp-frame"><video muted loop playsinline preload="none" data-poster="img/${p.c}.webp" data-src="vid/${p.c}-preview.mp4" aria-hidden="true"></video></div>
    <b>${esc(p.stat)}</b><span>${esc(p.label)}</span>
    <a class="stage-link" href="/work/${p.c}" data-open="work-${p.c}">See it in <span>${esc(clientOf(p.c))}</span>${arrowR}</a></div>`);
});
let capIO = null, pillarIO = null, filmIO = null, stageIndex = -1;
function setStage(i) {
  if (i === stageIndex) return;
  stageIndex = i;
  const p = PROOF[i];
  capPage.querySelectorAll('.pillar').forEach((li, k) => li.classList.toggle('active', k === i));
  capPage.querySelectorAll('.stage-steps li').forEach((li, k) => li.classList.toggle('on', k === i));
  const proof = capPage.querySelector('.stage-proof');
  document.getElementById('stageStat').textContent = p.stat;
  document.getElementById('stageLabel').textContent = p.label;
  proof.classList.remove('swap'); void proof.offsetWidth; proof.classList.add('swap');
  const link = document.getElementById('stageLink');
  link.dataset.open = 'work-' + p.c; link.querySelector('span').textContent = clientOf(p.c);
  // crossfade between the two video layers
  const [a, b] = capPage.querySelectorAll('.stage-frame video');
  const cur = a.classList.contains('on') ? a : b, next = cur === a ? b : a;
  next.poster = `img/${p.c}.webp`; next.src = `vid/${p.c}-preview.mp4`;
  if (!reduced) next.play().catch(() => {});
  next.classList.add('on'); cur.classList.remove('on');
  setTimeout(() => { if (!cur.classList.contains('on')) cur.pause(); }, 700);
}
// the phone proof clips get their posters only when the sheet opens, and only where they show,
// so the five case thumbnails are not part of the first download
function proofPosters() {
  capPage.querySelectorAll('.pillar-proof video:not([poster])').forEach(v => { if (v.offsetParent) v.poster = v.dataset.poster; });
}
function setupCapFx(instant) {
  teardownCapFx();
  setStage(0);
  proofPosters(); requestAnimationFrame(proofPosters);
  if (reduced) return;
  if (instant) shownNow(capPage, capSheet, '.up, [data-count], .how-steps');
  capPage.classList.add('fx');
  capPage.querySelectorAll('[data-count]:not([data-shown])').forEach(b => { b.textContent = formatCount(b.dataset.count, 0); });
  capIO = new IntersectionObserver(entries => {
    for (const en of entries) if (en.isIntersecting) { reveal(en.target); capIO.unobserve(en.target); }
  }, { root: capSheet, threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  capPage.querySelectorAll('.up, [data-count], .how-steps').forEach(el => { if (!el.dataset.shown) capIO.observe(el); });
  // the section crossing the middle of the screen drives the pinned stage
  pillarIO = new IntersectionObserver(entries => {
    for (const en of entries) if (en.isIntersecting) setStage(+en.target.dataset.proof);
  }, { root: capSheet, rootMargin: '-45% 0px -50% 0px' });
  capPage.querySelectorAll('.pillar').forEach(li => pillarIO.observe(li));
  // phones: clips play only while on screen
  filmIO = new IntersectionObserver(entries => {
    for (const en of entries) {
      const v = en.target;
      if (en.isIntersecting) { if (!v.poster) v.poster = v.dataset.poster; if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause();
    }
  }, { root: capSheet, threshold: 0.4 });
  capPage.querySelectorAll('.pillar-proof video').forEach(v => filmIO.observe(v));
  if (fineHover) smoothOn(capSheet, null);
  ReachMap.attach();
}
function teardownCapFx() {
  for (const io of [capIO, pillarIO, filmIO]) if (io) io.disconnect();
  capIO = pillarIO = filmIO = null;
  capPage.querySelectorAll('video').forEach(v => v.pause());
  ReachMap.detach();
}
// client and sector lines (names set in type until approved logo files are supplied)
(() => {
  const CLIENTS = ['Hoover', 'RNIB', 'Hovis', 'V&A', "Dr. Scholl's", 'Macmillan Cancer Support', 'Live Nation', 'LUSH', 'New York Bakery', 'Yutaka', 'Feliway', 'Evermix', 'G.Network', 'Astus'];
  const SECTORS = ['FMCG', 'Retail', 'Pharma', 'Electronics', 'Fashion', 'Charity and NGO', 'Infrastructure', 'Live events', 'Culture'];
  const fill = (sel, list) => {
    const t = capPage.querySelector(sel + ' .track');
    const once = list.map(n => `<span class="item">${esc(n)}</span>`).join('');
    t.innerHTML = once + `<span class="dup" aria-hidden="true" style="display:contents">${once}</span>`;
    t.parentElement.setAttribute('aria-label', list.join(', '));
  };
  fill('.marquee.big', CLIENTS); fill('.marquee.small', SECTORS);
})();

/* ---------------- reach map ----------------
   A dot map drawn on canvas from real country outlines (Natural Earth via world-atlas, Equal Earth projection),
   pre-computed into img/worldmap.json. Countries we've worked in are lime, offices white with a pulse.
   Dots light up in a wave from London when the map comes into view; regions zoom; hover or tap shows a card. */
const ReachMap = (() => {
  const LIME = '#a6f20a', HOT = '#eaffc4', GREY = '#4a4743';
  const cv = document.getElementById('reachMap'), tip = document.getElementById('mapTip'), card = document.getElementById('mapCard');
  const ctx = cv.getContext('2d');
  let data = null, loading = null, layers = {}, attached = false, visible = false, raf = 0, dpr = 1, cw = 0, ch = 0;
  let view = null, zoomFrom = null, zoomTo = null, zoomT = 1, base = null;
  let revealAt = -1, hover = -1, hoverAt = 0, lastT = 0, region = 'all';
  const officeOf = {};
  async function load() {
    if (data) return data;
    if (!loading) loading = fetch('img/worldmap.json').then(r => r.json()).then(d => {
      const k = v => v / 10;
      d.countries.forEach(c => { if (c.a) c.a = [k(c.a[0]), k(c.a[1])]; });
      for (const name of ['coarse', 'fine']) {
        const pts = d[name].map(([x, y, i]) => ({ x: k(x), y: k(y), i }));
        const cell = name === 'coarse' ? 7.2 : 3.0, hash = new Map();
        pts.forEach((p, n) => { const key = Math.floor(p.x / cell) + ',' + Math.floor(p.y / cell); (hash.get(key) || hash.set(key, []).get(key)).push(n); });
        layers[name] = { pts, cell, hash, r: name === 'coarse' ? 2.15 : 0.95 };
      }
      d.offices.forEach(o => { o.p = [k(o.p[0]), k(o.p[1])]; officeOf[o.country] = o; });
      d.arcs.forEach(a => { a.to = [k(a.to[0]), k(a.to[1])]; a.fromP = d.offices.find(o => o.name === a.from).p; });
      const lon = d.offices[0].p;
      for (const L of Object.values(layers)) { let m = 0; L.pts.forEach(p => { p.d = Math.hypot(p.x - lon[0], p.y - lon[1]); m = Math.max(m, p.d); }); L.max = m; }
      // region zoom boxes (pre-computed from each region's longitude and latitude range)
      d.boxes = {};
      for (const [r, b] of Object.entries(d.regions)) d.boxes[r] = b.map(k);
      buildList(d);
      return (data = d);
    });
    return loading;
  }
  function buildList(d) {
    const by = {};
    d.countries.forEach(c => { if (c.r && !['Jersey', 'Guernsey', 'Isle of Man', 'Åland', 'Faeroe Is.', 'Puerto Rico', 'Hong Kong', 'Macao'].includes(c.n)) (by[c.r] = by[c.r] || []).push(nice(c.n)); });
    document.getElementById('countryList').innerHTML = ['Europe', 'North America', 'Latin America', 'Middle East & Africa', 'Asia Pacific']
      .filter(r => by[r]).map(r => `<h4>${esc(r)}</h4><p>${by[r].sort().map(esc).join(', ')}</p>`).join('');
  }
  const NICE = { 'United States of America': 'United States', 'Bosnia and Herz.': 'Bosnia and Herzegovina', 'Macedonia': 'North Macedonia', 'Solomon Is.': 'Solomon Islands', 'Czechia': 'Czech Republic', 'Vatican': 'Vatican City' };
  const nice = n => NICE[n] || n;
  function fitBox(x0, y0, x1, y1, pad) {
    const w = (x1 - x0) * (1 + pad * 2) || 1, h = (y1 - y0) * (1 + pad * 2) || 1;
    const s = Math.min(cw / w, ch / h);
    return { s, x: (x0 + x1) / 2 - cw / s / 2, y: (y0 + y1) / 2 - ch / s / 2 };
  }
  function regionView(r) {
    if (r === 'all' || !data.boxes[r]) return base;
    const [x0, y0, x1, y1] = data.boxes[r];
    const v = fitBox(x0, y0, x1, y1, 0.02);
    const vw = cw / v.s;
    if (vw < data.W) v.x = Math.max(-10, Math.min(v.x, data.W + 10 - vw));   // don't show empty sea past the map's edges
    return v;
  }
  function size() {
    const rect = cv.getBoundingClientRect(); if (!rect.width) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    cw = rect.width; ch = Math.round(cw * (cw < 600 ? 0.7 : 0.5));
    cv.style.height = ch + 'px'; cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
    base = fitBox(0, 0, data.W, data.H, 0.0);
    view = regionView(region); zoomT = 1;
  }
  const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  function curView() {
    if (zoomT >= 1 || !zoomFrom) return view;
    const e = ease(zoomT);
    // zoom in log space so the move feels even
    const s = Math.exp(Math.log(zoomFrom.s) + (Math.log(zoomTo.s) - Math.log(zoomFrom.s)) * e);
    const cxF = zoomFrom.x + cw / zoomFrom.s / 2, cyF = zoomFrom.y + ch / zoomFrom.s / 2, cxT = zoomTo.x + cw / zoomTo.s / 2, cyT = zoomTo.y + ch / zoomTo.s / 2;
    const cx = cxF + (cxT - cxF) * e, cy = cyF + (cyT - cyF) * e;
    return { s, x: cx - cw / s / 2, y: cy - ch / s / 2 };
  }
  function zoom(r) {
    region = r;
    zoomFrom = curView(); zoomTo = regionView(r); view = zoomTo; zoomT = reduced ? 1 : 0;
    hideTip(); kick();
  }
  function arcPoint(a, b, t) {   // a gentle arc that bows upwards
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - Math.min(140, Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.32);
    const u = 1 - t; return [u * u * a[0] + 2 * u * t * mx + t * t * b[0], u * u * a[1] + 2 * u * t * my + t * t * b[1]];
  }
  function drawArc(a, b, frac, v, alpha, width) {
    ctx.beginPath();
    const n = 48, upto = Math.max(1, Math.round(n * frac));
    for (let k = 0; k <= upto; k++) { const [x, y] = arcPoint(a, b, k / n); const X = (x - v.x) * v.s, Y = (y - v.y) * v.s; k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
    ctx.strokeStyle = `rgba(166, 242, 10, ${alpha})`; ctx.lineWidth = width; ctx.stroke();
  }
  function draw(now) {
    const v = curView(), rel = v.s / base.s;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    const tRev = revealAt < 0 ? 0 : reduced ? 1e9 : (now - revealAt) / 1000;
    // coarse dots at world scale, fine dots once zoomed in, crossfading between 1.5x and 2.1x
    const mix = Math.min(1, Math.max(0, (rel - 1.5) / 0.6));
    for (const [name, alphaLayer] of [['coarse', 1 - mix], ['fine', mix]]) {
      if (alphaLayer <= 0.01) continue;
      const L = layers[name], r = Math.max(0.8, L.r * v.s * (name === 'fine' ? 1 : Math.min(1.25, Math.max(0.7, 1 / Math.sqrt(rel)))));
      const groups = { grey: [], lime: [], hot: [] };
      for (const p of L.pts) {
        const X = (p.x - v.x) * v.s, Y = (p.y - v.y) * v.s;
        if (X < -4 || Y < -4 || X > cw + 4 || Y > ch + 4) continue;
        const appear = Math.min(1, Math.max(0, (tRev - (p.d / L.max) * 1.6) / 0.35));
        if (appear <= 0) continue;
        const c = data.countries[p.i];
        (c.r ? (p.i === hover ? groups.hot : groups.lime) : groups.grey).push([X, Y, appear]);
      }
      for (const [g, col] of [['grey', GREY], ['lime', LIME], ['hot', HOT]]) {
        ctx.fillStyle = col;
        for (const [X, Y, a] of groups[g]) { ctx.globalAlpha = alphaLayer * a; ctx.beginPath(); ctx.arc(X, Y, r * (0.6 + 0.4 * a), 0, 6.283); ctx.fill(); }
      }
    }
    ctx.globalAlpha = 1;
    // routes from the offices
    const arcT = Math.min(1, Math.max(0, (tRev - 1.2) / 1.4));
    if (arcT > 0) for (const a of data.arcs) drawArc(a.fromP, a.to, ease(arcT), v, 0.5, 1.1);
    if (hover >= 0 && data.countries[hover].a) {
      const c = data.countries[hover], o = nearestOffice(c.a);
      if (o && Math.hypot(o.p[0] - c.a[0], o.p[1] - c.a[1]) > 3) drawArc(o.p, c.a, Math.min(1, (now - hoverAt) / 450), v, 0.95, 1.6);
    }
    // offices: white core, lime pulse, name
    const officeIn = Math.min(1, Math.max(0, (tRev - 0.2) / 0.5));
    ctx.font = '600 12px "Plus Jakarta Sans", Arial, sans-serif'; ctx.textBaseline = 'middle';
    data.offices.forEach((o, k) => {
      const X = (o.p[0] - v.x) * v.s, Y = (o.p[1] - v.y) * v.s;
      const ph = reduced ? 0.5 : ((now / 1000 + k * 0.6) % 2) / 2;
      ctx.globalAlpha = officeIn * (1 - ph) * 0.8; ctx.strokeStyle = LIME; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(X, Y, 5 + ph * 16, 0, 6.283); ctx.stroke();
      ctx.globalAlpha = officeIn; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(X, Y, 4, 0, 6.283); ctx.fill();
      // labels sit where they won't collide: London above, Barcelona below, Abu Dhabi to the right
      const lab = o.name, w = ctx.measureText(lab).width;
      const [lx, ly] = o.name === 'London' ? [X - w - 9, Y - 12] : o.name === 'Barcelona' ? [X - w - 9, Y + 12] : [X + 10, Y];
      ctx.fillStyle = 'rgba(20, 20, 20, .65)'; ctx.fillRect(lx - 5, ly - 9, w + 10, 18);
      ctx.fillStyle = '#fff'; ctx.fillText(lab, lx, ly);
    });
    ctx.globalAlpha = 1;
  }
  function nearestOffice(a) {
    let best = null, bd = 1e9;
    for (const o of data.offices) { const d = Math.hypot(o.p[0] - a[0], o.p[1] - a[1]); if (d < bd) { bd = d; best = o; } }
    return best;
  }
  function loop(now) {
    raf = 0;
    if (!attached || !visible || !data) return;
    if (zoomT < 1) zoomT = Math.min(1, zoomT + (now - (lastT || now)) / 900);
    lastT = now;
    draw(now);
    raf = requestAnimationFrame(loop);   // keeps running while on screen for the office pulses
  }
  function kick() { if (data && !base) size(); if (!raf && attached && visible && data && base) { lastT = 0; raf = requestAnimationFrame(loop); } }
  function hit(clientX, clientY) {
    const rect = cv.getBoundingClientRect(), v = curView(), rel = v.s / base.s;
    const L = rel > 1.8 ? layers.fine : layers.coarse;
    const wx = (clientX - rect.left) / v.s + v.x, wy = (clientY - rect.top) / v.s + v.y;
    const cx = Math.floor(wx / L.cell), cy = Math.floor(wy / L.cell);
    let best = -1, bd = L.cell * 0.9;
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      for (const n of L.hash.get((cx + dx) + ',' + (cy + dy)) || []) {
        const p = L.pts[n], d = Math.hypot(p.x - wx, p.y - wy);
        if (d < bd) { bd = d; best = p.i; }
      }
    }
    return best;
  }
  function info(i) {
    const c = data.countries[i], o = officeOf[c.n];
    return `<b>${esc(nice(c.n))}</b><span>${esc(c.r)}</span>${o ? `<i>${esc(o.label)} · ${esc(o.name)}</i>` : ''}`;
  }
  function setHover(i) { if (i !== hover) { hover = i; hoverAt = performance.now(); } }
  function hideTip() { tip.hidden = true; setHover(-1); }
  cv.addEventListener('pointermove', e => {
    if (!data || e.pointerType !== 'mouse') return;
    const i = hit(e.clientX, e.clientY);
    if (i >= 0 && data.countries[i].r) {
      setHover(i);
      const rect = cv.getBoundingClientRect();
      tip.innerHTML = info(i); tip.hidden = false;
      const x = e.clientX - rect.left, flip = x > rect.width - 220;
      tip.style.left = x + 'px'; tip.style.top = (e.clientY - rect.top) + 'px';
      tip.style.transform = flip ? 'translate(calc(-100% - 16px), -50%)' : 'translate(16px, -50%)';
    } else hideTip();
  });
  cv.addEventListener('pointerleave', hideTip);
  cv.addEventListener('click', e => {           // touch and pen: tap a country for its card
    if (!data || e.pointerType === 'mouse') return;
    const i = hit(e.clientX, e.clientY);
    if (i >= 0 && data.countries[i].r) { setHover(i); card.innerHTML = info(i); card.hidden = false; }
    else { setHover(-1); card.hidden = true; }
  });
  document.querySelector('.reach .regions').addEventListener('click', e => {
    const b = e.target.closest('[data-region]'); if (!b || !data) return;
    document.querySelectorAll('.reach .regions button').forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); });
    card.hidden = true; zoom(b.dataset.region); Sound.tick();
  });
  let visIO = null, resizeT = 0;
  const onResize = () => { clearTimeout(resizeT); resizeT = setTimeout(() => { if (data) { size(); kick(); } }, 120); };
  return {
    async attach() {
      attached = true;
      await load();
      if (!attached) return;
      size();
      addEventListener('resize', onResize);
      visIO = new IntersectionObserver(([en]) => {
        visible = en.isIntersecting;
        if (visible && revealAt < 0) revealAt = performance.now();
        kick();
      }, { root: capSheet, threshold: 0.2 });
      visIO.observe(cv);
    },
    detach() {
      attached = false; visible = false;
      if (visIO) { visIO.disconnect(); visIO = null; }
      removeEventListener('resize', onResize);
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    },
  };
})();

const WDIR = 'w/', LOGO_URL = 'img/freak-logo.txt';
/* ---------------- shared by the worlds ---------------- */
const phone = matchMedia('(max-width: 720px)').matches;
const rnd = (a, b) => a + Math.random() * (b - a);
const WORLDS = {};
/* Assets are fetched in the background (prefetchAssets) and kept as blob URLs, so building a world later
   never waits on the network. */
const ASSET = new Map();
const asset = u => ASSET.get(u) || u;
async function prefetchAssets(urls) {
  for (const u of urls) {
    if (ASSET.has(u)) continue;
    try { const r = await fetch(u); if (r.ok) ASSET.set(u, URL.createObjectURL(await r.blob())); } catch (e) {}
  }
}
const texLoader = new THREE.TextureLoader();

async function loadGLB64(url) {
  const b64 = (await (await fetch(asset(url))).text()).trim();
  const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return new GLTFLoader().parseAsync(bin.buffer, '');
}
async function loadTex(url, srgb = true) {
  const t = await texLoader.loadAsync(asset(url));
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function softDot(size = 64, stops = [[0, 'rgba(255,255,255,1)'], [0.4, 'rgba(255,255,255,.35)'], [1, 'rgba(255,255,255,0)']]) {
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([p, col]) => gr.addColorStop(p, col)); g.fillStyle = gr; g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
/* Project an equirectangular panorama, captured at `eye`, onto whatever geometry uses this material.
   Exact wherever the geometry matches the real surfaces. The panorama is already tone mapped. */
const EQUIRECT_GLSL = `
  vec2 equirect(vec3 d) { return vec2(atan(d.z, d.x) * 0.15915494 + 0.5, asin(clamp(d.y, -1.0, 1.0)) * 0.31830989 + 0.5); }`;
function projectionMaterial(tex, eye, opts = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uPano: { value: tex }, uEye: { value: eye } }, side: opts.side ?? THREE.FrontSide, toneMapped: false,
    depthWrite: opts.depthWrite ?? true, depthTest: opts.depthTest ?? true,
    vertexShader: `varying vec3 vWorld; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform sampler2D uPano; uniform vec3 uEye; varying vec3 vWorld; ${EQUIRECT_GLSL}
      void main() { gl_FragColor = vec4(texture2D(uPano, equirect(normalize(vWorld - uEye))).rgb, 1.0);
        #include <colorspace_fragment>
      }`,
  });
}
function panoTexture(tex) { tex.colorSpace = THREE.SRGBColorSpace; tex.generateMipmaps = false; tex.minFilter = THREE.LinearFilter; return tex; }
function envFrom(tex) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const e = tex.clone(); e.mapping = THREE.EquirectangularReflectionMapping; e.needsUpdate = true;
  const out = pmrem.fromEquirectangular(e).texture; pmrem.dispose(); return out;
}


/* ================================================================ STUDIO (Capabilities)
   A daylight studio in an old industrial building. The room is projected back onto a box the size of
   the real room; the copper scaffold F and its flowers are live, with their shadows baked in. */
WORLDS.studio = (() => {
  const ROOM = { x: 11.8, z: 11.8, h: 7.2, eye: 1.4 };
  const EL = THREE.MathUtils.degToRad(17), AZ = THREE.MathUtils.degToRad(-28);
  const SUN = new THREE.Vector3(Math.cos(EL) * Math.cos(AZ), Math.sin(EL), -Math.cos(EL) * Math.sin(AZ)).normalize();
  const SUN_COL = new THREE.Color(1.0, 0.84, 0.66);
  const scene = new THREE.Scene();

  // sunlight through the four windows on the +X wall, with their glazing bars: shared by the haze and the dust
  const BEAM_GLSL = `
    uniform vec3 uSun;
    float bars(float v, float pitch, float half_) {
      float c = fract(v / pitch) * pitch;
      return smoothstep(half_ - 0.01, half_ + 0.035, c) * smoothstep(half_ - 0.01, half_ + 0.035, pitch - c);
    }
    float inBeam(vec3 p) {
      float t = (${ROOM.x.toFixed(2)} - p.x) / uSun.x;
      if (t < 0.0) return 0.0;
      vec3 h = p + uSun * t;
      float y = h.y - 0.85;
      float lit = smoothstep(-0.04, 0.06, y) * smoothstep(-0.04, 0.06, 5.5 - y);
      if (lit <= 0.0) return 0.0;
      float b = 0.0;
      for (int i = 0; i < 4; i++) {
        float lz = h.z - (6.9 - 4.6 * float(i) - 1.8);
        b += smoothstep(-0.04, 0.06, lz) * smoothstep(-0.04, 0.06, 3.6 - lz) * bars(lz, 0.6, 0.0225);
      }
      return lit * b * bars(y, 0.6875, 0.0225);
    }`;
  const roomU = {
    uPano: { value: null }, uEye: { value: new THREE.Vector3(0, ROOM.eye, 0) }, uSun: { value: SUN },
    uSunCol: { value: SUN_COL.clone() }, uHaze: { value: 1 }, uSteps: { value: phone ? 14 : 26 },
  };
  const room = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM.x * 2, ROOM.h, ROOM.z * 2).translate(0, ROOM.h / 2, 0),
    new THREE.ShaderMaterial({
      uniforms: roomU, side: THREE.BackSide, toneMapped: false,
      vertexShader: `varying vec3 vWorld; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `
        uniform sampler2D uPano; uniform vec3 uEye, uSunCol; uniform float uHaze; uniform int uSteps;
        varying vec3 vWorld;
        ${BEAM_GLSL} ${EQUIRECT_GLSL}
        void main() {
          vec3 col = texture2D(uPano, equirect(normalize(vWorld - uEye))).rgb;
          if (uHaze > 0.001) {
            vec3 ro = cameraPosition, rd = vWorld - ro; float L = length(rd); rd /= L;
            float n = float(uSteps), dt = L / n;
            float j = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
            float acc = 0.0;
            for (int i = 0; i < 32; i++) {
              if (i >= uSteps) break;
              vec3 p = ro + rd * (dt * (float(i) + j));
              acc += inBeam(p) * (1.0 - smoothstep(2.0, 6.5, p.y) * 0.6);
            }
            float mu = max(dot(rd, uSun), 0.0);
            col += uSunCol * acc * dt * 0.011 * (0.12 + 1.1 * pow(mu, 10.0) + 0.3 * pow(mu, 2.5)) * uHaze;
          }
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`,
    }));
  room.renderOrder = -1; scene.add(room);

  // the sun on the back of the F (as in the panorama), a key light on its front (also in the panorama), and fill
  function shadowLight(dir, colour, intensity, size) {
    const l = new THREE.DirectionalLight(colour, intensity);
    l.position.copy(dir).multiplyScalar(12); l.target.position.set(0, 0.9, 0);
    l.castShadow = true; l.shadow.mapSize.set(size, size);
    Object.assign(l.shadow.camera, { left: -1.8, right: 1.8, top: 1.8, bottom: -1.8, near: 4, far: 20 });
    l.shadow.bias = -0.0004; l.shadow.normalBias = 0.015;
    scene.add(l, l.target); return l;
  }
  shadowLight(SUN, SUN_COL, 2.6, phone ? 1024 : 2048);
  shadowLight(new THREE.Vector3(-0.63, 0.57, -0.53).normalize(), new THREE.Color(1.0, 0.92, 0.84), 1.9, phone ? 1024 : 1536);
  scene.add(new THREE.HemisphereLight(0xfff1df, 0x5b4636, 0.14));

  // dust in the sunbeams, bright only where it crosses a beam
  const DUST = { count: phone ? 800 : 1700, box: 10.5, top: 6.0, size: 0.024 };
  const dustU = { uTime: { value: 0 }, uFocal: { value: 1000 }, uSun: { value: SUN }, uOn: { value: 1 } };
  {
    const n = DUST.count, pos = new Float32Array(n * 3), seed = new Float32Array(n), scale = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * DUST.box; pos[i * 3 + 1] = 0.05 + Math.pow(Math.random(), 1.3) * DUST.top; pos[i * 3 + 2] = (Math.random() * 2 - 1) * DUST.box;
      seed[i] = Math.random(); scale[i] = 0.5 + Math.pow(Math.random(), 2.5) * 2.2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1)); geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
    const B = DUST.box.toFixed(1), B2 = (DUST.box * 2).toFixed(1);
    const dust = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: dustU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float uTime, uFocal, uOn; attribute float aSeed, aScale; varying float vAlpha, vGlint, vBlur;
        ${BEAM_GLSL}
        void main() {
          vec3 p = position;
          float tw = 0.5 + 0.5 * sin(uTime * (0.5 + aSeed * 1.6) + aSeed * 40.0); tw = 0.3 + 0.7 * tw * tw;
          float t = uTime * 0.12 + aSeed * 50.0;
          p.x = mod(p.x - uTime * 0.035 * (0.4 + aSeed) + ${B}, ${B2}) - ${B};
          p.y += sin(t * 1.3) * 0.14 + sin(t * 0.37) * 0.08; p.z += cos(t * 0.8 + aSeed * 3.0) * 0.28;
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          float dist = -mv.z, blur = 1.0 - smoothstep(0.7, 2.6, dist);
          gl_PointSize = clamp(${DUST.size} * aScale * uFocal / dist * (1.0 + blur * 1.8), 1.5, 80.0);
          vBlur = blur;
          float beam = inBeam(p);
          vGlint = pow(max(dot(normalize(p - cameraPosition), uSun), 0.0), 5.0) * beam;
          vAlpha = uOn * smoothstep(0.35, 1.1, dist) * (1.0 - smoothstep(16.0, 26.0, dist)) * (0.2 + 0.8 * aSeed * aSeed) * tw * mix(1.0, 0.08, blur) * (0.03 + 0.97 * beam);
        }`,
      fragmentShader: `
        varying float vAlpha, vGlint, vBlur;
        void main() {
          float r = length(gl_PointCoord - 0.5) * 2.0;
          float dot_ = 1.0 - smoothstep(0.3, 1.0, r); dot_ *= dot_;
          float disc = (1.0 - smoothstep(0.5, 1.0, r)) * (0.75 + 0.25 * smoothstep(0.3, 0.8, r));
          vec3 col = mix(vec3(1.0, 0.84, 0.64), vec3(1.0, 0.95, 0.85), vGlint);
          gl_FragColor = vec4(col * (0.6 + vGlint * 1.1), mix(dot_, disc, vBlur) * vAlpha * (0.5 + vGlint * 0.6));
        }`,
    }));
    dust.frustumCulled = false; scene.add(dust);
  }

  let hazeGoal = 1;
  return {
    id: 'studio', scene, entering: 'Entering the studio', exposure: 1.0,
    kicker: 'World test 01 · Capabilities', title: 'The Studio',
    blurb: 'Afternoon sun through steel windows, and the copper F from the showreel, wrapped in flowers.',
    cam: { radius: 6.6, height: 0.9, look: 1.45, lookPhone: 0.6, fov: 38, far: 80 },
    assets: () => [WDIR + (phone ? 'studio-2k.jpg' : 'studio.jpg'), WDIR + 'hero_protos.txt', WDIR + 'hero_instances.json'],
    views: [{ label: 'Hero view', deg: 0, chord: 0 }, { label: 'Capabilities angle', deg: -35, chord: 1 }, { label: 'Back', deg: 180, chord: 3 }],
    toggle: { label: 'Sunbeams', set(on) { hazeGoal = on ? 1 : 0; } },
    async load() {
      const tex = panoTexture(await loadTex(WDIR + (phone ? 'studio-2k.jpg' : 'studio.jpg')));
      roomU.uPano.value = tex; scene.environment = envFrom(tex);
      const [gltf, inst] = await Promise.all([loadGLB64(WDIR + 'hero_protos.txt'), fetch(asset(WDIR + 'hero_instances.json')).then(r => r.json())]);
      const hero = new THREE.Group();
      // shade each flower by how buried it is in the arrangement, with a little random variation
      const all = [];
      for (const [name, arr] of Object.entries(inst.instances)) {
        if (name === 'Scaffold' || name === 'Twigs') continue;
        for (let i = 0; i < arr.length; i += 16) all.push([arr[i + 12], arr[i + 13], arr[i + 14]]);
      }
      const CELL = 0.14, grid = new Map(), key = (x, y, z) => `${x},${y},${z}`;
      all.forEach((p, i) => { const k = key(Math.floor(p[0] / CELL), Math.floor(p[1] / CELL), Math.floor(p[2] / CELL)); (grid.get(k) || grid.set(k, []).get(k)).push(i); });
      function shade(x, y, z) {
        const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL), cz = Math.floor(z / CELL); let n = 0;
        for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
          const c = grid.get(key(cx + i, cy + j, cz + k)); if (!c) continue;
          for (const idx of c) { const q = all[idx]; if (Math.hypot(q[0] - x, q[1] - y, q[2] - z) < 0.14) n++; }
        }
        return THREE.MathUtils.clamp(1.15 - n * 0.022, 0.5, 1.0);
      }
      const tint = new THREE.Color(), done = new Set();
      for (const [name, arr] of Object.entries(inst.instances)) {
        const node = gltf.scene.getObjectByName(name);
        if (!node) { console.warn('missing', name); continue; }
        const count = arr.length / 16;
        node.traverse(o => {
          if (!o.isMesh) return;
          const m = o.material;
          if (name === 'Scaffold') { m.envMapIntensity = 2.2; m.roughness = 0.26; }
          else if (!done.has(m)) { m.envMapIntensity = 0.75; m.roughness = Math.max(m.roughness, 0.6); done.add(m); }
          const im = new THREE.InstancedMesh(o.geometry, m, count);
          im.instanceMatrix.array.set(arr); im.instanceMatrix.needsUpdate = true;
          if (name !== 'Scaffold' && name !== 'Twigs') {
            for (let i = 0; i < count; i++) {
              const ao = shade(arr[i * 16 + 12], arr[i * 16 + 13], arr[i * 16 + 14]) * (0.92 + Math.random() * 0.16);
              im.setColorAt(i, tint.setRGB(ao, ao * (0.97 + Math.random() * 0.06), ao));
            }
            im.instanceColor.needsUpdate = true;
          }
          im.castShadow = true; im.receiveShadow = true; im.frustumCulled = false;
          hero.add(im);
        });
      }
      scene.add(hero); this.hero = hero;
    },
    update(t, dt) {
      roomU.uHaze.value += (hazeGoal - roomU.uHaze.value) * (1 - Math.exp(-dt * 5));
      dustU.uOn.value = 0.25 + 0.75 * roomU.uHaze.value;
      dustU.uTime.value = reduced ? 0 : t;
      dustU.uFocal.value = renderer.domElement.height * 0.5 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    },
  };
})();

/* ================================================================ CITY (Contact)
   A rain-soaked rooftop in a dense future city at night. The skyline and the roof are a path-traced
   panorama; the roof and everything on it are projected back onto their real shapes (exported from
   Blender), the far city onto a cylinder. Live: the black glass F, rain and ripples, steam, neon that
   flickers, giant animated billboards, cables, a blinking mast, flying traffic, and the F, signs and
   screens reflected in the puddles. */
WORLDS.city = (() => {
  const EYE = new THREE.Vector3(0, 1.4, 0);
  const b2t = a => new THREE.Vector3(a[0], a[2], -a[1]);           // Blender -> three.js
  const scene = new THREE.Scene(), mirror = new THREE.Scene();
  const mirrored = new THREE.Group(); mirrored.scale.y = -1; mirror.add(mirrored);
  const PINK = new THREE.Color(1.0, 0.12, 0.55), CYAN = new THREE.Color(0.15, 0.95, 1.0);
  const U = { uTime: { value: 0 } };
  let reflRT = null, floorMat = null, rainOn = 1, rainGoal = 1;
  const flickers = [], screens = [];

  const BAND = { lat: new THREE.Vector2(THREE.MathUtils.degToRad(-25), THREE.MathUtils.degToRad(55)) };
  const PANO_GLSL = `uniform sampler2D uPano, uBand; uniform vec2 uLat; uniform float uHasBand;
    ${EQUIRECT_GLSL}
    vec3 pano(vec3 d) {
      vec2 uv = equirect(d); vec3 c = texture2D(uPano, uv).rgb;
      if (uHasBand > 0.5) {
        float vb = (asin(clamp(d.y, -1.0, 1.0)) - uLat.x) / (uLat.y - uLat.x);
        float w = smoothstep(0.0, 0.04, vb) * smoothstep(0.0, 0.04, 1.0 - vb);
        if (w > 0.0) c = mix(c, texture2D(uBand, vec2(uv.x, vb)).rgb, w);
      }
      return c;
    }`;
  const panoU = { uPano: { value: null }, uBand: { value: null }, uLat: { value: BAND.lat }, uHasBand: { value: 0 }, uEye: { value: EYE } };
  function cityProjection(opts = {}) {
    return new THREE.ShaderMaterial({
      uniforms: panoU, side: opts.side ?? THREE.FrontSide, toneMapped: false, depthWrite: opts.depthWrite ?? true, depthTest: opts.depthTest ?? true,
      vertexShader: `varying vec3 vWorld; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `uniform vec3 uEye; varying vec3 vWorld; ${PANO_GLSL}
        void main() { gl_FragColor = vec4(pano(normalize(vWorld - uEye)), 1.0);
          #include <colorspace_fragment>
        }`,
    });
  }
  function addBoth(obj) { scene.add(obj); const c = obj.clone(); mirrored.add(c); return c; }

  // ---- neon sign: crisp tubes plus a soft glow, flickering now and then
  function neonMaterial(tex, colour, gain, additive) {
    return new THREE.ShaderMaterial({
      uniforms: { uTex: { value: tex }, uCol: { value: colour.clone() }, uOn: { value: 1 }, uGain: { value: gain } },
      transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, side: THREE.DoubleSide,
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform sampler2D uTex; uniform vec3 uCol; uniform float uOn, uGain; varying vec2 vUv;
        void main() { float m = texture2D(uTex, vUv).r; vec3 c = uCol * m * uGain * uOn + vec3(1.0) * pow(m, 3.0) * uGain * 0.35 * uOn;
          gl_FragColor = vec4(c, ${additive ? '1.0' : 'm'});
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
  }
  function orient(mesh, centre, facing) { mesh.position.copy(centre); mesh.lookAt(centre.clone().add(facing)); return mesh; }

  // ---- billboards: canvas slides with scanlines, a slow pulse and a glitch between slides
  const F_PATH = [];
  function drawSlide(ctx, W, H, s, theme) {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, theme.bg0); g.addColorStop(1, theme.bg1); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalAlpha = 0.18; ctx.strokeStyle = theme.ink; ctx.lineWidth = Math.max(2, W / 400);
    for (let x = -H; x < W; x += W / 14) { ctx.beginPath(); ctx.moveTo(x, H); ctx.lineTo(x + H, 0); ctx.stroke(); }
    ctx.restore();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = theme.ink; ctx.shadowColor = theme.glow; ctx.shadowBlur = W / 28;
    if (s.mark) {   // the Freak F, glowing
      const sc = H * 0.36, cx = W * (s.text ? 0.27 : 0.5), cy = H * 0.84;
      ctx.lineWidth = Math.max(3, W / 160); ctx.strokeStyle = theme.ink;
      for (const loop of F_PATH) { ctx.beginPath(); loop.forEach(([x, y], i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, cx + x * sc, cy - y * sc)); ctx.closePath(); ctx.stroke(); }
      if (s.text) { ctx.font = `400 ${H * 0.34}px "Bebas Neue", Impact, sans-serif`; ctx.fillText(s.text, W * 0.66, H * 0.5); }
      return;
    }
    if (s.vertical) {
      const n = s.text.length, size = Math.min(W * 0.8, H / (n * 1.05));
      ctx.font = `400 ${size}px "Monoton", "Bebas Neue", Impact, sans-serif`;
      [...s.text].forEach((ch, i) => ctx.fillText(ch, W / 2, H * (i + 0.5) / n));
      return;
    }
    ctx.font = `400 ${H * (s.size || 0.46)}px ${s.font || '"Bebas Neue", Impact, sans-serif'}`;
    ctx.fillText(s.text, W / 2, H * (s.sub ? 0.43 : 0.52), W * 0.92);
    if (s.sub) { ctx.shadowBlur = W / 60; ctx.font = `600 ${H * 0.09}px "Plus Jakarta Sans", system-ui, sans-serif`; ctx.fillText(s.sub, W / 2, H * 0.8, W * 0.9); }
  }
  const THEMES = {
    hero: { bg0: '#2a0016', bg1: '#ff1f8e', ink: '#fff2f8', glow: '#ff5cb0', slides: [
      { text: 'TALK TO US' }, { text: 'SAY HELLO', sub: 'LONDON  ·  BARCELONA  ·  ABU DHABI' }, { mark: true, text: 'FREAK' }, { text: 'HOLA · HELLO · مرحبا', size: 0.3 }, { text: "WE'RE LISTENING", size: 0.36 }] },
    contact: { bg0: '#001820', bg1: '#00b8d9', ink: '#eaffff', glow: '#5ff3ff', slides: [{ text: 'GET IN TOUCH' }, { text: 'TALK TO US' }, { text: 'ALWAYS ON' }] },
    tall: { bg0: '#071400', bg1: '#2f6b00', ink: '#e8ffd0', glow: '#a6ff3c', slides: [{ text: 'FREAK', vertical: true }, { text: 'TALK', vertical: true }] },
    back: { bg0: '#200800', bg1: '#ff6a12', ink: '#fff1e6', glow: '#ff9a4a', slides: [{ text: 'TALK TO US' }, { text: 'OPEN 24/7' }] },
  };
  function billboard(b) {
    const theme = THEMES[b.name] || THEMES.hero;
    const W = b.h > b.w ? 512 : 1024, H = Math.round(W * b.h / b.w);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTex: { value: tex }, uTime: U.uTime, uGlitch: { value: 0 }, uGain: { value: 2.2 }, uLines: { value: H * 0.5 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform sampler2D uTex; uniform float uTime, uGlitch, uGain, uLines; varying vec2 vUv;
        float h(float x) { return fract(sin(x * 91.7) * 43758.5); }
        void main() {
          vec2 uv = vUv;
          float band = floor(uv.y * 24.0); uv.x += (h(band + floor(uTime * 20.0)) - 0.5) * 0.08 * uGlitch;
          float sh = 0.004 + 0.02 * uGlitch;
          vec3 c = vec3(texture2D(uTex, uv + vec2(sh, 0.0)).r, texture2D(uTex, uv).g, texture2D(uTex, uv - vec2(sh, 0.0)).b);
          float scan = 0.82 + 0.18 * sin((uv.y * uLines - uTime * 6.0) * 3.14159);
          float pulse = 0.92 + 0.08 * sin(uTime * 1.7);
          float edge = smoothstep(0.0, 0.02, uv.x) * smoothstep(0.0, 0.02, 1.0 - uv.x) * smoothstep(0.0, 0.03, uv.y) * smoothstep(0.0, 0.03, 1.0 - uv.y);
          gl_FragColor = vec4(c * scan * pulse * uGain * edge * (1.0 - 0.6 * uGlitch * h(band + uTime)), 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    const centre = b2t(b.centre), facing = b2t(b.facing).normalize();
    const screen = orient(new THREE.Mesh(new THREE.PlaneGeometry(b.w, b.h), mat), centre, facing);
    const glowMat = new THREE.MeshBasicMaterial({ map: softDot(128), color: new THREE.Color(theme.glow).multiplyScalar(0.6), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
    const glowP = orient(new THREE.Mesh(new THREE.PlaneGeometry(b.w * 1.9, b.h * 1.9), glowMat), centre.clone().add(facing.clone().multiplyScalar(0.3)), facing);
    scene.add(screen, glowP); addBoth(screen);   // screens reflect in the puddles
    const st = { slide: -1, next: rnd(0, 2), mat, draw: i => { drawSlide(ctx, W, H, theme.slides[i], theme); tex.needsUpdate = true; }, n: theme.slides.length, glitchT: 0 };
    screens.push(st);
  }

  // ---- rain, as fine streaks in a box that follows the camera
  const RAIN = { n: phone ? 3000 : 7500, box: new THREE.Vector3(18, 12, 18) };
  const rainU = { uTime: U.uTime, uCam: { value: new THREE.Vector3() }, uBox: { value: RAIN.box }, uOn: { value: 1 },
    uPink: { value: new THREE.Vector3(-1.0, 1.95, -11.55) }, uCyan: { value: new THREE.Vector3(2.5, 1.85, 11.55) } };
  {
    const n = RAIN.n, pos = new Float32Array(n * 6), end = new Float32Array(n * 2), seed = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const x = Math.random(), y = Math.random(), z = Math.random(), s = Math.random();
      pos.set([x, y, z, x, y, z], i * 6); end[i * 2] = 0; end[i * 2 + 1] = 1; seed[i * 2] = seed[i * 2 + 1] = s;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aEnd', new THREE.BufferAttribute(end, 1)); g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const rainMesh = new THREE.LineSegments(g, new THREE.ShaderMaterial({
      uniforms: rainU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `uniform float uTime, uOn; uniform vec3 uCam, uBox, uPink, uCyan; attribute float aEnd, aSeed; varying float vA; varying vec3 vC;
        void main() {
          float speed = 7.5 + aSeed * 3.0; vec3 dir = normalize(vec3(0.12, -1.0, 0.05));
          vec3 p = position * uBox;
          p.y -= uTime * speed; p.x += uTime * speed * 0.12; p.z += uTime * speed * 0.05;
          vec3 o = uCam - uBox * 0.5; o.y = -0.2;
          p = mod(p - o, uBox) + o;
          p -= dir * aEnd * (0.10 + aSeed * 0.12);
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          float d = -mv.z;
          vA = uOn * (0.10 + 0.22 * aSeed) * smoothstep(0.3, 1.5, d) * (1.0 - smoothstep(9.0, 16.0, d)) * step(0.0, p.y);
          vC = vec3(0.55, 0.62, 0.78) + vec3(1.0, 0.12, 0.55) * 1.4 * exp(-distance(p, uPink) / 3.5) + vec3(0.15, 0.95, 1.0) * 1.2 * exp(-distance(p, uCyan) / 3.5);
        }`,
      fragmentShader: `varying float vA; varying vec3 vC; void main() { gl_FragColor = vec4(vC * vA, 1.0); }`,
    }));
    rainMesh.frustumCulled = false; scene.add(rainMesh);
  }

  // ---- steam from the vents
  const steamU = { uTime: U.uTime, uTex: { value: softDot(64, [[0, 'rgba(255,255,255,.9)'], [0.5, 'rgba(255,255,255,.35)'], [1, 'rgba(255,255,255,0)']]) }, uFocal: { value: 900 } };
  function steam(vents) {
    const per = phone ? 18 : 30, n = vents.length * per, base = new Float32Array(n * 3), seed = new Float32Array(n);
    vents.forEach((v, k) => { for (let i = 0; i < per; i++) { base.set([v.x, v.y, v.z], (k * per + i) * 3); seed[k * per + i] = Math.random(); } });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(base, 3)); g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const pts = new THREE.Points(g, new THREE.ShaderMaterial({
      uniforms: steamU, transparent: true, depthWrite: false,
      vertexShader: `uniform float uTime, uFocal; attribute float aSeed; varying float vA, vAge;
        void main() {
          float age = fract(uTime * (0.11 + aSeed * 0.05) + aSeed * 7.0);
          vec3 p = position + vec3(age * 2.6 + sin(aSeed * 40.0 + uTime * 0.7) * 0.3 * age, age * 4.2, -age * 0.8 + cos(aSeed * 31.0) * 0.4 * age);
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp((0.35 + age * 2.4) * uFocal / -mv.z, 2.0, 420.0);
          vA = sin(3.14159 * age) * (0.9 - 0.4 * age); vAge = age;
        }`,
      fragmentShader: `uniform sampler2D uTex; varying float vA, vAge;
        void main() { float a = texture2D(uTex, gl_PointCoord).a * vA * 0.24;
          vec3 c = mix(vec3(0.55, 0.85, 0.95), vec3(0.75, 0.6, 0.8), vAge);
          gl_FragColor = vec4(c, a);
          #include <colorspace_fragment>
        }`,
    }));
    pts.frustumCulled = false; scene.add(pts);
  }

  // ---- flying traffic far across the city
  function traffic() {
    const n = 26, pos = new Float32Array(n * 3), data = [];
    for (let i = 0; i < n; i++) {
      const a = rnd(0, Math.PI * 2), r = rnd(70, 360), h = rnd(14, 95), dir = rnd(0, Math.PI * 2);
      data.push({ c: new THREE.Vector3(Math.cos(a) * r, h, Math.sin(a) * r), d: new THREE.Vector3(Math.cos(dir), rnd(-0.02, 0.02), Math.sin(dir)), v: rnd(12, 30), o: rnd(0, 600) });
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const col = new Float32Array(n * 3); const tints = [[1, 0.95, 0.85], [1, 0.2, 0.15], [0.4, 0.9, 1], [1, 0.4, 0.8]];
    for (let i = 0; i < n; i++) col.set(tints[i % 4], i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const m = new THREE.PointsMaterial({ size: phone ? 7 : 9, sizeAttenuation: false, map: softDot(64), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const pts = new THREE.Points(g, m); pts.frustumCulled = false; scene.add(pts);
    return t => {
      for (let i = 0; i < n; i++) { const q = data[i], s = ((t * q.v + q.o) % 600) - 300; pos[i * 3] = q.c.x + q.d.x * s; pos[i * 3 + 1] = q.c.y + q.d.y * s; pos[i * 3 + 2] = q.c.z + q.d.z * s; }
      g.attributes.position.needsUpdate = true;
    };
  }
  let moveTraffic = () => {};

  // ---- cables, railing and the mast: thin things are live, so they never slide against the sky
  const metal = new THREE.MeshStandardMaterial({ color: 0x15161a, metalness: 0.8, roughness: 0.32 });
  function cable(a, b, sag) {
    const pts = []; for (let i = 0; i <= 40; i++) { const t = i / 40; const p = a.clone().lerp(b, t); p.y -= sag * 4 * t * (1 - t); pts.push(p); }
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.035, 5), metal));
  }
  function railing(R, PH) {
    const posts = [], rails = [];
    [[-R, R + 0.1, R, R + 0.1], [-R, -R - 0.1, R, -R - 0.1], [R + 0.1, -R, R + 0.1, R], [-R - 0.1, -R, -R - 0.1, R]].forEach(([x0, y0, x1, y1]) => {
      const a = b2t([x0, y0, 0]), b = b2t([x1, y1, 0]), L = a.distanceTo(b), n = Math.round(L / 2);
      for (let k = 0; k <= n; k++) posts.push(a.clone().lerp(b, k / n));
      rails.push([a, b]);
    });
    const post = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.95, 6).translate(0, PH + 0.48, 0), metal, posts.length);
    posts.forEach((p, i) => post.setMatrixAt(i, new THREE.Matrix4().makeTranslation(p.x, 0, p.z))); scene.add(post);
    rails.forEach(([a, b]) => [PH + 0.95, PH + 0.5].forEach(h => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, a.distanceTo(b), 6), metal);
      m.position.copy(a).lerp(b, 0.5); m.position.y = h; m.lookAt(b.x, h, b.z); m.rotateX(Math.PI / 2); scene.add(m);
    }));
  }
  let beacon = null;
  function mast(top) {
    const base = b2t([top[0], top[1], 0]);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, top[2], 8).translate(0, top[2] / 2, 0), metal); m.position.copy(base); scene.add(m);
    for (let k = 0; k < 5; k++) { const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.2, 5), metal); arm.position.set(base.x, 2.5 + k * 2.1, base.z); arm.rotation.set(Math.PI / 2, 0, k * 1.1); scene.add(arm); }
    beacon = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(64), color: 0xff2a1a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    beacon.position.set(base.x, top[2] + 0.1, base.z); beacon.scale.setScalar(1.3); scene.add(beacon);
  }

  // ---- the F: black glass with a pink edge light
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x050508, metalness: 0.0, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 3.0, ior: 1.7, specularIntensity: 1 });
  glass.onBeforeCompile = sh => {
    // pink light from the left as you face it, cyan from the right, strongest at the edges
    sh.uniforms.uPink = { value: new THREE.Vector3(1.0, 0.18, 0.6).multiplyScalar(1.1) };
    sh.uniforms.uCyan = { value: new THREE.Vector3(0.15, 0.85, 1.0).multiplyScalar(0.7) };
    sh.fragmentShader = sh.fragmentShader.replace('uniform float opacity;', 'uniform float opacity; uniform vec3 uPink, uCyan;')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        vec3 nW = inverseTransformDirection(normalize(normal), viewMatrix);
        float edge = pow(1.0 - saturate(dot(normalize(normal), normalize(vViewPosition))), 2.5);
        totalEmissiveRadiance += (uPink * smoothstep(-0.2, 0.9, -nW.z) + uCyan * smoothstep(-0.2, 0.9, nW.z)) * edge;`);
  };

  const world = {
    id: 'city', scene, entering: 'Entering the city', exposure: 1.0,
    kicker: 'World test 02 · Contact', title: 'The City',
    blurb: 'A rain-soaked rooftop after dark. Neon in the puddles, steam from the vents and the skyline asking you to talk to us.',
    cam: { radius: 6.6, height: 0.9, look: 1.45, lookPhone: 0.6, fov: 38, far: 1200 },
    assets: () => [WDIR + (phone ? 'city-2k.jpg' : 'city.jpg'), ...(phone ? [] : [WDIR + 'city-band.jpg']), WDIR + 'puddles.png', WDIR + 'city_layout.json', WDIR + 'roof_proxy.txt',
      WDIR + 'talk.png', WDIR + 'talk_glow.png', WDIR + 'always.png', WDIR + 'always_glow.png'],
    views: [{ label: 'Hero view', deg: 0 }, { label: 'Contact angle', deg: -70 }, { label: 'Skyline', deg: 150 }],
    toggle: { label: 'Rain', set(on) { rainGoal = on ? 1 : 0; } },
    async load() {
      const [pano, puddles, layout, proxy, logo, talk, talkG, always, alwaysG, fshape] = await Promise.all([
        loadTex(WDIR + (phone ? 'city-2k.jpg' : 'city.jpg')), loadTex(WDIR + 'puddles.png', false), fetch(asset(WDIR + 'city_layout.json')).then(r => r.json()),
        loadGLB64(WDIR + 'roof_proxy.txt'), loadGLB64(LOGO_URL),
        loadTex(WDIR + 'talk.png', false), loadTex(WDIR + 'talk_glow.png', false), loadTex(WDIR + 'always.png', false), loadTex(WDIR + 'always_glow.png', false),
        typeof F_SHAPE !== 'undefined' ? F_SHAPE : fetch(WDIR + 'fshape.json').then(r => r.json()),
      ]);
      F_PATH.push(fshape.stem, fshape.chevron);
      try { await Promise.all(['400 100px "Bebas Neue"', '400 100px "Monoton"', '600 40px "Plus Jakarta Sans"'].map(f => document.fonts.load(f))); } catch (e) {}
      panoTexture(pano); panoU.uPano.value = pano;
      if (!phone) {   // the sharp strip round the horizon, for big screens
        try { const band = panoTexture(await loadTex(WDIR + 'city-band.jpg')); panoU.uBand.value = band; panoU.uHasBand.value = 1; } catch (e) { console.warn('no horizon band', e); }
      }
      const panoMip = pano.clone(); panoMip.generateMipmaps = true; panoMip.minFilter = THREE.LinearMipmapLinearFilter; panoMip.needsUpdate = true;
      const env = envFrom(pano); scene.environment = env; mirror.environment = env;
      // the far city on a cylinder, then the roof on its real shapes
      const far = new THREE.Mesh(new THREE.CylinderGeometry(70, 70, 470, 96, 1, true).translate(0, 173, 0), cityProjection({ side: THREE.DoubleSide, depthWrite: false, depthTest: false }));
      const cap = new THREE.Mesh(new THREE.CircleGeometry(70, 64).rotateX(Math.PI / 2).translate(0, 408, 0), far.material);
      far.renderOrder = cap.renderOrder = -3; scene.add(far, cap);
      const near = cityProjection();
      floorMat = new THREE.ShaderMaterial({
        uniforms: { uPano: panoU.uPano, uBand: panoU.uBand, uLat: panoU.uLat, uHasBand: panoU.uHasBand, uMip: { value: panoMip }, uEye: { value: EYE }, uPuddle: { value: puddles }, uRefl: { value: null }, uRes: { value: new THREE.Vector2(1, 1) }, uTime: U.uTime, uRain: { value: 1 } },
        toneMapped: false,
        vertexShader: `varying vec3 vWorld; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
        fragmentShader: `uniform sampler2D uMip, uPuddle, uRefl; uniform vec3 uEye; uniform vec2 uRes; uniform float uTime, uRain; varying vec3 vWorld;
          ${PANO_GLSL}
          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          vec2 ripples(vec2 p, float t) {
            vec2 n = vec2(0.0);
            for (int k = 0; k < ${phone ? 1 : 2}; k++) {
              float s = k == 0 ? 0.42 : 0.26;
              vec2 g = floor(p / s), f = fract(p / s);
              for (int i = -1; i <= 1; i++) for (int j = -1; j <= 1; j++) {
                vec2 id = g + vec2(i, j), h2 = vec2(hash(id + float(k) * 19.0), hash(id + 7.3 + float(k)));
                vec2 c = (vec2(i, j) + h2 - f) * s;
                float ph = fract(t * (0.6 + 0.7 * h2.x) + h2.y * 9.0), r = length(c), R = ph * 0.2;
                n += (c / max(r, 1e-4)) * exp(-pow((r - R) / 0.011, 2.0)) * (1.0 - ph) * (1.0 - ph);
              }
            }
            return n;
          }
          void main() {
            float wet = texture2D(uPuddle, vec2((vWorld.x + 12.0) / 24.0, (12.0 - vWorld.z) / 24.0)).r;
            vec2 rn = ripples(vWorld.xz, uTime) * (0.3 + 0.7 * wet) * uRain;
            vec3 d = normalize(vWorld - uEye); d.xz -= rn * 0.035;
            vec3 col = pano(normalize(d));
            vec3 V = normalize(cameraPosition - vWorld);
            float fres = 0.05 + 0.95 * pow(1.0 - clamp(V.y, 0.0, 1.0), 5.0);
            // the city in the wet roof: look the reflected ray up in the panorama, sharp in the puddles, blurred elsewhere
            vec3 nrm = normalize(vec3(-rn.x * 0.5, 1.0, -rn.y * 0.5));
            vec3 r = reflect(-V, nrm); r.y = max(r.y, 0.002);
            vec2 ru = equirect(normalize(r));
            vec3 env = mix(textureLod(uMip, ru, 4.5).rgb, pano(normalize(r)), smoothstep(0.25, 0.85, wet));
            col += env * fres * mix(0.35, 0.95, wet);
            vec2 suv = gl_FragCoord.xy / uRes + rn * 0.025;   // a little vertical smear, like a real wet roof
            vec3 refl = (texture2D(uRefl, suv).rgb * 2.0 + texture2D(uRefl, suv + vec2(0.0, 0.006)).rgb + texture2D(uRefl, suv - vec2(0.0, 0.006)).rgb + texture2D(uRefl, suv - vec2(0.0, 0.014)).rgb) / 5.0;
            col += refl * mix(0.18, 0.9, wet) * mix(0.4, 1.0, fres);
            col += vec3(0.6, 0.7, 0.9) * length(rn) * 0.05 * uRain;
            gl_FragColor = vec4(col, 1.0);
            #include <colorspace_fragment>
          }`,
      });
      proxy.scene.traverse(o => { if (o.isMesh) { o.material = o.name === 'roof' ? floorMat : near; o.renderOrder = -2; } });
      scene.add(proxy.scene);

      // live neon on the roof
      const tx = { talk: [talk, talkG], always: [always, alwaysG] };
      for (const s of layout.signs) {
        const [t1, t2] = tx[s.name], c = b2t(s.centre), f = b2t(s.facing).normalize(), col = new THREE.Color(...s.colour);
        const core = orient(new THREE.Mesh(new THREE.PlaneGeometry(s.w, s.h), neonMaterial(t1, col, 3.2, true)), c, f);
        const gw = s.w * t2.image.width / t1.image.width, gh = s.h * t2.image.height / t1.image.height;
        const halo = orient(new THREE.Mesh(new THREE.PlaneGeometry(gw, gh), neonMaterial(t2, col, 0.9, true)), c.clone().add(f.clone().multiplyScalar(0.02)), f);
        scene.add(core, halo); addBoth(core); addBoth(halo);
        flickers.push({ mats: [core.material, halo.material], seed: Math.random() * 100, steady: s.name === 'always' });
        const L = new THREE.PointLight(col, 160, 0, 2); L.position.copy(c).add(f.clone().multiplyScalar(0.6)); scene.add(L); addBoth(L);
        flickers[flickers.length - 1].light = L;
      }
      layout.billboards.forEach(billboard);
      steam(layout.vents.map(b2t));
      railing(layout.roof, layout.parapet);
      mast(layout.mast);
      moveTraffic = traffic();
      const H = b2t([-9.6, 9.4, 3.3]);
      [[H, new THREE.Vector3(-46, 24, -52), 4], [H, new THREE.Vector3(-62, 30, 6), 5], [H.clone().add(new THREE.Vector3(1.5, 0, 0)), new THREE.Vector3(14, 27, -64), 4.5],
        [b2t([-10.8, -10.8, 11.6]), new THREE.Vector3(-56, 36, 44), 5], [b2t([-10.8, -10.8, 10.5]), new THREE.Vector3(8, 30, 66), 4], [b2t([9.6, -9.6, 5.2]), new THREE.Vector3(58, 28, 40), 4]]
        .forEach(([a, b, s]) => cable(a, b, s));
      // the F
      const g = logo.scene; g.scale.setScalar(3.416); g.position.y = 0.0476 * 3.416;
      g.traverse(o => { if (o.isMesh) { o.material = glass; o.castShadow = false; } });
      const hero = new THREE.Group(); hero.add(g); hero.rotation.y = -Math.PI / 2; hero.position.set(-0.056, 0, -0.056);
      scene.add(hero); addBoth(hero); world.hero = hero;
      // a soft magenta light from the big screen behind, and a cool fill from the sky
      const back = new THREE.DirectionalLight(0xff3d9a, 0.6); back.position.set(60, 14, 26); scene.add(back); addBoth(back);
      const sky = new THREE.HemisphereLight(0x5a4f9a, 0x110814, 0.25); scene.add(sky); mirror.add(sky.clone());
    },
    resize(w, h) {
      const pr = renderer.getPixelRatio(), W = Math.max(2, Math.floor(w * pr / 2)), H = Math.max(2, Math.floor(h * pr / 2));
      if (!reflRT) reflRT = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
      else reflRT.setSize(W, H);
      if (floorMat) { floorMat.uniforms.uRefl.value = reflRT.texture; floorMat.uniforms.uRes.value.set(w * pr, h * pr); }
    },
    update(t, dt) {
      U.uTime.value = t;
      rainOn += (rainGoal - rainOn) * (1 - Math.exp(-dt * 3)); rainU.uOn.value = rainOn; if (floorMat) floorMat.uniforms.uRain.value = rainOn;
      rainU.uCam.value.copy(camera.position);
      steamU.uFocal.value = renderer.domElement.height * 0.5 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      for (const f of flickers) {   // neon: mostly steady, with the odd stutter
        const k = Math.floor(t * 14 + f.seed), r = Math.abs(Math.sin(k * 12.9898 + f.seed) * 43758.5) % 1;
        const burst = (Math.sin(t * 0.37 + f.seed) > 0.93) && !f.steady;
        const on = burst ? (r > 0.45 ? 1 : 0.15) : 0.96 + 0.04 * Math.sin(t * 50 + f.seed);
        f.mats.forEach(m => { m.uniforms.uOn.value = on; }); if (f.light) f.light.intensity = 160 * on;
      }
      for (const s of screens) {   // billboards: change slide every few seconds, with a glitch
        if (t > s.next) { s.slide = (s.slide + 1) % s.n; s.draw(s.slide); s.next = t + rnd(5, 8); s.glitchT = t; }
        const g = Math.max(0, 1 - (t - s.glitchT) / 0.45); s.mat.uniforms.uGlitch.value = g * g + (Math.random() < 0.004 ? 0.6 : 0);
      }
      if (beacon) beacon.material.opacity = (t % 1.6) < 0.18 ? 1 : 0.05;
      moveTraffic(t);
      if (floorMat && !reflRT) world.resize(innerWidth, innerHeight);
    },
    compileExtra(r, cam) { r.compile(mirror, cam); },
    render(r, cam) {
      if (reflRT) { r.setRenderTarget(reflRT); r.setClearColor(0x000000, 1); r.clear(); r.render(mirror, cam); r.setRenderTarget(null); }
      r.render(scene, cam);
    },
  };
  return world;
})();

/* ================================================================ ORBIT (About)
   The chrome F floats in orbit above Earth at night. As the sun comes round, the F catches the first
   light on its edges, then turns to full colour as day sweeps across the ground. An astronaut works on
   it. London, Barcelona and Abu Dhabi glow brightest below, linked to the F and out to the world. */
WORLDS.orbit = (() => {
  const R = 600, D = 1250, TILT = THREE.MathUtils.degToRad(31);
  const C = new THREE.Vector3(Math.cos(TILT) * D, -Math.sin(TILT) * D, 0);   // Earth's centre, beyond and below the F
  const bg = new THREE.Scene(), fg = new THREE.Scene();
  const P = 120;   // seconds for a full day
  const SUB = { lat: 21, lon: 27 };   // the point on Earth directly under the F
  const OFFICES = [['London', 51.507, -0.128], ['Barcelona', 41.385, 2.173], ['Abu Dhabi', 24.454, 54.377]];
  const MARKETS = [['New York', 40.71, -74.0], ['Toronto', 43.65, -79.38], ['Los Angeles', 34.05, -118.24], ['Mexico City', 19.43, -99.13], ['São Paulo', -23.55, -46.63],
    ['Paris', 48.86, 2.35], ['Berlin', 52.52, 13.4], ['Madrid', 40.42, -3.7], ['Milan', 45.46, 9.19], ['Amsterdam', 52.37, 4.9], ['Stockholm', 59.33, 18.07], ['Warsaw', 52.23, 21.01],
    ['Istanbul', 41.01, 28.98], ['Athens', 37.98, 23.73], ['Cairo', 30.04, 31.24], ['Lagos', 6.52, 3.38], ['Nairobi', -1.29, 36.82], ['Johannesburg', -26.2, 28.05], ['Riyadh', 24.71, 46.68],
    ['Doha', 25.29, 51.53], ['Mumbai', 19.08, 72.88], ['Delhi', 28.61, 77.21], ['Singapore', 1.35, 103.82], ['Hong Kong', 22.32, 114.17], ['Shanghai', 31.23, 121.47], ['Tokyo', 35.68, 139.69],
    ['Seoul', 37.57, 126.98], ['Sydney', -33.87, 151.21], ['Lisbon', 38.72, -9.14], ['Dublin', 53.35, -6.26], ['Casablanca', 33.57, -7.59], ['Tel Aviv', 32.09, 34.78], ['Copenhagen', 55.68, 12.57]];
  const local = (lat, lon) => { const a = THREE.MathUtils.degToRad(lat), b = THREE.MathUtils.degToRad(lon); return new THREE.Vector3(Math.cos(a) * Math.cos(b), Math.sin(a), -Math.cos(a) * Math.sin(b)); };
  const localNorth = (lat, lon) => { const a = THREE.MathUtils.degToRad(lat), b = THREE.MathUtils.degToRad(lon); return new THREE.Vector3(-Math.sin(a) * Math.cos(b), Math.cos(a), Math.sin(a) * Math.sin(b)); };
  // turn Earth so the point under the F faces it, with north running up the screen towards the horizon
  const nW = C.clone().negate().normalize();
  const tW = new THREE.Vector3(1, 0, 0).sub(nW.clone().multiplyScalar(nW.x)).normalize(), eW = tW.clone().cross(nW);
  const nL = local(SUB.lat, SUB.lon), tL = localNorth(SUB.lat, SUB.lon), eL = tL.clone().cross(nL);
  const Mw = new THREE.Matrix4().makeBasis(eW, tW, nW), Ml = new THREE.Matrix4().makeBasis(eL, tL, nL);
  const EARTH_Q = new THREE.Quaternion().setFromRotationMatrix(Mw.multiply(Ml.transpose()));
  const onEarth = (lat, lon, h = 0) => local(lat, lon).applyQuaternion(EARTH_Q).multiplyScalar(R + h).add(C);
  const sunDir = new THREE.Vector3(), tmp = new THREE.Vector3();
  let t0 = 0, light = 0, arcsGoal = 1, arcsOn = 1;
  // the F leaves Earth's shadow when the sun is this many degrees east of the point under it (10 s after arriving)
  const SUNRISE = 180 - THREE.MathUtils.radToDeg(Math.asin(R / D)) + 1.5;

  // ---- stars and the Milky Way
  {
    const n = phone ? 3000 : 6000, pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    const band = new THREE.Vector3(0.3, 0.8, 0.5).normalize();
    for (let i = 0; i < n; i++) {
      let v = new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)).normalize();
      if (i % 3 === 0) { v.sub(band.clone().multiplyScalar(v.dot(band) * rnd(0.8, 1))).normalize(); }   // crowd a third of them along the band
      v.multiplyScalar(2600); pos.set([v.x, v.y, v.z], i * 3);
      const b = Math.pow(Math.random(), 3) * 1.4 + 0.08, warm = Math.random();
      col.set([b * (0.8 + 0.2 * warm), b * (0.82 + 0.1 * warm), b * (1.0 - 0.25 * warm)], i * 3);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const stars = new THREE.Points(g, new THREE.PointsMaterial({ size: phone ? 1.6 : 1.9, sizeAttenuation: false, vertexColors: true, depthWrite: false }));
    stars.renderOrder = -5; stars.frustumCulled = false; bg.add(stars);
  }

  // ---- Earth: day and night maps, clouds, ocean glint, the warm band at the terminator, our offices brightest
  const earthU = { uDay: { value: null }, uNight: { value: null }, uClouds: { value: null }, uWater: { value: null }, uSun: { value: sunDir }, uC: { value: C },
    uOff: { value: OFFICES.map(o => onEarth(o[1], o[2]).sub(C).normalize()) }, uTime: { value: 0 } };
  const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 160, 96), new THREE.ShaderMaterial({
    uniforms: earthU,
    vertexShader: `varying vec2 vUv; varying vec3 vN, vW; void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform sampler2D uDay, uNight, uClouds, uWater; uniform vec3 uSun, uC, uOff[3]; uniform float uTime; varying vec2 vUv; varying vec3 vN, vW;
      void main() {
        vec3 n = normalize(vN), V = normalize(cameraPosition - vW); float l = dot(n, uSun);
        float day = smoothstep(-0.1, 0.16, l);
        float cl = texture2D(uClouds, vUv + vec2(uTime * 0.0004, 0.0)).r;
        vec3 dayC = texture2D(uDay, vUv).rgb * (0.012 + 1.3 * max(l, 0.0));
        dayC = mix(dayC, vec3(0.95, 0.97, 1.0) * (0.008 + 1.35 * max(l, 0.0)), cl * 0.8);
        float water = texture2D(uWater, vUv).r;
        vec3 H = normalize(uSun + V);
        dayC += vec3(1.0, 0.85, 0.65) * water * (1.0 - cl) * pow(max(dot(n, H), 0.0), 70.0) * 1.2 * step(0.0, l);
        vec3 nightC = pow(texture2D(uNight, vUv).rgb, vec3(1.35)) * 3.6 * (1.0 - cl * 0.7);
        float off = 0.0;
        for (int i = 0; i < 3; i++) { float a = acos(clamp(dot(n, uOff[i]), -1.0, 1.0)); off += exp(-pow(a / 0.0055, 2.0)) * 2.5 + exp(-pow(a / 0.02, 2.0)) * 0.5; }
        nightC += vec3(1.0, 0.72, 0.62) * off * (0.85 + 0.15 * sin(uTime * 2.0));
        vec3 col = mix(nightC, dayC, day) + nightC * 0.04;
        col += vec3(1.0, 0.42, 0.2) * exp(-pow(l / 0.07, 2.0)) * 0.1 * (1.0 - cl * 0.5);
        float rim = pow(1.0 - max(dot(n, V), 0.0), 2.5);
        col += mix(vec3(0.004, 0.01, 0.03), vec3(0.28, 0.5, 1.0), smoothstep(-0.2, 0.3, l)) * rim * 0.75;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  earth.position.copy(C); earth.quaternion.copy(EARTH_Q); bg.add(earth);

  // ---- the atmosphere: a glow just outside the limb, blue by day, orange at sunrise, bright looking into the sun
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.04, 128, 64), new THREE.ShaderMaterial({
    uniforms: { uSun: { value: sunDir }, uC: { value: C } }, side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform vec3 uSun, uC; varying vec3 vW;
      void main() {
        vec3 ro = cameraPosition, rd = normalize(vW - ro);
        float tc = dot(uC - ro, rd); vec3 p = ro + rd * tc; float h = length(p - uC);
        float R = ${R.toFixed(1)};
        if (h < R) discard;
        float x = (h - R) / (R * 0.04);
        float glow = exp(-x * 4.0) * (1.0 - smoothstep(0.85, 1.0, x));
        vec3 up = normalize(p - uC); float lit = dot(up, uSun);
        vec3 col = mix(vec3(0.02, 0.04, 0.12), vec3(0.3, 0.55, 1.0), smoothstep(-0.25, 0.35, lit));
        col = mix(col, vec3(1.0, 0.5, 0.25), exp(-pow(lit / 0.18, 2.0)) * 0.8);
        float fwd = pow(max(dot(rd, uSun), 0.0), 12.0);
        gl_FragColor = vec4(col * glow * (0.9 + 3.0 * fwd), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  atmo.position.copy(C); bg.add(atmo);

  // ---- the sun: a hot core, a wide glow and a streak; hidden when Earth is in the way
  const sunCore = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(128, [[0, 'rgba(255,255,255,1)'], [0.2, 'rgba(255,250,235,1)'], [0.45, 'rgba(255,220,170,.35)'], [1, 'rgba(255,200,150,0)']]), color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(128, [[0, 'rgba(255,230,190,.6)'], [0.3, 'rgba(255,190,130,.18)'], [1, 'rgba(255,160,100,0)']]), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  const streak = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(128, [[0, 'rgba(255,240,220,.7)'], [0.5, 'rgba(255,220,190,.12)'], [1, 'rgba(255,200,170,0)']]), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  bg.add(sunGlow, streak, sunCore);

  // ---- connections: beams from the F down to our offices, and arcs out from the offices to the world
  const lines = [], pulses = [];
  function curveLine(points, colour, width, opacity, dash, fade = 0) {
    const geo = new LineGeometry(); geo.setPositions(points.flatMap(p => [p.x, p.y, p.z]));
    const c = new THREE.Color(colour), cols = [];
    points.forEach((p, i) => { const t = i / (points.length - 1), k = fade ? Math.pow(t, fade) * 0.9 + 0.1 : Math.sin(Math.PI * t) * 0.85 + 0.15; cols.push(c.r * k, c.g * k, c.b * k); });
    geo.setColors(cols);
    const m = new LineMaterial({ color: 0xffffff, vertexColors: true, linewidth: width, transparent: true, opacity, depthWrite: false, dashed: true, dashSize: dash[0], gapSize: dash[1] });
    m.blending = THREE.AdditiveBlending;
    const l = new Line2(geo, m); l.computeLineDistances(); l.frustumCulled = false; bg.add(l); lines.push(l); return l;
  }
  function buildConnections() {
    const F = new THREE.Vector3(0, 0.15, 0);
    OFFICES.forEach(([, lat, lon], i) => {
      const g = onEarth(lat, lon), mid = F.clone().lerp(g, 0.5).add(new THREE.Vector3(0, 30 + i * 12, 0));
      const pts = new THREE.QuadraticBezierCurve3(F, mid, g).getPoints(90);
      const l = curveLine(pts, 0xff8fc8, 1.7, 0.9, [10, 7], 1.6); l.userData = { speed: 30 + i * 6, base: 0.9 };
      pulses.push({ curve: new THREE.QuadraticBezierCurve3(F, mid, g), speed: 0.11 + i * 0.02, off: i * 0.33, col: 0xffc0e0 });
    });
    MARKETS.filter((m, i) => i % 3 !== 2).forEach(([, lat, lon], i) => {
      const o = OFFICES[i % 3], a = local(o[1], o[2]), b = local(lat, lon);
      const ang = a.angleTo(b), lift = Math.min(0.045, ang * 0.05), pts = [];
      for (let k = 0; k <= 64; k++) {
        const t = k / 64, v = a.clone().lerp(b, t).normalize();
        pts.push(v.applyQuaternion(EARTH_Q).multiplyScalar(R * (1 + 0.004 + lift * Math.sin(Math.PI * t))).add(C));
      }
      const l = curveLine(pts, 0x9feaff, 1.1, 0.42, [2.5, 7]); l.userData = { speed: 10 + (i % 5) * 3, base: 0.42 };
    });
  }
  const pulseGeo = new THREE.BufferGeometry(), pulsePos = new Float32Array(9 * 3), pulseCol = new Float32Array(9 * 3);
  pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3)); pulseGeo.setAttribute('color', new THREE.BufferAttribute(pulseCol, 3));
  const pulsePts = new THREE.Points(pulseGeo, new THREE.PointsMaterial({ map: softDot(64), color: 0xffd6ec, vertexColors: true, size: phone ? 8 : 10, sizeAttenuation: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  pulsePts.frustumCulled = false; pulsePts.layers.set(1); bg.add(pulsePts);
  const officeGlow = OFFICES.map(([, lat, lon]) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(64), color: 0xffb8dc, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.position.copy(onEarth(lat, lon, 1.5)); s.scale.setScalar(16); s.layers.set(1); bg.add(s); return s;
  });

  // ---- the F, chrome, with a reflection of the world around it
  const cubeRT = new THREE.WebGLCubeRenderTarget(phone ? 128 : 512, { type: THREE.HalfFloatType });
  const cubeCam = new THREE.CubeCamera(1, 5000, cubeRT); cubeCam.position.set(0, 1, 0);
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.35, roughness: 0.32, envMap: cubeRT.texture, envMapIntensity: 1.2, clearcoat: 1, clearcoatRoughness: 0.04, iridescence: 0.35, iridescenceIOR: 1.35, iridescenceThicknessRange: [300, 600] });
  // at night only its edges catch the glow; in the sun it turns to full colour, a thin-film sheen over the chrome
  // the F in candy paint under a clear coat: at night just the coat's highlights, in the sun its full colour
  const chromeU = { uDay: { value: 0 }, uNight: { value: 1 }, uTime: { value: 0 }, uObjToView: { value: new THREE.Matrix3() } };
  chrome.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, chromeU);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vObj;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvObj = (modelMatrix * vec4(position, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('uniform float opacity;', 'uniform float opacity; uniform float uDay, uNight, uTime; uniform mat3 uObjToView; varying vec3 vObj;\n'
        + 'vec3 h3(vec3 c) { return fract(sin(vec3(dot(c, vec3(127.1, 311.7, 74.7)), dot(c, vec3(269.5, 183.3, 246.1)), dot(c, vec3(113.5, 271.9, 124.6)))) * 43758.5453) - 0.5; }')
      .replace('#include <color_fragment>', `#include <color_fragment>
        float gt = clamp(vObj.y / 1.95 * 0.7 + (vObj.z + 0.83) / 1.55 * 0.3, 0.0, 1.0);
        vec3 gc = mix(vec3(0.22, 0.05, 0.75), vec3(0.95, 0.06, 0.42), smoothstep(0.0, 0.42, gt));
        gc = mix(gc, vec3(1.0, 0.32, 0.18), smoothstep(0.42, 0.75, gt));
        gc = mix(gc, vec3(1.0, 0.68, 0.16), smoothstep(0.75, 1.0, gt));
        diffuseColor.rgb = gc;`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float fr = pow(1.0 - saturate(dot(normalize(normal), normalize(vViewPosition))), 2.0);
        totalEmissiveRadiance += vec3(0.55, 0.7, 1.0) * pow(fr, 3.0) * 0.5 * uNight;`);
  };
  const heroG = new THREE.Group(); fg.add(heroG);
  // navigation lights at the F's corners, blinking like a satellite's
  const navs = [[-0.13, 1.92, -0.8, 0xff3030, 0], [-0.13, 1.86, 0.69, 0x30ff70, 0.5], [-0.13, 0.04, -0.55, 0xffffff, 0.25]].map(([x, y, z, c, ph]) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(64), color: c, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.position.set(x, y, z); s.scale.setScalar(0.22); s.userData.ph = ph; heroG.add(s); return s;
  });
  const sunLight = new THREE.DirectionalLight(0xfff3e2, 0); sunLight.castShadow = true; sunLight.shadow.mapSize.set(1024, 1024);
  Object.assign(sunLight.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 1, far: 30 }); sunLight.shadow.bias = -0.0005;
  const earthShine = new THREE.HemisphereLight(0x000000, 0x30476e, 0.4);
  fg.add(sunLight, sunLight.target, earthShine);

  // ---- an astronaut doing maintenance on the F
  const astro = new THREE.Group(); let spark = null, sparkLight = null, forearm = null;
  function buildAstronaut() {
    const suit = new THREE.MeshStandardMaterial({ color: 0xeeeeea, roughness: 0.78, metalness: 0.0 });
    const grey = new THREE.MeshStandardMaterial({ color: 0x8a8d93, roughness: 0.5, metalness: 0.4 });
    const visor = new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.06, metalness: 1, envMap: cubeRT.texture, envMapIntensity: 1.5 });
    const part = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, parent = astro) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
    part(new THREE.CapsuleGeometry(0.07, 0.11, 6, 14), suit, 0, 0, 0);
    part(new THREE.BoxGeometry(0.15, 0.19, 0.08), suit, 0, 0.01, -0.085);
    part(new THREE.BoxGeometry(0.07, 0.05, 0.03), grey, 0, 0.0, 0.07);
    part(new THREE.SphereGeometry(0.066, 24, 16), suit, 0, 0.145, 0);
    part(new THREE.SphereGeometry(0.058, 24, 16, Math.PI * 0.08, Math.PI * 0.84, Math.PI * 0.25, Math.PI * 0.42), visor, 0, 0.147, 0.012);
    part(new THREE.TorusGeometry(0.052, 0.008, 8, 24), grey, 0, 0.1, 0, Math.PI / 2);
    // left arm resting, right arm reaching out to the F with a tool
    const sh = (side) => { const g = new THREE.Group(); g.position.set(side * 0.085, 0.06, 0); astro.add(g); return g; };
    const lA = sh(-1); lA.rotation.set(0.3, 0, 0.35); part(new THREE.CapsuleGeometry(0.026, 0.08, 4, 10), suit, 0, -0.06, 0, 0, 0, 0, lA); part(new THREE.CapsuleGeometry(0.024, 0.07, 4, 10), suit, 0, -0.15, 0.03, -0.5, 0, 0, lA); part(new THREE.SphereGeometry(0.026, 12, 8), grey, 0, -0.2, 0.06, 0, 0, 0, lA);
    const rA = sh(1); rA.rotation.set(-1.2, 0, -0.25); part(new THREE.CapsuleGeometry(0.026, 0.08, 4, 10), suit, 0, -0.06, 0, 0, 0, 0, rA);
    forearm = new THREE.Group(); forearm.position.set(0, -0.11, 0); rA.add(forearm); forearm.rotation.x = -0.6;
    part(new THREE.CapsuleGeometry(0.024, 0.07, 4, 10), suit, 0, -0.05, 0, 0, 0, 0, forearm); part(new THREE.SphereGeometry(0.026, 12, 8), grey, 0, -0.1, 0, 0, 0, 0, forearm);
    part(new THREE.CylinderGeometry(0.008, 0.012, 0.08, 8), grey, 0, -0.15, 0, 0, 0, 0, forearm);
    // legs as proper joints: hip, knee and ankle, so the shin hangs from the knee and the boots point forward
    const leg = (side, hipBend, kneeBend, ankleBend) => {
      const hip = new THREE.Group(); hip.position.set(side * 0.04, -0.12, 0); hip.rotation.set(hipBend, 0, side * 0.06); astro.add(hip);
      part(new THREE.CapsuleGeometry(0.032, 0.1, 4, 10), suit, 0, -0.07, 0, 0, 0, 0, hip);
      const knee = new THREE.Group(); knee.position.set(0, -0.15, 0); knee.rotation.x = kneeBend; hip.add(knee);
      part(new THREE.SphereGeometry(0.031, 12, 8), suit, 0, 0, 0, 0, 0, 0, knee);
      part(new THREE.CapsuleGeometry(0.029, 0.095, 4, 10), suit, 0, -0.066, 0, 0, 0, 0, knee);
      const ankle = new THREE.Group(); ankle.position.set(0, -0.14, 0); ankle.rotation.x = ankleBend; knee.add(ankle);
      part(new THREE.SphereGeometry(0.03, 12, 8), suit, 0, 0, 0, 0, 0, 0, ankle);
      part(new THREE.CapsuleGeometry(0.027, 0.055, 4, 10), suit, 0, -0.012, 0.03, Math.PI / 2, 0, 0, ankle);
      part(new THREE.BoxGeometry(0.05, 0.014, 0.1), grey, 0, -0.036, 0.03, 0, 0, 0, ankle);
    };
    leg(-1, -0.5, 0.85, -0.05); leg(1, -0.3, 0.6, 0.0);
    // tip of the tool: a welding spark and its light
    spark = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(64), color: 0xbfe6ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    spark.position.set(0, -0.2, 0); spark.scale.setScalar(0.1); forearm.add(spark);
    sparkLight = new THREE.PointLight(0x9fd8ff, 0, 1.5, 2); sparkLight.position.set(0, -0.2, 0); forearm.add(sparkLight);
    astro.scale.setScalar(1.1);
    astro.position.set(-0.42, 1.58, 1.05); astro.rotation.set(0.15, 2.3, -0.25);
    fg.add(astro);
    // tether back to the F
    const a = new THREE.Vector3(-0.42, 1.6, 0.9), b = new THREE.Vector3(-0.05, 1.2, 0.45);
    const curve = new THREE.CatmullRomCurve3([a, a.clone().lerp(b, 0.3).add(new THREE.Vector3(-0.15, -0.25, 0.1)), a.clone().lerp(b, 0.7).add(new THREE.Vector3(-0.05, -0.3, 0.05)), b]);
    fg.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.004, 5), suit));
  }

  const labelsEl = document.getElementById('labels'), labels = []; let fMesh = null;
  const world = {
    id: 'orbit', scene: fg, entering: 'Going into orbit', exposure: 1.0,
    kicker: 'World test 03 · About', title: 'In orbit',
    blurb: 'The F above Earth at night, catching the first light as day comes round. London, Barcelona and Abu Dhabi shine brightest, connected to the world.',
    cam: { radius: 6.6, height: 2.3, look: 0.95, lookPhone: 0.6, fov: 38, far: 4000 },
    assets: () => [WDIR + (phone ? 'day-2k.jpg' : 'day-4k.jpg'), WDIR + (phone ? 'night-2k.jpg' : 'night-4k.jpg'), WDIR + 'clouds-2k.jpg', WDIR + 'water-2k.jpg'],
    views: [{ label: 'Hero view', deg: 0 }, { label: 'About angle', deg: -105 }, { label: 'Into the sun', deg: 140 }],
    toggle: { label: 'Connections', set(on) { arcsGoal = on ? 1 : 0; } },
    async load() {
      const big = !phone;
      const [day, night, clouds, water, logo] = await Promise.all([
        loadTex(WDIR + (big ? 'day-4k.jpg' : 'day-2k.jpg')), loadTex(WDIR + (big ? 'night-4k.jpg' : 'night-2k.jpg')), loadTex(WDIR + 'clouds-2k.jpg', false), loadTex(WDIR + 'water-2k.jpg', false), loadGLB64(LOGO_URL),
      ]);
      [day, night, clouds, water].forEach(t => { t.anisotropy = 8; });
      clouds.wrapS = THREE.RepeatWrapping;
      earthU.uDay.value = day; earthU.uNight.value = night; earthU.uClouds.value = clouds; earthU.uWater.value = water;
      const g = logo.scene; g.scale.setScalar(3.416); g.position.y = 0.0476 * 3.416;
      g.traverse(o => { if (o.isMesh) { o.material = chrome; o.castShadow = true; o.receiveShadow = true; fMesh = fMesh || o; } });
      const inner = new THREE.Group(); inner.add(g); inner.rotation.y = -Math.PI / 2; inner.position.set(-0.056, 0, -0.056); heroG.add(inner);
      buildAstronaut(); buildConnections();
      OFFICES.forEach(([name]) => { const el = document.createElement('div'); el.className = 'city-label'; el.textContent = name; labelsEl.appendChild(el); labels.push(el); });
    },
    enter() { t0 = clock.elapsedTime; labelsEl.hidden = false; camera.layers.enable(1); },
    reveal() { t0 = clock.elapsedTime; },   // night again each time you arrive, so the sunrise plays
    exit() { labelsEl.hidden = true; camera.layers.disable(1); },
    resize(w, h) { for (const l of lines) l.material.resolution.set(w, h); },
    update(t, dt) {
      const tt = t - t0;
      // the sun comes round: Earth's axis is fixed, the point under the sun moves west
      const delta = SUNRISE + 360 * 10 / P - 360 * tt / P;   // degrees east of the point under the F
      tmp.copy(local(0, SUB.lon + delta)).applyQuaternion(EARTH_Q); sunDir.copy(tmp).normalize();
      // is the F in Earth's shadow? soft at the edge, which is when its edges catch the first light
      const v = tmp.set(0, 1, 0).sub(C), along = v.dot(sunDir), off = v.clone().sub(sunDir.clone().multiplyScalar(along)).length();
      const target = along > 0 ? 1 : THREE.MathUtils.smoothstep(off, R * 0.985, R * 1.03);
      light += (target - light) * (1 - Math.exp(-dt * 4));
      sunLight.position.copy(sunDir).multiplyScalar(15); sunLight.target.position.set(0, 1, 0);
      sunLight.intensity = 3.4 * light;
      chromeU.uDay.value = light; chromeU.uNight.value = 1 - light; chromeU.uTime.value = t;
      if (fMesh) { fMesh.updateWorldMatrix(true, false); chromeU.uObjToView.value.setFromMatrix4(new THREE.Matrix4().multiplyMatrices(camera.matrixWorldInverse, fMesh.matrixWorld)); }
      navs.forEach(n => { const k = (t * 0.8 + n.userData.ph) % 1; n.material.opacity = k < 0.08 ? 1 : 0.08; n.scale.setScalar(k < 0.08 ? 0.3 : 0.16); });
      // light from Earth below: blue by day, a faint warm glow of cities at night
      const below = nW.dot(sunDir);
      earthShine.groundColor.setRGB(0.12 + 0.2 * Math.max(below, 0), 0.16 + 0.3 * Math.max(below, 0), 0.22 + 0.5 * Math.max(below, 0));
      earthShine.intensity = 0.25 + 0.9 * Math.max(below, 0);
      const sp = sunDir.clone().multiplyScalar(2400);
      sunCore.position.copy(sp); sunGlow.position.copy(sp); streak.position.copy(sp);
      sunCore.scale.setScalar(150); sunGlow.scale.setScalar(900 + 400 * (1 - light)); streak.scale.set(2600, 60, 1);
      // the F floats, turning a little
      heroG.position.y = Math.sin(t * 0.45) * 0.05; heroG.rotation.y = Math.sin(t * 0.13) * 0.08; heroG.rotation.z = Math.sin(t * 0.21) * 0.02;
      astro.position.y = 1.58 + heroG.position.y + Math.sin(t * 0.6 + 1) * 0.015; astro.rotation.z = -0.25 + Math.sin(t * 0.4) * 0.04;
      if (forearm) forearm.rotation.x = -0.6 + Math.sin(t * 1.3) * 0.08;
      const weld = (Math.sin(t * 0.8) > 0.2) ? (0.6 + 0.4 * Math.random()) : 0;
      if (spark) { spark.material.opacity = weld; spark.scale.setScalar(0.06 + 0.08 * weld); sparkLight.intensity = 0.6 * weld; }
      // connections
      arcsOn += (arcsGoal - arcsOn) * (1 - Math.exp(-dt * 3));
      for (const l of lines) { l.material.dashOffset -= dt * l.userData.speed; l.material.opacity = l.userData.base * arcsOn; l.visible = arcsOn > 0.01; }
      pulses.forEach((p, i) => { const u = (tt * p.speed + p.off) % 1, q = p.curve.getPoint(1 - u), k = Math.sin(Math.PI * u); pulsePos.set([q.x, q.y, q.z], i * 3); pulseCol.set([k, k, k], i * 3); });
      pulseGeo.attributes.position.needsUpdate = true; pulseGeo.attributes.color.needsUpdate = true; pulsePts.material.opacity = arcsOn;
      const nightUnder = 1 - THREE.MathUtils.smoothstep(below, -0.1, 0.25);
      officeGlow.forEach((s, i) => { s.material.opacity = (0.35 + 0.65 * nightUnder) * (0.8 + 0.2 * Math.sin(t * 2 + i)); });
      earthU.uTime.value = t;
      // the F's reflections: refresh the view of the world from the F a few times a second
      if ((Math.floor(t * 30) % 4) === 0) { heroG.visible = false; cubeCam.update(renderer, bg); heroG.visible = true; }
      // labels for the offices
      OFFICES.forEach(([, lat, lon], i) => {
        const p = onEarth(lat, lon, 2), n = p.clone().sub(C).normalize(), toCam = camera.position.clone().sub(p).normalize();
        const s = p.clone().project(camera), vis = n.dot(toCam) > 0.05 && s.z < 1 && Math.abs(s.x) < 1.1 && Math.abs(s.y) < 1.1;
        const el = labels[i]; if (!el) return;
        el.style.opacity = vis ? String(0.95 * (0.5 + 0.5 * arcsOn)) : '0';
        el.style.transform = `translate(${(s.x * 0.5 + 0.5) * innerWidth + 8}px, ${(-s.y * 0.5 + 0.5) * innerHeight - 6}px)`;
      });
    },
    hero: heroG,
    compileExtra(r, cam) { r.compile(bg, cam); },
    render(r, cam) {
      r.autoClear = false; r.setClearColor(0x000000, 1); r.clear();
      r.render(bg, cam); r.render(fg, cam);
      r.autoClear = true;
    },
  };
  return world;
})();

/* ---------------- worlds: each page has its own ----------------
   Work keeps the desert. Capabilities is the studio with the flower F, Contact the city at night,
   About the F in orbit. Going into a page dives into the F, and that page's world is swapped in behind
   it, so you come back out somewhere new. The other worlds download quietly once the desert is up,
   and each one is built the first time its page covers the screen. */
const WORLD_OF = { work: 'desert', capabilities: 'studio', contact: 'city', about: 'orbit' };
const WORLD_YAW = { desert: 0, studio: 0, city: 0, orbit: -105 };   // turns a world so its best view faces its page's card
let worldKey = 'desert', desertUp;
const desertReady = new Promise(r => { desertUp = r; });
const activeCam = () => worldKey === 'desert' ? CAM : WORLDS[worldKey].cam;
const diveTarget = () => worldKey === 'desert' ? fGroup : (WORLDS[worldKey].hero || fGroup);
const building = {};
function buildWorld(key) {
  const w = WORLDS[key];
  if (!w || w.ready) return Promise.resolve();
  if (!building[key]) {
    building[key] = (async () => {
      await prefetchAssets(w.assets());
      await w.load(); w.ready = true;
      const W = innerWidth, H = innerHeight; w.resize?.(W, H);
      try { renderer.compile(w.scene, camera); w.compileExtra?.(renderer, camera); } catch (e) {}
    })().catch(e => { console.warn('world did not load', key, e); delete building[key]; throw e; });
  }
  return building[key];
}
function setWorld(key) {
  if (key === worldKey) return;
  if (worldKey !== 'desert') WORLDS[worldKey].exit?.();
  worldKey = key;
  const w = key === 'desert' ? null : WORLDS[key];
  w?.enter?.();
  camera.far = w ? (w.cam.far ?? 400) : 400; camera.updateProjectionMatrix();
  renderer.toneMappingExposure = w ? (w.exposure ?? 1) : 1.05;
  Sound.setWorld(key); renderMoods();
  const hint = document.getElementById('dragHint');
  if (hint) hint.textContent = { desert: 'Drag the desert to turn', studio: 'Drag the studio to turn', city: 'Drag the city to turn', orbit: 'Drag to orbit' }[key];
  fit();
}
function requestWorld(key, el) {
  if (!gl || key === worldKey) return;
  desertReady.then(() => buildWorld(key)).then(() => { if (openSheet && openSheet === el) setWorld(key); }).catch(() => {});
}
let prefetching = false;
function prefetchWorlds() {   // network only, so the desert keeps running smoothly
  if (prefetching || !gl) return; prefetching = true;
  const go = async () => { for (const k of ['studio', 'city', 'orbit']) await prefetchAssets(WORLDS[k].assets()); };
  if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 4000 }); else setTimeout(go, 300);
}


/* ---------------- start ---------------- */
addEventListener('resize', () => { if (gl && camera) fit(); });
showStop(0, true);
if (gl) { document.documentElement.classList.add('intro'); initWorld(); } else { still.classList.remove('gone'); }
route();
