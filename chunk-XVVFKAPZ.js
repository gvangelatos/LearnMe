import{b as p,c as h,e as g,f as d,g as m,h as R,i as l,ia as I,k as f,m as E}from"./chunk-AH3Y4GLI.js";var T=(()=>{let s=class s{constructor(){this.http=E(I),this.MAX_RETRIES=50}getAllData(){return this.http.get("https://docs.google.com/spreadsheets/d/1yRrrjbgYoQRKOnXMzhAFIZUgCnulSp8XYKZg3EuG4q0/export?format=csv",{responseType:"text"}).pipe(p(t=>this.csvToJson(t)))}csvToJson(t){let e=t.split(`
`),r=e[0].split(",");return e.slice(1).map(o=>{let a=o.split(",");return r.reduce((n,c,i)=>(n[c.trim()]=a[i]?.trim(),n),{})})}getMaxId(){let e="https://docs.google.com/spreadsheets/d/1yRrrjbgYoQRKOnXMzhAFIZUgCnulSp8XYKZg3EuG4q0/gviz/tq?tq="+encodeURIComponent(`
    SELECT A
    ORDER BY A DESC
    LIMIT 1
  `);return this.http.get(e,{responseType:"text"}).pipe(p(r=>JSON.parse(r.substring(47,r.length-2)).table.rows[0]?.c[0]?.v??null))}getRandomWords(t){return this.getMaxId().pipe(l(e=>this.getSpecificWordsData(this.getRandomNumbersInRange(0,e,6,t??[]))))}getRandomWordWithArticle(){return this.getMaxId().pipe(l(t=>h(()=>this.fetchRandomOnce(t)).pipe(R({count:this.MAX_RETRIES}),g(e=>e.length>0),m(1),d([]))))}fetchRandomOnce(t){let r=`
      SELECT A, B, C, D, E
      WHERE D IS NOT NULL
      LIMIT 1
      OFFSET ${Math.floor(Math.random()*t)}
    `;return this.makeRequest(r)}makeRequest(t){let e="https://docs.google.com/spreadsheets/d/1yRrrjbgYoQRKOnXMzhAFIZUgCnulSp8XYKZg3EuG4q0/gviz/tq?tq="+encodeURIComponent(t);return this.http.get(e,{responseType:"text"}).pipe(p(r=>{let o=JSON.parse(r.substring(47,r.length-2)),a=o.table.cols.map(n=>n.label);return o.table.rows.map(n=>{let c={};return n.c.forEach((i,A)=>{c[a[A]]=i?.v??null}),c})}))}getRandomNumbersInRange(t=0,e,r=5,o){let a=new Set;for(;a.size<r;){let n=Math.floor(Math.random()*(e-t+1))+t;o.includes(n)||a.add(n)}return Array.from(a)}getSpecificWordsData(t){let e=`
    SELECT A, B, C, D, E
    WHERE A = ${t[0]} OR A = ${t[1]} OR A = ${t[2]} OR A = ${t[3]} OR A = ${t[4]} OR A = ${t[5]}
  `;return this.makeRequest(e)}};s.\u0275fac=function(e){return new(e||s)},s.\u0275prov=f({token:s,factory:s.\u0275fac,providedIn:"root"});let u=s;return u})();export{T as a};
