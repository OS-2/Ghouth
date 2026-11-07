(function(){
"use strict";
const SB_URL="https://jnaayhdeinqjbzdjyluk.supabase.co";
const SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuYWF5aGRlaW5xamJ6ZGp5bHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNzM5MjEsImV4cCI6MjEwOTY0OTkyMX0.DKM4fe4x16SugvsO1Rcbfn915QRa4Rl_4f4SXn6a-jo";
const sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,detectSessionInUrl:true}});
const DEF={whatsapp:"201019629436",deposit:50,vodafone:"",instapay:"",banner:"",globalDiscount:0,t1:50,t2:65,t3:85,customPrice:0,customNote:""};
const T1=["القاهرة","الجيزة"],T2=["الإسكندرية","القليوبية","الشرقية","الدقهلية","الغربية","المنوفية","البحيرة","الإسماعيلية","بورسعيد","السويس","دمياط","كفر الشيخ"],T3=["الفيوم","بني سويف","المنيا","أسيوط","سوهاج","قنا","الأقصر","أسوان","البحر الأحمر","الوادي الجديد","مطروح","شمال سيناء","جنوب سيناء"];
const GOVS=[...T1.map(n=>({n,t:1})),...T2.map(n=>({n,t:2})),...T3.map(n=>({n,t:3}))];
const STATUS=[["new","جديد"],["deposit","تم استلام العربون"],["prep","جاري التجهيز"],["shipped","تم الشحن"],["done","تم التسليم"],["cancel","ملغي"]];
const SLABEL=Object.fromEntries(STATUS);
const PAY={cod:"الدفع عند الاستلام (مع العربون)",vodafone:"فودافون كاش",instapay:"إنستاباي"};
const FONTS_AR=[["Reem Kufi","ريم كوفي"],["Aref Ruqaa","عارف رقعة"],["Amiri","أميري"],["Lalezar","لالزار"],["Cairo","القاهرة"],["Tajawal","تجوّل"],["Marhey","مرحي"],["El Messiri","المسيري"],["Changa","شانجا"],["Lemonada","ليمونادا"],["Katibeh","كتيبة"],["Rakkas","رقاص"],["Noto Naskh Arabic","نسخ"],["Noto Kufi Arabic","كوفي"],["Almarai","المراعي"],["Mada","مدى"],["Harmattan","هرمتان"],["Scheherazade New","شهرزاد"]];
const FONTS_EN=[["Pacifico","Pacifico"],["Dancing Script","Dancing Script"],["Great Vibes","Great Vibes"],["Lobster","Lobster"],["Playfair Display","Playfair"],["Bebas Neue","BEBAS"],["Oswald","Oswald"],["Montserrat","Montserrat"],["Satisfy","Satisfy"],["Sacramento","Sacramento"],["Caveat","Caveat"],["Righteous","Righteous"],["Permanent Marker","Marker"],["Orbitron","Orbitron"],["Abril Fatface","Abril"],["Courgette","Courgette"]];
const S={cats:[],products:[],models:[],settings:{...DEF},loaded:false,error:"",cart:[],fav:[],q:"",sort:"new",coupon:null,gov:"",form:{pay:"cod"},last:null,pi:0,
  admin:{session:null,isAdmin:false,checked:false,tab:"orders",orders:[],coupons:[],ed:null,cedit:null,confirm:null,filter:"all",msg:"",sent:false,mq:""},
  dz:{brand:"",model:"",text:"",font:"Reem Kufi",color:"#f4ecd6",tsize:64,imgs:null,img:null,file:null,scale:1,ox:0,oy:0,tx:300,ty:980,mode:"img",bg:"#0b4448",busy:false,err:""}};
try{S.cart=JSON.parse(localStorage.getItem("ghouth-cart")||"[]")}catch(e){}
try{S.fav=JSON.parse(localStorage.getItem("ghouth-fav")||"[]")}catch(e){}
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>Number(n||0).toLocaleString("en-US")+" ج.م";
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let tt;function toast(m){const t=$("#toast");t.innerHTML="<span>"+esc(m)+"</span>";clearTimeout(tt);tt=setTimeout(()=>t.innerHTML="",2600)}
const rid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);

