/* Show prices in the visitor's local currency, based on their device time zone (then browser region).
   Base prices are written in the page as A$ and charged in AUD; this converts them for display. */
(function(){
  var TZ={"Australia/":"AUD","Pacific/Auckland":"NZD","Pacific/Chatham":"NZD","America/Toronto":"CAD","America/Vancouver":"CAD","America/Edmonton":"CAD","America/Winnipeg":"CAD","America/Halifax":"CAD","America/Regina":"CAD","America/St_Johns":"CAD","America/Mexico_City":"MXN","America/Sao_Paulo":"BRL","America/Argentina/":"ARS","America/Bogota":"COP","America/Santiago":"CLP","America/Lima":"PEN","America/":"USD","Pacific/Honolulu":"USD","Europe/London":"GBP","Europe/Dublin":"EUR","Europe/Zurich":"CHF","Europe/Stockholm":"SEK","Europe/Oslo":"NOK","Europe/Copenhagen":"DKK","Europe/Warsaw":"PLN","Europe/Prague":"CZK","Europe/Budapest":"HUF","Europe/Bucharest":"RON","Europe/Istanbul":"TRY","Europe/":"EUR","Asia/Singapore":"SGD","Asia/Tokyo":"JPY","Asia/Seoul":"KRW","Asia/Kolkata":"INR","Asia/Calcutta":"INR","Asia/Hong_Kong":"HKD","Asia/Shanghai":"CNY","Asia/Taipei":"TWD","Asia/Manila":"PHP","Asia/Kuala_Lumpur":"MYR","Asia/Jakarta":"IDR","Asia/Bangkok":"THB","Asia/Ho_Chi_Minh":"VND","Asia/Dubai":"AED","Asia/Riyadh":"SAR","Asia/Jerusalem":"ILS","Asia/Karachi":"PKR","Africa/Johannesburg":"ZAR","Africa/Lagos":"NGN","Africa/Nairobi":"KES","Africa/Cairo":"EGP","Pacific/Fiji":"FJD"};
  var REG={AU:"AUD",NZ:"NZD",US:"USD",GB:"GBP",CA:"CAD",IE:"EUR",DE:"EUR",FR:"EUR",NL:"EUR",ES:"EUR",IT:"EUR",BE:"EUR",AT:"EUR",PT:"EUR",FI:"EUR",CH:"CHF",SE:"SEK",NO:"NOK",DK:"DKK",PL:"PLN",SG:"SGD",JP:"JPY",KR:"KRW",IN:"INR",HK:"HKD",PH:"PHP",MY:"MYR",AE:"AED",ZA:"ZAR",MX:"MXN",BR:"BRL"};
  var tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||"";}catch(e){}
  var cur=null,best="";
  for(var k in TZ){if(tz.indexOf(k)===0&&k.length>best.length)best=k;} if(best)cur=TZ[best];
  if(!cur){var m=(navigator.language||"").match(/-([A-Z]{2})/);if(m&&REG[m[1]])cur=REG[m[1]];}
  if(!cur)cur="USD";
  var lang=navigator.language||"en";
  function nodes(){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,l=[];while(n=w.nextNode()){if(/A\$\d/.test(n.nodeValue)&&!/SCRIPT|STYLE/.test(n.parentNode.nodeName))l.push(n);}return l;}
  function apply(rate,approx){
    var fmt;try{fmt=new Intl.NumberFormat(lang,{style:"currency",currency:cur,currencyDisplay:"narrowSymbol",maximumFractionDigits:0});}catch(e){fmt=new Intl.NumberFormat(lang,{style:"currency",currency:cur,maximumFractionDigits:0});}
    nodes().forEach(function(t){t.nodeValue=t.nodeValue.replace(/A\$(\d+(?:\.\d+)?)/g,function(_,v){var s=fmt.format(Math.round(parseFloat(v)*rate));return (approx?"~":"")+s+(/^[^A-Z]*$/.test(s)?" "+cur:"");});});
    if(approx){var note=document.createElement("p");note.className="small";note.style.textAlign="center";
    note.textContent="Prices shown in "+cur+" are approximate and converted from the AUD checkout price.";document.body.appendChild(note);}
  }
  if(cur==="AUD"){apply(1,false);return;}
  fetch("https://open.er-api.com/v6/latest/AUD").then(function(r){return r.json();}).then(function(d){var r=d&&d.rates&&d.rates[cur];if(r)apply(r,true);}).catch(function(){});
})();
