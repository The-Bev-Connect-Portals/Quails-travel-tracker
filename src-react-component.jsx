import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

/* ── COLORS ─────────────────────────────────────────────────────────────── */
const C = {
  bg:'#1c2b1c', surface:'#243824', surface2:'#1e301e',
  border:'#3a5530', borderHi:'#6a9a50',
  text:'#d4e8c2', textMuted:'#7a9a6a', textDim:'#4a6a40',
  green:'#5a9a40', greenHi:'#8ab870',
  gold:'#c8a030', rust:'#c8601a', teal:'#3a9a8a', purple:'#8a60c0', blue:'#3a70b0',
};

const CONTINENT_COLORS = {
  'Africa':'#c8601a', 'Asia':'#3a9a8a', 'Europe':'#8a60c0',
  'North America':'#c8a030', 'South America':'#5a9a40',
  'Oceania':'#3a70b0', 'Antarctica':'#8ab870', 'Unknown':'#3a5530',
};

/* ── STATE DATA ─────────────────────────────────────────────────────────── */
const STATE_FIPS = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT',
  '10':'DE','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN',
  '19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA',
  '26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV',
  '33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH',
  '40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN',
  '48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY',
};

const STATE_NAMES = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',
  CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',
  HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',
  KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',
  MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',
  NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',
  NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',
  OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
  SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',
  VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',
};

const CAPITALS_LIST = [
  {capital:'Montgomery',state:'AL'},{capital:'Juneau',state:'AK'},{capital:'Phoenix',state:'AZ'},
  {capital:'Little Rock',state:'AR'},{capital:'Sacramento',state:'CA'},{capital:'Denver',state:'CO'},
  {capital:'Hartford',state:'CT'},{capital:'Dover',state:'DE'},{capital:'Tallahassee',state:'FL'},
  {capital:'Atlanta',state:'GA'},{capital:'Honolulu',state:'HI'},{capital:'Boise',state:'ID'},
  {capital:'Springfield',state:'IL'},{capital:'Indianapolis',state:'IN'},{capital:'Des Moines',state:'IA'},
  {capital:'Topeka',state:'KS'},{capital:'Frankfort',state:'KY'},{capital:'Baton Rouge',state:'LA'},
  {capital:'Augusta',state:'ME'},{capital:'Annapolis',state:'MD'},{capital:'Boston',state:'MA'},
  {capital:'Lansing',state:'MI'},{capital:'Saint Paul',state:'MN'},{capital:'Jackson',state:'MS'},
  {capital:'Jefferson City',state:'MO'},{capital:'Helena',state:'MT'},{capital:'Lincoln',state:'NE'},
  {capital:'Carson City',state:'NV'},{capital:'Concord',state:'NH'},{capital:'Trenton',state:'NJ'},
  {capital:'Santa Fe',state:'NM'},{capital:'Albany',state:'NY'},{capital:'Raleigh',state:'NC'},
  {capital:'Bismarck',state:'ND'},{capital:'Columbus',state:'OH'},{capital:'Oklahoma City',state:'OK'},
  {capital:'Salem',state:'OR'},{capital:'Harrisburg',state:'PA'},{capital:'Providence',state:'RI'},
  {capital:'Columbia',state:'SC'},{capital:'Pierre',state:'SD'},{capital:'Nashville',state:'TN'},
  {capital:'Austin',state:'TX'},{capital:'Salt Lake City',state:'UT'},{capital:'Montpelier',state:'VT'},
  {capital:'Richmond',state:'VA'},{capital:'Olympia',state:'WA'},{capital:'Charleston',state:'WV'},
  {capital:'Madison',state:'WI'},{capital:'Cheyenne',state:'WY'},
];

/* ── COUNTRIES DATA ─────────────────────────────────────────────────────── */
const ALL_COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina',
  'Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados',
  'Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina',
  'Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia',
  'Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros',
  'Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','DR Congo','Denmark','Djibouti',
  'Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea',
  'Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia',
  'Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau',
  'Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq',
  'Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati',
  'Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya',
  'Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives',
  'Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia',
  'Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia',
  'Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea',
  'North Macedonia','Norway','Oman','Pakistan','Palau','Panama','Papua New Guinea',
  'Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda',
  'Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa',
  'San Marino','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore',
  'Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea',
  'South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria',
  'Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga',
  'Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine',
  'United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan',
  'Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
];

/* country ISO numeric → continent (for world map coloring) */
const COUNTRY_CONTINENT = {
  4:'Asia',8:'Europe',12:'Africa',20:'Europe',24:'Africa',28:'North America',
  32:'South America',36:'Oceania',40:'Europe',31:'Asia',44:'North America',
  48:'Asia',50:'Asia',52:'North America',56:'Europe',84:'North America',
  64:'Asia',68:'South America',70:'Europe',72:'Africa',76:'South America',
  96:'Asia',100:'Europe',104:'Asia',108:'Africa',112:'Europe',116:'Asia',
  120:'Africa',124:'North America',132:'Africa',140:'Africa',144:'Asia',
  148:'Africa',152:'South America',156:'Asia',158:'Asia',170:'South America',
  174:'Africa',178:'Africa',180:'Africa',188:'North America',191:'Europe',
  192:'North America',196:'Europe',203:'Europe',204:'Africa',208:'Europe',
  212:'North America',214:'North America',218:'South America',222:'North America',
  226:'Africa',231:'Africa',232:'Africa',233:'Europe',242:'Oceania',
  246:'Europe',250:'Europe',262:'Africa',266:'Africa',268:'Europe',270:'Africa',
  276:'Europe',288:'Africa',296:'Oceania',300:'Europe',308:'North America',
  320:'North America',324:'Africa',328:'South America',332:'North America',
  336:'Europe',340:'North America',348:'Europe',352:'Europe',356:'Asia',
  360:'Asia',364:'Asia',368:'Asia',372:'Europe',376:'Asia',380:'Europe',
  388:'North America',392:'Asia',398:'Asia',400:'Asia',404:'Africa',
  408:'Asia',410:'Asia',414:'Asia',417:'Asia',418:'Asia',422:'Asia',
  426:'Africa',428:'Europe',430:'Africa',434:'Africa',438:'Europe',
  440:'Europe',442:'Europe',450:'Africa',454:'Africa',458:'Asia',
  462:'Asia',466:'Africa',470:'Europe',478:'Africa',480:'Africa',
  484:'North America',492:'Europe',496:'Asia',498:'Europe',499:'Europe',
  504:'Africa',508:'Africa',516:'Africa',520:'Oceania',524:'Asia',
  528:'Europe',548:'Oceania',554:'Oceania',558:'North America',562:'Africa',
  566:'Africa',578:'Europe',583:'Oceania',584:'Oceania',585:'Oceania',
  586:'Asia',591:'North America',598:'Oceania',600:'South America',
  604:'South America',608:'Asia',616:'Europe',620:'Europe',624:'Africa',
  626:'Asia',634:'Asia',642:'Europe',643:'Europe',646:'Africa',
  659:'North America',662:'North America',670:'North America',674:'Europe',
  682:'Asia',686:'Africa',688:'Europe',690:'Africa',694:'Africa',
  702:'Asia',703:'Europe',704:'Asia',705:'Europe',706:'Africa',
  710:'Africa',716:'Africa',724:'Europe',728:'Africa',729:'Africa',
  740:'South America',748:'Africa',752:'Europe',756:'Europe',760:'Asia',
  762:'Asia',764:'Asia',768:'Africa',776:'Oceania',780:'North America',
  784:'Asia',788:'Africa',792:'Asia',795:'Asia',798:'Oceania',800:'Africa',
  804:'Europe',807:'Europe',818:'Africa',826:'Europe',834:'Africa',
  840:'North America',854:'Africa',858:'South America',860:'Asia',
  862:'South America',882:'Oceania',887:'Asia',894:'Africa',
};

