import { useRef, useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useAdmin } from '../context/AdminContext';

/* ═══════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════ */
const COLORS = [
  { id: 'black', label: 'Black', labelAr: 'أسود', hex: '#1a1a1a' },
  { id: 'white', label: 'White', labelAr: 'أبيض', hex: '#f0f0f0' },
  { id: 'red', label: 'Red', labelAr: 'أحمر', hex: '#c62828' },
  { id: 'navy', label: 'Navy', labelAr: 'كحلي', hex: '#1a237e' },
  { id: 'beige', label: 'Beige', labelAr: 'بيج', hex: '#d4a574' },
  { id: 'olive', label: 'Olive', labelAr: 'زيتي', hex: '#33691e' },
  { id: 'gray', label: 'Gray', labelAr: 'رمادي', hex: '#616161' },
  { id: 'burgundy', label: 'Burgundy', labelAr: 'خمري', hex: '#6d1a36' },
];

const SIZES = ['M', 'L', 'XL', 'XXL'];

const STYLES = [
  { id: 'streetwear', label: 'Streetwear', labelAr: 'ستريت وير', icon: '🔥' },
  { id: 'minimal', label: 'Minimal', labelAr: 'مينيمال', icon: '✨' },
  { id: 'oversized', label: 'Oversized', labelAr: 'أوفر سايز', icon: '👕' },
  { id: 'sporty', label: 'Sporty', labelAr: 'سبورت', icon: '⚡' },
  { id: 'anime', label: 'Anime', labelAr: 'أنمي', icon: '🎌' },
  { id: 'graffiti', label: 'Graffiti', labelAr: 'جرافيتي', icon: '🎨' },
];

const OUTFITS = {
  streetwear: { pants: 'Black Cargo Pants', pantsAr: 'بنطلون كارجو أسود', shoes: 'White Air Force 1s', shoesAr: 'اير فورس ١ أبيض', acc: 'Silver Chain + Watch', accAr: 'سلسلة فضة + ساعة', tip: 'Urban royalty 👑', tipAr: 'ملك الشارع 👑' },
  minimal: { pants: 'Slim Beige Chinos', pantsAr: 'شينو بيج سليم', shoes: 'White Sneakers', shoesAr: 'سنيكرز أبيض', acc: 'Minimal Watch', accAr: 'ساعة بسيطة', tip: 'Less is more ✨', tipAr: 'البساطة جمال ✨' },
  oversized: { pants: 'Wide Leg Black Jeans', pantsAr: 'جينز واسع أسود', shoes: 'Chunky Sneakers', shoesAr: 'سنيكرز بلاتفورم', acc: 'Bucket Hat + Rings', accAr: 'هات باكيت + خواتم', tip: 'Comfort + style 🔥', tipAr: 'الراحة مع الستايل 🔥' },
  sporty: { pants: 'Black Joggers', pantsAr: 'جوجرز أسود', shoes: 'Running Sneakers', shoesAr: 'سنيكرز رياضي', acc: 'Sports Watch', accAr: 'ساعة رياضية', tip: 'Ready for action 💪', tipAr: 'جاهز للأكشن 💪' },
  anime: { pants: 'Black Skinny Jeans', pantsAr: 'جينز سكيني أسود', shoes: 'High-Top Converse', shoesAr: 'كونفرس هاي', acc: 'Anime Pin + Tote', accAr: 'بن أنمي + شنطة', tip: 'Main character 🎌', tipAr: 'بطل القصة 🎌' },
  graffiti: { pants: 'Ripped Denim', pantsAr: 'جينز ممزق', shoes: 'Colorful Dunks', shoesAr: 'دانكس ملونه', acc: 'Beanie + Keychain', accAr: 'بيني + ميدالية', tip: 'Art on the move 🎨', tipAr: 'الفن في حركة 🎨' },
};

/* ═══════════════════════════════════════════════════
   ARABIC DETECTION
   ═══════════════════════════════════════════════════ */
function isAr(t) { return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(t); }

/* helper — pick random from array */
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ═══════════════════════════════════════════════════
   3D T-SHIRT (lightweight)
   ═══════════════════════════════════════════════════ */
