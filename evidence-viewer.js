'use strict';
(function(root){
 function driveEvidence(raw){
  let url;try{url=new URL(String(raw).trim());}catch{return null;}
  if(url.protocol!=='https:'||!['drive.google.com','docs.google.com'].includes(url.hostname)||url.username||url.password||url.port)return null;
  let preview=null;const path=url.pathname;
  const file=path.match(/^\/file\/d\/([\w-]+)(?:\/|$)/);
  const doc=path.match(/^\/(document|spreadsheets|presentation)(?:\/u\/\d+)?\/d\/(e\/)?([\w-]+)(?:\/|$)/);
  if(file)preview=`https://drive.google.com/file/d/${file[1]}/preview`;
  else if(doc){const [,kind,published,id]=doc;
   preview=`https://docs.google.com/${kind}/d/${published||''}${id}/${kind==='presentation'?'embed':published?(kind==='spreadsheets'?'pubhtml':'pub'):'preview'}`;
   if(published&&kind==='document')preview+='?embedded=true';
  }else if(url.hostname==='drive.google.com'&&['/open','/uc','/preview'].includes(path)&&/^[\w-]+$/.test(url.searchParams.get('id')||''))preview=`https://drive.google.com/file/d/${url.searchParams.get('id')}/preview`;
  else if(!path.includes('/folders/'))return null;
  if(preview){const embed=new URL(preview);for(const key of ['resourcekey','gid']){const value=url.searchParams.get(key)||new URLSearchParams(url.hash.slice(1)).get(key);if(value)embed.searchParams.set(key,value);}preview=embed.href;}
  return {original:url.href,preview};
 }
 function evidenceLinks(row){
  return Array.from({length:6},(_,i)=>{const slot=i+1;const link=driveEvidence(row[`evidence_${slot}_url`]);return link?{...link,slot,label:row[`evidence_${slot}_label`]?.trim()||`Evidence ${slot}`}:null;}).filter(Boolean);
 }
 function openEvidence(link,trigger){
  const old=document.querySelector('#evidence-dialog');if(old)old.close();
  const dialog=document.createElement('dialog');dialog.id='evidence-dialog';dialog.className='evidence-dialog';dialog.setAttribute('aria-labelledby','evidence-title');
  const header=document.createElement('header');header.className='evidence-toolbar';
  const title=document.createElement('h2');title.id='evidence-title';title.textContent=link.label;
  const close=document.createElement('button');close.type='button';close.className='evidence-close';close.setAttribute('aria-label',`Close evidence and return to ${document.querySelector('#detail-title')?.textContent||'the learning dashboard'}`);close.textContent='×';close.addEventListener('click',()=>dialog.close());
  header.append(title,close);dialog.append(header);
  const note=document.createElement('p');note.className='evidence-help';note.append(document.createTextNode(link.preview?'Scroll inside the preview to see the full evidence. ':'This Drive item does not offer an embedded preview. '));
  const original=document.createElement('a');original.href=link.original;original.target='_blank';original.rel='noopener noreferrer';original.textContent='Open in Google Drive';note.append(original);dialog.append(note);
  if(link.preview){const frame=document.createElement('iframe');frame.src=link.preview;frame.title=link.label;frame.allowFullscreen=true;frame.referrerPolicy='no-referrer';dialog.append(frame);}
  else{const empty=document.createElement('p');empty.className='evidence-preview-message';empty.textContent='Use the Google Drive link above to view this folder.';dialog.append(empty);}
  const footer=document.createElement('p');footer.className='evidence-footer';footer.textContent='If a preview asks for permission or cannot load, open the file in Google Drive. Click outside this window or press Escape to return.';dialog.append(footer);
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();});
  dialog.addEventListener('cancel',event=>event.stopPropagation());
  dialog.addEventListener('close',()=>{dialog.querySelector('iframe')?.remove();dialog.remove();if(trigger?.isConnected)trigger.focus({preventScroll:true});},{once:true});
  document.body.append(dialog);dialog.showModal();
 }
 root.driveEvidence=driveEvidence;root.evidenceLinks=evidenceLinks;root.openEvidence=openEvidence;
 if(typeof module!=='undefined')module.exports={driveEvidence,evidenceLinks};
})(typeof window==='undefined'?globalThis:window);
