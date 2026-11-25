'use strict';
window.VibrancyMedia={
 source(value){if(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value||'')&&value.length<=45000)return value;if(!/^(https:\/\/|\/?assets\/|\/?[a-z0-9-]+\.html(?:[?#]|$))/.test(value||''))return '';try{const u=new URL(value,document.baseURI);return value&&(u.protocol==='https:'||u.origin===location.origin&&u.protocol===location.protocol)?u.href:'';}catch{return '';}},
 image(frame,src,alt=''){src=this.source(src);if(!frame||!src)return;const img=document.createElement('img');img.src=src;img.alt=alt;img.className=frame.classList.contains('photo')?'standalone-photo':'tile-image';frame.replaceChildren(img);},
 icon(frame,value){if(!frame)return;if(this.source(value)){this.image(frame,value);return;}frame.textContent=({book:'▤',network:'✦',grid:'▦',chart:'▥',people:'♟',star:'★'})[value]||value||'✦';},
 pages(root,records,select){
 root.querySelectorAll('[data-custom-tiles]').forEach(el=>el.remove());
 const tiles=records.filter(r=>r.selector?.startsWith('@tile:'));
 if(tiles.length){const section=document.createElement('section');section.className='custom-tiles';section.dataset.customTiles='';section.setAttribute('aria-label','More to explore');(root.querySelector('main')||root).append(section);
 for(const r of tiles){if(!select&&/^(false|no|0)$/i.test(r.visible))continue;const id=r.selector.slice(6),card=document.createElement('article');card.className='custom-tile';card.classList.toggle('preview-hidden',/^(false|no|0)$/i.test(r.visible));const frame=document.createElement('div');frame.className='custom-tile-frame';frame.dataset.tileFrame=id;const h=document.createElement('h2');h.textContent=r.value;const p=document.createElement('p');p.textContent=r.description;card.append(frame,h,p);const href=this.source(r.url);if(href&&!href.startsWith('data:')){const a=document.createElement('a');a.href=href;a.textContent='Explore';card.append(a);}section.append(card);select?.(card,r._row);}}
 for(const r of records){let frame;if(r.selector?.startsWith('@image:')||r.selector?.startsWith('@icon:'))frame=[...root.querySelectorAll('[data-tile-frame]')].find(el=>el.dataset.tileFrame===r.selector.split(':')[1]);else if(/^\.card-(purpose|thinking|voice|work|feedback|support|thriving) \.photo$/.test(r.selector))frame=root.querySelector(r.selector);else continue;
 if(!frame||!select&&/^(false|no|0)$/i.test(r.visible))continue;if(r.selector.startsWith('@icon:')){frame.classList.toggle('medallion',r.description!=='icon');frame.classList.toggle('tile-icon',r.description==='icon');this.icon(frame,r.value);}else this.image(frame,r.url,r.value);select?.(frame,r._row);
 }
 }
};
