const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('#nav');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');toggle.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}))}
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
// Hora local de Santo Domingo (AST, UTC-4) sin depender del reloj del visitante.
const clock=document.querySelector('#sdq-clock');function updateSantoDomingoClock(){if(!clock)return;clock.textContent=new Intl.DateTimeFormat('es-DO',{timeZone:'America/Santo_Domingo',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date())}updateSantoDomingoClock();setInterval(updateSantoDomingoClock,1000);
// Tiempo actual de Santo Domingo desde Open-Meteo; no requiere clave de API.
const temp=document.querySelector('#weather-temp'),desc=document.querySelector('#weather-desc'),icon=document.querySelector('#weather-icon');
const weatherLabels={0:['Despejado','☀'],1:['Mayormente despejado','🌤'],2:['Parcialmente nublado','⛅'],3:['Nublado','☁'],45:['Niebla','🌫'],48:['Niebla','🌫'],51:['Llovizna ligera','🌦'],53:['Llovizna','🌦'],55:['Llovizna intensa','🌧'],56:['Llovizna helada','🌧'],57:['Llovizna helada','🌧'],61:['Lluvia ligera','🌦'],63:['Lluvia','🌧'],65:['Lluvia intensa','🌧'],66:['Lluvia helada','🌧'],67:['Lluvia helada','🌧'],71:['Nieve ligera','🌨'],73:['Nieve','🌨'],75:['Nieve intensa','🌨'],77:['Granizo menudo','🌨'],80:['Chubascos ligeros','🌦'],81:['Chubascos','🌧'],82:['Chubascos intensos','⛈'],85:['Chubascos de nieve','🌨'],86:['Chubascos de nieve','🌨'],95:['Tormenta','⛈'],96:['Tormenta con granizo','⛈'],99:['Tormenta intensa','⛈']};
async function updateSantoDomingoWeather(){if(!temp||!desc||!icon)return;try{const response=await fetch('https://api.open-meteo.com/v1/forecast?latitude=18.4861&longitude=-69.9312&current=temperature_2m,weather_code&timezone=America%2FSanto_Domingo');if(!response.ok)throw new Error('weather unavailable');const data=await response.json();const current=data.current;const condition=weatherLabels[current.weather_code]||['Condiciones actuales','🌤'];temp.textContent=Math.round(current.temperature_2m)+'°C';desc.textContent=condition[0];icon.textContent=condition[1];}catch(error){temp.textContent='';desc.textContent='Clima no disponible';icon.textContent='☁';}}updateSantoDomingoWeather();setInterval(updateSantoDomingoWeather,10*60*1000);

// Navegación corporativa unificada: resalta la sección visible y conserva
// el comportamiento accesible del menú en escritorio y dispositivos móviles.
const navLinks=[...document.querySelectorAll('#nav a[href^="#"]')];
function setActiveNav(id){
  navLinks.forEach(link=>{
    const active=link.getAttribute('href')==='#'+id;
    link.classList.toggle('active',active);
    if(active) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
}
navLinks.forEach(link=>link.addEventListener('click',()=>{
  const id=link.getAttribute('href').slice(1);
  setActiveNav(id);
  if(nav&&toggle){
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Abrir menú');
    toggle.textContent='☰';
  }
}));
window.addEventListener('hashchange',()=>{
  const id=location.hash.slice(1);
  if(id) setActiveNav(id);
});
if('IntersectionObserver' in window){
  const observedSections=navLinks
    .map(link=>document.querySelector(link.getAttribute('href')))
    .filter((section,index,array)=>section&&array.indexOf(section)===index);
  const navObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting)
      .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible) setActiveNav(visible.target.id);
  },{rootMargin:'-145px 0px -58% 0px',threshold:[0,.15,.35,.6]});
  observedSections.forEach(section=>navObserver.observe(section));
}
const initialSection=location.hash.slice(1)||'inicio';
setActiveNav(initialSection);
