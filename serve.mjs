import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {brotliCompress,constants} from 'node:zlib';
import {promisify} from 'node:util';
import {execFile} from 'node:child_process';
const args=process.argv.slice(2),option=(name,fallback)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1];};
const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const root=await fs.realpath(path.resolve(option('--dir',scriptDir)));
const port=Number(option('--port','4175'));
if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Choose a port from 1024 to 65535.');
const base='/' + String(option('--base','')).split('/').filter(Boolean).join('/');
const prefix=base==='/'?'':base;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.fbx':'application/octet-stream','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.wasm':'application/wasm'};
const packed=new Map(),compress=promisify(brotliCompress);
const server=http.createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'}).end();return;}
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(prefix&&pathname===prefix){res.writeHead(302,{'Location':prefix+'/'}).end();return;}
  if(prefix&&!pathname.startsWith(prefix+'/')){res.writeHead(404).end('Not found');return;}
  let relative=pathname.slice(prefix.length).replace(/^\/+/, '');if(!relative||relative.endsWith('/'))relative+='index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)||!mime[path.extname(file).toLowerCase()]){res.writeHead(404).end('Not found');return;}
  const real=await fs.realpath(file);if(!real.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  const info=await fs.stat(real);if(!info.isFile()){res.writeHead(404).end();return;}
  const etag='"'+info.size.toString(16)+'-'+Math.floor(info.mtimeMs).toString(16)+'"';
  const extension=path.extname(real).toLowerCase(),immutable=/[-][\w-]{8,}\.[a-z0-9]+$/i.test(path.basename(real));
  const headers={'Content-Type':mime[extension],'ETag':etag,'Cache-Control':immutable?'public, max-age=31536000, immutable':'no-cache','Vary':'Accept-Encoding','X-Content-Type-Options':'nosniff'};
  if(req.headers['if-none-match']===etag){res.writeHead(304,headers).end();return;}
  let data=await fs.readFile(real);
  if(/\bbr\b/.test(req.headers['accept-encoding']||'')&&['.html','.js','.css','.json','.fbx'].includes(extension)&&data.length>512){
   const key=real+etag;let compressed=packed.get(key);if(!compressed){compressed=compress(data,{params:{[constants.BROTLI_PARAM_QUALITY]:5}});packed.set(key,compressed);}data=await compressed;headers['Content-Encoding']='br';
  }
  headers['Content-Length']=String(data.length);res.writeHead(200,headers);res.end(req.method==='HEAD'?undefined:data);
 }catch(e){res.writeHead(e.code==='ENOENT'?404:400,{'Content-Type':'text/plain'}).end(e.code==='ENOENT'?'File not found':'Unable to read this request');}
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is already in use. Open the existing game, or run with --port 4176.`:error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>{
 const url=`http://127.0.0.1:${port}${prefix}/`;console.log(`RIDER DXB: ${url}\nKeep this window open while playing. Press Ctrl+C to stop.`);
 if(args.includes('--open')){
  if(process.platform==='win32')execFile('cmd.exe',['/c','start','',url]);
  else if(process.platform==='darwin')execFile('open',[url]);
  else execFile('xdg-open',[url]);
 }
});
