const {OAuth2Client,GoogleAuth}=require('google-auth-library');
const crypto=require('node:crypto');
const ID='1NJTD9kym-A6BeEFsEXm8bsCVG5jSE0EAjYuR5lAXpAU';
const OWNER='brian.creasman@fleming.kyschools.us';
const tabs={Homepage:'A1:I200',Sheet1:'A1:Z250',Alignment:'A4:D100',SiteContent:'A1:F200'};
function revision(values){return crypto.createHash('sha256').update(JSON.stringify(values)).digest('hex');}
function imageData(v){return typeof v==='string'&&v.length<=45000&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(v);}
function validate(changes,values){
 if(!Array.isArray(changes)||!changes.length||changes.length>150)throw Error('Choose between 1 and 150 fields to publish.');
 const seen=new Set();
 for(const c of changes){const key=c.row+':'+c.col;if(seen.has(key))throw Error('Duplicate field.');seen.add(key);
 if(!Number.isInteger(c.row)||c.row<1||c.row>=values.length||!Number.isInteger(c.col)||c.col<0||c.col>=values[0].length||typeof c.value!=='string'||c.value.length>(imageData(c.value)?45000:10000))throw Error('Invalid field.');
 if(String(values[c.row]?.[c.col]??'').startsWith('='))throw Error('Formulas are protected.');
 const field=values[0][c.col];if(['id','type','experience_id','page','selector'].includes(field))throw Error('Record identifiers are protected.');
 if(field==='percent'&&c.value.trim()&&(!Number.isFinite(Number(c.value.replace(/%$/,'')))||Number(c.value.replace(/%$/,''))<0||Number(c.value.replace(/%$/,''))>100))throw Error('Percent must be blank or 0–100.');
 if(/url$/.test(field)&&c.value&&!imageData(c.value)&&!/^(https:\/\/|(?:assets\/|[a-z0-9-]+\.html(?:[?#]|$)))/i.test(c.value))throw Error('Use an HTTPS URL or a local page or asset.');
 }
}
function validateAdditions(additions,tab,values){
 if(!Array.isArray(additions)||additions.length>30)throw Error('Add at most 30 records at a time.');
 if(!additions.length)return;
 const width=tab==='Homepage'?9:6,limit=200;
 if(additions.length&&!['Homepage','SiteContent'].includes(tab))throw Error('Cannot add records here.');
 if(values.length+additions.length>limit)throw Error('This area is full (200 rows).');
 const pages=['learning','ecosystem','logistics','accountability','culture-community','journey'];
 for(const row of additions){
 if(!Array.isArray(row)||row.length!==width||row.some(v=>typeof v!=='string'||v.length>(imageData(v)?45000:10000)))throw Error('Invalid new record.');
 if(tab==='Homepage'){if(row[0]!=='tile'||!/^custom-[a-z0-9-]+$/.test(row[1]))throw Error('Invalid tile.');}
 else if(!pages.includes(row[0])||!/^@(tile|image|icon):custom-[a-z0-9-]+$/.test(row[1])&&!/^@(order|visibility):(custom-[a-z0-9-]+|purpose|thinking|voice|work|feedback|support|thriving)$/.test(row[1])&&!/^\.card-(purpose|thinking|voice|work|feedback|support|thriving) \.photo$/.test(row[1]))throw Error('Invalid page tile.');
 const urlCol=4;if(row[urlCol]&&!imageData(row[urlCol])&&!/^(https:\/\/|(?:assets\/|[a-z0-9-]+\.html(?:[?#]|$)))/i.test(row[urlCol]))throw Error('Invalid tile URL.');
 }
}
async function authorize(req){const token=req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];if(!token){const e=Error('Sign in to continue.');e.status=401;throw e;}
 const ticket=await new OAuth2Client(process.env.GOOGLE_CLIENT_ID).verifyIdToken({idToken:token,audience:process.env.GOOGLE_CLIENT_ID});const p=ticket.getPayload();
 if(!p.email_verified||p.email!==OWNER||p.sub!=='111629863080092056219'){const e=Error('This control board is private.');e.status=403;throw e;}}
async function sheets(path,options={}){const auth=new GoogleAuth({credentials:{client_email:process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,private_key:process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,'\n')},scopes:['https://www.googleapis.com/auth/spreadsheets']});const client=await auth.getClient();return (await client.request({url:`https://sheets.googleapis.com/v4/spreadsheets/${ID}${path}`,...options})).data;}
module.exports={ID,OWNER,tabs,revision,validate,validateAdditions,imageData,authorize,sheets};
