const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('#nav');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');toggle.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}))}
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
// Hora local de Santo Domingo (AST, UTC-4) sin depender del reloj del visitante.
const clock=document.querySelector('#sdq-clock');function updateSantoDomingoClock(){if(!clock)return;clock.textContent=new Intl.DateTimeFormat('es-DO',{timeZone:'America/Santo_Domingo',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date())}updateSantoDomingoClock();setInterval(updateSantoDomingoClock,1000);
// Tiempo actual de Santo Domingo desde Open-Meteo; no requiere clave de API.
const temp=document.querySelector('#weather-temp'),desc=document.querySelector('#weather-desc'),icon=document.querySelector('#weather-icon');
const weatherLabels={0:['Despejado','☀'],1:['Mayormente despejado','🌤'],2:['Parcialmente nublado','⛅'],3:['Nublado','☁'],45:['Niebla','🌫'],48:['Niebla','🌫'],51:['Llovizna ligera','🌦'],53:['Llovizna','🌦'],55:['Llovizna intensa','🌧'],56:['Llovizna helada','🌧'],57:['Llovizna helada','🌧'],61:['Lluvia ligera','🌦'],63:['Lluvia','🌧'],65:['Lluvia intensa','🌧'],66:['Lluvia helada','🌧'],67:['Lluvia helada','🌧'],71:['Nieve ligera','🌨'],73:['Nieve','🌨'],75:['Nieve intensa','🌨'],77:['Granizo menudo','🌨'],80:['Chubascos ligeros','🌦'],81:['Chubascos','🌧'],82:['Chubascos intensos','⛈'],85:['Chubascos de nieve','🌨'],86:['Chubascos de nieve','🌨'],95:['Tormenta','⛈'],96:['Tormenta con granizo','⛈'],99:['Tormenta intensa','⛈']};
async function updateSantoDomingoWeather(){if(!temp||!desc||!icon)return;try{const response=await fetch('https://api.open-meteo.com/v1/forecast?latitude=18.4861&longitude=-69.9312&current=temperature_2m,weather_code&timezone=America%2FSanto_Domingo');if(!response.ok)throw new Error('weather unavailable');const data=await response.json();const current=data.current;const condition=weatherLabels[current.weather_code]||['Condiciones actuales','🌤'];temp.textContent=Math.round(current.temperature_2m)+'°C';desc.textContent=condition[0];icon.textContent=condition[1];}catch(error){temp.textContent='';desc.textContent='Clima no disponible';icon.textContent='☁';}}updateSantoDomingoWeather();setInterval(updateSantoDomingoWeather,10*60*1000);
/* Accessible interactive aircraft selector for the premium fleet panel */
const fleetSelector=document.querySelector('#fleet-selector');
if(fleetSelector){
  const detailImage=document.querySelector('#fleet-detail-image');
  const detailName=document.querySelector('#fleet-detail-name');
  const detailReg=document.querySelector('#fleet-detail-reg');
  const detailRegPhoto=document.querySelector('#fleet-detail-reg-photo');
  const detailRole=document.querySelector('#fleet-detail-role');
  const detailCategory=document.querySelector('#fleet-detail-category');
  const detailCode=document.querySelector('#fleet-detail-code');
  const detailDescription=document.querySelector('#fleet-detail-description');
  const descriptions={
    'McDonnell Douglas MD-11':'El trirreactor de largo alcance aporta carácter y capacidad a las operaciones virtuales de Costera, conectando el Caribe con destinos lejanos.',
    'Boeing 747':'El icónico Jumbo representa la vocación de largo alcance de la flota virtual y abre la puerta a rutas intercontinentales.',
    'Boeing 737-800':'Un avión versátil para conectar destinos caribeños y continentales dentro de la red virtual de Costera.',
    'BAe 146':'Cuatrimotor regional de corto recorrido, ideal para conectar destinos caribeños y aeropuertos con operaciones exigentes.',
    'ATR 72-600':'Turbohélice regional pensado para rutas cortas, conexiones cercanas y destinos del entorno caribeño.'
  };
  fleetSelector.querySelectorAll('.fleet-select-card').forEach(button=>{
    button.addEventListener('click',()=>{
      fleetSelector.querySelectorAll('.fleet-select-card').forEach(item=>{item.classList.remove('is-active');item.setAttribute('aria-pressed','false')});
      button.classList.add('is-active');button.setAttribute('aria-pressed','true');
      const d=button.dataset;
      detailImage.src=d.image;detailImage.alt=d.alt;
      detailName.textContent=d.name;detailReg.textContent=d.reg;detailRegPhoto.textContent=d.reg;
      detailRole.textContent=d.role+' · '+d.category;detailCategory.textContent=d.category;detailCode.textContent=d.reg;
      detailDescription.textContent=descriptions[d.name]||'Aeronave de la flota virtual de Costera Dominicana Air.';
    });
  });
}
