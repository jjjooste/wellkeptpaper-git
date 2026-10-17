/* Show A$ prices in the visitor's local currency (display only; prices are set in AUD). */
(function(){
  var TZ={"Australia/":"AUD","America/":"USD","Europe/London":"GBP","Europe/":"EUR","Asia/Singapore":"SGD","Asia/Tokyo":"JPY","Asia/Kolkata":"INR","Asia/Hong_Kong":"HKD","America/Toronto":"CAD","America/Vancouver":"CAD","America/Edmonton":"CAD","America/Winnipeg":"CAD","America/Halifax":"CAD","Africa/Johannesburg":"ZAR"};
  var REG={AU:"AUD",US:"USD",GB:"GBP",CA:"CAD",IE:"EUR",DE:"EUR",FR:"EUR",NL:"EUR",ES:"EUR",IT:"EUR",SG:"SGD",JP:"JPY",IN:"INR",HK:"HKD",ZA:"ZAR",NZ:"NZD"};
  var tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||"";}catch(e){}
  var cur=null;
  if(/^Pacific\/(Auckland|Chatham)/.test(tz)) cur="NZD";
  if(!cur){var best="";for(var k in TZ){if(tz.indexOf(k)===0&&k.length>best.length)best=k;} if(best)cur=TZ[best];}
  if(!cur){var m=(navigator.language||"").match(/-([A-Z]{2})/);if(m&&REG[m[1]])cur=REG[m[1]];}
  if(!cur||cur==="AUD")return;
  var lang=navigator.language||"en";
  function apply(rate){
    var fmt=new Intl.NumberFormat(lang,{style:"currency",currency:cur,maximumFractionDigits:0});
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,list=[];
    while(n=w.nextNode()){if(/A\$\d/.test(n.nodeValue)&&!/SCRIPT|STYLE/.test(n.parentNode.nodeName))list.push(n);}
    list.forEach(function(t){t.nodeValue=t.nodeValue.replace(/A\$(\d+(?:\.\d+)?)/g,function(_,v){return "~"+fmt.format(Math.round(parseFloat(v)*rate));});});
    var note=document.createElement("p");note.className="small";note.style.textAlign="center";
    note.textContent="Prices shown in "+cur+" are approximate. Final prices are charged in AUD.";
    document.body.appendChild(note);
  }
  fetch("https://open.er-api.com/v6/latest/AUD").then(function(r){return r.json();}).then(function(d){var r=d&&d.rates&&d.rates[cur];if(r)apply(r);}).catch(function(){});
})();
