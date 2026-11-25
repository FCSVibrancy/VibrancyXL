const assert=require('node:assert/strict');
const {driveEvidence,evidenceLinks}=require('../evidence-viewer.js');
const {markup,records}=require('../purpose-dashboard.js');
const fs=require('node:fs');
for(const bad of ['javascript:alert(1)','https://evil.example/file/d/abc','https://drive.google.com.evil.example/file/d/abc','http://drive.google.com/file/d/abc','https://x:secret@drive.google.com/file/d/abc',''])assert.equal(driveEvidence(bad),null);
assert.equal(driveEvidence('https://drive.google.com/file/d/abc123/view?resourcekey=secret').preview,'https://drive.google.com/file/d/abc123/preview?resourcekey=secret');
assert.equal(driveEvidence('https://drive.google.com/open?id=abc123').preview,'https://drive.google.com/file/d/abc123/preview');
assert.equal(driveEvidence('https://docs.google.com/document/d/abc123/edit').preview,'https://docs.google.com/document/d/abc123/preview');
assert.equal(driveEvidence('https://docs.google.com/spreadsheets/d/abc123/edit#gid=9').preview,'https://docs.google.com/spreadsheets/d/abc123/preview?gid=9');
assert.equal(driveEvidence('https://docs.google.com/presentation/d/abc123/edit').preview,'https://docs.google.com/presentation/d/abc123/embed');
assert.equal(driveEvidence('https://drive.google.com/drive/folders/abc123').preview,null);
const row={};for(let i=1;i<=7;i++){row[`evidence_${i}_url`]=`https://drive.google.com/file/d/file${i}/view`;row[`evidence_${i}_label`]=`Artifact ${i}`;}
assert.equal(evidenceLinks(row).length,6);delete row.evidence_2_url;assert.equal(evidenceLinks(row).length,5);
row.evidence_1_label='<script>alert(1)</script>';
const snapshot=JSON.parse(fs.readFileSync('data/learning-purpose.json'));
const data=records([snapshot.headers,...snapshot.rows]).map(r=>r.id==='curriculum'?{...r,...row}:r);
const html=markup(data,'current');assert.ok(!html.includes('<script>alert'));assert.ok(html.includes('&lt;script&gt;'));assert.equal((html.match(/data-evidence-id=/g)||[]).length,5);
console.log('Evidence tests passed: Drive preview URLs, resource keys, unsafe URL rejection, six-link limit, empty slots, and escaped labels.');
