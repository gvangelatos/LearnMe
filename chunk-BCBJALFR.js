import{bb as I,d as l,e as d,g as m,i as g,j as h,k as f,l as u,q as R,t as E}from"./chunk-RTO6WDIM.js";var y=(()=>{let i=class i{constructor(){this.http=E(I),this.MAX_RETRIES=50}getAllData(){return this.http.get("https://docs.google.com/spreadsheets/d/1yRrrjbgYoQRKOnXMzhAFIZUgCnulSp8XYKZg3EuG4q0/export?format=csv",{responseType:"text"}).pipe(l(t=>this.csvToJson(t)))}csvToJson(t){let e=t.split(`
`),r=e[0].split(",");return e.slice(1).map(s=>{let o=s.split(",");return r.reduce((n,a,c)=>(n[a.trim()]=o[c]?.trim(),n),{})})}getMaxId(){let e="https://docs.google.com/spreadsheets/d/1yRrrjbgYoQRKOnXMzhAFIZUgCnulSp8XYKZg3EuG4q0/gviz/tq?tq="+encodeURIComponent(`
    SELECT A
    ORDER BY A DESC
    LIMIT 1
  `);return this.http.get(e,{responseType:"text"}).pipe(l(r=>JSON.parse(r.substring(47,r.length-2)).table.rows[0]?.c[0]?.v??null))}getRandomWords(t,e=4){return this.getMaxId().pipe(u(r=>this.getSpecificWordsData(this.getRandomNumbersInRange(1,r,e,t??[]),e)))}getRandomWordWithArticle(){return this.getMaxId().pipe(u(t=>d(()=>this.fetchRandomOnce(t)).pipe(f({count:this.MAX_RETRIES}),m(e=>e.length>0),h(1),g([]))))}getRandomWordsWithArticle(t=1){return this.fetchAllIDsWithArticles().pipe(l(e=>e.map(r=>+r.id)),u(e=>this.getSpecificWordsData(this.selectRandomNumbers(e,t),t)),h(1))}selectRandomNumbers(t,e,r=[]){let o=[...t.filter(a=>!r.includes(a))],n=[];for(let a=0;a<e;a++){let c=Math.floor(Math.random()*o.length);n.push(o[c]),o.splice(c,1)}return n}fetchAllIDsWithArticles(){return this.makeRequest(`
      SELECT A
      WHERE D IS NOT NULL
    `)}fetchRandomOnce(t){let r=`
      SELECT A, B, C, D, E
      WHERE D IS NOT NULL
      LIMIT 1
      OFFSET ${Math.floor(Math.random()*t)}
    `;return this.makeRequest(r)}fetchMatchingWords(t){let r=`
      SELECT A, B, C, D, E
      WHERE lower(B) CONTAINS lower('${t.replace(/'/g,"\\'")}')
    `;return this.makeRequest(r)}makeRequest(t){let e="https://docs.google.com/spreadsheets/d/1yRrrjbgYoQRKOnXMzhAFIZUgCnulSp8XYKZg3EuG4q0/gviz/tq?tq="+encodeURIComponent(t);return this.http.get(e,{responseType:"text"}).pipe(l(r=>{let s=JSON.parse(r.substring(47,r.length-2)),o=s.table.cols.map(n=>n.label);return s.table.rows.map(n=>{let a={};return n.c.forEach((c,S)=>{a[o[S]]=c?.v??null}),a})}))}getRandomNumbersInRange(t=1,e,r=5,s){let o=new Set;for(;o.size<r;){let n=Math.floor(Math.random()*(e-t+1))+t;s.includes(n)||o.add(n)}return Array.from(o)}getSpecificWordsData(t,e){let r=`
    SELECT A, B, C, D, E
    WHERE A = ${t[0]}
  `;for(let s=1;s<e;s++)r+=` OR A = ${t[s]}`;return this.makeRequest(r)}};i.\u0275fac=function(e){return new(e||i)},i.\u0275prov=R({token:i,factory:i.\u0275fac,providedIn:"root"});let p=i;return p})();export{y as a};