/* ── NATIONAL PARKS ─────────────────────────────────────────────────────── */
const NATIONAL_PARKS = [
  {name:'Acadia',state:'ME',wiki:'Acadia_National_Park'},
  {name:'American Samoa',state:'AS',wiki:'National_Park_of_American_Samoa'},
  {name:'Arches',state:'UT',wiki:'Arches_National_Park'},
  {name:'Badlands',state:'SD',wiki:'Badlands_National_Park'},
  {name:'Big Bend',state:'TX',wiki:'Big_Bend_National_Park'},
  {name:'Biscayne',state:'FL',wiki:'Biscayne_National_Park'},
  {name:'Black Canyon of the Gunnison',state:'CO',wiki:'Black_Canyon_of_the_Gunnison_National_Park'},
  {name:'Bryce Canyon',state:'UT',wiki:'Bryce_Canyon_National_Park'},
  {name:'Canyonlands',state:'UT',wiki:'Canyonlands_National_Park'},
  {name:'Capitol Reef',state:'UT',wiki:'Capitol_Reef_National_Park'},
  {name:'Carlsbad Caverns',state:'NM',wiki:'Carlsbad_Caverns_National_Park'},
  {name:'Channel Islands',state:'CA',wiki:'Channel_Islands_National_Park'},
  {name:'Congaree',state:'SC',wiki:'Congaree_National_Park'},
  {name:'Crater Lake',state:'OR',wiki:'Crater_Lake_National_Park'},
  {name:'Cuyahoga Valley',state:'OH',wiki:'Cuyahoga_Valley_National_Park'},
  {name:'Death Valley',state:'CA',wiki:'Death_Valley_National_Park'},
  {name:'Denali',state:'AK',wiki:'Denali_National_Park_and_Preserve'},
  {name:'Dry Tortugas',state:'FL',wiki:'Dry_Tortugas_National_Park'},
  {name:'Everglades',state:'FL',wiki:'Everglades_National_Park'},
  {name:'Gates of the Arctic',state:'AK',wiki:'Gates_of_the_Arctic_National_Park'},
  {name:'Gateway Arch',state:'MO',wiki:'Gateway_Arch_National_Park'},
  {name:'Glacier',state:'MT',wiki:'Glacier_National_Park_(U.S.)'},
  {name:'Glacier Bay',state:'AK',wiki:'Glacier_Bay_National_Park'},
  {name:'Grand Canyon',state:'AZ',wiki:'Grand_Canyon_National_Park'},
  {name:'Grand Teton',state:'WY',wiki:'Grand_Teton_National_Park'},
  {name:'Great Basin',state:'NV',wiki:'Great_Basin_National_Park'},
  {name:'Great Sand Dunes',state:'CO',wiki:'Great_Sand_Dunes_National_Park'},
  {name:'Great Smoky Mountains',state:'TN',wiki:'Great_Smoky_Mountains_National_Park'},
  {name:'Guadalupe Mountains',state:'TX',wiki:'Guadalupe_Mountains_National_Park'},
  {name:'Haleakalā',state:'HI',wiki:'Haleakalā_National_Park'},
  {name:'Hawaiʻi Volcanoes',state:'HI',wiki:'Hawaiʻi_Volcanoes_National_Park'},
  {name:'Hot Springs',state:'AR',wiki:'Hot_Springs_National_Park'},
  {name:'Indiana Dunes',state:'IN',wiki:'Indiana_Dunes_National_Park'},
  {name:'Isle Royale',state:'MI',wiki:'Isle_Royale_National_Park'},
  {name:'Joshua Tree',state:'CA',wiki:'Joshua_Tree_National_Park'},
  {name:'Katmai',state:'AK',wiki:'Katmai_National_Park'},
  {name:'Kenai Fjords',state:'AK',wiki:'Kenai_Fjords_National_Park'},
  {name:'Kings Canyon',state:'CA',wiki:'Kings_Canyon_National_Park'},
  {name:'Kobuk Valley',state:'AK',wiki:'Kobuk_Valley_National_Park'},
  {name:'Lake Clark',state:'AK',wiki:'Lake_Clark_National_Park'},
  {name:'Lassen Volcanic',state:'CA',wiki:'Lassen_Volcanic_National_Park'},
  {name:'Mammoth Cave',state:'KY',wiki:'Mammoth_Cave_National_Park'},
  {name:'Mesa Verde',state:'CO',wiki:'Mesa_Verde_National_Park'},
  {name:'Mount Rainier',state:'WA',wiki:'Mount_Rainier_National_Park'},
  {name:'New River Gorge',state:'WV',wiki:'New_River_Gorge_National_Park'},
  {name:'North Cascades',state:'WA',wiki:'North_Cascades_National_Park'},
  {name:'Olympic',state:'WA',wiki:'Olympic_National_Park'},
  {name:'Petrified Forest',state:'AZ',wiki:'Petrified_Forest_National_Park'},
  {name:'Pinnacles',state:'CA',wiki:'Pinnacles_National_Park'},
  {name:'Redwood',state:'CA',wiki:'Redwood_National_and_State_Parks'},
  {name:'Rocky Mountain',state:'CO',wiki:'Rocky_Mountain_National_Park'},
  {name:'Saguaro',state:'AZ',wiki:'Saguaro_National_Park'},
  {name:'Sequoia',state:'CA',wiki:'Sequoia_National_Park'},
  {name:'Shenandoah',state:'VA',wiki:'Shenandoah_National_Park'},
  {name:'Theodore Roosevelt',state:'ND',wiki:'Theodore_Roosevelt_National_Park'},
  {name:'Virgin Islands',state:'VI',wiki:'Virgin_Islands_National_Park'},
  {name:'Voyageurs',state:'MN',wiki:'Voyageurs_National_Park'},
  {name:'White Sands',state:'NM',wiki:'White_Sands_National_Park'},
  {name:'Wind Cave',state:'SD',wiki:'Wind_Cave_National_Park'},
  {name:'Wrangell–St. Elias',state:'AK',wiki:'Wrangell–St._Elias_National_Park'},
  {name:'Yellowstone',state:'WY',wiki:'Yellowstone_National_Park'},
  {name:'Yosemite',state:'CA',wiki:'Yosemite_National_Park'},
  {name:'Zion',state:'UT',wiki:'Zion_National_Park'},
];

const CONTINENTS    = ['Africa','Antarctica','Asia','Australia / Oceania','Europe','North America','South America'];
const SEVEN_WONDERS = ['Great Wall of China','Petra (Jordan)','Chichén Itzá (Mexico)','Machu Picchu (Peru)','Colosseum (Italy)','Christ the Redeemer (Brazil)','Taj Mahal (India)'];
const NATURAL_WONDERS = ['Amazon River','Aurora Borealis','Grand Canyon','Great Barrier Reef','Harbor of Rio de Janeiro','Mount Everest','Victoria Falls'];
const OCEANS_SEAS   = ['Arctic Ocean','Atlantic Ocean','Indian Ocean','Pacific Ocean','Southern Ocean','Caribbean Sea','Mediterranean Sea','Red Sea','South China Sea'];

const TRAVEL_TIPS = [
  {heading:'Deciding on a Trip',color:C.gold,tips:[
    {title:'Find your travel style',body:'Nature & parks, relaxing beaches, sightseeing cities, active adventures, foodie explorations, or cultural immersion — pick what energizes you.'},
    {title:"Don't overplan",body:'Pick the things you want most and start there. Give yourself time to drive, see the sight, and do the activity. You get better at pacing with practice.'},
    {title:'A lot fits in 3 nights',body:"Find places 2–3 hrs by flight or 6–8 hrs by drive. Two nights is often enough — sometimes just one if you're strategic."},
  ]},
  {heading:'Knowing When to Go',color:C.teal,tips:[
    {title:'Spring & Fall are underrated',body:'Not too hot or cold, less crowded, beautiful scenery. Seasonal things are still open, especially in fall.'},
    {title:'Off-season = big savings',body:'Way cheaper and less crowded. National parks shine off-season. Mountain areas in summer, beach areas in winter.'},
    {title:'With school-age kids',body:'Maximize spring breaks, holidays, and in-service days. Spring break windows vary by school — take advantage.'},
  ]},
  {heading:'Buying Airfare',color:C.green,tips:[
    {title:'Best time to buy',body:'50–70 days out is often the sweet spot. If you feel you have a good price, buy it then.'},
    {title:'Use flight search tools',body:"Kayak, Google Flights, Skyscanner. Southwest doesn't show on aggregators — check their site separately."},
    {title:'Be flexible',body:"Mon/Tue departures are often cheaper than Thu/Fri. Sign up for Scott's Cheap Flights alerts."},
  ]},
  {heading:'Money & Budget',color:C.rust,tips:[
    {title:'Camping is king on a budget',body:'Prime campsites in high season require booking well ahead. Worth it for national park access at a fraction of the cost.'},
    {title:'Travel with friends',body:'Split costs on Airbnb/VRBO. More comfortable, and per-person costs are usually very reasonable.'},
  ]},
  {heading:'Planning & Packing',color:C.purple,tips:[
    {title:'Minimize jet lag',body:'Take red-eyes for long flights. Sleep during nighttime at your destination. Start your day when you arrive.'},
    {title:"Don't overpack",body:"Layer, especially in winter. Keep a standard packing list and refine it each trip."},
  ]},
];

