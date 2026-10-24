import React, {useEffect, useState} from 'react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';

const features=[
 ['Itinerary','https://itinerary.febro.id','Rencanakan perjalanan bersama.'],
 ['VoltLab','https://voltlab.febro.id','Belajar dan menghitung kelistrikan.'],
 ['Lamariva','https://lamariva.febro.id','Buat CV dan surat lamaran.'],
 ['Febro Space','https://eco.febro.id','Jelajahi tools dan fitur digital.'],
 ['QR Studio','https://qr.febro.id','Buat kode QR.'],
 ['Document Converter','https://convert.febro.id','Konversi dokumen.'],
 ['URL Shortener','https://short.febro.id','Persingkat tautan.'],
 ['Snippets','https://snip.febro.id','Kelola potongan kode.'],
 ['Receipt Generator','https://receipt.febro.id','Buat nota dengan mudah.'],
];
export default function SpaceFeatures({open,onOpenChange,welcome=false}){
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
  <DialogHeader><DialogTitle>{welcome?'Selamat! Kamu berhasil mendaftar di Febro Space':'Febro Space Features'}</DialogTitle>
  <DialogDescription>{welcome?'Akunmu siap digunakan untuk menjelajahi berbagai fitur Febro Space. Kamu akan kembali ke Receipt setelah menutup jendela ini.':'Jelajahi aplikasi dan fitur Febro Space.'}</DialogDescription></DialogHeader>
  <div className="grid gap-2 sm:grid-cols-2">{features.map(([name,url,desc])=><a key={url} href={url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border p-3 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"><strong className="block text-sm">{name} ↗</strong><span className="text-xs text-muted-foreground">{desc}</span></a>)}</div>
  <Button onClick={()=>onOpenChange(false)}>Kembali ke Receipt</Button>
 </DialogContent></Dialog>;
}
export function useSpaceWelcome(){
 const [welcome,setWelcome]=useState(false);
 useEffect(()=>{
  const u=new URL(window.location.href);
  if(u.searchParams.get('space_welcome')!=='1')return;
  u.searchParams.delete('space_welcome');
  window.history.replaceState(window.history.state,'',u.pathname+u.search+u.hash);
  setWelcome(true);
 },[]);
 return [welcome,setWelcome];
}
