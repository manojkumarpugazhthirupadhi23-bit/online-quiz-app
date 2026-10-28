var TIME=120;
var DATA={
"General Knowledge":{ic:"🌍",qs:[
["What is the capital of India?",["Mumbai","New Delhi","Chennai","Kolkata"],1],
["Which planet is known as the Red Planet?",["Venus","Jupiter","Mars","Saturn"],2],
["Who wrote the national anthem of India?",["Bankim Chandra","Rabindranath Tagore","Sarojini Naidu","Gandhi"],1],
["How many continents are there on Earth?",["5","6","7","8"],2],
["Which is the largest ocean?",["Atlantic","Indian","Arctic","Pacific"],3],
["Which river is called the Ganga of the South?",["Kaveri","Krishna","Godavari","Vaigai"],0],
["Which gas do plants absorb from the air?",["Oxygen","Carbon dioxide","Nitrogen","Hydrogen"],1],
["Who is known as the Father of the Nation in India?",["Nehru","Patel","Mahatma Gandhi","Bose"],2]]},
"Web Development":{ic:"💻",qs:[
["What does HTML stand for?",["HyperText Markup Language","High Text Machine Language","HyperTool Multi Language","Home Text Markup Level"],0],
["Which CSS property changes text colour?",["font-color","color","text-style","fg"],1],
["Which method stores data in the browser permanently?",["sessionStorage","cookies only","localStorage","RAM"],2],
["Which tag is used for the largest heading?",["<h6>","<head>","<h1>","<title>"],2],
["Which keyword declares a constant in JavaScript?",["var","let","const","static"],2],
["What does CSS stand for?",["Creative Style Sheets","Cascading Style Sheets","Computer Style Syntax","Colorful Style Sheets"],1],
["Which function shows a repeating timer in JavaScript?",["setTimeout","setInterval","wait","delay"],1],
["Which HTML tag is used to link a JavaScript file?",["<js>","<link>","<script>","<code>"],2]]},
"Science":{ic:"🔬",qs:[
["What is the chemical symbol for water?",["O2","H2O","CO2","HO"],1],
["Which organ pumps blood in the human body?",["Lungs","Liver","Heart","Kidney"],2],
["What is the speed of light approximately?",["3×10⁵ km/s","3×10³ km/s","3×10⁸ km/s","3×10⁶ km/s"],0],
["Which vitamin do we get from sunlight?",["A","B12","C","D"],3],
["What is the hardest natural substance?",["Gold","Iron","Diamond","Quartz"],2],
["Which planet has the most moons in our solar system?",["Mars","Saturn","Earth","Mercury"],1],
["The unit of force is?",["Joule","Newton","Watt","Pascal"],1],
["Which blood group is the universal donor?",["A+","AB+","O−","B−"],2]]},
"Mathematics":{ic:"➗",qs:[
["What is 12 × 12?",["124","144","132","154"],1],
["What is the square root of 169?",["11","12","13","14"],2],
["What is 25% of 200?",["25","40","50","75"],2],
["How many degrees are in a triangle?",["90","180","270","360"],1],
["What is the value of π (approx.)?",["2.14","3.14","4.13","3.41"],1],
["What is 7³?",["243","343","49","147"],1],
["Solve: 15 + 6 × 2",["42","27","30","21"],1],
["How many sides does a hexagon have?",["5","6","7","8"],1]]}
};
var app=document.getElementById("app"),Q=null,tm=null;
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function getBest(){try{return JSON.parse(localStorage.getItem("quizBest")||"{}")}catch(e){return {}}}
function setBest(c,s,t,p){try{var b=getBest();if(!b[c]||p>b[c].p){b[c]={s:s,t:t,p:p};localStorage.setItem("quizBest",JSON.stringify(b));return true}}catch(e){}return false}
function fmt(n){return Math.floor(n/60)+":"+("0"+(n%60)).slice(-2)}

