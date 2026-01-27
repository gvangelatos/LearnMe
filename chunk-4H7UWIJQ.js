import{Xa as I,d as c,e as h,g,i as d,j as m,k as f,l,q as R,t as E}from"./chunk-33V6LGE3.js";var A=(()=>{let o=class o{constructor(){this.http=E(I),this.MAX_RETRIES=50}getAllData(){return this.http.get("https://docs.google.com/spreadsheets/d/1yRrrjbgYoQRKOnXMzhAFIZUgCnulSp8XYKZg3EuG4q0/export?format=csv",{responseType:"text"}).pipe(c(t=>this.csvToJson(t)))}csvToJson(t){let e=t.split(`
`),r=e[0].split(",");return e.slice(1).map(s=>{let a=s.split(",");return r.reduce((n,i,u)=>(n[i.trim()]=a[u]?.trim(),n),{})})}getMaxId(){let e="https://docs.google.com/spreadsheets/d/1yRrrjbgYoQRKOnXMzhAFIZUgCnulSp8XYKZg3EuG4q0/gviz/tq?tq="+encodeURIComponent(`
    SELECT A
    ORDER BY A DESC
    LIMIT 1
  `);return this.http.get(e,{responseType:"text"}).pipe(c(r=>JSON.parse(r.substring(47,r.length-2)).table.rows[0]?.c[0]?.v??null))}getRandomWords(t,e=6){return this.getMaxId().pipe(l(r=>this.getSpecificWordsData(this.getRandomNumbersInRange(0,r,e,t??[]),e)))}getRandomWordWithArticle(){return this.getMaxId().pipe(l(t=>h(()=>this.fetchRandomOnce(t)).pipe(f({count:this.MAX_RETRIES}),g(e=>e.length>0),m(1),d([]))))}fetchRandomOnce(t){let r=`
      SELECT A, B, C, D, E
      WHERE D IS NOT NULL
      LIMIT 1
      OFFSET ${Math.floor(Math.random()*t)}
    `;return this.makeRequest(r)}fetchMatchingWords(t){let r=`
      SELECT A, B, C, D, E
      WHERE lower(B) CONTAINS lower('${t.replace(/'/g,"\\'")}')
    `;return this.makeRequest(r)}makeRequest(t){let e="https://docs.google.com/spreadsheets/d/1yRrrjbgYoQRKOnXMzhAFIZUgCnulSp8XYKZg3EuG4q0/gviz/tq?tq="+encodeURIComponent(t);return this.http.get(e,{responseType:"text"}).pipe(c(r=>{let s=JSON.parse(r.substring(47,r.length-2)),a=s.table.cols.map(n=>n.label);return s.table.rows.map(n=>{let i={};return n.c.forEach((u,S)=>{i[a[S]]=u?.v??null}),i})}))}getRandomNumbersInRange(t=0,e,r=5,s){let a=new Set;for(;a.size<r;){let n=Math.floor(Math.random()*(e-t+1))+t;s.includes(n)||a.add(n)}return Array.from(a)}getSpecificWordsData(t,e){let r=`
    SELECT A, B, C, D, E
    WHERE A = ${t[0]}
  `;for(let s=1;s<e;s++)r+=`OR A = ${t[s]}`;return this.makeRequest(r)}};o.\u0275fac=function(e){return new(e||o)},o.\u0275prov=R({token:o,factory:o.\u0275fac,providedIn:"root"});let p=o;return p})();export{A as a};
