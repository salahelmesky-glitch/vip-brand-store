import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const inputStyle = {
  padding:'13px 16px',borderRadius:14,border:'1px solid rgba(191,64,191,0.2)',
  background:'rgba(255,255,255,0.04)',color:'#f2f2f7',fontSize:14,
  outline:'none',fontFamily:'inherit',width:'100%',boxSizing:'border-box',
};

function AuthForm() {
  const { login, register, loading, error } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localErr, setLocalErr] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const handle = async (e) => {
    e.preventDefault(); setLocalErr(''); setSuccessMsg('');
    if (!email||!password){setLocalErr('ادخل الإيميل والباسورد');return;}
    if (!isLogin&&!name){setLocalErr('ادخل اسمك');return;}
    let ok=false;
    if(isLogin){const r=await login(email,password);if(r.success)ok=true;else setLocalErr(r.error);}
    else{const r=await register(email,password,name);if(r.success)ok=true;else if(r.error?.includes('already')){const lr=await login(email,password);if(lr.success)ok=true;else{setLocalErr('الإيميل مسجل');setIsLogin(true);}}else setLocalErr(r.error);}
    if(ok)setSuccessMsg('أهلاً بيك في عيلة VIP! 💜');
  };
  if(successMsg)return(
    <div style={{maxWidth:380,width:'100%',margin:'0 auto',padding:'0 16px',textAlign:'center'}}>
      <div style={{padding:'32px 24px',borderRadius:20,background:'rgba(0,255,102,0.05)',border:'1px solid rgba(0,255,102,0.2)'}}>
        <div style={{fontSize:50,marginBottom:12}}>🎉</div>
        <h2 style={{fontSize:22,fontWeight:900,color:'#00ff66',margin:'0 0 8px'}}>!تم بنجاح</h2>
        <p style={{fontSize:15,color:'#f2f2f7',margin:'0 0 20px',fontWeight:600}}>{successMsg}</p>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <Link to="/" style={{display:'block',padding:13,borderRadius:14,textDecoration:'none',background:'linear-gradient(135deg,#bf40bf,#7b2fff)',color:'#fff',fontSize:14,fontWeight:700,textAlign:'center'}}>🛒 تسوق الآن</Link>
        </div>
      </div>
    </div>
  );
  return(
    <div style={{maxWidth:380,width:'100%',margin:'0 auto',padding:'0 16px'}}>
      <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(191,64,191,0.2)',borderRadius:20,padding:'28px 22px'}}>
        <div style={{textAlign:'center',marginBottom:20}}>
          <div style={{width:60,height:60,borderRadius:'50%',margin:'0 auto 10px',background:'linear-gradient(135deg,rgba(191,64,191,0.15),rgba(123,47,255,0.15))',border:'1px solid rgba(191,64,191,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26}}>{isLogin?'🔐':'✨'}</div>
          <h2 style={{fontSize:20,fontWeight:800,color:'#f2f2f7',margin:0}}>{isLogin?'تسجيل الدخول':'حساب جديد'}</h2>
        </div>
        <form onSubmit={handle} style={{display:'flex',flexDirection:'column',gap:10}}>
          {!isLogin&&<input value={name} onChange={e=>setName(e.target.value)} placeholder="الاسم" style={inputStyle}/>}
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="الإيميل" style={inputStyle}/>
          <div style={{position:'relative'}}>
            <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="الباسورد" style={{...inputStyle,paddingRight:44}}/>
            <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#888',fontSize:16}}>{showPass?'🙈':'👁'}</button>
          </div>
          {(localErr||error)&&<p style={{fontSize:12,color:'#ff6b6b',margin:0,textAlign:'center'}}>⚠️ {localErr||error}</p>}
          <button type="submit" disabled={loading} style={{padding:13,borderRadius:14,border:'none',background:'linear-gradient(135deg,#bf40bf,#7b2fff)',color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',opacity:loading?0.6:1}}>{loading?'...':isLogin?'دخول':'تسجيل'}</button>
        </form>
        <button onClick={()=>{setIsLogin(!isLogin);setLocalErr('');}} style={{display:'block',width:'100%',marginTop:14,background:'none',border:'none',color:'#bf40bf',fontSize:12,cursor:'pointer',textDecoration:'underline'}}>{isLogin?'مفيش حساب؟ سجل جديد':'عندك حساب؟ سجل دخول'}</button>
      </div>
    </div>
  );
}

function UserProfile({user,logout}){
  const pts = (user.tshirtsPurchased||0)*25;
  return(
    <div style={{padding:20,borderRadius:18,background:'linear-gradient(135deg,rgba(191,64,191,0.08),rgba(123,47,255,0.06))',border:'1px solid rgba(191,64,191,0.2)',marginBottom:20}}>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
        <div style={{width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg,#bf40bf,#7b2fff)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>👤</div>
        <div style={{flex:1}}>
          <p style={{fontSize:16,fontWeight:700,color:'#f2f2f7',margin:0}}>{user.name}</p>
          <p style={{fontSize:11,color:'#888',margin:'4px 0 0'}}>{user.email}</p>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:16}}>
        <div style={{padding:10,borderRadius:12,background:'rgba(191,64,191,0.1)',border:'1px solid rgba(191,64,191,0.2)',textAlign:'center'}}>
          <p style={{fontSize:9,color:'#bf40bf',margin:0,fontWeight:600}}>النقاط</p>
          <p style={{fontSize:18,fontWeight:800,color:'#f2f2f7',margin:'4px 0 0'}}>{user.points + pts}</p>
        </div>
        <div style={{padding:10,borderRadius:12,background:'rgba(0,255,102,0.1)',border:'1px solid rgba(0,255,102,0.2)',textAlign:'center'}}>
          <p style={{fontSize:9,color:'#00ff66',margin:0,fontWeight:600}}>التيشيرتات</p>
          <p style={{fontSize:18,fontWeight:800,color:'#00ff66',margin:'4px 0 0'}}>{user.tshirtsPurchased||0}</p>
        </div>
        <div style={{padding:10,borderRadius:12,background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.2)',textAlign:'center'}}>
          <p style={{fontSize:9,color:'#f59e0b',margin:0,fontWeight:600}}>لكل تيشيرت</p>
          <p style={{fontSize:18,fontWeight:800,color:'#f59e0b',margin:'4px 0 0'}}>25 🪙</p>
        </div>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:14}}>
        <Link to="/page2" style={{flex:1,padding:10,borderRadius:12,textDecoration:'none',textAlign:'center',background:'rgba(191,64,191,0.1)',border:'1px solid rgba(191,64,191,0.2)',color:'#bf40bf',fontSize:12,fontWeight:700}}>🏆 المسابقة</Link>
        <Link to="/" style={{flex:1,padding:10,borderRadius:12,textDecoration:'none',textAlign:'center',background:'rgba(37,211,102,0.1)',border:'1px solid rgba(37,211,102,0.2)',color:'#25D366',fontSize:12,fontWeight:700}}>🛒 المتجر</Link>
      </div>
      <button onClick={logout} style={{width:'100%',padding:11,borderRadius:12,border:'1px solid rgba(255,100,100,0.3)',background:'rgba(255,100,100,0.08)',color:'#ff6b6b',fontSize:13,fontWeight:700,cursor:'pointer'}}>خروج / Logout</button>
    </div>
  );
}

const SECTIONS=[
  {icon:'📖',title:'إزاي تطلب؟',en:'How to Order',lines:['1️⃣ اختار التيشيرت من المتجر','2️⃣ اختار المحافظة والمقاس','3️⃣ ادخل بياناتك','4️⃣ اختار طريقة الدفع','5️⃣ أكد الطلب وهنتواصل معاك 💬']},
  {icon:'🚚',title:'الشحن والتوصيل',en:'Shipping',lines:['📍 كفر الشيخ: 1-2 يوم عمل','📍 باقي المحافظات: 2-4 أيام','💰 الشحن مشمول في السعر','📦 تغليف محمي بالكامل']},
  {icon:'🔄',title:'الاستبدال والاسترجاع',en:'Returns',lines:['✅ استبدال خلال 3 أيام','✅ المنتج لازم بحالته الأصلية','❌ المطبوعة غير قابلة للإرجاع','📞 تواصل معانا واتساب']},
  {icon:'📋',title:'تتبع طلبك',en:'Track Order',link:'/track-order',lines:['🔍 تابع حالة طلبك من هنا','📱 تحديثات على الواتساب','⏰ مراجعة الطلبات خلال ساعات']},
  {icon:'🛡️',title:'سياسة الخصوصية',en:'Privacy Policy',lines:['🔒 بياناتك محمية بالكامل','📧 لن نشارك بياناتك مع أي طرف تالت','🍪 نستخدم cookies لتحسين التجربة','💾 يمكنك طلب حذف حسابك']},
  {icon:'📜',title:'الشروط والأحكام',en:'Terms & Conditions',lines:['✅ باستخدام الموقع توافق على الشروط','💳 الأسعار شاملة الضريبة والشحن','⏳ العروض محدودة وقابلة للتغيير','🎯 نحتفظ بحق تعديل الأسعار']},
  {icon:'💜',title:'عن VIP Brand',en:'About Us',lines:['👕 براند مصري متخصص Streetwear','🎨 تصاميم حصرية ومميزة','⭐ جودة عالية بأسعار مناسبة','🤝 خدمة عملاء 24/7','📍 كفر الشيخ، مصر 🇪🇬']},
  {icon:'❓',title:'الأسئلة الشائعة',en:'FAQ',link:'/faq',lines:['❓ هل المنتجات أصلية؟ أيوا 100%','❓ هل فيه ضمان؟ أيوا على الطباعة','❓ هل فيه مقاسات كبيرة؟ حتى 3XL','❓ إزاي أتواصل؟ واتساب 01006527185']},
  {icon:'📏',title:'دليل المقاسات',en:'Size Guide',link:'/size-guide',lines:['S — 50-60 كجم','M — 60-75 كجم','L — 75-85 كجم','XL — 85-95 كجم','XXL/3XL — +95 كجم']},
  {icon:'📞',title:'تواصل معانا',en:'Contact Us',lines:['📱 واتساب: 01006527185','⏰ من 10 صباحاً لـ 12 بالليل','💬 رد سريع خلال دقائق']},
  {icon:'🎁',title:'نظام النقاط والمكافآت',en:'Rewards System',lines:['🪙 25 نقطة لكل تيشيرت تشتريه','🏆 100 نقطة = دخول المسابقة','🎰 فرصة ربح تيشيرت مجاني','⭐ كلما تشتري أكتر، تكسب أكتر!']},
  {icon:'💎',title:'عضوية VIP',en:'VIP Membership',lines:['👑 اشتري 3 تيشيرتات = عضو VIP','🔥 خصم 10% على كل طلب جديد','🎯 أول ناس تعرف العروض الجديدة','💜 هدايا حصرية لأعضاء VIP']},
  {icon:'🎨',title:'تصاميمنا',en:'Our Designs',lines:['✏️ كل تصميم حصري ومش متكرر','🖼️ مستوحاة من ثقافة الشارع العالمية','🔥 خامات طباعة عالية الجودة','👕 قطن 100% مصري فاخر']},
  {icon:'⭐',title:'آراء العملاء',en:'Reviews',lines:['⭐⭐⭐⭐⭐ "جودة رهيبة والتوصيل سريع"','⭐⭐⭐⭐⭐ "التصاميم مختلفة ومميزة"','⭐⭐⭐⭐⭐ "أحلى تيشيرت اشتريته"','⭐⭐⭐⭐⭐ "خدمة عملاء ممتازة"']},
  {icon:'🔥',title:'العروض الحالية',en:'Current Offers',lines:['🏷️ خصم على الطلب التاني','📦 شحن مجاني لكفر الشيخ','🎁 هدية مع كل طلب فوق 500 جنيه','⏰ العروض محدودة!']},
  {icon:'👕',title:'العناية بالتيشيرت',en:'Care Instructions',lines:['🧼 غسيل على درجة 30°','🚫 لا تستخدم مبيض','♨️ كوي من الداخل فقط','🌀 غسيل يدوي أفضل للطباعة']},
  {icon:'📦',title:'طرق الدفع',en:'Payment Methods',lines:['💵 كاش عند الاستلام (الأكثر استخداماً)','📱 فودافون كاش — رقم: 01006527185','💳 تحويل بنكي (تواصل واتساب)','✅ الدفع آمن ومضمون 100%']},
  {icon:'🌍',title:'مناطق التوصيل',en:'Delivery Areas',lines:['📍 كفر الشيخ — توصيل سريع 1-2 يوم','📍 القاهرة والجيزة — 2-3 أيام','📍 الإسكندرية والدلتا — 2-3 أيام','📍 الصعيد — 3-4 أيام','📍 كل محافظات مصر ✅']},
  {icon:'🏆',title:'إنجازاتنا',en:'Achievements',lines:['📈 +1000 عميل سعيد','👕 +5000 تيشيرت تم بيعه','⭐ تقييم 4.9 من 5','🇪🇬 أول براند Streetwear مصري']},
  {icon:'💡',title:'نصائح للاختيار',en:'Tips',lines:['📏 قيس نفسك قبل الطلب','🎨 اختار اللون اللي يناسب ستايلك','👕 القطن المصري بيكبر شوية بعد الغسيل','📱 لو محتار تواصل معانا نساعدك']},
];

function InfoCard({s,open,toggle}){
  return(
    <div style={{borderRadius:14,overflow:'hidden',background:'rgba(255,255,255,0.02)',border:`1px solid ${open?'rgba(191,64,191,0.2)':'rgba(255,255,255,0.05)'}`}}>
      <button onClick={toggle} style={{width:'100%',padding:'13px 16px',display:'flex',alignItems:'center',gap:10,background:'none',border:'none',cursor:'pointer',direction:'rtl',textAlign:'right'}}>
        <span style={{fontSize:18,flexShrink:0}}>{s.icon}</span>
        <div style={{flex:1}}>
          <p style={{fontSize:13,fontWeight:700,color:'#f2f2f7',margin:0}}>{s.title}</p>
          <p style={{fontSize:9,color:'#666',margin:'1px 0 0'}}>{s.en}</p>
        </div>
        <span style={{fontSize:11,color:'#bf40bf',transform:open?'rotate(180deg)':'rotate(0)',transition:'transform 0.2s'}}>▼</span>
      </button>
      {open&&(
        <div style={{padding:'0 16px 12px',direction:'rtl'}}>
          <div style={{height:1,background:'rgba(191,64,191,0.08)',marginBottom:8}}/>
          {s.lines.map((l,i)=><p key={i} style={{fontSize:12,color:'#aaa',margin:'5px 0',lineHeight:1.6}}>{l}</p>)}
          {s.link&&<Link to={s.link} style={{display:'inline-block',marginTop:6,padding:'7px 16px',borderRadius:10,background:'rgba(191,64,191,0.1)',border:'1px solid rgba(191,64,191,0.2)',color:'#bf40bf',fontSize:11,fontWeight:700,textDecoration:'none'}}>اضغط هنا ←</Link>}
        </div>
      )}
    </div>
  );
}

export default function SettingsPage(){
  const {user,isLoggedIn,logout}=useUser();
  const [openS,setOpenS]=useState({});
  return(
    <div style={{background:'#050010',minHeight:'100vh',color:'#f2f2f7',fontFamily:"'Inter',sans-serif"}}>
      <header style={{position:'fixed',top:0,left:0,right:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',height:52,background:'rgba(5,0,16,0.92)',borderBottom:'1px solid rgba(191,64,191,0.12)'}}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none',color:'#aaa',fontSize:12}}>← VIP BRAND</Link>
        <span style={{fontSize:10,letterSpacing:'0.2em',color:'#bf40bf',fontWeight:600}}>🔐 ACCOUNT</span>
        <div style={{width:40}}/>
      </header>

      <div style={{paddingTop:62,paddingBottom:100,maxWidth:500,margin:'0 auto',padding:'62px 16px 100px'}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <p style={{fontSize:10,letterSpacing:'0.3em',color:'#bf40bf',textTransform:'uppercase',fontWeight:600}}>🔐 حسابك / YOUR ACCOUNT</p>
          <h1 style={{fontSize:26,fontWeight:900,color:'#f2f2f7',margin:'8px 0'}}>{isLoggedIn?`أهلاً ${user?.name}! 👋`:'سجل الدخول'}</h1>
          <p style={{fontSize:12,color:'#888',margin:'4px 0 0'}}>{isLoggedIn?'إدارة حسابك والنقاط والمكافآت':'سجل دخول أو أنشئ حساب جديد'}</p>
        </div>

        {isLoggedIn?<UserProfile user={user} logout={logout}/>:<AuthForm/>}

        {/* 20 INFO SECTIONS */}
        <div style={{marginTop:24}}>
          <p style={{fontSize:10,letterSpacing:'0.2em',color:'#bf40bf',textTransform:'uppercase',fontWeight:600,marginBottom:12,textAlign:'center'}}>ℹ️ معلومات مهمة / INFO</p>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {SECTIONS.map((s,i)=><InfoCard key={i} s={s} open={!!openS[i]} toggle={()=>setOpenS(p=>({...p,[i]:!p[i]}))}/>)}
          </div>
        </div>

        {/* BRAND FOOTER INFO */}
        <div style={{marginTop:30,padding:20,borderRadius:18,background:'linear-gradient(135deg,rgba(191,64,191,0.06),rgba(123,47,255,0.04))',border:'1px solid rgba(191,64,191,0.12)',textAlign:'center',direction:'rtl'}}>
          <h3 style={{fontSize:18,fontWeight:900,color:'#d966d9',margin:'0 0 8px'}}>💜 VIP Brand</h3>
          <p style={{fontSize:11,color:'#888',lineHeight:1.8,margin:'0 0 12px'}}>
            براند مصري فاخر متخصص في تيشيرتات Streetwear بجودة عالمية.<br/>
            تصاميم حصرية · قطن مصري 100% · شحن لكل مصر<br/>
            خدمة عملاء 24/7 · ضمان جودة الطباعة
          </p>
          <div style={{height:1,background:'rgba(191,64,191,0.1)',margin:'12px 0'}}/>
          <p style={{fontSize:10,color:'#666',margin:'0 0 4px'}}>📍 كفر الشيخ، مصر 🇪🇬</p>
          <p style={{fontSize:10,color:'#666',margin:0}}>📱 01006527185</p>
        </div>

        {/* ANY QUESTION? + WHATSAPP */}
        <div style={{marginTop:20,textAlign:'center',direction:'rtl'}}>
          <div style={{padding:20,borderRadius:18,background:'rgba(37,211,102,0.04)',border:'1px solid rgba(37,211,102,0.15)'}}>
            <p style={{fontSize:20,margin:'0 0 8px'}}>💬</p>
            <h3 style={{fontSize:16,fontWeight:800,color:'#f2f2f7',margin:'0 0 6px'}}>أي استفسار تاني؟</h3>
            <p style={{fontSize:12,color:'#888',margin:'0 0 14px'}}>فريق VIP جاهز يساعدك في أي وقت!</p>
            <a href="https://wa.me/201006527185?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B!%20%D8%B9%D9%86%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 28px',borderRadius:14,background:'#25D366',color:'#fff',fontSize:14,fontWeight:700,textDecoration:'none',boxShadow:'0 4px 16px rgba(37,211,102,0.25)'}}>
              📱 تواصل واتساب
            </a>
          </div>
        </div>

        {/* CTA - مستني طلبك */}
        <div style={{marginTop:20,textAlign:'center',direction:'rtl'}}>
          <div style={{padding:24,borderRadius:18,background:'linear-gradient(135deg,rgba(191,64,191,0.1),rgba(123,47,255,0.08))',border:'1px solid rgba(191,64,191,0.25)',boxShadow:'0 0 30px rgba(191,64,191,0.05)'}}>
            <p style={{fontSize:28,margin:'0 0 8px'}}>🛒</p>
            <h3 style={{fontSize:18,fontWeight:900,color:'#d966d9',margin:'0 0 6px'}}>مش هتدخل تشتري؟!</h3>
            <p style={{fontSize:13,color:'#f2f2f7',margin:'0 0 4px',fontWeight:600}}>يلا بينا... مستنيين طلبك! 🔥</p>
            <p style={{fontSize:11,color:'#888',margin:'0 0 16px'}}>تصاميم حصرية بتستناك في المتجر</p>
            <Link to="/" style={{display:'inline-block',padding:'14px 40px',borderRadius:14,background:'linear-gradient(135deg,#bf40bf,#7b2fff)',color:'#fff',fontSize:15,fontWeight:800,textDecoration:'none',boxShadow:'0 4px 20px rgba(191,64,191,0.3)',letterSpacing:'0.05em'}}>
              🛍️ يلا نتسوق!
            </Link>
          </div>
        </div>

        <div style={{textAlign:'center',marginTop:24,padding:'16px 0'}}>
          <p style={{fontSize:9,color:'rgba(153,153,159,0.25)',margin:0}}>VIP Brand © 2024 — Made with 💜 in Egypt 🇪🇬</p>
        </div>
      </div>
    </div>
  );
}
