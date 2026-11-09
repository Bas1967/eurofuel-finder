const API="https://www.fuel-prices.eu/live/api.php?action=summary";
const names={AD:"Andorra",AT:"Oostenrijk",BE:"België",BG:"Bulgarije",CH:"Zwitserland",CY:"Cyprus",CZ:"Tsjechië",DE:"Duitsland",DK:"Denemarken",EE:"Estland",ES:"Spanje",FI:"Finland",FR:"Frankrijk",GB:"Verenigd Koninkrijk",GR:"Griekenland",HR:"Kroatië",HU:"Hongarije",IE:"Ierland",IS:"IJsland",IT:"Italië",LT:"Litouwen",LU:"Luxemburg",LV:"Letland",MT:"Malta",NL:"Nederland",NO:"Noorwegen",PL:"Polen",PT:"Portugal",RO:"Roemenië",SE:"Zweden",SI:"Slovenië",SK:"Slowakije"};
const $=id=>document.getElementById(id);let records=[];let installPrompt=null;
const fuelNames={sp95:"Benzine Euro 95",sp98:"Benzine Euro 98",diesel:"Diesel",gpl:"LPG",e10:"Benzine E10",e5:"Benzine E5",e85:"E85",cng:"CNG",lng:"LNG",hvo:"HVO"};
const EUROPE=new Set(const EUROPE=new Set(["NL","BE","DE"]);
function euro(v){return new Intl.NumberFormat("nl-NL",{style:"currency",currency:"EUR",minimumFractionDigits:3,maximumFractionDigits:3}).format(v)}
function render(){
 const fuel=$("fuel").value, sort=$("sort").value;
 const list=records.map(c=>({code:c.country_code,name:names[c.country_code]||c.country_code,entry:c.fuels?.[fuel]})).filter(x=>x.entry&&Number(x.entry[sort])>0).sort((a,b)=>a.entry[sort]-b.entry[sort]);
 $("count").textContent=list.length;
 $("best").textContent=list.length?euro(list[0].entry[sort]):"—";
 $("rows").innerHTML=list.length?list.map((x,i)=>`<tr><td class="rank">${i+1}</td><td class="country">${x.name}<span class="sub">${x.code}</span></td><td>${Number(x.entry.stations||0).toLocaleString("nl-NL")}</td><td class="price">${euro(x.entry[sort])}</td></tr>`).join(""):`<tr><td colspan="4">Geen gegevens voor deze brandstof.</td></tr>`;
}
async function load(){
 $("status").textContent="Prijzen ophalen bij de openbare gegevensbron…";
 $("status").classList.remove("error");$("refresh").disabled=true;
 try{
  const r=await fetch(API,{cache:"no-store"});if(!r.ok)throw new Error("Gegevensbron antwoordde met HTTP "+r.status);
  const j=await r.json();if(!j.ok||!Array.isArray(j.data?.countries))throw new Error(j.error||"Onverwacht antwoord van de gegevensbron.");
  records=j.data.countries.filter(c=>EUROPE.has(c.country_code));
  const newest=records.map(c=>c.last_fetched).filter(Boolean).sort().at(-1);
  $("date").textContent=newest?new Date(newest.replace(" ","T")+"Z").toLocaleDateString("nl-NL"):"onbekend";
  $("status").textContent=`Bijgewerkt: ${newest||"datum niet opgegeven"} UTC · ${fuelNames[$("fuel").value]}.`;
  render();
 }catch(e){$("status").textContent="Ophalen mislukt: "+e.message+" Controleer je internetverbinding en probeer opnieuw.";$("status").classList.add("error");$("rows").innerHTML='<tr><td colspan="4">Geen live gegevens beschikbaar.</td></tr>'}
 finally{$("refresh").disabled=false}
}
$("fuel").addEventListener("change",render);$("sort").addEventListener("change",render);$("refresh").addEventListener("click",load);
function calc(){const litres=Number($("litres").value),home=Number($("home").value),best=records.map(c=>c.fuels?.[$("fuel").value]?.min).filter(v=>Number(v)>0).sort((a,b)=>a-b)[0];if(!best||!home||!litres){$("saving").textContent="Vul je thuisprijs in om het verschil te berekenen.";return}const diff=(home-best)*litres;$("saving").textContent=diff>0?`Bij de laagste gemelde prijs bespaar je ongeveer ${euro(diff)} op ${litres} liter (zonder extra reis- of tolkosten).`:`De laagste gemelde prijs is niet goedkoper dan jouw thuisprijs.`}
$("litres").addEventListener("input",calc);$("home").addEventListener("input",calc);$("fuel").addEventListener("change",calc);
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("install").hidden=false});
$("install").addEventListener("click",async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("install").hidden=true});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
load();