/* ---------- helpers ---------- */
const kids=id=>S.cats.filter(c=>(c.parent_id||null)===(id||null)).sort((a,b)=>a.sort-b.sort);
const cat=id=>S.cats.find(c=>c.id===id);
function descIds(id){const out=[id];kids(id).forEach(k=>out.push(...descIds(k.id)));return out}
function pathOf(id){const p=[];let c=cat(id);while(c){p.unshift(c);c=cat(c.parent_id)}return p}
const disc=p=>Math.max(+p.discount_pct||0,+S.settings.globalDiscount||0);
const price=p=>Math.round((+p.price||0)*(1-disc(p)/100));
const inStock=p=>p.stock==null||+p.stock>0;
function ph(p){const g=/هد|بوكس|ميدال/.test((cat(p.category_id)||{}).name||p.name||"");const h=[...(p.name||"x")].reduce((a,c)=>a+c.charCodeAt(0),0)%4;const tint=["#0b4a4d","#0e5a52","#12474f","#1a4a3a"][h];
 const icon=g?'<rect x="34" y="64" width="92" height="64" rx="6"/><rect x="28" y="48" width="104" height="18" rx="5"/><path d="M80 48v80"/><path d="M80 48c-12-20-34-14-26-2 4 5 16 4 26 2zM80 48c12-20 34-14 26-2-4 5-16 4-26 2z"/>':'<rect x="46" y="22" width="68" height="116" rx="16"/><rect x="56" y="32" width="30" height="30" rx="8"/><circle cx="65" cy="41" r="4"/><circle cx="77" cy="53" r="4"/>';
 return "data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="'+tint+'"/><g fill="none" stroke="#e6c36a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'+icon+'</g></svg>')}
const img0=p=>(p.images&&p.images[0])||ph(p);
const wa=m=>"https://wa.me/"+String(S.settings.whatsapp||DEF.whatsapp).replace(/\D/g,"")+(m?"?text="+encodeURIComponent(m):"");
const isFav=id=>S.fav.includes(id);
const brands=()=>[...new Set(S.models.map(m=>m.brand))];
const modelsOf=b=>S.models.filter(m=>m.brand===b).map(m=>m.model);
const heart='<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.7a4.2 4.2 0 0 1 7.5 2.5c0 5.7-7.5 10.3-7.5 10.3z"/></svg>';
const customPrice=()=>+S.settings.customPrice||0;
function calc(){const items=S.cart.map((c,i)=>{if(c.type==="custom")return{c,i,custom:true,unit:customPrice()};const p=S.products.find(x=>x.id===c.pid);return p?{c,i,p,unit:price(p)}:null}).filter(Boolean);
 const sub=items.reduce((a,x)=>a+x.unit*x.c.qty,0);const cd=S.coupon?Math.round(sub*S.coupon.pct/100):0;
 const g=GOVS.find(x=>x.n===S.gov);const ship=g?(+S.settings["t"+g.t]||0):0;const total=sub-cd+ship;const dep=Math.round(total*(+S.settings.deposit||0)/100);return{items,sub,cd,ship,total,dep,g}}
const cartCount=()=>S.cart.reduce((a,c)=>a+c.qty,0);

/* ---------- chrome / drawer / search ---------- */
function chrome(){const n=cartCount();const cn=$("#cartN");cn.hidden=!n;cn.textContent=n;const fn=$("#favN");fn.hidden=!S.fav.length;fn.textContent=S.fav.length;
 const b=$("#bar");b.hidden=!S.settings.banner;b.textContent=S.settings.banner||"";$("#fwa").textContent="+"+String(S.settings.whatsapp||"").replace(/\D/g,"");drawDrawer()}
function drawDrawer(){const d=$("#drawer");
 const tree=kids(null).map(c=>{const k=kids(c.id);return k.length?`<details><summary>${esc(c.name)}<span class="gold">▾</span></summary><div class="sub"><a href="#c-${c.id}" data-close>كل ${esc(c.name)}</a>${k.map(x=>`<a href="#c-${x.id}" data-close>${esc(x.name)}</a>`).join("")}</div></details>`:`<a href="#c-${c.id}" data-close>${esc(c.name)}</a>`}).join("");
 d.innerHTML=`<div class="drawer-top"><span class="logo-name">غَوْث</span><button class="ib" data-act="closeMenu" aria-label="إغلاق"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
 <a href="#home" data-close>الصفحة الرئيسية</a>
 <a href="#design" data-close class="gold">صمّم جرابك</a>
 <details><summary>الأقسام<span class="gold">▾</span></summary><div class="sub">${tree||'<a>لا توجد أقسام بعد</a>'}</div></details>
 <a href="#fav" data-close>المفضلة <span class="tag">${S.fav.length}</span></a>
 <a href="#cart" data-close>السلة <span class="tag">${cartCount()}</span></a>
 <a href="#track" data-close>تتبّع طلبك</a>
 <a href="${esc(wa("أهلاً غَوْث، عندي استفسار"))}" target="_blank" rel="noopener">تواصل معنا (واتساب)</a>`}
function openMenu(){$("#drawer").classList.add("open");$("#drawer").setAttribute("aria-hidden","false");$("#ov").hidden=false}
function closeMenu(){$("#drawer").classList.remove("open");$("#drawer").setAttribute("aria-hidden","true");$("#ov").hidden=true}
function openSearch(){$("#sov").hidden=false;$("#sq").focus();drawSearch()}
function closeSearch(){$("#sov").hidden=true}
function drawSearch(){const q=($("#sq").value||"").trim();const el=$("#sres");
 if(!q){el.innerHTML='<div class="empty"><p>اكتب اسم المنتج أو القسم.</p></div>';return}
 const r=S.products.filter(p=>p.active&&((p.name+" "+(p.description||"")+" "+((cat(p.category_id)||{}).name||"")).includes(q))).slice(0,30);
 el.innerHTML=r.length?r.map(p=>`<a class="sres" href="#p-${p.id}" data-closeS><img src="${esc(img0(p))}" alt=""><div><div>${esc(p.name)}</div><b class="pr" style="color:var(--accent-text)">${fmt(price(p))}</b></div></a>`).join(""):'<div class="empty"><h3>مفيش نتائج</h3>جرّب كلمة تانية.</div>'}

/* ---------- shop views ---------- */
function cardH(p){const d=disc(p),out=!inStock(p);
 return `<article class="card"><button class="fav ${isFav(p.id)?"on":""}" data-act="fav" data-id="${p.id}" aria-label="مفضلة">${heart}</button><a class="card-img" href="#p-${p.id}"><img src="${esc(img0(p))}" alt="${esc(p.name)}" loading="lazy">${d?`<span class="badge">خصم ${d}%</span>`:""}${out?'<span class="badge out">نفدت الكمية</span>':""}</a>
 <div class="card-b"><a class="card-t" href="#p-${p.id}">${esc(p.name)}</a><div class="pr"><b>${fmt(price(p))}</b>${d?`<s>${fmt(p.price)}</s>`:""}</div>
 <button class="btn sm" data-act="quick" data-id="${p.id}" ${out?"disabled":""}>${p.needs_phone||(p.options||[]).length?"اختر الموديل":"أضف للسلة"}</button></div></article>`}
function sortList(l){const s=S.sort;return l.slice().sort((a,b)=>s==="low"?price(a)-price(b):s==="high"?price(b)-price(a):s==="off"?disc(b)-disc(a):new Date(b.created_at)-new Date(a.created_at))}
function toolbar(){return `<div class="toolbar"><select id="sort" aria-label="الترتيب"><option value="new">الأحدث</option><option value="low">الأقل سعرًا</option><option value="high">الأعلى سعرًا</option><option value="off">الأعلى خصمًا</option></select></div>`}
function loading(){return S.error?`<div class="wrap"><div class="empty"><h3>تعذّر تحميل المتجر</h3><p>${esc(S.error)}</p><button class="btn" data-act="reload">إعادة المحاولة</button></div></div>`:`<div class="wrap"><div class="empty">جاري التحميل…</div></div>`}
function viewHome(){if(!S.loaded){$("#app").innerHTML=loading();return}
 const top=kids(null);const latest=sortList(S.products.filter(p=>p.active)).slice(0,12);
 $("#app").innerHTML=`<section class="hero"><div class="wrap"><div><h1>جرابات موبايل وهدايا مختارة بعناية</h1><p>اطلب من الموقع، حوّل العربون، وأوردرك يوصلك لحد باب البيت في كل المحافظات.</p><div class="row"><a class="btn" href="#design">صمّم جرابك</a><a class="btn ghost" href="#all">كل المنتجات</a></div></div><img class="hero-img" src="logo.jpg" alt="شعار غَوْث"></div></section>
 <div class="wrap"><div class="trust"><div><b>العربون يثبّت طلبك</b>نسبة بسيطة قبل التجهيز والباقي عند الاستلام</div><div><b>شحن لكل المحافظات</b>سعر واحد للطلب كله</div><div><b>3 طرق دفع</b>عند الاستلام، فودافون كاش، إنستاباي</div></div>
 ${top.length?`<div class="sec-h"><h2>الأقسام</h2></div><div class="tiles">${top.map(c=>`<a class="tile" href="#c-${c.id}"><b>${esc(c.name)}</b><span>${kids(c.id).length?kids(c.id).length+" أقسام فرعية":"تصفّح"}</span></a>`).join("")}<a class="tile" href="#design" style="border-color:var(--gold)"><b style="color:var(--accent-text)">صمّم جرابك</b><span>صورتك واسمك</span></a></div>`:""}
 <div class="sec-h"><h2>أحدث المنتجات</h2><a class="muted" href="#all">عرض الكل ←</a></div>
 ${toolbar()}<div class="grid" id="grid">${latest.length?latest.map(cardH).join(""):'<div class="empty" style="grid-column:1/-1"><h3>المنتجات جاية قريب</h3>تابعنا على واتساب.</div>'}</div></div>`;
 const s=$("#sort");if(s)s.value=S.sort}
function viewCat(id){if(!S.loaded){$("#app").innerHTML=loading();return}
 const all=id==="all";const c=all?null:cat(id);if(!all&&!c){$("#app").innerHTML='<div class="wrap"><div class="empty"><h3>القسم ده مش موجود</h3><a class="btn" href="#home">الرئيسية</a></div></div>';return}
 const ids=all?null:descIds(id);const list=sortList(S.products.filter(p=>p.active&&(all||ids.includes(p.category_id))));
 const crumbs=all?"كل المنتجات":pathOf(id).map((x,i,a)=>i<a.length-1?`<a href="#c-${x.id}">${esc(x.name)}</a>`:esc(x.name)).join(" ‹ ");
 const sub=all?kids(null):kids(id);
 $("#app").innerHTML=`<div class="wrap"><span class="crumb"><a href="#home">الرئيسية</a> ‹ ${crumbs}</span><h1 style="font-size:26px;padding-top:6px">${all?"كل المنتجات":esc(c.name)}</h1>
 ${sub.length?`<div class="chips">${sub.map(x=>`<a class="chip" href="#c-${x.id}">${esc(x.name)}</a>`).join("")}</div>`:""}
 ${toolbar()}<div class="grid">${list.length?list.map(cardH).join(""):'<div class="empty" style="grid-column:1/-1"><h3>مفيش منتجات في القسم ده لسه</h3>جرّب قسم تاني.</div>'}</div></div>`;
 $("#sort").value=S.sort}
function viewFav(){if(!S.loaded){$("#app").innerHTML=loading();return}
 const list=S.products.filter(p=>p.active&&isFav(p.id));
 $("#app").innerHTML=`<div class="wrap"><h1 style="font-size:26px;padding-top:20px">المفضلة</h1><div class="grid">${list.length?list.map(cardH).join(""):'<div class="empty" style="grid-column:1/-1"><h3>لسه مختارتش حاجة</h3>اضغط على القلب في أي منتج وهتلاقيه هنا.<p><a class="btn" href="#all">تصفّح المنتجات</a></p></div>'}</div></div>`}
function phoneSel(prefix,b,m){const bl=brands();return `<div class="two form" style="grid-template-columns:1fr 1fr;gap:10px"><label>الماركة<select id="${prefix}-brand"><option value="">اختر</option>${bl.map(x=>`<option ${x===b?"selected":""}>${esc(x)}</option>`).join("")}</select></label><label>الموديل<select id="${prefix}-model"><option value="">اختر الماركة أولاً</option>${(b?modelsOf(b):[]).map(x=>`<option ${x===m?"selected":""}>${esc(x)}</option>`).join("")}</select></label></div>`}
function viewProduct(id){if(!S.loaded){$("#app").innerHTML=loading();return}
 const p=S.products.find(x=>x.id===id);if(!p){$("#app").innerHTML='<div class="wrap"><div class="empty"><h3>المنتج ده مش موجود</h3><a class="btn" href="#home">رجوع للمتجر</a></div></div>';return}
 const imgs=(p.images&&p.images.length)?p.images:[ph(p)];if(S.pi>=imgs.length)S.pi=0;const d=disc(p),out=!inStock(p);const path=pathOf(p.category_id);
 $("#app").innerHTML=`<div class="wrap"><span class="crumb"><a href="#home">الرئيسية</a>${path.map(x=>` ‹ <a href="#c-${x.id}">${esc(x.name)}</a>`).join("")}</span><div class="pdp">
 <div><img class="pdp-main" src="${esc(imgs[S.pi])}" alt="${esc(p.name)}"><div class="thumbs">${imgs.length>1?imgs.map((u,i)=>`<img src="${esc(u)}" alt="" class="${i===S.pi?"on":""}" data-act="thumb" data-i="${i}">`).join(""):""}</div></div>
 <div class="form"><h1>${esc(p.name)}</h1><div class="pr"><b>${fmt(price(p))}</b>${d?`<s>${fmt(p.price)}</s> <span class="badge" style="position:static">وفّر ${d}%</span>`:""}</div>
 <p class="muted" style="margin:0">${esc(p.description||"")}</p>${p.stock!=null&&+p.stock>0&&+p.stock<=5?`<div style="color:var(--danger)">باقي ${p.stock} فقط</div>`:""}
 ${p.needs_phone?phoneSel("pp","",""):""}
 ${(p.options||[]).length?`<label>الاختيار<select id="opt">${p.options.map(o=>`<option>${esc(o)}</option>`).join("")}</select></label>`:""}
 <div class="err" id="perr"></div>
 <div class="row"><div class="qty"><button data-act="pq" data-d="-1" aria-label="أقل">−</button><span id="pq">1</span><button data-act="pq" data-d="1" aria-label="أكتر">+</button></div><button class="btn" data-act="addpdp" data-id="${p.id}" ${out?"disabled":""}>${out?"نفدت الكمية":"أضف للسلة"}</button><button class="btn ghost ${isFav(p.id)?"on":""}" data-act="fav" data-id="${p.id}">♡ مفضلة</button></div>
 <a class="btn ghost" target="_blank" rel="noopener" href="${esc(wa("عاوز أسأل عن: "+p.name))}">اسأل على واتساب</a></div></div></div>`}
function addCart(item){const k=S.cart.find(c=>c.type==="product"&&item.type==="product"&&c.pid===item.pid&&c.opt===item.opt);k?k.qty+=item.qty:S.cart.push(item);save("ghouth-cart",S.cart);chrome();toast("اتضاف للسلة")}

/* ---------- cart / checkout ---------- */
function itemLabel(c){if(c.type==="custom")return `تصميم خاص — ${c.brand} ${c.model}${c.text?" — "+c.text:""}`;const p=S.products.find(x=>x.id===c.pid);return (p?p.name:"منتج")+(c.opt?" — "+c.opt:"")}
function viewCart(){if(!S.loaded){$("#app").innerHTML=loading();return}const o=calc();
 if(!o.items.length){$("#app").innerHTML='<div class="wrap"><div class="empty"><h3>السلة فاضية</h3><p>ضيف جرابات أو هدايا وارجع هنا تكمّل الطلب.</p><a class="btn" href="#all">تصفّح المنتجات</a> <a class="btn ghost" href="#design">صمّم جرابك</a></div></div>';return}
 const f=S.form;
 $("#app").innerHTML=`<div class="wrap"><div class="cart-grid"><div class="panel"><h2>سلة المشتريات</h2><div id="items"></div></div>
 <div class="panel"><h2>بيانات الطلب</h2><div class="form">
 <label>الاسم<input id="f-name" autocomplete="name" value="${esc(f.name)}"></label>
 <label>رقم الموبايل<input id="f-phone" inputmode="tel" autocomplete="tel" placeholder="01xxxxxxxxx" value="${esc(f.phone)}"></label>
 <label>المحافظة<select id="f-gov"><option value="">اختر المحافظة</option>${GOVS.map(g=>`<option ${S.gov===g.n?"selected":""}>${g.n}</option>`).join("")}</select></label>
 <label>العنوان بالتفصيل<textarea id="f-addr" rows="2">${esc(f.addr)}</textarea></label>
 <label>ملاحظات (اختياري)<input id="f-note" value="${esc(f.note)}"></label>
 <div class="row"><input id="coupon" style="flex:1 1 140px;width:auto" placeholder="كود الخصم" value="${esc(S.coupon?S.coupon.code:"")}"><button class="btn ghost" data-act="coupon">تطبيق</button></div><div class="err" id="cerr"></div>
 <div><div class="muted" style="margin-bottom:6px">طريقة الدفع</div><div class="form" style="gap:8px">${Object.entries(PAY).map(([k,l])=>`<label class="radio"><input type="radio" name="pay" value="${k}" ${f.pay===k?"checked":""}>${l}</label>`).join("")}</div></div>
 <div id="sum"></div><div id="depo"></div><div class="err" id="err"></div><button class="btn" id="placeBtn" data-act="place">تأكيد الطلب</button></div></div></div></div>`;
 drawItems();drawSum()}
function drawItems(){const o=calc();const el=$("#items");if(!el)return;
 el.innerHTML=o.items.map(x=>{const c=x.c;const im=x.custom?(c.preview||ph({name:"x"})):img0(x.p);return `<div class="item"><img src="${esc(im)}" alt=""><div class="t"><b>${esc(itemLabel(c))}</b><span class="muted">${fmt(x.unit)}${x.custom&&!x.unit?" (السعر يتحدد بعد المراجعة)":""}</span><div class="row" style="margin-top:4px"><div class="qty"><button data-act="cq" data-i="${x.i}" data-d="-1" aria-label="أقل">−</button><span>${c.qty}</span><button data-act="cq" data-i="${x.i}" data-d="1" aria-label="أكتر">+</button></div><button class="chip" data-act="rm" data-i="${x.i}">حذف</button></div></div><b style="font-variant-numeric:tabular-nums">${fmt(x.unit*c.qty)}</b></div>`}).join("")}
function payHow(){const s=S.settings,m=S.form.pay;const num=m==="vodafone"?s.vodafone:m==="instapay"?s.instapay:"";
 if(m==="cod")return "حوّل العربون على فودافون كاش"+(s.vodafone?" ("+esc(s.vodafone)+")":"")+" أو إنستاباي"+(s.instapay?" ("+esc(s.instapay)+")":"")+"، والباقي تدفعه للمندوب عند الاستلام.";
 return (num?"حوّل على: <b class='sel'>"+esc(num)+"</b>. ":"هنبعتلك رقم التحويل على واتساب. ")+"تقدر تحوّل العربون بس أو المبلغ كامل."}
function drawSum(){const o=calc();const s=$("#sum");if(!s)return;
 s.innerHTML=`<div class="sum"><div><span>المنتجات</span><span>${fmt(o.sub)}</span></div>${o.cd?`<div><span>خصم الكود (${esc(S.coupon.code)})</span><span>−${fmt(o.cd)}</span></div>`:""}<div><span>الشحن (سعر واحد للطلب)</span><span>${o.g?fmt(o.ship):"يتحدد بالمحافظة"}</span></div><div class="tot"><span>الإجمالي</span><span>${fmt(o.total)}</span></div></div>`;
 $("#depo").innerHTML=`<div class="note"><b>العربون مطلوب قبل ما الطلب يتأكد:</b> ${+S.settings.deposit||0}% من الإجمالي = <b>${fmt(o.dep)}</b>. الأوردر بيتجهّز بعد وصول العربون.<br>${payHow()}<br>ابعت صورة التحويل على واتساب بعد التأكيد. المتبقي: ${fmt(o.total-o.dep)}.</div>`}
function readForm(){const g=id=>($("#"+id)||{}).value;if(!$("#f-name"))return;Object.assign(S.form,{name:g("f-name"),phone:g("f-phone"),addr:g("f-addr"),note:g("f-note")});S.gov=g("f-gov")}
async function place(){readForm();const f=S.form,e=$("#err"),btn=$("#placeBtn");const ph0=String(f.phone||"").replace(/[\s+\-]/g,"").replace(/^20/,"0");
 if(!(f.name||"").trim())return e.textContent="اكتب اسمك من فضلك.";
 if(!/^01[0125]\d{8}$/.test(ph0))return e.textContent="رقم الموبايل لازم يكون 11 رقم ويبدأ بـ 01.";
 if(!S.gov)return e.textContent="اختر المحافظة.";if(!(f.addr||"").trim())return e.textContent="اكتب العنوان بالتفصيل.";
 e.textContent="";btn.disabled=true;btn.textContent="جاري إرسال الطلب…";
 const items=S.cart.map(c=>c.type==="custom"?{type:"custom",brand:c.brand,model:c.model,text:c.text,font:c.font,preview:c.preview,original:c.original,qty:c.qty}:{type:"product",pid:c.pid,opt:c.opt||"",qty:c.qty});
 const {data,error}=await sb.rpc("place_order",{p:{name:f.name.trim(),phone:ph0,gov:S.gov,addr:f.addr.trim(),note:(f.note||"").trim(),pay:f.pay,coupon:S.coupon?S.coupon.code:"",items}});
 btn.disabled=false;btn.textContent="تأكيد الطلب";
 if(error){const m=error.message||"";e.textContent=m.includes("out_of_stock")?"الكمية المتاحة من "+m.split("out_of_stock:")[1]+" مش كفاية. قلّل الكمية أو شيله من السلة.":m.includes("product_missing")?"فيه منتج في السلة مبقاش متاح. احذفه وكمّل.":"تعذّر إرسال الطلب. جرّب تاني أو كلمنا على واتساب.";if(m.includes("out_of_stock")||m.includes("product_missing"))loadData();return}
 S.last=Object.assign({},data,{name:f.name.trim(),phone:ph0,gov:S.gov,addr:f.addr.trim(),note:(f.note||"").trim(),pay:f.pay});S.cart=[];S.coupon=null;save("ghouth-cart",S.cart);chrome();loadData();location.hash="done"}
function viewDone(){const o=S.last;if(!o){location.hash="home";return}
 const lines=o.items.map(i=>"- "+(i.type==="custom"?"تصميم خاص: "+i.brand+" "+i.model+(i.text?" | الاسم: "+i.text:"")+(i.font?" | الخط: "+i.font:"")+(i.preview?"\nمعاينة: "+i.preview:""):i.name+(i.opt?" ("+i.opt+")":""))+" × "+i.qty+" = "+fmt(i.price*i.qty));
 const msg=["طلب جديد من متجر غَوْث","رقم الطلب: "+o.id,"الاسم: "+o.name,"الموبايل: "+o.phone,"المحافظة: "+o.gov,"العنوان: "+o.addr,o.note?"ملاحظات: "+o.note:null,"","المنتجات:",...lines,"",o.coupon?"كود الخصم: "+o.coupon+" (−"+fmt(o.cd)+")":null,"الشحن: "+fmt(o.ship),"الإجمالي: "+fmt(o.total),"العربون المطلوب: "+fmt(o.dep),"طريقة الدفع: "+PAY[o.pay]].filter(x=>x!==null).join("\n");
 const s=S.settings;const how=o.pay==="vodafone"?(s.vodafone?"فودافون كاش: <b class='sel'>"+esc(s.vodafone)+"</b>":"هنبعتلك رقم فودافون كاش على واتساب."):o.pay==="instapay"?(s.instapay?"إنستاباي: <b class='sel'>"+esc(s.instapay)+"</b>":"هنبعتلك بيانات إنستاباي على واتساب."):"العربون على فودافون كاش"+(s.vodafone?" <b class='sel'>"+esc(s.vodafone)+"</b>":"")+" أو إنستاباي"+(s.instapay?" <b class='sel'>"+esc(s.instapay)+"</b>":"")+".";
 $("#app").innerHTML=`<div class="wrap"><div class="empty" style="max-width:560px;margin:auto"><h2 style="color:var(--accent-text)">وصلنا طلبك يا ${esc(o.name.split(" ")[0])}</h2><p>رقم الطلب <b class="sel">${esc(o.id)}</b> (احتفظ به لتتبّع الطلب)</p>
 <div class="note" style="text-align:start;margin:14px 0"><b>خطوة أخيرة لتأكيد الطلب:</b> حوّل العربون <b>${fmt(o.dep)}</b> وابعت صورة التحويل على واتساب. الأوردر بيتجهّز بعد وصول العربون، والباقي ${fmt(o.total-o.dep)}.<br>${how}</div>
 <a class="btn" target="_blank" rel="noopener" href="${esc(wa(msg))}">ابعت صورة التحويل على واتساب</a> <a class="btn ghost" href="#home">كمّل تسوّق</a></div></div>`}
function viewTrack(){$("#app").innerHTML=`<div class="wrap" style="max-width:520px"><div class="panel" style="margin-top:20px"><h2>تتبّع طلبك</h2><div class="form"><label>رقم الطلب<input id="t-id" placeholder="GH-XXXXXX" autocapitalize="characters"></label><label>رقم الموبايل<input id="t-ph" inputmode="tel" placeholder="01xxxxxxxxx"></label><button class="btn" data-act="track">تتبّع</button><div id="t-res" class="err"></div></div></div></div>`}

/* ---------- design studio ---------- */
const W=600,H=1200;
function viewDesign(){const d=S.dz;
 $("#app").innerHTML=`<div class="wrap"><h1 style="font-size:26px;padding-top:20px">صمّم جرابك</h1><p class="muted" style="margin:4px 0 0">ارفع صورتك، اكتب اسمك، واختار الخط. السعر: <b style="color:var(--accent-text)">${customPrice()?fmt(customPrice()):"يتحدد بعد مراجعة التصميم"}</b></p>
 <div class="studio"><div class="stage"><canvas id="cv" width="${W}" height="${H}" aria-label="معاينة الجراب"></canvas><span class="muted" style="font-size:13px">اسحب بإصبعك لتحريك ${d.mode==="img"?"الصورة":"الاسم"}</span></div>
 <div class="form">
 <div class="step"><h3>١. نوع التليفون</h3>${phoneSel("dz",d.brand,d.model)}</div>
 <div class="step"><h3>٢. صورتك</h3><input id="dz-file" type="file" accept="image/*"><div class="row"><label class="row muted">تكبير<input id="dz-scale" type="range" min="0.3" max="3" step="0.02" value="${d.scale}" style="width:160px"></label><label class="row muted">لون الخلفية<input id="dz-bg" type="color" value="${d.bg}" style="width:56px"></label></div></div>
 <div class="step"><h3>٣. الاسم والخط</h3><input id="dz-text" placeholder="اكتب الاسم (عربي أو إنجليزي)" maxlength="30" value="${esc(d.text)}">
 <div class="muted">خطوط عربية</div><div class="fonts">${FONTS_AR.map(([f,l])=>`<button class="fbtn ${d.font===f?"on":""}" style="font-family:'${f}'" data-act="font" data-f="${esc(f)}">${esc(l)}</button>`).join("")}</div>
 <div class="muted">خطوط إنجليزية</div><div class="fonts">${FONTS_EN.map(([f,l])=>`<button class="fbtn ${d.font===f?"on":""}" style="font-family:'${f}'" data-act="font" data-f="${esc(f)}">${esc(l)}</button>`).join("")}</div>
 <div class="row"><label class="row muted">اللون<input id="dz-color" type="color" value="${d.color}" style="width:56px"></label><label class="row muted">الحجم<input id="dz-size" type="range" min="28" max="140" value="${d.tsize}" style="width:140px"></label></div>
 <div class="row"><span class="muted">اسحب:</span><label class="radio"><input type="radio" name="dzm" value="img" ${d.mode==="img"?"checked":""}>الصورة</label><label class="radio"><input type="radio" name="dzm" value="txt" ${d.mode==="txt"?"checked":""}>الاسم</label></div></div>
 <div class="err" id="dz-err">${esc(d.err)}</div>
 <button class="btn" id="dz-add" data-act="dzadd" ${d.busy?"disabled":""}>${d.busy?"جاري رفع التصميم…":"أضف التصميم للسلة"}</button></div></div></div>`;
 drawCase()}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function paintCase(c,hideGuides){const d=S.dz;c.clearRect(0,0,W,H);c.save();rr(c,10,10,W-20,H-20,90);c.clip();c.fillStyle=d.bg;c.fillRect(0,0,W,H);
 if(d.img){const iw=d.img.width,ih=d.img.height;const base=Math.max(W/iw,H/ih);const s=base*d.scale;const w=iw*s,h=ih*s;c.drawImage(d.img,(W-w)/2+d.ox,(H-h)/2+d.oy,w,h)}
 if(d.text){c.fillStyle=d.color;c.textAlign="center";c.textBaseline="middle";c.font=`${d.tsize}px '${d.font}', sans-serif`;c.shadowColor="rgba(0,0,0,.45)";c.shadowBlur=8;c.fillText(d.text,d.tx,d.ty,W-90);c.shadowBlur=0}
 c.restore();
 c.fillStyle="#0e0e0e";rr(c,44,44,210,210,52);c.fill();c.strokeStyle="#3a3a3a";c.lineWidth=4;c.stroke();
 [[110,110],[190,110],[150,190]].forEach(([x,y])=>{c.fillStyle="#1d1d1d";c.beginPath();c.arc(x,y,32,0,7);c.fill();c.strokeStyle="#555";c.lineWidth=3;c.stroke();c.fillStyle="#08080a";c.beginPath();c.arc(x,y,17,0,7);c.fill()});
 c.strokeStyle="#c9a94f";c.lineWidth=5;rr(c,10,10,W-20,H-20,90);c.stroke()}
function drawCase(){const cv=$("#cv");if(!cv)return;paintCase(cv.getContext("2d"))}
function bindCanvas(){const cv=$("#cv");if(!cv)return;let last=null;
 cv.onpointerdown=e=>{last={x:e.clientX,y:e.clientY};cv.setPointerCapture(e.pointerId);cv.style.cursor="grabbing"};
 cv.onpointermove=e=>{if(!last)return;const k=W/cv.getBoundingClientRect().width;const dx=(e.clientX-last.x)*k,dy=(e.clientY-last.y)*k;last={x:e.clientX,y:e.clientY};const d=S.dz;if(d.mode==="img"){d.ox+=dx;d.oy+=dy}else{d.tx+=dx;d.ty+=dy}drawCase()};
 cv.onpointerup=cv.onpointercancel=()=>{last=null;cv.style.cursor="grab"}}
async function shrinkFile(file,max,type,q){const bm=await createImageBitmap(file);const k=Math.min(1,max/Math.max(bm.width,bm.height));const c=document.createElement("canvas");c.width=Math.round(bm.width*k);c.height=Math.round(bm.height*k);c.getContext("2d").drawImage(bm,0,0,c.width,c.height);return new Promise(r=>c.toBlob(r,type||"image/jpeg",q||.86))}
async function loadDzImage(file){const bm=await createImageBitmap(file);const k=Math.min(1,1800/Math.max(bm.width,bm.height));const c=document.createElement("canvas");c.width=Math.round(bm.width*k);c.height=Math.round(bm.height*k);c.getContext("2d").drawImage(bm,0,0,c.width,c.height);S.dz.img=c;S.dz.file=file;S.dz.scale=1;S.dz.ox=0;S.dz.oy=0;const sc=$("#dz-scale");if(sc)sc.value=1;drawCase()}
async function upload(bucket,blob,ext){const path=rid()+"."+ext;const {error}=await sb.storage.from(bucket).upload(path,blob,{contentType:blob.type,upsert:false});if(error)throw error;return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl}
async function dzAdd(){const d=S.dz;const er=$("#dz-err");
 if(!d.brand||!d.model)return er.textContent="اختار ماركة التليفون وموديله.";
 if(!d.img&&!d.text)return er.textContent="ارفع صورة أو اكتب اسم.";
 er.textContent="";d.busy=true;$("#dz-add").disabled=true;$("#dz-add").textContent="جاري رفع التصميم…";
 try{await document.fonts.load(`40px '${d.font}'`,d.text||"Aa");drawCase();
  const pv=document.createElement("canvas");pv.width=W/2;pv.height=H/2;const pc=pv.getContext("2d");const full=document.createElement("canvas");full.width=W;full.height=H;paintCase(full.getContext("2d"));pc.drawImage(full,0,0,W/2,H/2);
  const prevBlob=await new Promise(r=>pv.toBlob(r,"image/png"));const preview=await upload("designs",prevBlob,"png");
  let original="";if(d.file){const ob=await shrinkFile(d.file,2400,"image/jpeg",.9);original=await upload("designs",ob,"jpg")}
  S.cart.push({type:"custom",brand:d.brand,model:d.model,text:d.text,font:d.font,preview,original,qty:1});save("ghouth-cart",S.cart);chrome();d.busy=false;toast("اتضاف التصميم للسلة");location.hash="cart"
 }catch(e){d.busy=false;d.err="تعذّر رفع التصميم. جرّب صورة أصغر أو اتصل بنا.";viewDesign()}}

/* ---------- admin ---------- */
const A=()=>S.admin;
async function checkAdmin(){const {data}=await sb.auth.getSession();A().session=data.session;A().isAdmin=false;
 if(data.session){const r=await sb.rpc("is_admin");A().isAdmin=r.data===true}A().checked=true;$("#adminLink").textContent=A().isAdmin?"لوحة الإدارة":"الإدارة"}
sb.auth.onAuthStateChange(async()=>{await checkAdmin();if(location.hash==="#admin"){await loadAdmin();viewAdmin()}});
async function loadAdmin(){if(!A().isAdmin)return;
 const [o,c]=await Promise.all([sb.from("orders").select("*").order("created_at",{ascending:false}).limit(300),sb.from("coupons").select("*").order("code")]);
 A().orders=o.data||[];A().coupons=c.data||[];
 const p=await sb.from("products").select("*").order("created_at",{ascending:false});if(p.data)S.products=p.data;
 const cc=await sb.from("categories").select("*").order("sort");if(cc.data)S.cats=cc.data}
function loginView(){const a=A();$("#app").innerHTML=`<div class="wrap" style="max-width:460px"><div class="panel" style="margin-top:24px"><h2>دخول الإدارة</h2>
 ${a.session&&!a.isAdmin?`<p class="err">الإيميل ${esc(a.session.user.email)} مش مسموح له بالإدارة.</p><button class="btn ghost" data-act="logout">تسجيل خروج</button>`:`
 <div class="form"><p class="muted" style="margin:0">اكتب إيميل الإدارة وهيوصلك رابط دخول على الإيميل. العملاء مش محتاجين تسجيل.</p>
 <label>الإيميل<input id="ad-email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com"></label>
 <button class="btn" data-act="sendlink">ابعت رابط الدخول</button>
 ${a.sent?`<div class="note">اتبعت الرابط. افتح الإيميل واضغط عليه من نفس الجهاز، وراجع الـ Spam لو مجاش.</div>
 <label>أو اكتب الكود لو الإيميل فيه كود<input id="ad-code" inputmode="numeric" placeholder="الكود"></label><button class="btn ghost" data-act="verify">دخول بالكود</button>`:""}
 <div class="err">${esc(a.msg)}</div></div>`}</div></div>`}
function viewAdmin(){const a=A();if(!a.checked){$("#app").innerHTML='<div class="wrap"><div class="empty">جاري التحقق…</div></div>';return}
 if(!a.isAdmin){loginView();return}
 const nNew=a.orders.filter(o=>o.status==="new").length,low=S.products.filter(p=>p.stock!=null&&+p.stock<=3).length;
 $("#app").innerHTML=`<div class="wrap"><div class="row" style="justify-content:space-between;padding-top:16px"><h1 style="font-size:22px">لوحة الإدارة</h1><div class="row"><button class="chip" data-act="refresh">تحديث</button><button class="chip" data-act="logout">خروج</button></div></div>
 <div class="admin-sum"><div>طلبات جديدة<b>${nNew}</b></div><div>كل الطلبات<b>${a.orders.length}</b></div><div>المنتجات<b>${S.products.length}</b></div><div>مخزون قليل<b>${low}</b></div></div>
 <div class="tabs">${[["orders","الطلبات"],["products","المنتجات"],["cats","الأقسام"],["disc","الخصومات"],["models","موديلات التليفونات"],["set","الإعدادات"]].map(([k,l])=>`<button class="chip" data-act="tab" data-v="${k}" aria-pressed="${a.tab===k}">${l}</button>`).join("")}</div><div id="ab" style="padding-bottom:40px"></div></div>`;drawAdmin()}
function drawAdmin(){const b=$("#ab");if(!b)return;({orders:aOrders,products:aProducts,cats:aCats,disc:aDisc,models:aModels,set:aSet})[A().tab](b)}
function orderItems(o){return (o.items||[]).map(i=>i.type==="custom"?`<li><b>تصميم خاص</b> × ${i.qty} — ${esc(i.brand)} ${esc(i.model)}${i.text?" — الاسم: <b style='font-family:\""+esc(i.font)+"\"'>"+esc(i.text)+"</b> ("+esc(i.font)+")":""}<div class="cdz">${i.preview?`<a href="${esc(i.preview)}" target="_blank" rel="noopener"><img src="${esc(i.preview)}" alt="معاينة"></a>`:""}${i.original?`<a class="btn ghost sm" style="width:auto" href="${esc(i.original)}" target="_blank" rel="noopener">الصورة الأصلية</a>`:""}</div></li>`:`<li>${esc(i.name)} ${i.opt?"("+esc(i.opt)+")":""} × ${i.qty} = ${fmt(i.price*i.qty)}</li>`).join("")}
function aOrders(b){const a=A();const L=a.orders.filter(o=>a.filter==="all"||o.status===a.filter);
 b.innerHTML=`<div class="chips"><button class="chip" data-act="ofilter" data-v="all" aria-pressed="${a.filter==="all"}">الكل</button>${STATUS.map(([k,l])=>`<button class="chip" data-act="ofilter" data-v="${k}" aria-pressed="${a.filter===k}">${l}</button>`).join("")}</div>`+(L.length?L.map(o=>`<div class="ord"><header><span class="id">${esc(o.id)}</span><span class="muted">${new Date(o.created_at).toLocaleString("ar-EG")}</span></header>
 <div><b>${esc(o.name)}</b> · <span class="sel">${esc(o.phone)}</span> · <a class="pill" target="_blank" rel="noopener" href="https://wa.me/2${esc(o.phone)}">واتساب</a></div><div>${esc(o.gov)} — ${esc(o.addr)}${o.note?"<br><span class='muted'>ملاحظة: "+esc(o.note)+"</span>":""}</div>
 <ul>${orderItems(o)}</ul><div>الإجمالي <b>${fmt(o.total)}</b> (شحن ${fmt(o.ship)}${o.coupon?"، كود "+esc(o.coupon):""}) · العربون <b>${fmt(o.dep)}</b> · <span class="pill">${esc(PAY[o.pay]||o.pay)}</span></div>
 <div class="mini"><select data-chg="status" data-id="${esc(o.id)}">${STATUS.map(([k,l])=>`<option value="${k}" ${o.status===k?"selected":""}>${l}</option>`).join("")}</select><label class="row"><input type="checkbox" data-chg="dep" data-id="${esc(o.id)}" ${o.deposit_paid?"checked":""}> العربون وصل</label><button class="btn danger sm" style="width:auto" data-act="delord" data-id="${esc(o.id)}">${a.confirm===o.id?"تأكيد الحذف":"حذف"}</button></div></div>`).join(""):'<div class="empty"><h3>لسه مفيش طلبات</h3>أول طلب هيظهر هنا.</div>')}
function catOpts(sel){const out=[];const walk=(pid,pre)=>kids(pid).forEach(c=>{out.push(`<option value="${c.id}" ${sel===c.id?"selected":""}>${esc(pre+c.name)}</option>`);walk(c.id,pre+"— ")});walk(null,"");return out.join("")}
function aProducts(b){const e=A().ed;
 if(!e){b.innerHTML=`<div class="row" style="margin-bottom:12px"><button class="btn" data-act="newp">+ منتج جديد</button></div>`+(S.products.length?`<div class="table"><table><thead><tr><th></th><th>المنتج</th><th>السعر</th><th>خصم</th><th>مخزون</th><th></th></tr></thead><tbody>${S.products.map(p=>`<tr><td><img class="pthumb" src="${esc(img0(p))}" alt=""></td><td>${esc(p.name)}<div class="muted" style="font-size:12.5px">${esc((cat(p.category_id)||{}).name||"بدون قسم")}${p.active?"":" · مخفي"}</div></td><td>${fmt(p.price)}</td><td>${+p.discount_pct||0}%</td><td>${p.stock==null?"-":p.stock}</td><td><div class="mini"><button class="chip" data-act="editp" data-id="${p.id}">تعديل</button><button class="chip" data-act="togp" data-id="${p.id}">${p.active?"إخفاء":"إظهار"}</button><button class="chip" style="color:var(--danger)" data-act="delp" data-id="${p.id}">${A().confirm===p.id?"تأكيد الحذف":"حذف"}</button></div></td></tr>`).join("")}</tbody></table></div>`:'<div class="empty"><h3>لسه مفيش منتجات</h3>اضغط "منتج جديد".</div>');return}
 b.innerHTML=`<div class="panel"><h2>${e.id?"تعديل منتج":"منتج جديد"}</h2><div class="form">
 <label>اسم المنتج<input id="e-name" value="${esc(e.name)}"></label>
 <label>القسم<select id="e-cat"><option value="">بدون قسم</option>${catOpts(e.category_id)}</select></label>
 <div class="two"><label>السعر (ج.م)<input id="e-price" type="number" min="0" inputmode="numeric" value="${esc(e.price)}"></label><label>خصم على المنتج %<input id="e-disc" type="number" min="0" max="90" inputmode="numeric" value="${esc(e.discount_pct||0)}"></label></div>
 <label>الكمية المتاحة (سيبها فاضية لو غير محدودة)<input id="e-stock" type="number" min="0" inputmode="numeric" value="${e.stock==null?"":esc(e.stock)}"></label>
 <label class="row"><input id="e-phone" type="checkbox" ${e.needs_phone?"checked":""}> العميل لازم يختار نوع التليفون (للجرابات)</label>
 <label>اختيارات إضافية (افصل بفاصلة، مثلاً الألوان)<input id="e-opts" value="${esc((e.options||[]).join(", "))}"></label>
 <label>الوصف<textarea id="e-desc" rows="3">${esc(e.description)}</textarea></label>
 <div><div class="muted" style="margin-bottom:6px">الصور</div><div class="imgs">${(e.images||[]).map((u,i)=>`<div><img src="${esc(u)}" alt=""><button data-act="delimg" data-i="${i}" aria-label="حذف الصورة">×</button></div>`).join("")}</div><input id="e-files" type="file" accept="image/*" multiple style="margin-top:8px"><div class="muted" id="upn" style="font-size:13px"></div></div>
 <label class="row"><input id="e-act" type="checkbox" ${e.active!==false?"checked":""}> ظاهر في المتجر</label><div class="err" id="eerr"></div>
 <div class="row"><button class="btn" data-act="savep">حفظ المنتج</button><button class="btn ghost" data-act="cancelp">إلغاء</button></div></div></div>`}
function readEd(){if(!$("#e-name"))return;const g=id=>$("#"+id).value;Object.assign(A().ed,{name:g("e-name").trim(),category_id:g("e-cat")||null,price:+g("e-price")||0,discount_pct:+g("e-disc")||0,stock:g("e-stock")===""?null:+g("e-stock"),needs_phone:$("#e-phone").checked,options:g("e-opts").split(/[,،]/).map(s=>s.trim()).filter(Boolean),description:g("e-desc").trim(),active:$("#e-act").checked})}
async function upImgs(files){readEd();const n=$("#upn");for(let i=0;i<files.length;i++){n.textContent="برفع صورة "+(i+1)+" من "+files.length+"…";try{const blob=await shrinkFile(files[i],1200,"image/jpeg",.86);const url=await upload("products",blob,"jpg");A().ed.images=(A().ed.images||[]).concat(url)}catch(x){n.textContent="تعذّر رفع صورة. جرّب صورة أصغر.";return}}drawAdmin()}
function aCats(b){const a=A();const row=(c,d)=>`<div class="row" style="padding:8px 0;border-bottom:1px solid var(--line);padding-inline-start:${d*18}px"><b style="flex:1">${esc(c.name)}</b>${c.active?"":'<span class="pill">مخفي</span>'}<button class="chip" data-act="addsub" data-id="${c.id}">+ فرعي</button><button class="chip" data-act="rencat" data-id="${c.id}">تعديل</button><button class="chip" data-act="upcat" data-id="${c.id}" aria-label="لفوق">↑</button><button class="chip" data-act="dncat" data-id="${c.id}" aria-label="لتحت">↓</button><button class="chip" style="color:var(--danger)" data-act="delcat" data-id="${c.id}">${a.confirm===c.id?"تأكيد الحذف":"حذف"}</button></div>`+kids(c.id).map(k=>row(k,d+1)).join("");
 b.innerHTML=`<div class="panel"><h2>الأقسام</h2><div class="mini" style="margin-bottom:12px"><input id="nc-name" placeholder="اسم قسم رئيسي جديد"><button class="btn" style="min-height:38px" data-act="addcat">إضافة</button></div>${kids(null).map(c=>row(c,0)).join("")||'<p class="muted">لسه مفيش أقسام.</p>'}<div class="err" id="cerr3"></div>${a.cedit?`<div class="note" style="margin-top:12px"><div class="mini"><input id="ce-name" value="${esc(a.cedit.name)}"><label class="row"><input id="ce-act" type="checkbox" ${a.cedit.active?"checked":""}> ظاهر</label><button class="btn" style="min-height:38px" data-act="savecat">حفظ</button><button class="chip" data-act="cancelcat">إلغاء</button></div></div>`:""}</div>`}
function aDisc(b){const a=A();b.innerHTML=`<div class="panel" style="margin-bottom:14px"><h2>خصم على المتجر كله</h2><p class="muted" style="margin-top:0">بيتطبق على كل المنتجات. لو المنتج عليه خصم أعلى، بيتاخد الأعلى. 0 معناها مفيش خصم.</p><div class="mini"><input id="g-disc" type="number" min="0" max="90" value="${+S.settings.globalDiscount||0}"> %<button class="btn" style="min-height:38px" data-act="saveg">حفظ</button></div></div>
 <div class="panel"><h2>أكواد الخصم</h2><div class="mini" style="margin-bottom:12px"><input id="c-code" placeholder="الكود مثال: GHOUTH10" style="min-width:150px"><input id="c-pct" type="number" min="1" max="90" placeholder="%"><input id="c-exp" type="date" aria-label="تاريخ الانتهاء"><button class="btn" style="min-height:38px" data-act="addc">إضافة</button></div><div class="err" id="cerr2"></div>
 ${a.coupons.length?`<div class="table"><table><thead><tr><th>الكود</th><th>الخصم</th><th>ينتهي</th><th></th></tr></thead><tbody>${a.coupons.map(c=>`<tr><td class="sel"><b>${esc(c.code)}</b></td><td>${c.pct}%</td><td>${esc(c.expires||"مفتوح")}</td><td><div class="mini"><button class="chip" data-act="togc" data-id="${c.id}">${c.active?"إيقاف":"تفعيل"}</button><button class="chip" style="color:var(--danger)" data-act="delc" data-id="${c.id}">${a.confirm===c.id?"تأكيد الحذف":"حذف"}</button></div></td></tr>`).join("")}</tbody></table></div>`:'<p class="muted">لسه مفيش أكواد.</p>'}</div>`}
function aModels(b){const a=A();const q=a.mq;const L=S.models.filter(m=>!q||(m.brand+" "+m.model).toLowerCase().includes(q.toLowerCase())).slice(0,80);
 b.innerHTML=`<div class="panel"><h2>موديلات التليفونات (${S.models.length})</h2><p class="muted" style="margin-top:0">القايمة فيها أشهر الماركات. ضيف أي موديل ناقص هنا ويظهر للعميل في صفحة التصميم.</p>
 <div class="mini" style="margin-bottom:12px"><input id="m-brand" list="mb" placeholder="الماركة"><datalist id="mb">${brands().map(x=>`<option value="${esc(x)}">`).join("")}</datalist><input id="m-model" placeholder="الموديل"><button class="btn" style="min-height:38px" data-act="addm">إضافة</button></div><div class="err" id="merr"></div>
 <input id="m-q" placeholder="بحث في الموديلات" value="${esc(q)}" style="margin-bottom:8px"><div class="table"><table><tbody>${L.map(m=>`<tr><td>${esc(m.brand)}</td><td>${esc(m.model)}</td><td><button class="chip" style="color:var(--danger)" data-act="delm" data-id="${m.id}">حذف</button></td></tr>`).join("")}</tbody></table></div></div>`}
function aSet(b){const s=S.settings;b.innerHTML=`<div class="panel"><h2>إعدادات المتجر</h2><div class="form">
 <label>رقم واتساب (بالكود الدولي)<input id="s-wa" inputmode="tel" value="${esc(s.whatsapp)}"></label>
 <label>نسبة العربون %<input id="s-dep" type="number" min="0" max="100" value="${+s.deposit||0}"></label>
 <div class="two"><label>رقم فودافون كاش<input id="s-vf" inputmode="tel" value="${esc(s.vodafone)}"></label><label>حساب إنستاباي<input id="s-ip" value="${esc(s.instapay)}"></label></div>
 <label>سعر التصميم الخاص (ج.م)<input id="s-cp" type="number" min="0" value="${+s.customPrice||0}"></label>
 <label>شريط الإعلان أعلى الموقع<input id="s-bn" value="${esc(s.banner)}"></label>
 <div class="muted">سعر الشحن للطلب الكامل حسب المحافظة (ج.م)</div>
 <div class="two"><label>القاهرة والجيزة<input id="s-t1" type="number" min="0" value="${+s.t1||0}"></label><label>الإسكندرية والدلتا والقناة<input id="s-t2" type="number" min="0" value="${+s.t2||0}"></label></div>
 <label>الصعيد والمحافظات الحدودية<input id="s-t3" type="number" min="0" value="${+s.t3||0}"></label><button class="btn" data-act="saveset">حفظ الإعدادات</button></div></div>`}
async function saveSettings(patch){const next=Object.assign({},S.settings,patch);const {error}=await sb.from("settings").upsert({id:1,data:next});if(error)return toast("تعذّر الحفظ");S.settings=next;chrome();toast("تم الحفظ")}
async function dbDo(p,okMsg){const {error}=await p;if(error){toast("تعذّرت العملية: "+(error.message||""));return false}if(okMsg)toast(okMsg);return true}

/* ---------- router & data ---------- */
function route(){const h=location.hash.slice(1)||"home";closeMenu();closeSearch();chrome();window.scrollTo(0,0);
 if(h==="cart")viewCart();else if(h==="done")viewDone();else if(h==="fav")viewFav();else if(h==="design"){viewDesign();bindCanvas()}else if(h==="track")viewTrack();
 else if(h==="admin"){viewAdmin();if(A().isAdmin)loadAdmin().then(viewAdmin)}else if(h==="all")viewCat("all");else if(h.startsWith("c-"))viewCat(h.slice(2));else if(h.startsWith("p-")){S.pi=0;viewProduct(h.slice(2))}else viewHome()}
function refresh(){const h=location.hash.slice(1)||"home";chrome();const a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)&&a.closest("#app"))return;
 if(h==="design"||h==="admin"||h==="done"||h==="track")return;const y=window.scrollY;if(h==="cart")readForm();route2();window.scrollTo(0,y)}
