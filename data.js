/* =========================================================
   WAYFARE — data.js  (shared by index + destination pages)
   Trip data, photo galleries, and availability helpers.
   ========================================================= */

/* --- photo helper -----------------------------------------
   Uses verified Unsplash CDN photo IDs (stable, hotlinkable,
   free for commercial use, no attribution required). Each
   gallery entry is [photoId, caption]. Swap an id for your
   own/licensed image any time — or replace src directly.    */
function img(id, w){
  w = w || 1280;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
}
function gallery(items){
  return items.map(([id, caption]) => ({ src: img(id), id, caption }));
}

/* --- region tints (used for the gradient fallback) ------- */
const REGION_TINT = {
  Americas: ["#0c5a6e", "#0a7d6b"],
  Asia:     ["#0b4f74", "#1c7d86"],
  Africa:   ["#0e5b73", "#1d8a8a"],
  Europe:   ["#0a4a78", "#1577a8"],
};

/* --- the trips ------------------------------------------- */
const TRIPS = [
  {
    id:"andean", name:"The Andean Traverse", region:"Americas", where:"Peru · Bolivia",
    blurb:"Cusco markets to the white silence of the Uyuni salt flat, overland the whole way.",
    days:12, date:"14 Sep 2026", coord:"13.5°S / 71.9°W", price:4380, total:14, left:2,
    long:"Twelve days that climb from the cobbled streets of Cusco, through the terraced Sacred Valley, up to Machu Picchu at first light — then south across the altiplano to the mirror-flat expanse of Salar de Uyuni. You travel overland the whole way, so the landscape changes by the hour instead of by the flight.",
    highlights:["Sunrise at Machu Picchu before the day crowds arrive","A night on the Uyuni salt flat under a sky with no horizon","Markets and ruins through the Sacred Valley with a resident guide"],
    stops:[
      ["Cusco","Two days acclimatising in the old Inca capital — markets, ruins, and the best coffee in the Andes."],
      ["Sacred Valley","Terraces, salt pans, and Ollantaytambo on the slow road toward the mountain."],
      ["Machu Picchu","In at dawn by the early train, ahead of the buses."],
      ["Salar de Uyuni","Across the border into Bolivia for the salt flat and its impossible reflections."],
    ],
    included:["All overland transport & the Machu Picchu train","11 nights lodging, family guesthouses to salt hotels","Resident English-speaking guide","Park permits & entries","Daily breakfast, four dinners"],
    photos: gallery([
      ["1587595431973-160d0d94add1","Machu Picchu at dawn"],
      ["1543385426-191664295b58","The citadel"],
      ["1666240073343-9801b7b5b949","Inca stonework"],
      ["1664387518989-bb1d8574f078","Llamas on the terraces"],
      ["1526392060635-9d6019884377","The high Andes"],
    ]),
  },
  {
    id:"kyoto", name:"Kyoto to Coast", region:"Asia", where:"Japan",
    blurb:"Temple mornings in Kyoto, then a slow drift through the art islands of the Seto sea.",
    days:9, date:"02 Apr 2026", coord:"35.0°N / 135.8°E", price:3960, total:12, left:5,
    long:"A trip in two halves. First the temples, gardens and back lanes of Kyoto in cherry-blossom season, walked early before the gates fill. Then west to the Seto Inland Sea, island-hopping between Naoshima and its neighbours where contemporary art sits in old fishing villages and disused schools.",
    highlights:["Higashiyama lanes and Kiyomizu-dera before breakfast","The vermilion tunnel of Fushimi Inari, walked at dawn","Naoshima's island art museums by bicycle and ferry"],
    stops:[
      ["Kyoto","Four nights for temples, tea houses, and Nishiki market."],
      ["Arashiyama","Bamboo, the monkey park, and the river at the city's edge."],
      ["Naoshima","Ferry to the art island — Chichu, the pumpkin, and a night in a village inn."],
      ["Setouchi","A final drift through the inland sea before flying home from Okayama."],
    ],
    included:["Rail passes & island ferries","8 nights lodging, ryokan to island inns","Resident guide in Kyoto","Museum & garden entries","Daily breakfast, three dinners"],
    photos: gallery([
      ["1614360380098-63e2fbfda70b","Kiyomizu-dera, Kyoto"],
      ["1717496376319-ee3d354ac2d8","Higashiyama lanes"],
      ["1669954766248-520dd92190ea","Temple rooftops"],
      ["1637679105331-a0cea188b83e","A hillside shrine"],
      ["1560664253-62927fb4d627","Shrine bell"],
    ]),
  },
  {
    id:"sahara", name:"Saharan Thresholds", region:"Africa", where:"Morocco",
    blurb:"Marrakech, over the High Atlas, and a night where the dunes start at Merzouga.",
    days:8, date:"19 Oct 2026", coord:"31.1°N / 4.0°W", price:2740, total:14, left:9,
    long:"From the noise and colour of Marrakech, the route climbs over the High Atlas, down through gorges and kasbahs, to the edge of the Sahara at Merzouga. The last leg is by camel into the dunes for a night in a desert camp — dinner under a sky that does not stop.",
    highlights:["The souks and rooftops of Marrakech","The Tizi n'Tichka pass over the High Atlas","A night in the Erg Chebbi dunes, reached by camel"],
    stops:[
      ["Marrakech","Two nights in the medina — souks, gardens, and a rooftop dinner."],
      ["High Atlas","Over the pass and down to Aït Benhaddou's earthen kasbah."],
      ["Dadès & Todra","Gorges, palm valleys, and the long road east."],
      ["Merzouga","Camels into the dunes for a night under canvas at the desert's edge."],
    ],
    included:["Private 4x4 transport across the Atlas","7 nights lodging, riads to a desert camp","Resident guide & camel handlers","All park & site entries","Daily breakfast, four dinners"],
    photos: gallery([
      ["1617374128851-c84e37dc9f37","Erg Chebbi dunes"],
      ["1559586616-361e18714958","Camel caravan, Merzouga"],
      ["1763146742150-0dc401217fb5","Kasbah at dusk"],
      ["1667143297021-a452e55fdfa8","The great sand sea"],
      ["1510952267577-fc96d5ca660a","Into the dunes"],
    ]),
  },
  {
    id:"fjord", name:"Fjordline", region:"Europe", where:"Norway",
    blurb:"Bergen's wooden wharf up to Lofoten, chasing light that refuses to set.",
    days:10, date:"08 Jun 2026", coord:"68.2°N / 14.5°E", price:5120, total:10, left:1,
    long:"Ten days up the Norwegian coast in the season of the midnight sun. From the painted wharf houses of Bergen, by rail and coastal boat north to the Lofoten archipelago, where red fishing cabins sit under peaks that drop straight into the sea and the light never quite goes out.",
    highlights:["Bergen's Bryggen wharf and the funicular at golden hour","The coastal voyage north past fjord after fjord","Midnight sun over the Lofoten peaks"],
    stops:[
      ["Bergen","Two nights in the gateway city — wharf, market, and mountain views."],
      ["The coast","North by the famous coastal route, fjords on either side."],
      ["Lofoten","Reine, Hamnøy, and the red rorbu cabins on the water."],
      ["Arctic beaches","White-sand coves under the never-setting sun."],
    ],
    included:["Rail, coastal boat & local transfers","9 nights lodging, harbour hotels to rorbuer","Resident guide in Lofoten","Boat excursions","Daily breakfast, five dinners"],
    photos: gallery([
      ["1663428520845-056989f8a664","Reine, Lofoten"],
      ["1595586551885-12db6bd260eb","Fjord country"],
      ["1593291805141-990f40ec982d","Red rorbu cabins"],
      ["1542047078441-229be3aa1f12","Islands to the horizon"],
      ["1601028247653-4b522976ed67","Villages on the water"],
    ]),
  },
  {
    id:"mekong", name:"The Mekong Slow Boat", region:"Asia", where:"Laos · Vietnam",
    blurb:"Two days downriver by wooden boat, then the lantern streets of Hoi An.",
    days:14, date:"11 Nov 2026", coord:"19.9°N / 102.1°E", price:3580, total:12, left:7,
    long:"Fourteen unhurried days along the spine of the Mekong. A two-day wooden slow-boat carries you downriver to Luang Prabang's temples and almsgiving dawns, then east into Vietnam — the rice terraces, the old port of Hoi An, and its river of lanterns at night.",
    highlights:["Two days on a wooden slow-boat down the Mekong","Dawn almsgiving and night markets in Luang Prabang","Hoi An's lantern-lit old town on the river"],
    stops:[
      ["Huay Xai","Board the slow-boat at the Lao border for two days downriver."],
      ["Luang Prabang","Temples, waterfalls, and the quiet former royal capital."],
      ["Hanoi","Across into Vietnam — the old quarter and a night train south."],
      ["Hoi An","Tailors, rice fields, and lanterns on the Thu Bồn river."],
    ],
    included:["Private slow-boat & internal flights","13 nights lodging, river inns to boutique stays","Resident guides in Laos & Vietnam","All entries & boat trips","Daily breakfast, six dinners"],
    photos: gallery([
      ["1563354860-799d15199ac3","Hoi An lanterns"],
      ["1722706202511-8743d7b34794","The yellow old town"],
      ["1582774803540-8a703c87184d","On the Thu Bồn river"],
      ["1664650440553-ab53804814b3","Riverboats at rest"],
      ["1558334466-afce6bf36c69","Riverside houses"],
    ]),
  },
  {
    id:"patagonia", name:"Patagonia Endways", region:"Americas", where:"Chile · Argentina",
    blurb:"Torres del Paine's granite towers, then Fitz Roy across the border at dawn.",
    days:11, date:"23 Feb 2026", coord:"50.9°S / 73.4°W", price:4690, total:12, left:3,
    long:"Eleven days at the bottom of the world. The W trek through Torres del Paine — towers, glaciers, and teal lakes — then across the Argentine border to El Chaltén, the small town beneath the spires of Fitz Roy, walked in the long southern light.",
    highlights:["The full W route through Torres del Paine","Grey Glacier and the milky lakes beneath it","Fitz Roy at sunrise from Laguna de los Tres"],
    stops:[
      ["Puerto Natales","The fjord town where the trek begins."],
      ["Torres del Paine","Four days on the W — towers, French Valley, Grey Glacier."],
      ["El Calafate","Across the border, with a day at the Perito Moreno glacier."],
      ["El Chaltén","Trails beneath Fitz Roy and Cerro Torre to finish."],
    ],
    included:["All transfers & border crossing","10 nights lodging, refugios to mountain lodges","Resident trekking guide","Park fees & glacier excursion","All breakfasts & trail lunches, six dinners"],
    photos: gallery([
      ["1558517286-6b7b81953cb5","Torres del Paine"],
      ["1586600822178-26dec0f653a9","The towers at sunrise"],
      ["1544198365-f5d60b6d8190","Grey Glacier"],
      ["1637580981046-6e14709be202","Guanacos on the steppe"],
      ["1648953490889-7de7775ee105","Glacial lakes"],
    ]),
  },
  {
    id:"cyclades", name:"Cyclades Hop", region:"Europe", where:"Greece",
    blurb:"Five islands by ferry, away from the cruise crowds, on a hand-picked route.",
    days:7, date:"15 May 2026", coord:"37.0°N / 25.3°E", price:2980, total:16, left:11,
    long:"A week of ferries and whitewashed lanes through the Cyclades, on a route chosen to skip the cruise-ship islands at their busiest. Quiet harbours, hill villages, swimming coves, and a caldera sunset to end — moving at the pace of the boats.",
    highlights:["Five islands linked by local ferry, not a cruise","Hill villages and swimming coves off the tourist track","The caldera sunset from Oia on the last night"],
    stops:[
      ["Naxos","The largest Cycladic island — beaches, a marble quarry, mountain villages."],
      ["Small Cyclades","A night on a quiet island most ferries skip."],
      ["Milos","Volcanic coves and the lunar shore at Sarakiniko."],
      ["Santorini","The caldera and Oia for the final sunset."],
    ],
    included:["All inter-island ferries","6 nights lodging, family-run island stays","Resident guide for two island days","A sailing day with lunch aboard","Daily breakfast, three dinners"],
    photos: gallery([
      ["1613395877344-13d4a8e0d49e","Oia, Santorini"],
      ["1678266561093-324802646fb2","Blue domes of the caldera"],
      ["1580502304784-8985b7eb7260","Whitewashed cliffs"],
      ["1601581875309-fafbf2d3ed3a","Island houses by the sea"],
      ["1571406252241-db0280bd36cd","Cyclades blue"],
    ]),
  },
  {
    id:"rift", name:"Rift Valley Crossing", region:"Africa", where:"Tanzania",
    blurb:"The Serengeti's open plains down into the green bowl of Ngorongoro crater.",
    days:9, date:"05 Jul 2026", coord:"2.3°S / 34.8°E", price:6240, total:8, left:2,
    long:"Nine days across northern Tanzania in the season of the great migration. Game drives through the endless Serengeti plains, nights in tented camps that move with the herds, and a descent into the Ngorongoro crater — a collapsed volcano holding its own contained world of wildlife.",
    highlights:["The great migration across the Serengeti plains","Descending into the Ngorongoro crater for a full day","Tented camps under the stars, capped at eight guests"],
    stops:[
      ["Tarangire","Baobabs and elephant herds to begin."],
      ["Serengeti","Three days of game drives, following the herds."],
      ["Ngorongoro","A full day inside the crater's wildlife bowl."],
      ["Lake Eyasi","A final morning with a Hadza community before flying out."],
    ],
    included:["4x4 safari vehicles & a bush flight","8 nights in tented & lodge camps","Resident naturalist guide","All park & crater fees","All meals on safari"],
    photos: gallery([
      ["1516026672322-bc52d61a55d5","Serengeti plains"],
      ["1505148230895-d9a785a555fa","Elephant herds"],
      ["1566296524462-e0a341bf65e6","Zebra on the move"],
      ["1703934169695-9c91c8bc69c3","Giraffe at dawn"],
      ["1516497084411-042e90c17be1","On game drive"],
    ]),
  },
  {
    id:"highlands", name:"Highlands & Isles", region:"Europe", where:"Scotland",
    blurb:"Glencoe, the road to Skye, and a sleeper-train morning into the far north.",
    days:6, date:"21 Aug 2026", coord:"57.3°N / 6.2°W", price:2460, total:14, left:14,
    long:"Six days through the Scottish Highlands and over to Skye. Glens and lochs, a ruined castle or two, the dramatic road to the Isle of Skye, and a leg by the West Highland line — one of the great rail journeys — through country that empties out the further north you go.",
    highlights:["Glencoe's valley and the West Highland railway","The Quiraing and Old Man of Storr on Skye","Castles, lochs, and a whisky stop on the way north"],
    stops:[
      ["Glencoe","Into the Highlands through its most famous glen."],
      ["Fort William","Beneath Ben Nevis, with the Jacobite steam line nearby."],
      ["Isle of Skye","Two nights — the Quiraing, Storr, and fairy pools."],
      ["Inverness","Loch Ness on the way to a final Highland night."],
    ],
    included:["Rail legs & private coach","5 nights lodging, inns to a Skye guesthouse","Resident guide","Castle & distillery entries","Daily breakfast, three dinners"],
    photos: gallery([
      ["1667122169237-f9826de1786b","The Old Man of Storr"],
      ["1576405515541-cb47b7da4fa7","The Quiraing"],
      ["1589708249886-cff7237d7586","Coast at sunset"],
      ["1609087998060-f567d481a1ae","Skye's sea cliffs"],
      ["1551801691-f0bce83d4f68","Highland green"],
    ]),
  },
  {
    id:"lycian", name:"Cappadocia & the Lycian Way", region:"Asia", where:"Turkey",
    blurb:"Balloons over the fairy chimneys, then coastal walking above the turquoise sea.",
    days:10, date:"28 Sep 2026", coord:"38.6°N / 34.8°E", price:3140, total:12, left:6,
    long:"Ten days across two of Turkey's most distinct landscapes. First the surreal rock valleys of Cappadocia — cave villages, underground cities, and a dawn balloon flight over the fairy chimneys. Then south to the coast for sections of the Lycian Way, walking cliff paths above the turquoise sea.",
    highlights:["A dawn balloon flight over Cappadocia's fairy chimneys","Cave villages and underground cities of Göreme","Cliff-path sections of the Lycian Way above the coast"],
    stops:[
      ["Göreme","Cave hotels, rock churches, and the balloon launch at dawn."],
      ["Underground cities","Down into Derinkuyu before the road south."],
      ["Antalya coast","To the Mediterranean and the start of the Lycian path."],
      ["Lycian Way","Cliff walking between coves, with swims along the way."],
    ],
    included:["Internal flight & private transport","9 nights lodging, cave hotels to coastal inns","Resident guide & balloon flight","All site entries","Daily breakfast, four dinners"],
    photos: gallery([
      ["1604156789095-3348604c0f43","Balloons over Göreme"],
      ["1510253687831-0f982d7862fc","Dawn flight"],
      ["1559783510-c448bd7d686b","Fairy-chimney valleys"],
      ["1691156550450-e2099ed3ac55","Uçhisar's cave town"],
      ["1565694286329-16c31ae20a20","Rock country"],
    ]),
  },
  {
    id:"faroe", name:"The Faroe Edges", region:"Europe", where:"Faroe Islands",
    blurb:"Cliff villages, sea stacks, and weather that changes its mind by the hour.",
    days:7, date:"03 Jun 2026", coord:"62.0°N / 6.8°W", price:3890, total:10, left:0,
    long:"Seven days around the eighteen islands of the Faroes — grass-roofed villages, waterfalls that fall straight into the sea, and the cliff-top lake at Sørvágsvatn that seems to hang above the ocean. A small, weather-driven trip for people who like their landscapes raw.",
    highlights:["The Múlafossur waterfall dropping off a cliff into the sea","Sørvágsvatn, the lake that floats above the ocean","Grass-roofed villages and the puffin cliffs of Mykines"],
    stops:[
      ["Tórshavn","The tiny turf-roofed capital as a base."],
      ["Vágar","Múlafossur and the cliff-edge lake of Sørvágsvatn."],
      ["Mykines","A boat to the puffin island, weather permitting."],
      ["Eysturoy","Sea stacks, fjords, and the village of Gjógv."],
    ],
    included:["Ferries, tunnels & private transport","6 nights lodging in island guesthouses","Resident guide","Boat trip to Mykines","Daily breakfast, four dinners"],
    photos: gallery([
      ["1517751243320-0cc45ec82da7","Faroe cliffs"],
      ["1539634262233-7c0b48ab9503","Sea stacks"],
      ["1554610975-1fa324cfb60b","A cliff-edge waterfall"],
      ["1527346944637-89b61119597c","Grass-roof village"],
      ["1539634936668-036d13a9cc3b","Atlantic edges"],
    ]),
  },
  {
    id:"baja", name:"Baja Whale Road", region:"Americas", where:"Mexico",
    blurb:"Desert to lagoon, where grey whales bring their calves close to the boat.",
    days:8, date:"09 Mar 2026", coord:"26.0°N / 112.1°W", price:3320, total:12, left:4,
    long:"Eight days down the Baja peninsula in grey-whale season. Cardón cactus deserts give way to the Pacific lagoons of San Ignacio, where grey whales come to calve — and, famously, surface right beside the small boats. Nights in desert camps and fishing towns between.",
    highlights:["Grey whales and their calves at San Ignacio lagoon","Cardón cactus deserts and Pacific dunes","Nights in low-impact desert and beach camps"],
    stops:[
      ["Loreto","A mission town on the Sea of Cortez to begin."],
      ["The desert","Across the peninsula through cardón cactus country."],
      ["San Ignacio","Two days on the lagoon with the grey whales."],
      ["Pacific coast","Dunes, fishing villages, and a final beach camp."],
    ],
    included:["All ground transport & boat trips","7 nights lodging, eco-camps to small hotels","Resident marine guide","Whale-watching permits","Daily breakfast, five dinners"],
    photos: gallery([
      ["1615695478392-af177ac550b9","Cactus by the lagoon"],
      ["1668844524956-3f11b984bfbf","Sea of Cortez"],
      ["1608613484919-c2d5a1ba20d5","Cardón desert"],
      ["1562095241-8c6714fd4178","Pacific rock coast"],
      ["1675127077743-f388e7e37924","Quiet lagoons"],
    ]),
  },
];

/* --- availability helpers (shared) ----------------------- */
function statusOf(t){
  if(t.left <= 0) return { key:"out",  label:"Sold out", s:"s-out",  f:"f-out"  };
  if(t.left <= 2) return { key:"last", label:`${t.left} seat${t.left>1?"s":""} left`, s:"s-last", f:"f-last" };
  if(t.left <= 4) return { key:"fill", label:`${t.left} seats left`, s:"s-fill", f:"f-fill" };
  return { key:"open", label:`${t.left} of ${t.total} open`, s:"s-open", f:"f-open" };
}
const pctTaken = t => Math.round(((t.total - t.left) / t.total) * 100);
const money = n => "£" + n.toLocaleString("en-GB");
const tripById = id => TRIPS.find(t => t.id === id);
const regionGradient = region => {
  const [a,b] = REGION_TINT[region] || ["#0a4a78","#1577a8"];
  return `linear-gradient(135deg, ${a}, ${b})`;
};

/* expose */
window.WAYFARE = { TRIPS, statusOf, pctTaken, money, tripById, regionGradient, img };