/* ─────────────────────────────────────────────────────────────────────────
   UTILITY: load topojson script dynamically
───────────────────────────────────────────────────────────────────────── */
let topoPromise = null;
function loadTopojson() {
  if (!topoPromise) {
    topoPromise = new Promise((resolve, reject) => {
      if (window.topojson) { resolve(window.topojson); return; }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js';
      s.onload = () => resolve(window.topojson);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return topoPromise;
}

/* ─────────────────────────────────────────────────────────────────────────
   MAP: US Choropleth
───────────────────────────────────────────────────────────────────────── */
function USChoroplethMap({ visited, onToggle }) {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tooltip, setTooltip]   = useState(null);
  const W = 960, H = 600;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const topo = await loadTopojson();
        const us   = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r=>r.json());
        if (!alive) return;
        const geo  = topo.feature(us, us.objects.states);
        const proj = d3.geoAlbersUsa().fitSize([W, H], geo);
        const path = d3.geoPath().projection(proj);
        setFeatures(geo.features.map(f => {
          const id   = String(f.id).padStart(2,'0');
          const abbr = STATE_FIPS[id];
          return { id, abbr, name: STATE_NAMES[abbr]||abbr, d: path(f), centroid: path.centroid(f) };
        }).filter(f => f.d));
        setLoading(false);
      } catch(e) { console.error(e); setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return (
    <div style={{textAlign:'center',padding:60,color:C.textMuted}}>
      <div style={{fontSize:'2rem',marginBottom:12}}>🗺️</div>
      Loading US map…
    </div>
  );

  return (
    <div style={{position:'relative'}}>
      {tooltip && (
        <div style={{
          position:'absolute',top:8,left:'50%',transform:'translateX(-50%)',
          background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,
          padding:'6px 14px',fontSize:'0.85rem',color:C.text,pointerEvents:'none',zIndex:10,
          boxShadow:'0 4px 16px rgba(0,0,0,0.4)',
        }}>
          {tooltip.name} {visited.has(tooltip.abbr) ? '✓' : ''}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
        {features.map(f => {
          const done = visited.has(f.abbr);
          return (
            <g key={f.id}
              onMouseEnter={() => setTooltip(f)}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => f.abbr && onToggle(f.abbr)}
              style={{cursor:'pointer'}}>
              <path d={f.d} style={{
                fill: done ? C.rust : '#2a3d2a',
                stroke: '#1c2b1c', strokeWidth: 0.8,
                transition:'fill 0.2s',
              }}/>
              {f.centroid && f.abbr && (
                <text x={f.centroid[0]} y={f.centroid[1]}
                  style={{fill:done?'#fff':C.textDim,fontSize:8,fontWeight:700,
                    textAnchor:'middle',dominantBaseline:'middle',pointerEvents:'none'}}>
                  {f.abbr}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p style={{textAlign:'center',fontSize:'0.72rem',color:C.textMuted,marginTop:4}}>Click any state to mark visited</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAP: World Choropleth (countries + continents mode)
───────────────────────────────────────────────────────────────────────── */
function WorldChoroplethMap({ visited, onToggle, mode = 'countries', visitedContinents, onToggleContinent }) {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tooltip, setTooltip]   = useState(null);
  const W = 960, H = 500;

  // country ISO numeric → name (abbreviated set, most important)
  const ISO_NAMES = {
    4:'Afghanistan',8:'Albania',12:'Algeria',20:'Andorra',24:'Angola',28:'Antigua & Barbuda',
    32:'Argentina',36:'Australia',40:'Austria',31:'Azerbaijan',44:'Bahamas',48:'Bahrain',
    50:'Bangladesh',52:'Barbados',56:'Belgium',84:'Belize',64:'Bhutan',68:'Bolivia',
    70:'Bosnia & Herz.',72:'Botswana',76:'Brazil',96:'Brunei',100:'Bulgaria',104:'Myanmar',
    108:'Burundi',116:'Cambodia',120:'Cameroon',124:'Canada',140:'C. African Rep.',
    144:'Sri Lanka',148:'Chad',152:'Chile',156:'China',158:'Taiwan',170:'Colombia',
    174:'Comoros',178:'Congo',180:'DR Congo',188:'Costa Rica',191:'Croatia',192:'Cuba',
    196:'Cyprus',203:'Czech Rep.',208:'Denmark',214:'Dominican Rep.',218:'Ecuador',
    818:'Egypt',222:'El Salvador',231:'Ethiopia',233:'Estonia',242:'Fiji',246:'Finland',
    250:'France',266:'Gabon',268:'Georgia',276:'Germany',288:'Ghana',300:'Greece',
    320:'Guatemala',324:'Guinea',328:'Guyana',332:'Haiti',340:'Honduras',348:'Hungary',
    352:'Iceland',356:'India',360:'Indonesia',364:'Iran',368:'Iraq',372:'Ireland',
    376:'Israel',380:'Italy',388:'Jamaica',392:'Japan',400:'Jordan',398:'Kazakhstan',
    404:'Kenya',414:'Kuwait',418:'Laos',428:'Latvia',422:'Lebanon',430:'Liberia',
    434:'Libya',440:'Lithuania',442:'Luxembourg',450:'Madagascar',454:'Malawi',
    458:'Malaysia',466:'Mali',470:'Malta',484:'Mexico',496:'Mongolia',504:'Morocco',
    508:'Mozambique',516:'Namibia',524:'Nepal',528:'Netherlands',554:'New Zealand',
    558:'Nicaragua',562:'Niger',566:'Nigeria',408:'North Korea',578:'Norway',512:'Oman',
    586:'Pakistan',591:'Panama',600:'Paraguay',604:'Peru',608:'Philippines',616:'Poland',
    620:'Portugal',634:'Qatar',642:'Romania',643:'Russia',646:'Rwanda',682:'Saudi Arabia',
    686:'Senegal',688:'Serbia',706:'Somalia',710:'South Africa',410:'South Korea',
    728:'South Sudan',724:'Spain',729:'Sudan',752:'Sweden',756:'Switzerland',760:'Syria',
    762:'Tajikistan',764:'Thailand',768:'Togo',780:'Trinidad & Tobago',788:'Tunisia',
    792:'Turkey',800:'Uganda',804:'Ukraine',784:'UAE',826:'United Kingdom',840:'United States',
    858:'Uruguay',860:'Uzbekistan',862:'Venezuela',704:'Vietnam',887:'Yemen',894:'Zambia',716:'Zimbabwe',
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const topo  = await loadTopojson();
        const world = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r=>r.json());
        if (!alive) return;
        const geo   = topo.feature(world, world.objects.countries);
        const proj  = d3.geoNaturalEarth1().fitSize([W, H], geo);
        const path  = d3.geoPath().projection(proj);
        setFeatures(geo.features.map(f => {
          const id   = parseInt(f.id);
          const cont = COUNTRY_CONTINENT[id] || 'Unknown';
          return { id, name: ISO_NAMES[id] || '', continent: cont, d: path(f) };
        }).filter(f => f.d));
        setLoading(false);
      } catch(e) { console.error(e); setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return (
    <div style={{textAlign:'center',padding:60,color:C.textMuted}}>
      <div style={{fontSize:'2rem',marginBottom:12}}>🌍</div>
      Loading world map…
    </div>
  );

  return (
    <div style={{position:'relative'}}>
      {tooltip && (
        <div style={{
          position:'absolute',top:8,left:'50%',transform:'translateX(-50%)',
          background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:8,
          padding:'6px 14px',fontSize:'0.85rem',color:C.text,pointerEvents:'none',zIndex:10,
          boxShadow:'0 4px 16px rgba(0,0,0,0.4)',whiteSpace:'nowrap',
        }}>
          {mode==='countries' ? tooltip.name || 'Unknown' : `${tooltip.continent}  ${visitedContinents?.has(tooltip.continent)?'✓':''}`}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
        {features.map(f => {
          const contColor = CONTINENT_COLORS[f.continent] || C.border;
          const isDoneCountry = mode==='countries' && f.name && visited.has(f.name);
          const isDoneCont    = mode==='continents' && visitedContinents?.has(f.continent);
          const done = isDoneCountry || isDoneCont;
          return (
            <path key={f.id} d={f.d}
              onMouseEnter={() => setTooltip(f)}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => {
                if (mode==='countries' && f.name) onToggle(f.name);
                else if (mode==='continents' && f.continent !== 'Unknown') onToggleContinent(f.continent);
              }}
              style={{
                fill: done ? contColor : '#2a3d2a',
                stroke: '#1c2b1c', strokeWidth: 0.4,
                cursor: (mode==='countries' && f.name) || (mode==='continents' && f.continent!=='Unknown') ? 'pointer' : 'default',
                transition: 'fill 0.15s',
                opacity: done ? 1 : 0.85,
              }}
            />
          );
        })}
      </svg>

      {/* Continent legend */}
      {mode === 'continents' && (
        <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginTop:10}}>
          {Object.entries(CONTINENT_COLORS).filter(([k])=>k!=='Unknown').map(([cont,col])=>(
            <div key={cont} style={{display:'flex',alignItems:'center',gap:5,fontSize:'0.72rem',color:C.textMuted}}>
              <div style={{width:10,height:10,borderRadius:2,background:col}}/>
              {cont}
            </div>
          ))}
        </div>
      )}
      <p style={{textAlign:'center',fontSize:'0.72rem',color:C.textMuted,marginTop:6}}>
        {mode==='countries' ? 'Click a country to mark visited' : 'Click any region to mark its continent visited'}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   NATIONAL PARK CARD with Wikipedia image
───────────────────────────────────────────────────────────────────────── */
function ParkCard({ park, visited, onToggle }) {
  const [img, setImg]     = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const done = visited.has(park.name);

  useEffect(() => {
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(park.wiki)}&prop=pageimages&format=json&pithumbsize=500&origin=*`)
      .then(r=>r.json())
      .then(data => {
        const pages = data?.query?.pages;
        if (!pages) return;
        const page = Object.values(pages)[0];
        if (page?.thumbnail?.source) setImg(page.thumbnail.source);
      })
      .catch(()=>{});
  }, [park.wiki]);

  // Park-specific gradient fallback
  const hash = park.name.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  const hue  = (hash * 37) % 360;
  const fallbackBg = `linear-gradient(135deg, hsl(${hue},35%,18%) 0%, hsl(${(hue+50)%360},45%,28%) 100%)`;

  return (
    <div onClick={() => onToggle(park.name)} style={{
      borderRadius:10, overflow:'hidden', cursor:'pointer', position:'relative',
      border: `2px solid ${done ? C.greenHi : C.border}`,
      transition:'all 0.15s', boxShadow: done ? `0 0 16px rgba(138,184,112,0.3)` : 'none',
    }}>
      {/* Image */}
      <div style={{height:130, background:fallbackBg, position:'relative', overflow:'hidden'}}>
        {img && (
          <img src={img} alt={park.name}
            onLoad={() => setImgLoaded(true)}
            style={{
              width:'100%', height:'100%', objectFit:'cover',
              opacity: imgLoaded ? 1 : 0, transition:'opacity 0.4s',
              display:'block',
            }}
          />
        )}
        {done && (
          <div style={{
            position:'absolute',inset:0,background:'rgba(90,154,64,0.45)',
            display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            <div style={{
              width:40,height:40,borderRadius:'50%',background:C.green,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:'1.2rem',boxShadow:'0 2px 12px rgba(0,0,0,0.5)',
            }}>✓</div>
          </div>
        )}
        <div style={{
          position:'absolute',top:6,right:6,
          background:'rgba(28,43,28,0.7)',borderRadius:4,padding:'2px 6px',
          fontSize:'0.65rem',color:C.textMuted,fontWeight:600,
        }}>{park.state}</div>
      </div>
      {/* Name */}
      <div style={{
        background: done ? 'rgba(90,154,64,0.15)' : C.surface2,
        padding:'8px 10px',
      }}>
        <div style={{fontSize:'0.82rem',fontWeight:600,color:done?C.greenHi:C.text,lineHeight:1.3}}>{park.name}</div>
        <div style={{fontSize:'0.68rem',color:C.textMuted,marginTop:2}}>National Park</div>
      </div>
    </div>
  );
}

function ParkGrid({ visited, onToggle }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const filtered = NATIONAL_PARKS.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.state.toLowerCase().includes(search.toLowerCase());
    const mf = filter==='all'||(filter==='done'&&visited.has(p.name))||(filter==='todo'&&!visited.has(p.name));
    return ms && mf;
  });
  const IS = {padding:'8px 12px',borderRadius:8,border:`1.5px solid ${C.border}`,background:C.surface2,color:C.text,fontSize:'0.875rem',outline:'none'};

  return (
    <div>
      <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
        <input placeholder="Search parks or state…" value={search} onChange={e=>setSearch(e.target.value)} style={{...IS,flex:1,minWidth:150}}/>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{...IS,width:130}}>
          <option value="all">All 63</option>
          <option value="done">✓ Visited</option>
          <option value="todo">○ Not Yet</option>
        </select>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(165px,1fr))',gap:10}}>
        {filtered.map(p => <ParkCard key={p.name} park={p} visited={visited} onToggle={onToggle}/>)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SHARED UI COMPONENTS
───────────────────────────────────────────────────────────────────────── */
function ProgressBar({value,max,color=C.green}){
  const pct=max?Math.round((value/max)*100):0;
  return(
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      <div style={{flex:1,height:7,background:'#2a3d2a',borderRadius:4,overflow:'hidden'}}>
        <div style={{width:`${pct}%`,height:'100%',background:color,borderRadius:4,transition:'width 0.5s ease'}}/>
      </div>
      <span style={{fontSize:'0.72rem',color:C.textMuted,minWidth:72,textAlign:'right'}}>{value}/{max} · {pct}%</span>
    </div>
  );
}
function Stars({rating}){
  const r=Math.min(parseInt(rating)||0,5);
  return <span style={{fontSize:'0.75rem',color:C.gold}}>{'★'.repeat(r)}{'☆'.repeat(5-r)}</span>;
}
function SubTabs({tabs,active,setActive}){
  return(
    <div style={{display:'flex',flexWrap:'wrap',borderBottom:`1px solid #2a3d2a`}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setActive(t.id)} style={{
          padding:'8px 13px',border:'none',background:'transparent',cursor:'pointer',
          fontSize:'0.78rem',fontWeight:active===t.id?600:400,
          color:active===t.id?C.greenHi:C.textMuted,
          borderBottom:active===t.id?`2px solid ${C.greenHi}`:'2px solid transparent',
          marginBottom:'-1px',transition:'all 0.15s',whiteSpace:'nowrap',
        }}>{t.label}</button>
      ))}
    </div>
  );
}
function AddBtn({onClick,label='+ Add Entry'}){
  return(
    <button onClick={onClick} style={{marginBottom:14,background:C.green,color:'#fff',border:'none',borderRadius:8,padding:'9px 20px',fontWeight:600,fontSize:'0.875rem',cursor:'pointer'}}>
      {label}
    </button>
  );
}

/* searchable checklist (for capitals, countries with pre-populated list) */
function SearchableChecklist({items,visited,onToggle,label,color=C.greenHi,renderRow}){
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('all');
  const IS={padding:'8px 12px',borderRadius:8,border:`1.5px solid ${C.border}`,background:C.surface2,color:C.text,fontSize:'0.875rem',outline:'none'};
  const filtered=items.filter(item=>{
    const text=(typeof item==='string'?item:Object.values(item).join(' ')).toLowerCase();
    const ms=text.includes(search.toLowerCase());
    const key=typeof item==='string'?item:item.capital||item;
    const mf=filter==='all'||(filter==='done'&&visited.has(key))||(filter==='todo'&&!visited.has(key));
    return ms&&mf;
  });
  return(
    <div>
      <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
        <input placeholder={`Search ${label}…`} value={search} onChange={e=>setSearch(e.target.value)} style={{...IS,flex:1,minWidth:150}}/>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{...IS,width:130}}>
          <option value="all">All</option><option value="done">✓ Visited</option><option value="todo">○ Not Yet</option>
        </select>
      </div>
      <div style={{background:C.surface2,borderRadius:10,border:`1px solid ${C.border}`,overflow:'hidden'}}>
        {filtered.map((item,i)=>{
          const key=typeof item==='string'?item:item.capital||item;
          const done=visited.has(key);
          return(
            <div key={key} onClick={()=>onToggle(key)} style={{
              display:'flex',alignItems:'center',gap:12,padding:'10px 14px',cursor:'pointer',
              borderBottom:i<filtered.length-1?`1px solid ${C.border}`:'none',
              background:done?'rgba(90,154,64,0.06)':'transparent',transition:'background 0.1s',
            }}>
              <div style={{width:20,height:20,borderRadius:4,flexShrink:0,border:`2px solid ${done?color:C.textDim}`,background:done?color:'transparent',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>
                {done&&<span style={{color:'#fff',fontSize:'0.65rem',fontWeight:700}}>✓</span>}
              </div>
              <div style={{flex:1}}>{renderRow?renderRow(item,done):<span style={{fontSize:'0.88rem',color:done?color:C.text,fontWeight:done?600:400}}>{key}</span>}</div>
              {done&&<span style={{fontSize:'0.63rem',background:'rgba(90,154,64,0.15)',color,borderRadius:10,padding:'2px 8px',fontWeight:600}}>VISITED</span>}
            </div>
          );
        })}
        {!filtered.length&&<div style={{padding:28,textAlign:'center',color:C.textMuted,fontSize:'0.875rem'}}>No results</div>}
      </div>
    </div>
  );
}

function AddEntryForm({title,fields,onAdd,onCancel}){
  const [form,setForm]=useState(Object.fromEntries(fields.map(f=>[f.key,f.default||''])));
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const IS={width:'100%',padding:'8px 12px',borderRadius:8,border:`1.5px solid ${C.border}`,background:C.surface2,color:C.text,fontSize:'0.875rem',outline:'none'};
  return(
    <div style={{background:C.surface,borderRadius:10,border:`1.5px solid ${C.borderHi}`,padding:18,marginBottom:16}}>
      <div style={{fontSize:'0.95rem',color:C.text,fontWeight:600,marginBottom:14}}>{title}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:10,marginBottom:14}}>
        {fields.map(f=>(
          <div key={f.key}>
            <label style={{fontSize:'0.68rem',color:C.textMuted,letterSpacing:'0.06em',textTransform:'uppercase',display:'block',marginBottom:4}}>{f.label}</label>
            {f.type==='select'?(
              <select value={form[f.key]} onChange={e=>set(f.key,e.target.value)} style={IS}>
                <option value="">Select…</option>{f.options&&f.options.map(o=><option key={o}>{o}</option>)}
              </select>
            ):f.type==='textarea'?(
              <textarea rows={2} value={form[f.key]} onChange={e=>set(f.key,e.target.value)} placeholder={f.placeholder||''} style={{...IS,resize:'vertical'}}/>
            ):(
              <input type={f.type||'text'} value={form[f.key]} onChange={e=>set(f.key,e.target.value)} placeholder={f.placeholder||''} style={IS}/>
            )}
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:10}}>
        <button onClick={()=>{if(!form[fields[0].key]?.trim())return;onAdd({...form,id:Date.now()});}}
          style={{background:C.green,color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:600,fontSize:'0.875rem',cursor:'pointer'}}>+ Save</button>
        <button onClick={onCancel}
          style={{background:'transparent',color:C.textMuted,border:`1.5px solid ${C.border}`,borderRadius:8,padding:'7px 16px',fontSize:'0.875rem',cursor:'pointer'}}>Cancel</button>
      </div>
    </div>
  );
}

function EntryCard({item,onDelete,renderItem}){
  const [hov,setHov]=useState(false);
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:C.surface2,border:`1px solid ${hov?C.borderHi:C.border}`,borderRadius:10,padding:14,position:'relative',transition:'all 0.15s'}}>
      {renderItem(item)}
      {hov&&<button onClick={()=>onDelete(item.id)} style={{position:'absolute',top:10,right:10,background:'rgba(180,60,40,0.2)',border:'none',color:'#e07060',borderRadius:4,padding:'2px 7px',cursor:'pointer',fontSize:'0.75rem'}}>✕</button>}
    </div>
  );
}
function EntryList({items,onDelete,renderItem}){
  if(!items.length) return <div style={{padding:36,textAlign:'center',color:C.textMuted,fontSize:'0.875rem'}}>Nothing added yet. Start logging! ✈️</div>;
  return(
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:10}}>
      {items.map(item=><EntryCard key={item.id} item={item} onDelete={onDelete} renderItem={renderItem}/>)}
    </div>
  );
}
function FreeFormSection({list,setter,sKey,addingTo,setAddingTo,title,fields,showRating}){
  return(
    <>
      {addingTo===sKey
        ?<AddEntryForm title={`Add ${title}`} fields={fields} onCancel={()=>setAddingTo(null)} onAdd={e=>{setter(l=>[...l,e]);setAddingTo(null);}}/>
        :<AddBtn onClick={()=>setAddingTo(sKey)}/>}
      <EntryList items={list} onDelete={id=>setter(l=>l.filter(i=>i.id!==id))} renderItem={e=>(
        <>
          <div style={{fontSize:'0.93rem',color:C.text,fontWeight:600,marginBottom:3,paddingRight:24}}>{e.name}</div>
          <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
            {(e.city||e.state)&&<span style={{fontSize:'0.73rem',color:C.textMuted}}>{[e.city,e.state].filter(Boolean).join(', ')}</span>}
            {e.date&&<span style={{fontSize:'0.7rem',color:C.textDim}}>{e.date}</span>}
            {showRating&&e.rating&&<Stars rating={e.rating}/>}
          </div>
          {e.notes&&<div style={{fontSize:'0.78rem',color:C.textMuted,marginTop:5,fontStyle:'italic',lineHeight:1.5}}>{e.notes}</div>}
        </>
      )}/>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   GOOGLE MAPS PANEL
───────────────────────────────────────────────────────────────────────── */
function GoogleMapsPanel() {
  return (
    <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:20,marginBottom:20}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
        <div style={{width:40,height:40,borderRadius:10,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',flexShrink:0}}>🗺️</div>
        <div>
          <div style={{fontWeight:700,color:C.text,fontSize:'0.95rem'}}>Google Maps Saved Places</div>
          <div style={{fontSize:'0.78rem',color:C.textMuted,marginTop:2}}>Browse your saved lists, then add them here</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:8,marginBottom:16}}>
        {[
          {label:'Restaurants',icon:'🍽️',query:'restaurants'},
          {label:'Bars',icon:'🍺',query:'bars'},
          {label:'Attractions',icon:'⭐',query:'attractions'},
          {label:'Hotels',icon:'🛏️',query:'hotels'},
          {label:'Beaches',icon:'🏖️',query:'beaches'},
          {label:'Saved Lists',icon:'🔖',query:'saved'},
        ].map(({label,icon,query})=>(
          <a key={label} href={`https://www.google.com/maps/search/${query}/`} target="_blank" rel="noopener noreferrer"
            style={{
              display:'flex',alignItems:'center',gap:8,padding:'10px 12px',
              background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,
              color:C.text,textDecoration:'none',fontSize:'0.82rem',fontWeight:500,
              transition:'all 0.15s',
            }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderHi}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <span style={{fontSize:'1rem'}}>{icon}</span>{label}
          </a>
        ))}
      </div>

      <div style={{background:C.surface2,borderRadius:8,padding:14,border:`1px solid ${C.border}`}}>
        <div style={{fontSize:'0.75rem',color:C.textMuted,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>How to use together</div>
        {[
          'Tap a category above to open Google Maps to that search',
          'Find a saved place you want to add here',
          'Come back and hit "+ Add to Wishlist" with that info',
        ].map((step,i)=>(
          <div key={i} style={{display:'flex',gap:10,marginBottom:6,fontSize:'0.82rem',color:C.textMuted}}>
            <span style={{color:C.greenHi,fontWeight:700,flexShrink:0}}>{i+1}.</span>
            {step}
          </div>
        ))}
        <div style={{marginTop:10,fontSize:'0.75rem',color:C.textDim,borderTop:`1px solid ${C.border}`,paddingTop:10}}>
          🔜 Full Google Maps sync coming in a future update (requires login)
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────────────────────── */
export default function TravelLog() {
  const [mainTab, setMainTab]   = useState('been');
  const [beenSec, setBeenSec]   = useState('us');
  const [usSub,   setUsSub]     = useState('states');
  const [worldSub,setWorldSub]  = useState('countries');
  const [worldMapMode,setWorldMapMode] = useState('countries');
  const [eatSub,  setEatSub]    = useState('restaurants');
  const [natSub,  setNatSub]    = useState('beaches');
  const [cultSub, setCultSub]   = useState('museums');
  const [evtSub,  setEvtSub]    = useState('sports');
  const [wantSub, setWantSub]   = useState('eat');
  const [addingTo,setAddingTo]  = useState(null);

  /* checklist sets */
  const [vstStates,  setVstStates]  = useState(new Set());
  const [vstParks,   setVstParks]   = useState(new Set());
  const [vstConts,   setVstConts]   = useState(new Set());
  const [vstWonders, setVstWonders] = useState(new Set());
  const [vstNatural, setVstNatural] = useState(new Set());
  const [vstOceans,  setVstOceans]  = useState(new Set());
  const [vstCountries,setVstCountries]=useState(new Set());
  const [vstCapitals,setVstCapitals]=useState(new Set());

  /* free-form lists */
  const [wCities,   setWCities]   = useState([]);
  const [usCities,  setUsCities]  = useState([]);
  const [rests,     setRests]     = useState([]);
  const [bars,      setBars]      = useState([]);
  const [breweries, setBreweries] = useState([]);
  const [wineries,  setWineries]  = useState([]);
  const [beers,     setBeers]     = useState([]);
  const [wines,     setWines]     = useState([]);
  const [stays,     setStays]     = useState([]);
  const [beaches,   setBeaches]   = useState([]);
  const [lakes,     setLakes]     = useState([]);
  const [rivers,    setRivers]    = useState([]);
  const [islands,   setIslands]   = useState([]);
  const [hikes,     setHikes]     = useState([]);
  const [museums,   setMuseums]   = useState([]);
  const [historic,  setHistoric]  = useState([]);
  const [zoos,      setZoos]      = useState([]);
  const [cparks,    setCparks]    = useState([]);
  const [roadtrips, setRoadtrips] = useState([]);
  const [sports,    setSports]    = useState([]);
  const [amusement, setAmusement] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [wantItems, setWantItems] = useState([]);

  const tog = setter => name => setter(s=>{const n=new Set(s);n.has(name)?n.delete(name):n.add(name);return n;});

  const totalPlaces = vstStates.size+vstParks.size+vstConts.size+vstWonders.size+vstCountries.size+vstCapitals.size+
    wCities.length+usCities.length+rests.length+bars.length+breweries.length+wineries.length+
    beers.length+wines.length+stays.length+beaches.length+lakes.length+rivers.length+
    islands.length+hikes.length+museums.length+historic.length+zoos.length+
    cparks.length+roadtrips.length+sports.length+amusement.length+festivals.length;

  const LF = type => [
    {key:'name',label:`${type} Name`,placeholder:type},
    {key:'city',label:'City',placeholder:'City'},
    {key:'state',label:'State / Country',placeholder:'CA'},
    {key:'date',label:'When',type:'month'},
    {key:'rating',label:'Rating (1–5)',placeholder:'5'},
    {key:'notes',label:'Notes',type:'textarea',placeholder:'What was great…'},
  ];

  /* ── US SECTION ── */
  const renderUS = () => (
    <>
      <SubTabs tabs={[{id:'states',label:'States'},{id:'parks',label:'National Parks'},{id:'caps',label:'State Capitals'},{id:'cities',label:'Cities'}]}
        active={usSub} setActive={t=>{setUsSub(t);setAddingTo(null);}}/>
      <div style={{marginTop:16}}>
        {usSub==='states'&&<>
          <div style={{marginBottom:14}}><ProgressBar value={vstStates.size} max={50} color={C.rust}/></div>
          {vstStates.size>0&&<div style={{marginBottom:12,display:'flex',flexWrap:'wrap',gap:5}}>
            {[...vstStates].sort().map(a=><span key={a} style={{background:C.rust,color:'#fff',borderRadius:5,padding:'2px 9px',fontSize:'0.7rem',fontWeight:700}}>{a}</span>)}
          </div>}
          <USChoroplethMap visited={vstStates} onToggle={tog(setVstStates)}/>
        </>}
        {usSub==='parks'&&<>
          <div style={{marginBottom:14}}><ProgressBar value={vstParks.size} max={63} color={C.greenHi}/></div>
          <ParkGrid visited={vstParks} onToggle={tog(setVstParks)}/>
        </>}
        {usSub==='caps'&&<>
          <div style={{marginBottom:14}}><ProgressBar value={vstCapitals.size} max={50} color={C.teal}/></div>
          <SearchableChecklist items={CAPITALS_LIST} visited={vstCapitals} onToggle={tog(setVstCapitals)} label="capitals" color={C.teal}
            renderRow={(item,done)=>(
              <div>
                <span style={{fontSize:'0.88rem',color:done?C.teal:C.text,fontWeight:done?600:400}}>{item.capital}</span>
                <span style={{fontSize:'0.72rem',color:C.textMuted,marginLeft:8}}>{STATE_NAMES[item.state]}</span>
              </div>
            )}/>
        </>}
        {usSub==='cities'&&<FreeFormSection list={usCities} setter={setUsCities} sKey="uscities" addingTo={addingTo} setAddingTo={setAddingTo} title="US City" fields={LF('City')} showRating/>}
      </div>
    </>
  );

  /* ── WORLD SECTION ── */
  const renderWorld = () => (
    <>
      <SubTabs tabs={[{id:'countries',label:'Countries'},{id:'continents',label:'Continents'},{id:'cities',label:'World Cities'},{id:'wonders',label:'7 Wonders'},{id:'natural',label:'Natural Wonders'}]}
        active={worldSub} setActive={t=>{setWorldSub(t);setAddingTo(null);}}/>
      <div style={{marginTop:16}}>
        {worldSub==='countries'&&<>
          <div style={{marginBottom:14}}><ProgressBar value={vstCountries.size} max={195} color={C.teal}/></div>
          {/* Map + List toggle */}
          <div style={{display:'flex',gap:8,marginBottom:14}}>
            {['map','list'].map(v=>(
              <button key={v} onClick={()=>setWorldMapMode(v)} style={{
                padding:'6px 16px',borderRadius:20,border:'none',cursor:'pointer',fontSize:'0.8rem',fontWeight:worldMapMode===v?600:400,
                background:worldMapMode===v?C.teal:C.surface2,color:worldMapMode===v?'#fff':C.textMuted,
              }}>{v==='map'?'🗺️ Map':'📋 List'}</button>
            ))}
          </div>
          {worldMapMode==='map'
            ?<WorldChoroplethMap visited={vstCountries} onToggle={tog(setVstCountries)} mode="countries"/>
            :<SearchableChecklist items={ALL_COUNTRIES} visited={vstCountries} onToggle={tog(setVstCountries)} label="countries" color={C.teal}/>
          }
        </>}
        {worldSub==='continents'&&<>
          <div style={{marginBottom:14}}><ProgressBar value={vstConts.size} max={7} color={C.gold}/></div>
          <WorldChoroplethMap visited={vstCountries} onToggle={tog(setVstCountries)} mode="continents" visitedContinents={vstConts} onToggleContinent={tog(setVstConts)}/>
          <div style={{marginTop:14,display:'flex',flexWrap:'wrap',gap:8}}>
            {CONTINENTS.map(c=>{
              const done=vstConts.has(c);
              const col=CONTINENT_COLORS[c.replace('Australia / Oceania','Oceania')]||C.green;
              return(
                <button key={c} onClick={()=>tog(setVstConts)(c)} style={{
                  padding:'7px 14px',borderRadius:20,border:`2px solid ${done?col:C.border}`,cursor:'pointer',
                  background:done?col:C.surface2,color:done?'#fff':C.textMuted,fontSize:'0.82rem',fontWeight:done?600:400,
                }}>{done?'✓ ':''}{c}</button>
              );
            })}
          </div>
        </>}
        {worldSub==='wonders'&&<><div style={{marginBottom:14}}><ProgressBar value={vstWonders.size} max={7} color={C.gold}/></div>
          <SearchableChecklist items={SEVEN_WONDERS} visited={vstWonders} onToggle={tog(setVstWonders)} label="Wonders" color={C.gold}/></>}
        {worldSub==='natural'&&<><div style={{marginBottom:14}}><ProgressBar value={vstNatural.size} max={7} color={C.greenHi}/></div>
          <SearchableChecklist items={NATURAL_WONDERS} visited={vstNatural} onToggle={tog(setVstNatural)} label="Natural Wonders" color={C.greenHi}/></>}
        {worldSub==='cities'&&<FreeFormSection list={wCities} setter={setWCities} sKey="wcities" addingTo={addingTo} setAddingTo={setAddingTo} title="World City"
          fields={[{key:'name',label:'City',placeholder:'e.g. Tokyo'},{key:'state',label:'Country',placeholder:'Japan'},{key:'date',label:'When',type:'month'},{key:'notes',label:'Notes',type:'textarea'}]}/>}
      </div>
    </>
  );

  const renderEatDrink=()=>(
    <>
      <SubTabs tabs={[{id:'restaurants',label:'Restaurants'},{id:'bars',label:'Bars'},{id:'breweries',label:'Breweries'},{id:'wineries',label:'Wineries'},{id:'beers',label:'Beers'},{id:'wines',label:'Wines'},{id:'stays',label:'Stays'}]}
        active={eatSub} setActive={t=>{setEatSub(t);setAddingTo(null);}}/>
      <div style={{marginTop:16}}>
        {eatSub==='restaurants'&&<FreeFormSection list={rests}     setter={setRests}     sKey="rests"     addingTo={addingTo} setAddingTo={setAddingTo} title="Restaurant"   fields={LF('Restaurant')} showRating/>}
        {eatSub==='bars'       &&<FreeFormSection list={bars}      setter={setBars}      sKey="bars"      addingTo={addingTo} setAddingTo={setAddingTo} title="Bar"          fields={LF('Bar')}        showRating/>}
        {eatSub==='breweries'  &&<FreeFormSection list={breweries} setter={setBreweries} sKey="breweries" addingTo={addingTo} setAddingTo={setAddingTo} title="Brewery"      fields={LF('Brewery')}    showRating/>}
        {eatSub==='wineries'   &&<FreeFormSection list={wineries}  setter={setWineries}  sKey="wineries"  addingTo={addingTo} setAddingTo={setAddingTo} title="Winery"       fields={LF('Winery')}     showRating/>}
        {eatSub==='beers'      &&<FreeFormSection list={beers}     setter={setBeers}     sKey="beers"     addingTo={addingTo} setAddingTo={setAddingTo} title="Beer"
          fields={[{key:'name',label:'Beer Name',placeholder:'e.g. Pliny the Elder'},{key:'state',label:'Brewery',placeholder:'Russian River'},{key:'rating',label:'Rating',placeholder:'5'},{key:'notes',label:'Notes',type:'textarea'}]} showRating/>}
        {eatSub==='wines'      &&<FreeFormSection list={wines}     setter={setWines}     sKey="wines"     addingTo={addingTo} setAddingTo={setAddingTo} title="Wine"
          fields={[{key:'name',label:'Wine Name',placeholder:'e.g. Opus One'},{key:'state',label:'Region',placeholder:'Napa Valley'},{key:'rating',label:'Rating',placeholder:'5'},{key:'notes',label:'Notes',type:'textarea'}]} showRating/>}
        {eatSub==='stays'      &&<FreeFormSection list={stays}     setter={setStays}     sKey="stays"     addingTo={addingTo} setAddingTo={setAddingTo} title="Stay"         fields={LF('Hotel / Airbnb')} showRating/>}
      </div>
    </>
  );

  const renderNature=()=>(
    <>
      <SubTabs tabs={[{id:'beaches',label:'Beaches'},{id:'lakes',label:'Lakes'},{id:'rivers',label:'Rivers'},{id:'islands',label:'Islands'},{id:'hikes',label:'Hikes'},{id:'oceans',label:'Oceans & Seas'}]}
        active={natSub} setActive={t=>{setNatSub(t);setAddingTo(null);}}/>
      <div style={{marginTop:16}}>
        {natSub==='beaches'&&<FreeFormSection list={beaches} setter={setBeaches} sKey="beaches" addingTo={addingTo} setAddingTo={setAddingTo} title="Beach"  fields={LF('Beach')}  showRating/>}
        {natSub==='lakes'  &&<FreeFormSection list={lakes}   setter={setLakes}   sKey="lakes"   addingTo={addingTo} setAddingTo={setAddingTo} title="Lake"   fields={LF('Lake')}   showRating/>}
        {natSub==='rivers' &&<FreeFormSection list={rivers}  setter={setRivers}  sKey="rivers"  addingTo={addingTo} setAddingTo={setAddingTo} title="River"  fields={LF('River')}  showRating/>}
        {natSub==='islands'&&<FreeFormSection list={islands} setter={setIslands} sKey="islands" addingTo={addingTo} setAddingTo={setAddingTo} title="Island" fields={LF('Island')} showRating/>}
        {natSub==='hikes'  &&<FreeFormSection list={hikes}   setter={setHikes}   sKey="hikes"   addingTo={addingTo} setAddingTo={setAddingTo} title="Hike"
          fields={[{key:'name',label:'Trail Name',placeholder:'e.g. Angels Landing'},{key:'state',label:'Park / Location',placeholder:'Zion NP, UT'},{key:'date',label:'When',type:'month'},{key:'rating',label:'Rating',placeholder:'5'},{key:'notes',label:'Notes',type:'textarea'}]} showRating/>}
        {natSub==='oceans' &&<><div style={{marginBottom:14}}><ProgressBar value={vstOceans.size} max={OCEANS_SEAS.length} color={C.blue}/></div>
          <SearchableChecklist items={OCEANS_SEAS} visited={vstOceans} onToggle={tog(setVstOceans)} label="Oceans & Seas" color={C.blue}/></>}
      </div>
    </>
  );

  const renderCulture=()=>(
    <>
      <SubTabs tabs={[{id:'museums',label:'Museums'},{id:'historic',label:'Historic Sites'},{id:'zoos',label:'Zoos & Aquariums'},{id:'cparks',label:'City Parks'},{id:'roadtrips',label:'Road Trips'}]}
        active={cultSub} setActive={t=>{setCultSub(t);setAddingTo(null);}}/>
      <div style={{marginTop:16}}>
        {cultSub==='museums'  &&<FreeFormSection list={museums}   setter={setMuseums}   sKey="museums"   addingTo={addingTo} setAddingTo={setAddingTo} title="Museum / Gallery"   fields={LF('Museum')}  showRating/>}
        {cultSub==='historic' &&<FreeFormSection list={historic}  setter={setHistoric}  sKey="historic"  addingTo={addingTo} setAddingTo={setAddingTo} title="Historic Site"      fields={LF('Site')}    showRating/>}
        {cultSub==='zoos'     &&<FreeFormSection list={zoos}      setter={setZoos}      sKey="zoos"      addingTo={addingTo} setAddingTo={setAddingTo} title="Zoo / Aquarium"     fields={LF('Zoo')}     showRating/>}
        {cultSub==='cparks'   &&<FreeFormSection list={cparks}    setter={setCparks}    sKey="cparks"    addingTo={addingTo} setAddingTo={setAddingTo} title="City Park / Garden" fields={LF('Park')}    showRating/>}
        {cultSub==='roadtrips'&&<FreeFormSection list={roadtrips} setter={setRoadtrips} sKey="roadtrips" addingTo={addingTo} setAddingTo={setAddingTo} title="Road Trip"
          fields={[{key:'name',label:'Route Name',placeholder:'e.g. Pacific Coast Hwy'},{key:'state',label:'States / Region',placeholder:'CA, OR, WA'},{key:'date',label:'When',type:'month'},{key:'rating',label:'Rating',placeholder:'5'},{key:'notes',label:'Highlights',type:'textarea'}]} showRating/>}
      </div>
    </>
  );

  const renderEvents=()=>(
    <>
      <SubTabs tabs={[{id:'sports',label:'Sporting Events'},{id:'amusement',label:'Amusement Parks'},{id:'festivals',label:'Festivals & Fairs'}]}
        active={evtSub} setActive={t=>{setEvtSub(t);setAddingTo(null);}}/>
      <div style={{marginTop:16}}>
        {evtSub==='sports'   &&<FreeFormSection list={sports}    setter={setSports}    sKey="sports"    addingTo={addingTo} setAddingTo={setAddingTo} title="Sporting Event"  fields={LF('Event')} showRating/>}
        {evtSub==='amusement'&&<FreeFormSection list={amusement} setter={setAmusement} sKey="amusement" addingTo={addingTo} setAddingTo={setAddingTo} title="Amusement Park"  fields={LF('Park')}  showRating/>}
        {evtSub==='festivals'&&<FreeFormSection list={festivals} setter={setFestivals} sKey="festivals" addingTo={addingTo} setAddingTo={setAddingTo} title="Festival / Fair" fields={LF('Event')} showRating/>}
      </div>
    </>
  );

  const renderWantToGo=()=>{
    const cat=wantSub;
    const items=wantItems.filter(i=>i.cat===cat);
    return(
      <>
        <GoogleMapsPanel/>
        <SubTabs tabs={[{id:'eat',label:'🍽️ Eat'},{id:'stay',label:'🛏️ Stay'},{id:'bars',label:'🍺 Bars'},{id:'beaches',label:'🏖️ Beaches'},{id:'camp',label:'⛺ Camp'},{id:'outdoor',label:'🥾 Outdoors'},{id:'kids',label:'👧 Kids'},{id:'drives',label:'🚗 Drives'},{id:'other',label:'📍 Other'}]}
          active={wantSub} setActive={t=>{setWantSub(t);setAddingTo(null);}}/>
        <div style={{marginTop:16}}>
          {addingTo===`w_${cat}`
            ?<AddEntryForm title="Add to Wishlist" onCancel={()=>setAddingTo(null)} onAdd={e=>{setWantItems(l=>[...l,{...e,cat,id:Date.now()}]);setAddingTo(null);}}
                fields={[{key:'name',label:'Name / Place'},{key:'city',label:'City'},{key:'state',label:'State / Country'},{key:'notes',label:'Why / Notes',type:'textarea',placeholder:'Who recommended it…'}]}/>
            :<AddBtn onClick={()=>setAddingTo(`w_${cat}`)} label="+ Add to Wishlist"/>}
          <EntryList items={items} onDelete={id=>setWantItems(l=>l.filter(i=>i.id!==id))} renderItem={e=>(
            <>
              <div style={{fontSize:'0.93rem',color:C.text,fontWeight:600,paddingRight:24}}>{e.name}</div>
              {(e.city||e.state)&&<div style={{fontSize:'0.73rem',color:C.textMuted,marginTop:3}}>{[e.city,e.state].filter(Boolean).join(', ')}</div>}
              {e.notes&&<div style={{fontSize:'0.78rem',color:C.textMuted,marginTop:5,fontStyle:'italic'}}>"{e.notes}"</div>}
            </>
          )}/>
        </div>
      </>
    );
  };

  const beenTabs=[
    {id:'us',    label:'🇺🇸 US',        color:C.rust},
    {id:'world', label:'🌍 World',       color:C.teal},
    {id:'eat',   label:'🍽️ Eat & Drink', color:C.gold},
    {id:'nature',label:'🌊 Nature',      color:C.blue},
    {id:'culture',label:'🏛️ Culture',    color:C.purple},
    {id:'events',label:'🎉 Events',      color:C.greenHi},
  ];

  return(
    <div style={{background:C.bg,minHeight:'100vh',color:C.text,fontFamily:'system-ui,sans-serif'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#2a3d2a}::-webkit-scrollbar-thumb{background:#5a7a4a;border-radius:3px}`}</style>

      {/* HEADER */}
      <header style={{background:'linear-gradient(135deg,#0f1f0f,#1c3018)',borderBottom:`1px solid ${C.border}`,padding:'16px 20px 14px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.55rem',color:C.text,margin:0}}>
            Quail's Travel Log <span style={{fontStyle:'italic',fontSize:'0.88rem',color:C.textMuted}}>· Guide to the Galaxy</span>
          </h1>
          <div style={{display:'flex',flexWrap:'wrap',gap:16,marginTop:10}}>
            {[
              {e:'🏛️',l:`${vstStates.size}/50 States`,c:C.rust},
              {e:'🏔️',l:`${vstParks.size}/63 Parks`,c:C.greenHi},
              {e:'🌍',l:`${vstCountries.size} Countries`,c:C.teal},
              {e:'📍',l:`${totalPlaces} Total`,c:C.gold},
            ].map(s=>(
              <div key={s.l} style={{display:'flex',alignItems:'center',gap:5}}>
                <span style={{fontSize:'0.85rem'}}>{s.e}</span>
                <span style={{fontSize:'0.78rem',color:s.c,fontWeight:600}}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN TABS */}
      <div style={{background:'#111e11',borderBottom:`1px solid ${C.border}`,position:'sticky',top:0,zIndex:20}}>
        <div style={{maxWidth:960,margin:'0 auto',display:'flex'}}>
          {[{id:'been',label:'✅ Been There'},{id:'want',label:'📌 Want to Go'},{id:'tips',label:'📖 Travel Tips'}].map(t=>(
            <button key={t.id} onClick={()=>{setMainTab(t.id);setAddingTo(null);}} style={{
              flex:1,padding:'13px 8px',border:'none',cursor:'pointer',
              fontSize:'0.85rem',fontWeight:mainTab===t.id?600:400,
              background:mainTab===t.id?C.surface:'transparent',
              color:mainTab===t.id?C.text:C.textMuted,
              borderBottom:mainTab===t.id?`2px solid ${C.greenHi}`:'2px solid transparent',
              transition:'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{maxWidth:960,margin:'0 auto',padding:'20px 16px 60px'}}>
        {mainTab==='been'&&<>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:18}}>
            {beenTabs.map(t=>(
              <button key={t.id} onClick={()=>{setBeenSec(t.id);setAddingTo(null);}} style={{
                padding:'7px 14px',borderRadius:20,border:'none',cursor:'pointer',
                background:beenSec===t.id?t.color:C.surface2,
                color:beenSec===t.id?'#fff':C.textMuted,
                fontSize:'0.82rem',fontWeight:beenSec===t.id?600:400,transition:'all 0.15s',
              }}>{t.label}</button>
            ))}
          </div>
          {beenSec==='us'     &&renderUS()}
          {beenSec==='world'  &&renderWorld()}
          {beenSec==='eat'    &&renderEatDrink()}
          {beenSec==='nature' &&renderNature()}
          {beenSec==='culture'&&renderCulture()}
          {beenSec==='events' &&renderEvents()}
        </>}
        {mainTab==='want'&&renderWantToGo()}
        {mainTab==='tips'&&(
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',color:C.text,marginBottom:4,fontStyle:'italic'}}>Quail's Guide to the Galaxy ✈️</div>
            <div style={{fontSize:'0.85rem',color:C.textMuted,marginBottom:24}}>Travel smarter. Stress less. See more.</div>
            {TRAVEL_TIPS.map(sec=>(
              <div key={sec.heading} style={{marginBottom:28}}>
                <div style={{fontSize:'1.05rem',color:sec.color,fontWeight:700,marginBottom:12}}>{sec.heading}</div>
                {sec.tips.map(tip=>(
                  <div key={tip.title} style={{borderLeft:`3px solid ${sec.color}`,paddingLeft:16,marginBottom:14}}>
                    <div style={{fontSize:'0.9rem',fontWeight:600,color:C.text,marginBottom:4}}>{tip.title}</div>
                    <div style={{fontSize:'0.85rem',color:C.textMuted,lineHeight:1.6}}>{tip.body}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