function route2(){const h=location.hash.slice(1)||"home";if(h==="cart")viewCart();else if(h==="fav")viewFav();else if(h==="all")viewCat("all");else if(h.startsWith("c-"))viewCat(h.slice(2));else if(h.startsWith("p-"))viewProduct(h.slice(2));else viewHome()}
async function loadData(){
 const [c,p,m,s]=await Promise.all([sb.from("categories").select("*").order("sort"),sb.from("products").select("*").order("created_at",{ascending:false}),sb.from("phone_models").select("*").order("brand").order("model").limit(2000),sb.from("settings").select("data").eq("id",1).maybeSingle()]);
 if(c.error||p.error){S.error="تأكد من الاتصال بالإنترنت وحاول تاني.";S.loaded=false;refresh();return}
 S.error="";S.cats=c.data||[];S.products=p.data||[];S.models=m.data||[];if(s.data&&s.data.data)S.settings=Object.assign({},DEF,s.data.data);S.loaded=true;refresh()}
window.addEventListener("hashchange",route);

/* ---------- events ---------- */
document.addEventListener("click",async ev=>{
 if(ev.target.id==="ov"){closeMenu();return}
 if(ev.target.closest("[data-close]")){setTimeout(closeMenu,0);return}
 if(ev.target.closest("[data-closeS]")){setTimeout(closeSearch,0);return}
 const t=ev.target.closest("[data-act]");if(!t)return;const a=t.dataset.act,id=t.dataset.id,i=+t.dataset.i,d=+t.dataset.d;const prod=id&&S.products.find(p=>p.id===id);const ad=A();
 switch(a){
 case"closeMenu":closeMenu();break;
 case"reload":S.error="";route();loadData();break;
 case"fav":ev.preventDefault();if(isFav(id))S.fav=S.fav.filter(x=>x!==id);else{S.fav.push(id);toast("اتضاف للمفضلة")}save("ghouth-fav",S.fav);chrome();document.querySelectorAll('[data-act="fav"][data-id="'+id+'"]').forEach(el=>el.classList.toggle("on",isFav(id)));if(location.hash==="#fav")viewFav();break;
 case"quick":if(prod.needs_phone||(prod.options||[]).length)location.hash="p-"+id;else addCart({type:"product",pid:id,opt:"",qty:1});break;
 case"thumb":S.pi=i;viewProduct(location.hash.slice(3));break;
 case"pq":{const el=$("#pq");el.textContent=Math.max(1,+el.textContent+d);break}
 case"addpdp":{const pe=$("#perr");let opt=[];if(prod.needs_phone){const b=$("#pp-brand").value,m=$("#pp-model").value;if(!b||!m){pe.textContent="اختار ماركة التليفون وموديله.";return}opt.push(b+" "+m)}const o=$("#opt");if(o)opt.push(o.value);addCart({type:"product",pid:id,opt:opt.join(" / "),qty:+$("#pq").textContent});break}
 case"cq":{const c=S.cart[i];if(c){c.qty=Math.max(1,Math.min(50,c.qty+d));save("ghouth-cart",S.cart);chrome();drawItems();drawSum()}break}
 case"rm":readForm();S.cart.splice(i,1);save("ghouth-cart",S.cart);chrome();viewCart();break;
 case"coupon":{const code=($("#coupon").value||"").trim();if(!code){S.coupon=null;$("#cerr").textContent="";drawSum();break}const r=await sb.rpc("validate_coupon",{c:code});if(r.data){S.coupon=r.data;$("#cerr").textContent="";toast("تم تطبيق الكود")}else{S.coupon=null;$("#cerr").textContent="الكود غير صحيح أو منتهي."}drawSum();break}
 case"place":place();break;
 case"track":{const r=await sb.rpc("track_order",{oid:$("#t-id").value.trim(),ph:$("#t-ph").value.trim().replace(/[\s+\-]/g,"").replace(/^20/,"0")});const el=$("#t-res");if(r.data){const o=r.data;el.className="note";el.innerHTML=`طلب <b>${esc(o.id)}</b><br>الحالة: <b>${esc(SLABEL[o.status]||o.status)}</b><br>العربون: ${o.deposit_paid?"وصل ✓":"لسه ما وصلش"}<br>الإجمالي: ${fmt(o.total)}`}else{el.className="err";el.textContent="مش لاقيين الطلب. راجع رقم الطلب والموبايل."}break}
 case"font":S.dz.font=t.dataset.f;await document.fonts.load(`40px '${S.dz.font}'`,S.dz.text||"Aa");document.querySelectorAll(".fbtn").forEach(b=>b.classList.toggle("on",b.dataset.f===S.dz.font));drawCase();break;
 case"dzadd":dzAdd();break;
 case"sendlink":{const em=($("#ad-email").value||"").trim();if(!em)return;ad.msg="";const r=await sb.auth.signInWithOtp({email:em,options:{emailRedirectTo:location.origin+location.pathname+"#admin",shouldCreateUser:true}});if(r.error)ad.msg="تعذّر إرسال الرابط: "+r.error.message;else{ad.sent=true;ad.email=em}viewAdmin();break}
 case"verify":{const r=await sb.auth.verifyOtp({email:ad.email||$("#ad-email").value.trim(),token:$("#ad-code").value.trim(),type:"email"});if(r.error){ad.msg="الكود غير صحيح أو منتهي.";viewAdmin()}break}
 case"logout":await sb.auth.signOut();ad.sent=false;await checkAdmin();viewAdmin();break;
 case"refresh":await loadAdmin();viewAdmin();toast("تم التحديث");break;
 case"tab":ad.tab=t.dataset.v;ad.ed=null;ad.cedit=null;ad.confirm=null;viewAdmin();break;
 case"ofilter":ad.filter=t.dataset.v;drawAdmin();break;
 case"delord":case"delp":case"delc":case"delcat":{if(ad.confirm!==id){ad.confirm=id;drawAdmin();return}ad.confirm=null;const tb=a==="delord"?"orders":a==="delp"?"products":a==="delc"?"coupons":"categories";if(await dbDo(sb.from(tb).delete().eq("id",id),"تم الحذف"))await loadAdmin();drawAdmin();break}
 case"newp":ad.ed={name:"",category_id:null,price:"",discount_pct:0,stock:null,needs_phone:false,options:[],description:"",images:[],active:true};drawAdmin();break;
 case"editp":ad.ed=JSON.parse(JSON.stringify(prod));drawAdmin();break;
 case"cancelp":ad.ed=null;drawAdmin();break;
 case"delimg":readEd();ad.ed.images.splice(i,1);drawAdmin();break;
 case"savep":{readEd();const e=ad.ed,er=$("#eerr");if(!e.name)return er.textContent="اكتب اسم المنتج.";if(!e.price)return er.textContent="اكتب السعر.";const row={name:e.name,category_id:e.category_id,price:e.price,discount_pct:e.discount_pct,stock:e.stock,needs_phone:e.needs_phone,options:e.options,description:e.description,images:e.images||[],active:e.active};
  const ok=await dbDo(e.id?sb.from("products").update(row).eq("id",e.id):sb.from("products").insert(row),"تم حفظ المنتج");if(ok){ad.ed=null;await loadAdmin();viewAdmin()}break}
 case"togp":if(await dbDo(sb.from("products").update({active:!prod.active}).eq("id",id)))await loadAdmin();drawAdmin();break;
 case"addcat":{const n=$("#nc-name").value.trim();if(!n)return;if(await dbDo(sb.from("categories").insert({name:n,sort:kids(null).length+1}),"تمت الإضافة")){await loadAdmin();chrome();drawAdmin()}break}
 case"addsub":{ad.cedit={sub:id,name:"",active:true};drawAdmin();break}
 case"rencat":{const c=cat(id);ad.cedit={id,name:c.name,active:c.active};drawAdmin();break}
 case"cancelcat":ad.cedit=null;drawAdmin();break;
 case"savecat":{const n=$("#ce-name").value.trim();if(!n)return;const ce=ad.cedit;const ok=ce.id?await dbDo(sb.from("categories").update({name:n,active:$("#ce-act").checked}).eq("id",ce.id),"تم الحفظ"):await dbDo(sb.from("categories").insert({name:n,parent_id:ce.sub,sort:kids(ce.sub).length+1}),"تمت الإضافة");if(ok){ad.cedit=null;await loadAdmin();chrome();drawAdmin()}break}
 case"upcat":case"dncat":{const c=cat(id);const sib=kids(c.parent_id);const k=sib.findIndex(x=>x.id===id),o=sib[k+(a==="upcat"?-1:1)];if(!o)break;await Promise.all([sb.from("categories").update({sort:o.sort}).eq("id",c.id),sb.from("categories").update({sort:c.sort}).eq("id",o.id)]);if(o.sort===c.sort)await sb.from("categories").update({sort:c.sort+(a==="upcat"?-1:1)}).eq("id",c.id);await loadAdmin();chrome();drawAdmin();break}
 case"saveg":saveSettings({globalDiscount:Math.min(90,Math.max(0,+$("#g-disc").value||0))});break;
 case"addc":{const code=$("#c-code").value.trim().toUpperCase(),pct=+$("#c-pct").value;if(!code||!(pct>0&&pct<=90))return $("#cerr2").textContent="اكتب الكود ونسبة بين 1 و 90.";if(await dbDo(sb.from("coupons").insert({code,pct,expires:$("#c-exp").value||null}),"تمت إضافة الكود")){await loadAdmin();drawAdmin()}break}
 case"togc":{const c=ad.coupons.find(x=>x.id===id);if(await dbDo(sb.from("coupons").update({active:!c.active}).eq("id",id)))await loadAdmin();drawAdmin();break}
 case"addm":{const b=$("#m-brand").value.trim(),m=$("#m-model").value.trim();if(!b||!m)return $("#merr").textContent="اكتب الماركة والموديل.";if(await dbDo(sb.from("phone_models").insert({brand:b,model:m}),"تمت الإضافة")){const r=await sb.from("phone_models").select("*").order("brand").order("model").limit(2000);S.models=r.data||S.models;drawAdmin()}break}
 case"delm":if(await dbDo(sb.from("phone_models").delete().eq("id",+id))){S.models=S.models.filter(m=>m.id!==+id);drawAdmin()}break;
 case"saveset":{const g=k=>$("#"+k).value;saveSettings({whatsapp:g("s-wa").replace(/\D/g,"")||DEF.whatsapp,deposit:Math.min(100,Math.max(0,+g("s-dep")||0)),vodafone:g("s-vf").trim(),instapay:g("s-ip").trim(),banner:g("s-bn").trim(),customPrice:+g("s-cp")||0,t1:+g("s-t1")||0,t2:+g("s-t2")||0,t3:+g("s-t3")||0});break}
 }});
