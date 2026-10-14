var KEY="suraksha_contacts",contacts=[];
function load(){try{contacts=JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){contacts=[]}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(contacts))}catch(e){}}
function esc(s){return s.replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function render(){
 var ul=document.getElementById("cl");
 if(!contacts.length){ul.innerHTML='<li class="empty">No contacts yet. Add at least one person you trust.</li>';return}
 ul.innerHTML=contacts.map(function(c,i){return'<li><span><b>'+esc(c.n)+'</b><br>'+esc(c.p)+'</span><span><a class="btn alt" href="tel:'+esc(c.p)+'">Call</a> <button class="btn alt" data-i="'+i+'">Remove</button></span></li>'}).join("");
}
document.getElementById("cl").addEventListener("click",function(e){var i=e.target.getAttribute("data-i");if(i!==null){contacts.splice(+i,1);save();render()}});
document.getElementById("cf").addEventListener("submit",function(e){e.preventDefault();
 var n=cn.value.trim(),p=cp.value.trim();if(!n||!p)return;contacts.push({n:n,p:p});save();render();e.target.reset()});

var st=document.getElementById("status");
document.getElementById("sos").addEventListener("click",function(){
 st.hidden=false;st.innerHTML="Getting your location…";st.scrollIntoView({behavior:"smooth",block:"nearest"});
 if(!navigator.geolocation){st.innerHTML='Location is not supported on this browser. <a class="btn red" href="tel:112">Call 112</a>';return}
 navigator.geolocation.getCurrentPosition(ready,fail,{enableHighAccuracy:true,timeout:12000,maximumAge:0});
});
function ready(pos){
 var link="https://maps.google.com/?q="+pos.coords.latitude+","+pos.coords.longitude;
 var msg="EMERGENCY! I need help. My live location: "+link;
 var h='<b>Alert ready</b><p style="margin:6px 0 0;color:var(--mut);font-size:15px">Review the message, then send it.</p><textarea id="msg">'+msg+'</textarea><div class="row">';
 h+='<a class="btn red" href="tel:112">Call 112</a>';
 h+='<a class="btn" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(msg)+'">Share on WhatsApp</a>';
 contacts.forEach(function(c){h+='<a class="btn alt" href="sms:'+esc(c.p)+'?body='+encodeURIComponent(msg)+'">SMS '+esc(c.n)+'</a>'});
 h+='</div>';
 if(!contacts.length)h+='<p style="color:var(--mut);font-size:15px">Tip: add trusted contacts below to message them in one tap.</p>';
 st.innerHTML=h;
}
function fail(){st.innerHTML='<b>Location is blocked or unavailable.</b><p style="margin:6px 0 0;color:var(--mut);font-size:15px">Allow location for this site in your browser settings, then tap SOS again. For immediate help, call now.</p><div class="row"><a class="btn red" href="tel:112">Call 112</a></div>'}
load();render();
