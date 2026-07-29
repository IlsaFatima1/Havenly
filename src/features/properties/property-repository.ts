import { supabase } from '../../lib/supabase'
import type { Property, PropertyInput, PropertyStatus } from './types'

type Row={id:string;owner_id:string;title:string;description:string;price:number;purpose:Property['purpose'];property_type:Property['propertyType'];bedrooms:number;bathrooms:number;kitchen:number;parking:number;square_feet:number;city:string;area:string;address:string;latitude:number;longitude:number;images:string[];status:PropertyStatus;created_at:string;updated_at:string}
const LOCAL_KEY='haven-properties-dynamic-v2'
function localList():Property[]{try{return JSON.parse(localStorage.getItem(LOCAL_KEY)??'[]') as Property[]}catch{return[]}}
function localSave(items:Property[]){localStorage.setItem(LOCAL_KEY,JSON.stringify(items))}
export function fromRow(row:Row):Property{return{id:row.id,ownerId:row.owner_id,title:row.title,description:row.description,price:Number(row.price),purpose:row.purpose,propertyType:row.property_type,bedrooms:row.bedrooms,bathrooms:row.bathrooms,kitchen:row.kitchen,parking:row.parking,squareFeet:row.square_feet,city:row.city,area:row.area,address:row.address,latitude:Number(row.latitude),longitude:Number(row.longitude),mapLocation:`${row.latitude},${row.longitude}`,images:row.images,status:row.status,createdAt:row.created_at,updatedAt:row.updated_at}}
function toRow(input:PropertyInput){return{title:input.title,description:input.description,price:input.price,purpose:input.purpose,property_type:input.propertyType,bedrooms:input.bedrooms,bathrooms:input.bathrooms,kitchen:input.kitchen,parking:input.parking,square_feet:input.squareFeet,city:'Karachi',area:input.area,address:input.address,latitude:input.latitude,longitude:input.longitude,images:input.images}}
export const propertyRepository={
 async list(){
   if(supabase){
     try {
       const {data,error}=await supabase.from('properties').select('*').order('created_at',{ascending:false});
       if(!error && data) return (data as Row[]).map(fromRow);
       if(error) console.warn("Supabase list returned error, falling back locally:", error.message);
     } catch (e) {
       console.warn("Supabase list query failed, falling back to local storage", e);
     }
   }
   return localList();
 },
 async getById(id:string){
   if(supabase){
     try {
       const {data,error}=await supabase.from('properties').select('*').eq('id',id).maybeSingle();
       if(!error && data) return fromRow(data as Row);
       if(error) console.warn("Supabase getById returned error:", error.message);
     } catch (e) {
       console.warn("Supabase property query failed, falling back to local storage", e);
     }
   }
   return localList().find(property=>property.id===id)??null;
 },
 async create(input:PropertyInput,status:PropertyStatus){
   if(supabase){
     try {
       const {data:{user}}=await supabase.auth.getUser();
       if(user){
         const {data,error}=await supabase.from('properties').insert({...toRow(input),owner_id:user.id,status}).select().single();
         if(!error && data) return fromRow(data as Row);
         if(error) console.warn("Supabase insert returned error, saving locally:", error.message);
       }
     } catch (e) {
       console.warn("Supabase create failed, falling back to local storage", e);
     }
   }
   const now=new Date().toISOString();
   const property:Property={...input,id:crypto.randomUUID(),ownerId:'local-owner',status,createdAt:now,updatedAt:now};
   localSave([property,...localList()]);
   return property;
 },
 async update(id:string,input:PropertyInput){
   if(supabase){
     try {
       const {data,error}=await supabase.from('properties').update(toRow(input)).eq('id',id).select().single();
       if(!error && data) return fromRow(data as Row);
       if(error) console.warn("Supabase update returned error, updating locally:", error.message);
     } catch (e) {
       console.warn("Supabase update failed, falling back to local storage", e);
     }
   }
   const items=localList();
   const current=items.find(p=>p.id===id);
   if(!current)throw new Error('Property was not found.');
   const property={...current,...input,updatedAt:new Date().toISOString()};
   localSave(items.map(p=>p.id===id?property:p));
   return property;
 },
 async remove(id:string){
   if(supabase){
     try {
       const {error}=await supabase.from('properties').delete().eq('id',id);
       if(!error) return;
       if(error) console.warn("Supabase delete returned error, deleting locally:", error.message);
     } catch (e) {
       console.warn("Supabase delete failed, removing locally", e);
     }
   }
   localSave(localList().filter(p=>p.id!==id));
 },
 async status(id:string,status:PropertyStatus){
   if(supabase){
     try {
       const {data,error}=await supabase.from('properties').update({status}).eq('id',id).select().single();
       if(!error && data) return fromRow(data as Row);
       if(error) console.warn("Supabase status returned error, updating locally:", error.message);
     } catch (e) {
       console.warn("Supabase status update failed, setting locally", e);
     }
   }
   const items=localList();
   const current=items.find(p=>p.id===id);
   if(!current)throw new Error('Property was not found.');
   const property={...current,status,updatedAt:new Date().toISOString()};
   localSave(items.map(p=>p.id===id?property:p));
   return property;
 }
}
