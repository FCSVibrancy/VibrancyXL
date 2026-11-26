'use strict';
// Prototype records only. Replace these examples with reviewed, permissioned evidence.
const experiences=window.VibrancyExperiences;
const cards = document.querySelector('#cards');
const dialog = document.querySelector('#detail');
const content = document.querySelector('#detail-content');
let clearCardEntrance=()=>{};
function render(){
 clearCardEntrance();
 cards.innerHTML=experiences.map(item=>`<article class="card card-${item.id}"><div class="photo ${item.images?'photo-collage':''}" aria-hidden="true">${item.images ? item.images.map((src,i)=>`<img src="${src}" alt="" class="collage-photo collage-photo-${i+1}" loading="lazy">`).join('') : item.image ? `<img src="${item.image}" alt="" class="standalone-photo">` : `<svg viewBox="${item.crop}" preserveAspectRatio="xMidYMid slice"><image href="assets/dashboard-reference.png" width="1586" height="992"/></svg>`}</div><div class="card-copy"><h2>${item.title}</h2><p>${item.question}</p><button data-id="${item.id}" aria-label="Explore Learning: ${item.title}">Explore Learning</button></div></article>`).join('');
 clearCardEntrance=animateEntrance(cards);

}
function openDetail(item){if(!item)return;openPurposeDashboard(id=>openDetail(experiences.find(item=>item.id===id)),item.id);}
cards.addEventListener('click',event=>{const button=event.target.closest('button[data-id]');if(button)openDetail(experiences.find(item=>item.id===button.dataset.id));});
dialog.addEventListener('close',()=>{dialog.classList.remove('purpose-dialog');openPurposeDashboard.requestId=null;});
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
document.querySelector('#review').addEventListener('click',()=>{dialog.classList.remove('purpose-dialog');content.innerHTML='<span class="tag">Suggested review process</span><h2 id="detail-title">How we review evidence</h2><p>Start with what a student says, makes, or does. Consider the learning goal and classroom context before drawing a conclusion.</p><h3>Look across sources</h3><p>Pair student explanations with work samples, observations, and revisions. A single photograph or artifact cannot establish learning growth.</p><h3>Look for change over time</h3><p>Compare earlier and later evidence against clear success criteria. Describe the change and the next learning step.</p><h3>Share with care</h3><p>Use school-approved permissions before publishing student images, names, recordings, or work. Review evidence for context and accessibility.</p><p class="school-note">This is a proposed process for this prototype, not an adopted district policy. All current examples and imagery are illustrative.</p>';dialog.showModal();});
render();

document.querySelectorAll('[data-experience]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();openDetail(experiences.find(item=>item.id===link.dataset.experience));}));
