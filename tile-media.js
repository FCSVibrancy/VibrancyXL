'use strict';
window.VibrancyMedia={
 areaNavigation(root,page){
 const areas={learning:'Vibrant Learning',ecosystem:'Vibrant Ecosystem',logistics:'Vibrant Logistics of Learning',accountability:'Vibrant Accountability','culture-community':'Vibrant Culture and Community',journey:'The Journey to Local Accountability'};
 if(!areas[page])return;
 root.querySelectorAll('dialog').forEach(dialog=>{
 if(dialog.querySelector('.area-return'))return;
 const nav=document.createElement('nav');nav.className='area-return';nav.setAttribute('aria-label','Return to area homepage');
 const link=document.createElement('a');link.href=page+'.html';link.textContent='← Back to '+areas[page]+' Homepage';
 link.addEventListener('click',event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();dialog.close();});
 nav.append(link);dialog.prepend(nav);
 });
 },
 source(value){if(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value||'')&&value.length<=45000)return value;if(!/^(https:\/\/|\/?assets\/|\/?[a-z0-9-]+\.html(?:[?#]|$))/.test(value||''))return '';try{const u=new URL(value,document.baseURI);return value&&(u.protocol==='https:'||u.origin===location.origin&&u.protocol===location.protocol)?u.href:'';}catch{return '';}},
 image(frame,src,alt=''){src=this.source(src);if(!frame||!src)return;const img=document.createElement('img');img.src=src;img.alt=alt;img.className=frame.classList.contains('photo')?'standalone-photo':'tile-image';frame.replaceChildren(img);},
 icon(frame,value){if(!frame)return;if(this.source(value)){this.image(frame,value);return;}frame.textContent=({book:'▤',network:'✦',grid:'▦',chart:'▥',people:'♟',star:'★'})[value]||value||'✦';},
 pages(root,records,select){
 const hidden=r=>/^(false|no|0)$/i.test(r?.visible||'');
 const visibility=key=>records.find(r=>r.selector==='@visibility:'+key);
 const order=(key,fallback)=>{const row=records.find(r=>r.selector==='@order:'+key);return row?.value?.trim()&&Number.isFinite(Number(row.value))?Number(row.value):fallback;};
 root.querySelectorAll('[data-custom-tiles],[data-custom-tile]').forEach(el=>el.remove());
 const cards=root.querySelector('.cards'),tiles=records.filter(r=>r.selector?.startsWith('@tile:'));
 let target=cards;
 if(tiles.length&&!target){target=document.createElement('section');target.className='custom-tiles';target.dataset.customTiles='';target.setAttribute('aria-label','More to explore');(root.querySelector('main')||root).append(target);}
 const items=[];
 if(cards)cards.querySelectorAll('.card').forEach((el,i)=>{const key=[...el.classList].find(c=>c.startsWith('card-'))?.slice(5);if(!key)return;const row=visibility(key);el.hidden=!select&&hidden(row);if(select){el.classList.toggle('preview-hidden',hidden(row));if(row)select(el,row._row);}items.push({el,key,order:order(key,i+1),index:i});});
 for(const [i,r] of tiles.entries()){
 const id=r.selector.slice(6),removed=hidden(visibility(id)||r);if(!select&&removed)continue;
 const card=document.createElement('article');card.className='custom-tile';card.dataset.customTile=id;card.classList.toggle('preview-hidden',removed);
 const frame=document.createElement('div');frame.className='custom-tile-frame';frame.dataset.tileFrame=id;
 const h=document.createElement('h2');h.textContent=r.value;const p=document.createElement('p');p.textContent=r.description;card.append(frame,h,p);
 const href=this.source(r.url);if(href&&!href.startsWith('data:')){const a=document.createElement('a');a.href=href;a.textContent='Explore';card.append(a);}target.append(card);select?.(card,r._row);
 items.push({el:card,key:id,order:order(id,(cards?7:0)+i+1),index:(cards?7:0)+i});
 }
 if(target)items.sort((a,b)=>a.order-b.order||a.index-b.index).forEach(item=>target.append(item.el));
 for(const r of records){
 let frame;if(r.selector?.startsWith('@image:')||r.selector?.startsWith('@icon:'))frame=[...root.querySelectorAll('[data-tile-frame]')].find(el=>el.dataset.tileFrame===r.selector.split(':')[1]);
 else if(/^\.card-(purpose|thinking|voice|work|feedback|support|thriving) \.photo$/.test(r.selector))frame=root.querySelector(r.selector);else continue;
 if(!frame||hidden(r))continue;
 if(r.selector.startsWith('@icon:')){frame.classList.toggle('medallion',r.description!=='icon');frame.classList.toggle('tile-icon',r.description==='icon');this.icon(frame,r.value);}else this.image(frame,r.url,r.value);
 select?.(frame,r._row);
 }
 }
};
