import http from 'node:http';
import {randomBytes,createHash,createPublicKey,verify} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
const issuer='https://auth.febro.id',client='febro-receipt',origin='https://receipt.febro.id',redirect=origin+'/auth/callback';
const secret=process.env.RECEIPT_OIDC_SECRET;
if(!secret)throw Error('RECEIPT_OIDC_SECRET missing');
const dir=process.env.RECEIPT_DATA_DIR||'/opt/receipt/data';fs.mkdirSync(dir,{recursive:true,mode:0o700});
const db=new DatabaseSync(path.join(dir,'auth.sqlite'));
db.exec('CREATE TABLE IF NOT EXISTS flows(state TEXT PRIMARY KEY,verifier TEXT,nonce TEXT,return_to TEXT,expires INTEGER);CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,user_id TEXT,name TEXT,email TEXT,expires INTEGER);CREATE TABLE IF NOT EXISTS seen_users(id TEXT PRIMARY KEY);');
const random=()=>randomBytes(32).toString('base64url'),hash=s=>createHash('sha256').update(s).digest('base64url');
const cookie=(name,value,age)=>name+'='+value+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age='+age;
const cookies=req=>Object.fromEntries((req.headers.cookie||'').split(';').map(x=>x.trim().split('=').slice(0,2)).filter(x=>x.length===2));
const json=(res,status,obj,headers={})=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store',...headers});res.end(JSON.stringify(obj));};
const go=(res,url,headers={})=>{res.writeHead(302,{Location:url,'Cache-Control':'no-store',...headers});res.end();};
let keys=null,until=0;
async function validate(jwt,nonce){
 const parts=jwt?.split('.');if(parts?.length!==3)throw Error('Invalid ID token');
 const [h,p,s]=parts,head=JSON.parse(Buffer.from(h,'base64url')),body=JSON.parse(Buffer.from(p,'base64url'));
 if(head.alg!=='RS256'||body.iss!==issuer||body.aud!==client||body.nonce!==nonce||body.token_use!=='id'||body.email_verified!==true||body.exp<=Date.now()/1000||body.iat>Date.now()/1000+30)throw Error('Invalid token claims');
 if(!keys||until<Date.now()){const r=await fetch(issuer+'/oauth/jwks');if(!r.ok)throw Error('JWKS unavailable');keys=(await r.json()).keys;until=Date.now()+300000;}
 const k=keys.find(x=>x.kid===head.kid&&x.alg==='RS256');if(!k||!verify('RSA-SHA256',Buffer.from(h+'.'+p),createPublicKey({key:k,format:'jwk'}),Buffer.from(s,'base64url')))throw Error('Invalid token signature');
 return body;
}
const server=http.createServer(async(req,res)=>{try{
 const u=new URL(req.url,'http://localhost');
 if(u.pathname==='/health')return json(res,200,{ok:true});
 if(u.pathname==='/auth/login'){
  const state=random(),verifier=random()+random(),nonce=random();
  const target=u.searchParams.get('return_to')||'/generator';
  const returnTo=target.startsWith('/')&&!target.startsWith('//')&&!target.includes('\\')?target:'/generator';
  db.prepare('INSERT INTO flows VALUES(?,?,?,?,?)').run(hash(state),verifier,nonce,returnTo,Date.now()+300000);
  const q=new URLSearchParams({client_id:client,redirect_uri:redirect,response_type:'code',scope:'openid email profile',state,nonce,code_challenge:hash(verifier),code_challenge_method:'S256'});
  return go(res,issuer+'/oauth/authorize?'+q,{'Set-Cookie':cookie('receipt_flow',state,300)});
 }
 if(u.pathname==='/auth/callback'){
  const state=u.searchParams.get('state'),code=u.searchParams.get('code');
  if(!state||!code||state!==cookies(req).receipt_flow)throw Error('Invalid state');
  const flow=db.prepare('DELETE FROM flows WHERE state=? RETURNING *').get(hash(state));
  if(!flow||flow.expires<Date.now())throw Error('Expired login attempt');
  const t=await fetch(issuer+'/oauth/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'authorization_code',code,client_id:client,client_secret:secret,redirect_uri:redirect,code_verifier:flow.verifier})});
  if(!t.ok)throw Error('Token exchange failed: '+t.status);
  const claims=await validate((await t.json()).id_token,flow.nonce);
  const sid=random(),first=!db.prepare('SELECT id FROM seen_users WHERE id=?').get(claims.sub);
  db.prepare('INSERT OR IGNORE INTO seen_users VALUES(?)').run(claims.sub);
  db.prepare('INSERT INTO sessions VALUES(?,?,?,?,?)').run(hash(sid),claims.sub,claims.name||'',claims.email||'',Date.now()+86400000);
  const destination=new URL(flow.return_to,origin);if(first)destination.searchParams.set('space_welcome','1');
  return go(res,destination.href,{'Set-Cookie':[cookie('receipt_sid',sid,86400),cookie('receipt_flow','',0)]});
 }
 if(u.pathname==='/api/me'){
  const sid=cookies(req).receipt_sid;const s=sid?db.prepare('SELECT * FROM sessions WHERE id=? AND expires>?').get(hash(sid),Date.now()):null;
  return json(res,200,{user:s?{id:s.user_id,name:s.name,email:s.email}:null});
 }
 if(u.pathname==='/api/logout'&&req.method==='POST'){
  if(req.headers.origin!==origin)return json(res,403,{error:'Invalid origin'});
  const sid=cookies(req).receipt_sid;if(sid)db.prepare('DELETE FROM sessions WHERE id=?').run(hash(sid));
  return json(res,200,{ok:true},{'Set-Cookie':cookie('receipt_sid','',0)});
 }
 return json(res,404,{error:'Not found'});
 }catch(e){console.error(e);return json(res,400,{error:e.message});}});
server.listen(Number(process.env.RECEIPT_AUTH_PORT||3102),'127.0.0.1',()=>console.log('Receipt SSO ready'));
