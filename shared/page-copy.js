'use strict';
(function(root){
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function markup(value){return String(value??'').trim().split(/\r?\n\s*\r?\n/).filter(Boolean).map(paragraph=>'<p>'+escape(paragraph).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')+'</p>').join('');}
 function apply(element,value){let target=element;if(element.tagName==='P'){target=element.ownerDocument.createElement('div');target.className=element.className;element.replaceWith(target);}target.classList.add('learning-description');target.innerHTML=markup(value);return target;}
 const api={markup,apply};root.VibrancyPageCopy=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