document.addEventListener("input",ev=>{const t=ev.target;
 if(t.id==="sq")drawSearch();
 else if(t.id&&t.id.startsWith("f-")){readForm();if(t.id==="f-gov")drawSum()}
 else if(t.id==="m-q"){A().mq=t.value;const pos=t.selectionStart;aModels($("#ab"));const n=$("#m-q");n.focus();n.setSelectionRange(pos,pos)}
 else if(t.id==="dz-text"){S.dz.text=t.value;drawCase()}
 else if(t.id==="dz-scale"){S.dz.scale=+t.value;drawCase()}
 else if(t.id==="dz-bg"){S.dz.bg=t.value;drawCase()}
 else if(t.id==="dz-color"){S.dz.color=t.value;drawCase()}
 else if(t.id==="dz-size"){S.dz.tsize=+t.value;drawCase()}});
document.addEventListener("change",async ev=>{const t=ev.target;
 if(t.id==="sort"){S.sort=t.value;route2()}
 else if(t.id==="f-gov"){readForm();drawSum()}
 else if(t.name==="pay"){S.form.pay=t.value;drawSum()}
 else if(t.name==="dzm"){S.dz.mode=t.value}
 else if(t.id==="dz-file"&&t.files.length){try{await loadDzImage(t.files[0])}catch(e){S.dz.err="الصورة دي مش مدعومة. جرّب JPG أو PNG.";$("#dz-err").textContent=S.dz.err}}
 else if(t.id==="dz-brand"||t.id==="pp-brand"){const pre=t.id.split("-")[0];const m=$("#"+pre+"-model");m.innerHTML='<option value="">اختر الموديل</option>'+modelsOf(t.value).map(x=>`<option>${esc(x)}</option>`).join("");if(pre==="dz"){S.dz.brand=t.value;S.dz.model=""}}
 else if(t.id==="dz-model"){S.dz.model=t.value}
 else if(t.id==="e-files"&&t.files.length)upImgs([...t.files]);
 else if(t.dataset.chg==="status"){if(await dbDo(sb.from("orders").update({status:t.value}).eq("id",t.dataset.id),"تم تحديث الحالة"))await loadAdmin()}
 else if(t.dataset.chg==="dep"){const o=A().orders.find(x=>x.id===t.dataset.id);const upd={deposit_paid:t.checked};if(t.checked&&o.status==="new")upd.status="deposit";if(await dbDo(sb.from("orders").update(upd).eq("id",o.id),"تم التحديث")){await loadAdmin();drawAdmin()}}});
$("#menuBtn").onclick=openMenu;$("#searchBtn").onclick=openSearch;$("#sclose").onclick=closeSearch;
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeMenu();closeSearch()}});
setInterval(async()=>{if(location.hash==="#admin"&&A().isAdmin&&A().tab==="orders"&&!document.activeElement.closest("#ab select,#ab input")){const o=await sb.from("orders").select("*").order("created_at",{ascending:false}).limit(300);if(o.data&&o.data.length!==A().orders.length){A().orders=o.data;drawAdmin();toast("وصل طلب جديد")}}},25000);
(async function boot(){chrome();route();await checkAdmin();loadData();if(location.hash==="#admin"){await loadAdmin();viewAdmin()}})();
})();