function home(){
  clearInterval(tm);var b=getBest(),h='<h1>Online Quiz Application</h1><p class="sub">Choose a category. '+TIME/60+' minutes, multiple-choice, questions shuffled every attempt.</p><div class="grid">';
  Object.keys(DATA).forEach(function(c){
    var x=b[c];h+='<button class="cat" data-c="'+esc(c)+'"><span class="ic">'+DATA[c].ic+'</span><b>'+esc(c)+'</b><small>'+DATA[c].qs.length+' questions</small><div class="best">'+(x?'Best: '+x.s+'/'+x.t+' ('+x.p+'%)':'No attempt yet')+'</div></button>'});
  h+='</div>';app.innerHTML=h;
  app.querySelectorAll(".cat").forEach(function(el,i){el.onclick=function(){start(el.getAttribute("data-c"))};el.style.animationDelay=(i*90)+"ms";el.onmousemove=function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform="rotateY("+x*18+"deg) rotateX("+(-y*18)+"deg) translateZ(10px)"};el.onmouseleave=function(){el.style.transform=""}});
}
function start(c){
  var qs=shuffle(DATA[c].qs).map(function(q){var idx=shuffle([0,1,2,3]);return{q:q[0],o:idx.map(function(i){return q[1][i]}),a:idx.indexOf(q[2])}});
  Q={c:c,qs:qs,ans:qs.map(function(){return -1}),i:0,left:TIME};
  clearInterval(tm);tm=setInterval(function(){Q.left--;var t=document.getElementById("tm");if(t){t.textContent=fmt(Q.left);t.className="timer"+(Q.left<=15?" low":"")}if(Q.left<=0){submit()}},1000);
  show(1);
}
function show(an){
  var q=Q.qs[Q.i],n=Q.qs.length,h='<div class="top"><span>'+esc(Q.c)+' · Question '+(Q.i+1)+' of '+n+'</span><span class="timer'+(Q.left<=15?' low':'')+'" id="tm">'+fmt(Q.left)+'</span></div><div class="bar"><i style="width:'+((Q.i+1)/n*100)+'%"></i></div><div class="card qcard'+(an?' enter':'')+'"><p class="q">'+esc(q.q)+'</p>';
  q.o.forEach(function(o,k){h+='<button class="opt'+(Q.ans[Q.i]===k?' sel':'')+'" data-k="'+k+'">'+String.fromCharCode(65+k)+'. '+esc(o)+'</button>'});
  h+='</div><div class="nav"><button class="btn alt" id="pv"'+(Q.i?'':' disabled')+'>Previous</button>'+(Q.i<n-1?'<button class="btn" id="nx">Next</button>':'<button class="btn" id="sb">Submit Quiz</button>')+'</div>';
  app.innerHTML=h;
  app.querySelectorAll(".opt").forEach(function(el){el.onclick=function(){Q.ans[Q.i]=+el.getAttribute("data-k");show()}});
  var p=document.getElementById("pv"),x=document.getElementById("nx"),s=document.getElementById("sb");
  p.onclick=function(){Q.i--;show(1)};if(x)x.onclick=function(){Q.i++;show(1)};if(s)s.onclick=function(){var u=Q.ans.filter(function(a){return a<0}).length;if(!u||confirm(u+" question(s) unanswered. Submit anyway?"))submit()};
}
function submit(){
  clearInterval(tm);var t=Q.qs.length,ok=0,at=0;
  Q.qs.forEach(function(q,i){if(Q.ans[i]>=0){at++;if(Q.ans[i]===q.a)ok++}});
  var wr=at-ok,pc=Math.round(ok/t*100),nb=setBest(Q.c,ok,t,pc),b=getBest()[Q.c],used=TIME-Math.max(Q.left,0);
  var h='<div class="card score pop"><h2>'+esc(Q.c)+' · Results</h2><div class="big">'+ok+' / '+t+'</div><div>'+pc+'%'+(Q.left<=0?' · Time is up, auto-submitted':'')+'</div>'+(nb?'<div class="best">🏆 New best score!</div>':'')+'<div class="best">Best score: '+b.s+'/'+b.t+' ('+b.p+'%)</div>'
  +'<div class="stats"><div class="stat"><b>'+t+'</b><span>Total questions</span></div><div class="stat"><b>'+at+'</b><span>Attempted</span></div><div class="stat"><b style="color:var(--ok)">'+ok+'</b><span>Correct</span></div><div class="stat"><b style="color:var(--no)">'+wr+'</b><span>Incorrect</span></div></div><div class="best">Time taken: '+fmt(used)+' · Unattempted: '+(t-at)+'</div>'
  +'<div class="row"><button class="btn" id="rs">Restart Quiz</button><button class="btn alt" id="ac">Another Category</button></div></div><h2>Answer Review</h2>';
  Q.qs.forEach(function(q,i){
    var a=Q.ans[i],tag=a<0?'<span class="tag sk">Skipped</span>':a===q.a?'<span class="tag ok">Correct</span>':'<span class="tag no">Incorrect</span>';
    h+='<div class="card"><p class="q">'+(i+1)+'. '+esc(q.q)+tag+'</p>';
    q.o.forEach(function(o,k){var c=k===q.a?' right':k===a?' wrong':'';h+='<div class="opt'+c+'">'+String.fromCharCode(65+k)+'. '+esc(o)+(k===q.a?' ✓':k===a?' ✗ (your answer)':'')+'</div>'});
    h+='</div>'});
  app.innerHTML=h;window.scrollTo(0,0);
  document.getElementById("rs").onclick=function(){start(Q.c)};document.getElementById("ac").onclick=home;
}
home();