function createBody() {
  const seg = 48;
  const p = [
    { y:-1.20,rx:0.72,rz:0.42 },{ y:-1.15,rx:0.73,rz:0.42 },{ y:-1.05,rx:0.73,rz:0.42 },
    { y:-0.90,rx:0.72,rz:0.41 },{ y:-0.70,rx:0.71,rz:0.40 },{ y:-0.45,rx:0.69,rz:0.39 },
    { y:-0.20,rx:0.68,rz:0.38 },{ y:0.00,rx:0.68,rz:0.38 },{ y:0.20,rx:0.70,rz:0.39 },
    { y:0.35,rx:0.72,rz:0.40 },{ y:0.50,rx:0.74,rz:0.41 },{ y:0.60,rx:0.75,rz:0.41 },
    { y:0.70,rx:0.75,rz:0.40 },{ y:0.78,rx:0.72,rz:0.38 },{ y:0.84,rx:0.58,rz:0.32 },
    { y:0.88,rx:0.40,rz:0.26 },{ y:0.92,rx:0.26,rz:0.22 },{ y:0.96,rx:0.19,rz:0.18 },
    { y:1.00,rx:0.18,rz:0.17 },
  ];
  const v=[],n=[],u=[],idx=[];
  for(let i=0;i<p.length;i++){const{y,rx,rz}=p[i];const vv=i/(p.length-1);for(let s=0;s<=seg;s++){const a=(s/seg)*Math.PI*2;v.push(Math.cos(a)*rx,y,Math.sin(a)*rz+Math.max(0,-Math.sin(a))*0.03);u.push(s/seg,1-vv);n.push(Math.cos(a),0,Math.sin(a));}}
  for(let i=0;i<p.length-1;i++)for(let s=0;s<seg;s++){const a=i*(seg+1)+s,b=a+1,c=a+(seg+1),d=c+1;idx.push(a,c,b,b,c,d);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(n,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(u,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
function createSleeve() {
  const s=20,r=8,v=[],n=[],u=[],idx=[];
  for(let i=0;i<=r;i++){const t=i/r,rad=0.30+(0.22-0.30)*t,y=-t*0.42;for(let j=0;j<=s;j++){const a=(j/s)*Math.PI*2;v.push(Math.cos(a)*rad,y,Math.sin(a)*rad);n.push(Math.cos(a),0,Math.sin(a));u.push(j/s,t);}}
  for(let i=0;i<r;i++)for(let j=0;j<s;j++){const a=i*(s+1)+j,b=a+1,c=a+(s+1),d=c+1;idx.push(a,c,b,b,c,d);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(n,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(u,2));g.setIndex(idx);g.computeVertexNormals();return g;
}

const bGeo={c:null},sGeo={c:null};

function TShirt({color,spin}){
  const ref=useRef();const sp=useRef(0);
  if(!bGeo.c)bGeo.c=createBody();if(!sGeo.c)sGeo.c=createSleeve();
  useFrame(({clock})=>{if(!ref.current)return;ref.current.position.y=Math.sin(clock.getElapsedTime()*0.7)*0.015;if(spin){sp.current+=0.12;ref.current.rotation.y=sp.current;}});
  const m=useMemo(()=><meshStandardMaterial color={color} roughness={0.78} metalness={0} side={THREE.DoubleSide}/>,[color]);
  return(<group ref={ref}><mesh geometry={bGeo.c}>{m}</mesh><mesh geometry={sGeo.c} position={[-0.72,0.68,0]} rotation={[0.08,0,0.65]}>{m}</mesh><mesh geometry={sGeo.c} position={[0.72,0.68,0]} rotation={[0.08,0,-0.65]}>{m}</mesh><mesh position={[0,1,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[0.185,0.025,8,48]}/>{m}</mesh></group>);
}

function Stage(){
  const r=useRef();
  useFrame(({clock})=>{if(r.current)r.current.material.opacity=0.4+Math.sin(clock.getElapsedTime()*2.5)*0.15;});
  return(<group><mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.35,0]}><cylinderGeometry args={[1.2,1.3,0.08,64]}/><meshStandardMaterial color="#0a0a12" roughness={0.15} metalness={0.9}/></mesh><mesh ref={r} rotation={[-Math.PI/2,0,0]} position={[0,-1.30,0]}><ringGeometry args={[1.22,1.26,64]}/><meshBasicMaterial color="#00ff66" transparent opacity={0.5} side={THREE.DoubleSide}/></mesh></group>);
}

function Scene({color,spin}){
  return(<><ambientLight intensity={0.7} color="#d0d8e8"/><spotLight position={[3,5,5]} intensity={3} angle={0.6} penumbra={0.5} castShadow/><spotLight position={[-4,3,4]} intensity={1.5} angle={0.6} penumbra={0.7} color="#ddeeff"/><directionalLight position={[0,2,6]} intensity={1}/><pointLight position={[0,-1.2,0]} intensity={0.3} color="#00ff66"/><fog attach="fog" args={['#050010',8,25]}/><Suspense fallback={null}><TShirt color={color} spin={spin}/></Suspense><Stage/><ContactShadows position={[0,-1.31,0]} opacity={0.4} scale={4} blur={2.5} far={4}/><OrbitControls enableDamping dampingFactor={0.06} enableZoom minDistance={3.5} maxDistance={8} enablePan={false} autoRotate autoRotateSpeed={1.5} target={[0,-0.1,0]} minPolarAngle={Math.PI*0.3} maxPolarAngle={Math.PI*0.7}/></>);
}

/* ═══════════════════════════════════════════════════
   CHAT BUBBLE — supports text + product image (just the photo)
   ═══════════════════════════════════════════════════ */
function Bubble({msg,isUser,rtl,img,productImg}){
  return(
    <div style={{display:'flex',justifyContent:isUser?'flex-end':'flex-start',marginBottom:10,animation:'fadeSlideUp 0.3s ease-out'}}>
      {!isUser&&<div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,background:'linear-gradient(135deg,#00ff66,#00cc52)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,marginRight:8,marginTop:2}}>🤖</div>}
      <div style={{maxWidth:'82%',display:'flex',flexDirection:'column',gap:6}}>
        <div style={{padding:'10px 14px',borderRadius:isUser?'16px 16px 4px 16px':'16px 16px 16px 4px',background:isUser?'linear-gradient(135deg,rgba(0,255,102,0.15),rgba(0,255,102,0.08))':'rgba(255,255,255,0.05)',border:isUser?'1px solid rgba(0,255,102,0.2)':'1px solid rgba(255,255,255,0.08)',fontSize:13,lineHeight:1.6,color:'#e0e0e0',direction:rtl?'rtl':'ltr',textAlign:rtl?'right':'left',whiteSpace:'pre-line'}}>
          {msg}
        </div>
        {img&&<img src={img} alt="Design" loading="lazy" style={{maxWidth:'100%',borderRadius:12,border:'1px solid rgba(0,255,102,0.15)',maxHeight:200,objectFit:'cover'}}/>}
        {productImg&&<img src={productImg} alt="تصميم" loading="lazy" style={{maxWidth:220,borderRadius:14,border:'1px solid rgba(0,255,102,0.2)',objectFit:'contain',background:'linear-gradient(135deg,#0c0c12,#1a0b2e)',boxShadow:'0 4px 20px rgba(0,255,102,0.08)'}}/>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function AIStylist(){
  const { products } = useAdmin();
  const[tab,setTab]=useState('chat');
  const[style,setStyle]=useState(null);
  const[color,setColor]=useState('#1a1a1a');
  const[size,setSize]=useState('L');
  const[msgs,setMsgs]=useState([
    {text:"أهلاً بيك يا غالي! 👋✨\nانت هنا عشان نطلعلك التصميم اللي ف دماغك! 🔥\n\nقولي عاوز إيه وأنا هوريك أحلى التصاميم عندنا 😎\n\nHey! 👋 You're here so we can bring the design in your mind to life! 🔥\nTell me what you want and I'll show you! 😎",user:false,rtl:false},
  ]);
  const[input,setInput]=useState('');
  const[spin,setSpin]=useState(false);
  const[tip,setTip]=useState('');
  const endRef=useRef(null);

  /* ── Track suggested products to avoid repeats ── */
  const suggestedRef=useRef(new Set());
  const lastSuggestedRef=useRef(null);
  const lastCategoryRef=useRef(null); // 'boys' or 'girls' or null

  /* ── Product pools ── */
  const boysProducts=useMemo(()=>products.filter(p=>p.gender==='boys'&&p.inStock!==false),[products]);
  const girlsProducts=useMemo(()=>products.filter(p=>p.gender==='girls'&&p.inStock!==false),[products]);
  const allProducts=useMemo(()=>products.filter(p=>p.inStock!==false),[products]);

  /* ── Get a product that hasn't been suggested yet ── */
  const getNewProduct=useCallback((pool)=>{
    const available=pool.filter(p=>!suggestedRef.current.has(p.id));
    // If all suggested, reset and try again
    if(available.length===0){
      suggestedRef.current.clear();
      return pickRandom(pool);
    }
    const pick=pickRandom(available);
    suggestedRef.current.add(pick.id);
    lastSuggestedRef.current=pick;
    return pick;
  },[]);

  // Prefs
  useEffect(()=>{try{const s=localStorage.getItem('ais-p');if(s){const p=JSON.parse(s);if(p.c)setColor(p.c);if(p.s)setSize(p.s);if(p.st)setStyle(p.st);}}catch{}},[]);
  useEffect(()=>{try{localStorage.setItem('ais-p',JSON.stringify({c:color,s:size,st:style}))}catch{}},[color,size,style]);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[msgs]);

  // Smart tips
  useEffect(()=>{
    if(!style)return;
    const tips=[
      {c:(s,cl)=>cl==='#1a1a1a',en:'🖤 Black = power move!',ar:'🖤 الأسود = قوة!'},
      {c:(s,cl)=>cl==='#f0f0f0',en:'⚪ White is timeless',ar:'⚪ الأبيض كلاسيك'},
      {c:(s,cl)=>s==='streetwear',en:'🔥 Streetwear looks best on dark',ar:'🔥 الستريت وير أحلى على الغامق'},
      {c:(s,cl)=>s==='minimal',en:'✨ Minimal = elegance',ar:'✨ المينيمال = أناقة'},
      {c:(s,cl)=>s==='anime',en:'🎌 Anime pops on black/navy',ar:'🎌 الأنمي تحفة على الأسود'},
    ];
    const t=tips.find(t=>t.c(style,color));
    if(t)setTip(`${t.en}\n${t.ar}`);
  },[style,color]);

  const apply=useCallback((st,cl)=>{setStyle(st);setColor(cl);setSpin(true);setTimeout(()=>setSpin(false),1800);},[]);

  /* ═══════════════════════════════════════════════════
     SMART AI RESPONSE — talks like a friend / shop owner
     Connected to real store products!
     ═══════════════════════════════════════════════════ */
  const aiReply=useCallback((userMsg)=>{
    const m=userMsg.toLowerCase().trim();
    const arab=isAr(userMsg);
    let reply={text:'',rtl:arab,img:null,productImg:null};

    /* ── Helper: suggest a product with friendly message ── */
    const suggestProduct=(pool,category)=>{
      if(!pool||pool.length===0){
        reply.text=arab?'للأسف مفيش تصاميم متاحة حالياً 😅\nبس هنضيف تصاميم جديدة قريب!':'No designs available right now 😅\nBut new ones coming soon!';
        return reply;
      }
      const p=getNewProduct(pool);
      lastCategoryRef.current=category;
      reply.productImg=p.img;
      return p;
    };

    // ── EASTER EGGS — يوسف = خنشر ، محمد = نسنس ──
    if(m.match(/انا\s*يوسف|أنا\s*يوسف|يوسف|i'?m\s*youssef|i'?m\s*yousef|i am youssef|i am yousef|youssef|yousef/i)){
      reply.text='اي ي خنشر 😂🔥\nاطلب اللي انت عاوزه يا معلم! 😎';
      reply.rtl=true;
      return reply;
    }
    if(m.match(/انا\s*محمد|أنا\s*محمد|محمد|i'?m\s*mohamed|i'?m\s*muhammad|i am mohamed|i am muhammad|mohamed|muhammad/i)){
      reply.text='اي ي نسنس 😂🔥\nاطلب ي معلم! 😎';
      reply.rtl=true;
      return reply;
    }

    /* ── Helper: praise phrases for suggesting ── */
    const praiseAr=[
      'ده من أحلى التصاميم عندنا! 🔥 إيه رأيك؟',
      'ده تصميم تحفة والله! ❤️ عجبك؟',
      'شوف ده يا معلم — ده الأحسن عندنا! 💯 إيه رأيك؟',
      'ده تصميم ممتاز وكل الناس بتحبه! 🔥 رأيك إيه؟',
      'ده من أكتر التصاميم المطلوبة! ⭐ يعجبك؟',
      'والله ده تصميم نااار! 🔥 قولي رأيك!',
    ];
    const praiseEn=[
      "This is one of our best sellers! 🔥 What do you think?",
      "This design is absolutely fire! ❤️ Like it?",
      "Check this one out — it's the best! 💯 What do you think?",
      "This is an amazing design, everyone loves it! 🔥 Your thoughts?",
      "One of our most popular designs! ⭐ Do you like it?",
      "This one is pure fire! 🔥 Tell me what you think!",
    ];

    // ── GREETINGS ──
    if(m.match(/^(hi|hey|hello|yo|sup|what'?s? ?up)/)||m.match(/^(مرحب|سلام|اهل|هاي|يو|ازيك|ازايك|عامل|كيف|هلا)/)){
      if(arab){
        const r=[
          'الحمد لله يا معلم! 😊 نورتنا والله!\nانت هنا عشان نطلعلك التصميم اللي ف دماغك!\nقولي عاوز إيه! 🔥',
          'أهلاً يا غالي! الحمد لله تمام! 🔥\nانت جيت المكان الصح!\nقولي عاوز إيه وأنا هوريك! 😎',
          'يا هلا يا كبير! الحمد لله! 👋\nانت هنا عشان نطلعلك أحلى تصميم!\nقولي عاوز تشوف إيه! 🔥',
        ];
        reply.text=pickRandom(r);
      }else{
        const r=[
          "Hey there! 👋 Welcome!\nYou're here so we can bring the design in your mind to life!\nTell me what you want! 🔥",
          "What's up! 🔥 Great to have you here!\nJust tell me what you want and I'll show you! 😎",
          "Hey! Welcome! 👋\nYou're here to find your perfect design!\nWe've got " + allProducts.length + " amazing ones! 🔥\nWhat would you like to see?",
        ];
        reply.text=pickRandom(r);
      }
      return reply;
    }

    // ── HOW ARE YOU ──
    if(m.match(/(how are you|how you doing|how's it going)/)||m.match(/(عامل اي|ازيك|كيفك|كيف حالك|الحمد)/)){
      if(arab){
        const r=[
          'الحمد لله تمام يا صاحبي! 😄\nانت عامل إيه؟ يلا قولي عاوز تشوف إيه وأنا هوريك! 🔥',
          'الحمد لله يا غالي! وانت عامل إيه يا كبير؟ 💪\nيلا نشوف التصاميم الجامدة! 😎',
          'الحمد لله كويس جداً يا معلم! ❤️\nولسه مستنيك عشان أوريك أحلى التصاميم! قولي نبدأ! 🔥',
        ];
        reply.text=pickRandom(r);
      }else{
        const r=[
          "I'm great bro, thanks! 😄\nReady to show you our best designs today! 🔥",
          "Doing awesome! And you? 💪\nLet's find you the perfect design!",
          "Feeling great man! 🎨\nSo what are you looking for? I've got fire designs! 😎",
        ];
        reply.text=pickRandom(r);
      }
      return reply;
    }

    // ── THANKS ──
    if(m.match(/(thank|thanks|thx|شكر|تسلم|يسلمو|مشكور)/)){
      if(arab){reply.text='العفو يا حبيبي! ده واجبنا 😊\nأنا هنا عشان أوفرلك أحلى التصاميم!\nلو عاوز أي حاجه تانية قولي!';}
      else{reply.text="You're welcome! Happy to help! 😊\nI'm here to offer you the best designs!\nAnything else you want to see?";}
      return reply;
    }

    // ── DON'T LIKE IT / CHANGE / ANOTHER ──
    if(m.match(/(مش عاجب|م عاجب|مش حلو|عاوز تاني|ابعت تاني|غير|تصميم تاني|حاجه تاني|مش حبيت|ما عجب|لا مش|غيره|بدل|ابعتلي غير|عايز غير|مش عايز ده|لا ده|ش حلو)/)||
       m.match(/(don'?t like|not this|another|change|different|next|show me another|swap|switch|nah|nope|not feeling|something else)/)){
      const pool=lastCategoryRef.current==='girls'?girlsProducts:lastCategoryRef.current==='boys'?boysProducts:allProducts;
      const p=suggestProduct(pool,lastCategoryRef.current);
      if(typeof p==='object'&&p.text){return reply;} // error case

      if(arab){
        const responses=[
          `تمام يا حبيبي! 😊 مفيش مشكلة خالص!\nشوف ده بقا 👆\n\n${pickRandom(praiseAr)}`,
          `ولا يهمك يا معلم! 💪\nخد ده أحلى بكتير 🔥\n\n${pickRandom(praiseAr)}`,
          `اوكي مفيش مشكلة! 😎\nيلا شوف ده\n\n${pickRandom(praiseAr)}`,
          `طيب شوف ده يا غالي! ✨\nده الأحسن واللي كل الناس بتحبه! 🔥\nإيه رأيك؟`,
        ];
        reply.text=pickRandom(responses);
      }else{
        const responses=[
          `No worries at all! 😊\nCheck this one out 👆\n\n${pickRandom(praiseEn)}`,
          `Got you! 💪 Here's another one 🔥\n\n${pickRandom(praiseEn)}`,
          `Okay, no problem! 😎\nHow about this?\n\n${pickRandom(praiseEn)}`,
          `Alright, check this out instead! ✨\nThis is the best one! 🔥\nWhat do you think?`,
        ];
        reply.text=pickRandom(responses);
      }
      reply.productImg=p.img;
      return reply;
    }

    // ── LIKE IT / GOOD ──
    if(m.match(/(nice|cool|awesome|great|love it|fire|yeah|yes|perfect|حلو|جامد|تحفه|تحفة|حبيت|ممتاز|رهيب|عجبني|اه|ايوا|تمام|جميل|هو ده|اوك|عايز ده|هاخده|هاخد)/)){
      if(arab){
        const r=[
          'أيوا كده يا معلم! 🔥 ذوقك رهيب والله!\nعاوز تشوف تصاميم تاني؟ ولا تطلب ده على طول من واتساب؟ 📱',
          'اختيار ممتاز يا كبير! 💯\nده فعلاً من أحسن التصاميم عندنا!\nعاوز تشوف حاجه كمان ولا هتطلب؟ 😊',
          'والله ذوقك حلو أوي! ❤️\nلو عاوز تطلبه روح الصفحة الأولى ودوس عليه!\nولا عاوز تشوف تصاميم تانية؟',
        ];
        reply.text=pickRandom(r);
      }else{
        const r=[
          "Great taste! 🔥 Glad you like it!\nWant to see more designs? Or order this one via WhatsApp? 📱",
          "Excellent choice! 💯\nThis is truly one of our best!\nWanna see more or ready to order? 😊",
          "You have awesome taste! ❤️\nGo to the main page and tap on it to order!\nOr want to see more designs?",
        ];
        reply.text=pickRandom(r);
      }
      return reply;
    }

    // ── ORDER / BUY ──
    if(m.match(/(اطلب|طلب|اشتري|هاخد|عاوز اطلب|order|buy|purchase|want to order|get this)/)){
      if(lastSuggestedRef.current){
        const p=lastSuggestedRef.current;
        if(arab){
          reply.text=`تمام يا حبيبي! 🛒\nعشان تطلب ${p.name}:\n\n1️⃣ روح الصفحة الأولى\n2️⃣ دوس على التصميم\n3️⃣ اختار المقاس\n4️⃣ دوس "اطلب الآن" وهتروح واتساب 📱\n\nولو عاوز تصاميم تانية قولي! 😊`;
        }else{
          reply.text=`Sure thing! 🛒\nTo order ${p.name}:\n\n1️⃣ Go to the main page\n2️⃣ Tap on the design\n3️⃣ Select your size\n4️⃣ Hit "Order Now" to go to WhatsApp 📱\n\nWant to see more designs? Just ask! 😊`;
        }
      }else{
        if(arab){
          reply.text='عشان تطلب يا حبيبي 🛒\nروح الصفحة الأولى ودوس على أي تصميم يعجبك!\nولا عاوز أوريك تصاميم هنا الأول؟ 😊';
        }else{
          reply.text="To order 🛒\nGo to the main page and tap any design you like!\nOr want me to show you some designs first? 😊";
        }
      }
      return reply;
    }

    // ── BOYS / MEN DESIGNS ──
    if(m.match(/(ولاد|ولد|رجال|شباب|boys|men|boy|man|guys|male|رجالي|شبابي)/)){
      if(boysProducts.length===0){
        reply.text=arab?'مفيش تصاميم حالياً 😅 بس قريب هنضيف!':'No designs available right now 😅 Coming soon!';
        return reply;
      }
      const p=getNewProduct(boysProducts);
      lastCategoryRef.current='boys';
      reply.productImg=p.img;

      if(arab){
        const r=[
          `يلا يا معلم! 💪 شوف التصميم ده 👆\n\n${pickRandom(praiseAr)}\n\nلو مش عاجبك قولي وأجيبلك غيره! 😎`,
          `أكيد يا كبير! 🔥 شوف ده\n\n${pickRandom(praiseAr)}\n\nلو مش عاجبك قولي وأغيرهولك! 😎`,
          `شوف التصميم ده! 🔥\n\n${pickRandom(praiseAr)}\n\nعندنا ${boysProducts.length-1} تصميم تاني كمان! 💯`,
        ];
        reply.text=pickRandom(r);
      }else{
        const r=[
          `Here you go! 💪 Check this out 👆\n\n${pickRandom(praiseEn)}\n\nDon't like it? Just say and I'll show you another! 😎`,
          `Sure thing! 🔥 Take a look\n\n${pickRandom(praiseEn)}\n\nDon't like it? Just say! 😎`,
          `Check this design! 🔥\n\n${pickRandom(praiseEn)}\n\nWe have ${boysProducts.length-1} more to show you! 💯`,
        ];
        reply.text=pickRandom(r);
      }
      return reply;
    }

    // ── GIRLS / WOMEN DESIGNS ──
    if(m.match(/(بنات|بنت|نساء|ستات|girls|women|girl|woman|female|بناتي|نسائي|حريمي)/)){
      if(girlsProducts.length===0){
        reply.text=arab?'مفيش تصاميم حالياً 😅 بس قريب هنضيف!':'No designs available right now 😅 Coming soon!';
        return reply;
      }
      const p=getNewProduct(girlsProducts);
      lastCategoryRef.current='girls';
      reply.productImg=p.img;

      if(arab){
        const r=[
          `يلا! 💖 شوفي التصميم ده 👆\n\n${pickRandom(praiseAr)}\n\nلو مش عاجبك قوليلي وأجيبلك غيره! 😊`,
          `أكيد! 🌟 شوفي ده\n\n${pickRandom(praiseAr)}\n\nلو مش عاجبك قوليلي! 😊`,
          `شوفي التصميم ده! ✨\n\n${pickRandom(praiseAr)}\n\nعندنا ${girlsProducts.length-1} تصميم تاني كمان! 💖`,
        ];
        reply.text=pickRandom(r);
      }else{
        const r=[
          `Here you go! 💖 Check this out 👆\n\n${pickRandom(praiseEn)}\n\nDon't like it? Just say! 😊`,
          `Sure! 🌟 Take a look\n\n${pickRandom(praiseEn)}\n\nDon't like it? Just say! 😊`,
          `Check this design! ✨\n\n${pickRandom(praiseEn)}\n\nWe have ${girlsProducts.length-1} more to show you! 💖`,
        ];
        reply.text=pickRandom(r);
      }
      return reply;
    }

    // ── DESIGN REQUEST (generic) ──
    if(m.match(/(design|تصميم|عاوز تصميم|ابعتلي|ابعت|عايز تصميم|صمم|صمملي|اعمل|اعملي|show me|give me|want a|ورين|وريني|عرض|اعرض)/)){
      const pool=lastCategoryRef.current==='girls'?girlsProducts:lastCategoryRef.current==='boys'?boysProducts:allProducts;
      const p=getNewProduct(pool);
      lastCategoryRef.current=lastCategoryRef.current||p.gender;
      reply.productImg=p.img;

      if(arab){
        reply.text=`يلا يا معلم! 🎨 شوف التصميم ده 👆\n\n${pickRandom(praiseAr)}\n\nلو مش عاجبك قولي "عاوز تاني" وأجيبلك غيره! 😎`;
      }else{
        reply.text=`Here you go! 🎨 Check this out 👆\n\n${pickRandom(praiseEn)}\n\nDon't like it? Say "another" and I'll show you more! 😎`;
      }
      return reply;
    }

    // ── STYLE KEYWORDS (still works for 3D preview) ──
    for(const s of STYLES){
      if(m.includes(s.id)||m.includes(s.label.toLowerCase())||userMsg.includes(s.labelAr)){
        apply(s.id,COLORS[Math.floor(Math.random()*COLORS.length)].hex);
        // Also suggest a real product
        const p=getNewProduct(allProducts);
        reply.productImg=p.img;

        if(arab){
          reply.text=`اختيار ممتاز يا معلم! 🔥\nوشوف كمان التصميم ده من عندنا 👆\n${pickRandom(praiseAr)}`;
        }else{
          reply.text=`Great choice! 🔥\nAlso check this design from our store 👆\n${pickRandom(praiseEn)}`;
        }
        return reply;
      }
    }

    // ── COLOR KEYWORDS ──
    for(const c of COLORS){
      if(m.includes(c.label.toLowerCase())||userMsg.includes(c.labelAr)){
        setColor(c.hex);setSpin(true);setTimeout(()=>setSpin(false),1200);
        if(arab){reply.text=`تم! 🎨 غيرت اللون لـ ${c.labelAr}.\nشكل التيشيرت تحفة كده!\n\nعاوز أوريك تصميم حلو من المحل؟ 😊`;}
        else{reply.text=`Done! 🎨 Changed to ${c.label}.\nThe T-shirt looks amazing!\n\nWant me to show you a design from our store? 😊`;}
        return reply;
      }
    }

    // ── SURPRISE ──
    if(m.match(/(surprise|random|فاجئ|عشوائ)/)){return null;}

    // ── OUTFIT ──
    if(m.match(/(outfit|لبس|ملابس|طقم|تنسيق)/)){
      setTab('outfit');
      if(arab){reply.text='فتحت وضع الأوتفيت! 👔\nشوف التنسيقات الكاملة!';}
      else{reply.text='Switched to Outfit Mode! 👔\nCheck out the full combos!';}
      return reply;
    }

    // ── TRENDING ──
    if(m.match(/(trend|hot|popular|ترند|رائج)/)){
      setTab('trending');
      // Show a random product as trending
      const p=getNewProduct(allProducts);
      reply.productImg=p.img;
      if(arab){reply.text=`من أكتر التصاميم رواجاً عندنا! 🔥\nشوف ده 👆\n\n${pickRandom(praiseAr)}`;}
      else{reply.text=`Here's one of our most popular designs! 🔥\nCheck it out 👆\n\n${pickRandom(praiseEn)}`;}
      return reply;
    }

    // ── HELP ──
    if(m.match(/(help|ازاي|مساعد|إيه|ممكن)/)){
      if(arab){
        reply.text=`أنا هنا أساعدك وأوفرلك أحلى التصاميم يا حبيبي! 😊\n\n👦 قولي "ولاد" — أوريك تصاميم ولاد\n👧 قولي "بنات" — أوريك تصاميم بنات\n🎨 قولي "عاوز تصميم" — أجيبلك تصميم\n🔄 قولي "عاوز تاني" — أغيرلك التصميم\n💰 قولي "بكام" — أقولك السعر\n🎲 قولي "فاجئني" — اختيار عشوائي\n\nعندنا ${allProducts.length} تصميم — ولاد وبنات! 🔥\nأو اتكلم عادي وأنا هرد عليك! 💬`;
      }else{
        reply.text=`I'm here to help you find the best designs! 😊\n\n👦 Say "boys" — see boys designs\n👧 Say "girls" — see girls designs\n🎨 Say "show me a design" — get a design\n🔄 Say "another" — see a different design\n💰 Say "price" — check prices\n🎲 Say "surprise me" — random pick\n\nWe have ${allProducts.length} designs — boys & girls! 🔥\nOr just chat and I'll respond! 💬`;
      }
      return reply;
    }

    // ── SIZE ──
    if(m.match(/(size|مقاس|سايز)/)){
      if(arab){reply.text=`المقاس الحالي: ${size} 📏\nدوس على أي مقاس تحت عشان تغيره!\nالمقاسات المتاحة: M, L, XL, XXL`;}
      else{reply.text=`Current size: ${size} 📏\nTap a size button below to change!\nAvailable: M, L, XL, XXL`;}
      return reply;
    }

    // ── PRICE ──
    if(m.match(/(price|كام|سعر|بكام|how much)/)){
      const prices=allProducts.map(p=>p.price||500);
      const minP=Math.min(...prices);
      const maxP=Math.max(...prices);
      if(arab){
        reply.text=minP===maxP
          ?`كل التصاميم بـ ${minP} جنيه 💰\nعندنا ${allProducts.length} تصميم!\nعاوز تشوف تصميم؟ 😊`
          :`الأسعار من ${minP} لـ ${maxP} جنيه 💰\nعندنا ${allProducts.length} تصميم!\nعاوز تشوف تصميم؟ 😊`;
      }else{
        reply.text=minP===maxP
          ?`All designs are ${minP} EGP 💰\nWe have ${allProducts.length} designs!\nWant to see one? 😊`
          :`Prices range from ${minP} to ${maxP} EGP 💰\nWe have ${allProducts.length} designs!\nWant to see one? 😊`;
      }
      return reply;
    }

    // ── SPECIFIC PRODUCT NUMBER ──
    const numMatch=m.match(/(?:model|موديل|رقم|تصميم|#)\s*(\d+)/)||m.match(/^(\d+)$/);
    if(numMatch){
      const num=parseInt(numMatch[1]);
      const p=allProducts.find(pr=>pr.id===num);
      if(p){
        lastSuggestedRef.current=p;
        lastCategoryRef.current=p.gender;
        suggestedRef.current.add(p.id);
        reply.productImg=p.img;
        if(arab){
          reply.text=`أيوا! شوف ده 👆\n\n${pickRandom(praiseAr)}`;
        }else{
          reply.text=`Here it is 👆\n\n${pickRandom(praiseEn)}`;
        }
        return reply;
      }else{
        if(arab){reply.text=`مفيش تصميم رقم ${num} 😅\nعندنا أرقام من 1 لـ ${allProducts.length}. جرب رقم تاني!`;}
        else{reply.text=`No design #${num} found 😅\nWe have #1 to #${allProducts.length}. Try another number!`;}
        return reply;
      }
    }

    // ── DEFAULT — suggest a product in a friendly way ──
    const pool=lastCategoryRef.current==='girls'?girlsProducts:lastCategoryRef.current==='boys'?boysProducts:allProducts;
    const p=getNewProduct(pool);
    lastCategoryRef.current=lastCategoryRef.current||p.gender;
    reply.productImg=p.img;

    if(arab){
      const responses=[
        `فهمتك يا حبيبي! 😎\nشوف التصميم ده 👆\n\n${pickRandom(praiseAr)}\n\nلو مش عاجبك قولي وأجيبلك غيره! 😊`,
        `يلا يا معلم شوف ده! 🔥\n\n${pickRandom(praiseAr)}\n\nقولي "عاوز تاني" لو عاوز تصميم تاني! 😎`,
        `أنا شايف إن ده هيعجبك! ✨\n\n${pickRandom(praiseAr)}\n\nعندنا كمان ${pool.length-1} تصميم تاني لو مش عاجبك! 💯`,
      ];
      reply.text=pickRandom(responses);
    }else{
      const responses=[
        `Got you! 😎\nCheck this out 👆\n\n${pickRandom(praiseEn)}\n\nDon't like it? Just tell me! 😊`,
        `Here's something for you! 🔥\n\n${pickRandom(praiseEn)}\n\nSay "another" if you want a different one! 😎`,
        `I think you'll love this one! ✨\n\n${pickRandom(praiseEn)}\n\nWe have ${pool.length-1} more designs if you want! 💯`,
      ];
      reply.text=pickRandom(responses);
    }
    return reply;
  },[style,size,color,apply,boysProducts,girlsProducts,allProducts,getNewProduct]);

  const send=useCallback(()=>{
    const m=input.trim();if(!m)return;
    const ar=isAr(m);
    setMsgs(p=>[...p,{text:m,user:true,rtl:ar}]);
    setInput('');

    if(m.toLowerCase().match(/(surprise|random|فاجئ|عشوائ)/)){
      doSurprise(ar);return;
    }

    setTimeout(()=>{
      const r=aiReply(m);
      if(r)setMsgs(p=>[...p,{text:r.text,user:false,rtl:r.rtl,img:r.img,productImg:r.productImg}]);
    },400+Math.random()*400);
  },[input,aiReply]);

  const pickStyle=useCallback((id)=>{
    apply(id,COLORS[Math.floor(Math.random()*COLORS.length)].hex);
    const si=STYLES.find(s=>s.id===id);
    // Also suggest a real product
    const pool=allProducts;
    const p=pool.length>0?getNewProduct(pool):null;
    setMsgs(p2=>[...p2,
      {text:`${si.icon} ${si.label}`,user:true,rtl:false},
      {text:`Applied ${si.label} style! ✅\n${si.labelAr} اتطبق! ✅${p?`\n\nوشوف كمان ده من عندنا 👆`:''}`
        ,user:false,rtl:false,productImg:p?p.img:null},
    ]);
  },[apply,allProducts,getNewProduct]);

  const doSurprise=useCallback((ar=false)=>{
    const rs=STYLES[Math.floor(Math.random()*STYLES.length)];
    const rc=COLORS[Math.floor(Math.random()*COLORS.length)];
    const rz=SIZES[Math.floor(Math.random()*SIZES.length)];
    setSize(rz);apply(rs.id,rc.hex);

    // Pick a random real product
    const p=allProducts.length>0?getNewProduct(allProducts):null;

    setMsgs(prev=>[...prev,
      {text:ar?'🎲 فاجئني!':'🎲 Surprise me!',user:true,rtl:ar},
      {text:ar?`كومبو مفاجأة! 🎉\n\n✅ اتطبق فوراً!${p?`\n\nوكمان شوف التصميم ده 👆\nده الأحسن واللي كل الناس بتحبه! 🔥`:''}`
        :`Surprise combo! 🎉\n\n✅ Applied!${p?`\n\nAlso check this design 👆\nThis is the best — everyone loves it! 🔥`:''}`,
        user:false,rtl:ar,productImg:p?p.img:null},
    ]);
  },[apply,allProducts,getNewProduct]);

  const outfit=style?OUTFITS[style]:null;

  return(
    <div id="ai-stylist-page" style={{background:'#050010',minHeight:'100vh',color:'#f2f2f7',fontFamily:"'Inter','Segoe UI',sans-serif",overflow:'hidden'}}>

      {/* HEADER */}
      <header style={{position:'fixed',top:0,left:0,right:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',height:52,background:'rgba(5,0,16,0.92)',backdropFilter:'blur(14px)',borderBottom:'1px solid rgba(0,255,102,0.08)'}}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:6,textDecoration:'none',color:'#aaa',fontSize:12}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>BACK
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:16}}>🤖</span>
          <span style={{fontSize:11,letterSpacing:'0.15em',color:'#00ff66',fontWeight:700}}>AI STYLIST / المصمم</span>
        </div>
        <span style={{fontSize:10,color:'#555',letterSpacing:'0.12em'}}>VIP</span>
      </header>

      <div className="ais-layout" style={{paddingTop:52,minHeight:'100vh'}}>

        {/* 3D VIEWER */}
        <div className="ais-3d" style={{position:'relative',background:'#050010'}}>
          <Canvas camera={{position:[0,0.2,5.5],fov:38}} gl={{antialias:true,toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.6}} style={{background:'transparent',touchAction:'none'}}>
            <Scene color={color} spin={spin}/>
          </Canvas>
          <div style={{position:'absolute',top:12,right:12,background:'rgba(0,255,102,0.1)',border:'1px solid rgba(0,255,102,0.3)',borderRadius:20,padding:'4px 12px',fontSize:11,fontWeight:700,color:'#00ff66'}}>📏 {size}</div>
          {style&&<div style={{position:'absolute',top:12,left:12,background:'rgba(0,255,102,0.1)',border:'1px solid rgba(0,255,102,0.2)',borderRadius:20,padding:'4px 12px',fontSize:11,fontWeight:600,color:'#00ff66'}}>{STYLES.find(s=>s.id===style)?.icon} {style}</div>}
          <div style={{position:'absolute',bottom:12,left:0,right:0,display:'flex',justifyContent:'center',gap:8,padding:'0 12px'}}>
            {COLORS.map(c=>(
              <button key={c.id} onClick={()=>{setColor(c.hex);setSpin(true);setTimeout(()=>setSpin(false),1200);}} style={{width:30,height:30,borderRadius:'50%',background:c.hex,border:color===c.hex?'2.5px solid #00ff66':'2px solid rgba(255,255,255,0.15)',cursor:'pointer',outline:'none',transition:'all 0.3s',boxShadow:color===c.hex?'0 0 12px rgba(0,255,102,0.5)':'none',flexShrink:0}} title={`${c.label} / ${c.labelAr}`}/>
            ))}
          </div>
        </div>

        {/* AI PANEL */}
        <div className="ais-panel" style={{display:'flex',flexDirection:'column',background:'linear-gradient(180deg,rgba(10,5,20,0.98),rgba(5,0,16,0.99))',borderTop:'1px solid rgba(0,255,102,0.06)',overflow:'hidden'}}>

          {/* Tabs */}
          <div style={{display:'flex',borderBottom:'1px solid rgba(255,255,255,0.06)',flexShrink:0}}>
            {[{id:'chat',i:'💬',l:'Chat / محادثة'},{id:'trending',i:'🔥',l:'Trending / ترند'},{id:'outfit',i:'👔',l:'Outfit / أوتفيت'}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:'10px 0',background:'none',border:'none',borderBottom:tab===t.id?'2px solid #00ff66':'2px solid transparent',color:tab===t.id?'#00ff66':'#666',fontSize:11,fontWeight:tab===t.id?700:500,cursor:'pointer',outline:'none',display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
                <span>{t.i}</span> {t.l}
              </button>
            ))}
          </div>

          {/* CHAT */}
          {tab==='chat'&&(
            <div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
              <div style={{display:'flex',gap:6,padding:'10px 12px',overflowX:'auto',flexShrink:0,scrollbarWidth:'none'}}>
                {STYLES.map(s=>(<button key={s.id} onClick={()=>pickStyle(s.id)} style={{flexShrink:0,padding:'6px 12px',borderRadius:20,background:style===s.id?'rgba(0,255,102,0.15)':'rgba(255,255,255,0.04)',border:style===s.id?'1px solid rgba(0,255,102,0.4)':'1px solid rgba(255,255,255,0.08)',color:style===s.id?'#00ff66':'#aaa',fontSize:11,fontWeight:600,cursor:'pointer',outline:'none',whiteSpace:'nowrap'}}>{s.icon} {s.label}</button>))}
              </div>

              {/* Quick actions */}
              <div style={{display:'flex',gap:6,padding:'0 12px 8px',flexShrink:0}}>
                <button onClick={()=>doSurprise(false)} style={{flex:1,padding:'8px',borderRadius:12,background:'linear-gradient(135deg,rgba(0,255,102,0.12),rgba(0,200,80,0.06))',border:'1px solid rgba(0,255,102,0.25)',color:'#00ff66',fontSize:12,fontWeight:700,cursor:'pointer',outline:'none',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>🎲 Surprise / فاجئني</button>
                <div style={{display:'flex',gap:3}}>
                  {SIZES.map(sz=>(<button key={sz} onClick={()=>setSize(sz)} style={{padding:'8px 10px',borderRadius:10,minWidth:36,background:size===sz?'rgba(0,255,102,0.12)':'rgba(255,255,255,0.03)',border:size===sz?'1px solid #00ff66':'1px solid rgba(255,255,255,0.08)',color:size===sz?'#00ff66':'#777',fontSize:11,fontWeight:700,cursor:'pointer',outline:'none'}}>{sz}</button>))}
                </div>
              </div>

              {tip&&<div style={{margin:'0 12px 8px',padding:'8px 12px',borderRadius:10,background:'rgba(0,255,102,0.05)',border:'1px solid rgba(0,255,102,0.12)',fontSize:11,color:'#88ffaa',lineHeight:1.5,flexShrink:0,whiteSpace:'pre-line'}}>💡 {tip}</div>}
              <div style={{flex:1,overflowY:'auto',padding:'6px 12px',scrollbarWidth:'thin',scrollbarColor:'rgba(0,255,102,0.2) transparent'}}>
                {msgs.map((m,i)=>(<Bubble key={i} msg={m.text} isUser={m.user} rtl={m.rtl} img={m.img} productImg={m.productImg}/>))}
                <div ref={endRef}/>
              </div>
              <div style={{display:'flex',gap:8,padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.06)',flexShrink:0,background:'rgba(5,0,16,0.95)'}}>
                <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="اكتب أو Type... | قول 'عاوز تصميم' 😎" style={{flex:1,padding:'10px 14px',borderRadius:20,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#e0e0e0',fontSize:13,outline:'none',fontFamily:'inherit',direction:isAr(input)?'rtl':'ltr'}}/>
                <button onClick={send} style={{width:40,height:40,borderRadius:'50%',flexShrink:0,background:'linear-gradient(135deg,#00ff66,#00cc52)',border:'none',cursor:'pointer',outline:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050010" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* TRENDING */}
          {tab==='trending'&&(
            <div style={{flex:1,overflowY:'auto',padding:12}}>
              <p style={{fontSize:10,letterSpacing:'0.3em',color:'#00ff66',textTransform:'uppercase',marginBottom:12,fontWeight:600}}>🔥 TRENDING / الأكثر طلباً</p>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {allProducts.slice(0,10).map(p=>(
                  <button key={p.id} onClick={()=>{
                    lastSuggestedRef.current=p;
                    lastCategoryRef.current=p.gender;
                    suggestedRef.current.add(p.id);
                    setMsgs(prev=>[...prev,{text:`شوف التصميم ده! 🔥\nCheck this out!\n${p.price||500} EGP`,user:false,rtl:false,productImg:p.img}]);
                    setTab('chat');
                  }} style={{display:'flex',alignItems:'center',gap:12,padding:12,borderRadius:14,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',cursor:'pointer',outline:'none',textAlign:'left',width:'100%'}}>
                    <div style={{width:48,height:48,borderRadius:10,flexShrink:0,overflow:'hidden',background:'linear-gradient(135deg,#0c0c12,#1a0b2e)'}}>
                      <img src={p.img} alt={p.name} style={{width:'100%',height:'100%',objectFit:'contain'}} loading="lazy" onError={(e)=>{e.target.style.display='none';}}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                        <span style={{fontSize:13,fontWeight:700,color:'#e0e0e0'}}>{p.name}</span>
                        <span style={{fontSize:9,padding:'2px 6px',borderRadius:8,background:'rgba(0,255,102,0.1)',color:'#00ff66',fontWeight:600}}>{p.gender==='boys'?'👦':'👧'}</span>
                      </div>
                      {p.nameAr&&<p style={{fontSize:11,color:'#999',margin:0}}>{p.nameAr}</p>}
                      <p style={{fontSize:10,color:'#666',margin:'2px 0 0'}}>{p.price||500} EGP</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* OUTFIT */}
          {tab==='outfit'&&(
            <div style={{flex:1,overflowY:'auto',padding:12}}>
              <p style={{fontSize:10,letterSpacing:'0.3em',color:'#00ff66',textTransform:'uppercase',marginBottom:8,fontWeight:600}}>👔 OUTFIT MODE / وضع الأوتفيت</p>
              {!style?(
                <div style={{padding:20,textAlign:'center',borderRadius:14,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                  <p style={{fontSize:32,marginBottom:8}}>👕</p>
                  <p style={{fontSize:13,color:'#aaa',marginBottom:4}}>Pick a style first!</p>
                  <p style={{fontSize:12,color:'#888',marginBottom:12}}>اختار ستايل الأول!</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center'}}>
                    {STYLES.map(s=>(<button key={s.id} onClick={()=>{pickStyle(s.id);setTab('outfit');}} style={{padding:'6px 14px',borderRadius:20,background:'rgba(0,255,102,0.08)',border:'1px solid rgba(0,255,102,0.2)',color:'#00ff66',fontSize:11,fontWeight:600,cursor:'pointer',outline:'none'}}>{s.icon} {s.label}</button>))}
                  </div>
                </div>
              ):outfit&&(
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <div style={{padding:'14px 16px',borderRadius:14,background:'linear-gradient(135deg,rgba(0,255,102,0.08),rgba(0,200,80,0.03))',border:'1px solid rgba(0,255,102,0.15)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <span style={{fontSize:20}}>{STYLES.find(s=>s.id===style)?.icon}</span>
                      <span style={{fontSize:16,fontWeight:800,color:'#00ff66',textTransform:'capitalize'}}>{style} Look</span>
                    </div>
                    <p style={{fontSize:12,color:'#88ffaa'}}>{outfit.tip}</p>
                    <p style={{fontSize:12,color:'#66dd88',direction:'rtl'}}>{outfit.tipAr}</p>
                  </div>
                  {[
                    {i:'👕',l:'T-Shirt / تيشيرت',v:`${COLORS.find(c=>c.hex===color)?.label} ${style} (${size})`,va:`${COLORS.find(c=>c.hex===color)?.labelAr} ${STYLES.find(s=>s.id===style)?.labelAr} (${size})`},
                    {i:'👖',l:'Pants / بنطلون',v:outfit.pants,va:outfit.pantsAr},
                    {i:'👟',l:'Shoes / حذاء',v:outfit.shoes,va:outfit.shoesAr},
                    {i:'⌚',l:'Accessories / إكسسوارات',v:outfit.acc,va:outfit.accAr},
                  ].map((it,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:12,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',animation:`fadeSlideUp 0.3s ease-out ${i*0.08}s both`}}>
                      <span style={{fontSize:22,width:36,textAlign:'center'}}>{it.i}</span>
                      <div style={{flex:1}}>
                        <p style={{fontSize:10,color:'#666',textTransform:'uppercase',letterSpacing:'0.1em',margin:0}}>{it.l}</p>
                        <p style={{fontSize:13,color:'#e0e0e0',fontWeight:600,margin:'2px 0 0'}}>{it.v}</p>
                        <p style={{fontSize:11,color:'#999',margin:'1px 0 0',direction:'rtl'}}>{it.va}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',paddingTop:4}}>
                    {STYLES.filter(s=>s.id!==style).map(s=>(<button key={s.id} onClick={()=>pickStyle(s.id)} style={{padding:'5px 10px',borderRadius:16,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',color:'#999',fontSize:10,cursor:'pointer',outline:'none'}}>{s.icon} {s.label}</button>))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .ais-layout{display:grid;grid-template-columns:1fr minmax(340px,420px);height:calc(100vh - 52px)}
        .ais-3d{min-height:400px}
        .ais-panel{max-height:calc(100vh - 52px);border-left:1px solid rgba(255,255,255,0.04)}
        @media(max-width:768px){
          .ais-layout{grid-template-columns:1fr!important;grid-template-rows:280px 1fr;height:auto;min-height:calc(100vh - 52px)}
          .ais-3d{min-height:280px!important;max-height:320px}
          .ais-panel{border-left:none!important;max-height:none;min-height:calc(100vh - 332px);height:calc(100vh - 332px)}
        }
        .ais-panel ::-webkit-scrollbar{width:4px;height:0}
        .ais-panel ::-webkit-scrollbar-track{background:transparent}
        .ais-panel ::-webkit-scrollbar-thumb{background:rgba(0,255,102,0.2);border-radius:4px}
        .ais-panel input:focus{border-color:rgba(0,255,102,0.4)!important;box-shadow:0 0 10px rgba(0,255,102,0.1)}
        .ais-panel button:active{transform:scale(0.95)}
      `}</style>
    </div>
  );
}
