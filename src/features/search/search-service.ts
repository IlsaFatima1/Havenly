import type { Property, PropertyPurpose, PropertyType } from '../properties/types'

export type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high'
export type SearchFilters = { query:string; city:string; area:string; minPrice:string; maxPrice:string; minSquareFeet:string; maxSquareFeet:string; bedrooms:string; bathrooms:string; purpose:''|PropertyPurpose; propertyType:''|PropertyType; sort:SortOption }
export const defaultFilters: SearchFilters = { query:'',city:'',area:'',minPrice:'',maxPrice:'',minSquareFeet:'',maxSquareFeet:'',bedrooms:'',bathrooms:'',purpose:'',propertyType:'',sort:'newest' }

export const marketplaceFixtures: Property[] = [
  {
    id: "fixture-karachi-1",
    ownerId: "system-owner-1",
    title: "Luxury 3-Bedroom Apartment in Clifton",
    description: "Stunning modern apartment overlooking Clifton beach. High-end finishes, 24/7 security, dedicated parking, and premium building amenities.",
    price: 150000,
    purpose: "rent",
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    kitchen: 1,
    parking: 1,
    squareFeet: 1800,
    city: "Karachi",
    area: "Clifton",
    address: "Block 4, Clifton, Karachi",
    mapLocation: "24.8138,67.0289",
    latitude: 24.8138,
    longitude: 67.0289,
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"],
    status: "published",
    createdAt: "2026-03-20T10:00:00.000Z",
    updatedAt: "2026-03-20T10:00:00.000Z"
  },
  {
    id: "fixture-karachi-2",
    ownerId: "system-owner-2",
    title: "Magnificent 5-Bedroom Luxury Villa in DHA Phase 6",
    description: "Exquisite newly constructed architect-designed villa featuring expansive living spaces, lush gardens, high ceilings, and double-height drawing room.",
    price: 85000000,
    purpose: "sale",
    propertyType: "villa",
    bedrooms: 5,
    bathrooms: 6,
    kitchen: 2,
    parking: 3,
    squareFeet: 4500,
    city: "Karachi",
    area: "DHA",
    address: "Khayaban-e-Hilal, Phase 6, DHA, Karachi",
    mapLocation: "24.7925,67.0683",
    latitude: 24.7925,
    longitude: 67.0683,
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"],
    status: "published",
    createdAt: "2026-03-22T14:30:00.000Z",
    updatedAt: "2026-03-22T14:30:00.000Z"
  },
  {
    id: "fixture-karachi-3",
    ownerId: "system-owner-3",
    title: "Renovated 4-Bedroom Townhouse in Bahadurabad",
    description: "Gorgeously renovated townhouse situated in the heart of Bahadurabad. Excellent road access, fully air-conditioned rooms, and modern built-in kitchen.",
    price: 42000000,
    purpose: "sale",
    propertyType: "townhouse",
    bedrooms: 4,
    bathrooms: 4,
    kitchen: 1,
    parking: 2,
    squareFeet: 2700,
    city: "Karachi",
    area: "Bahadurabad",
    address: "Alamgir Road, Bahadurabad, Karachi",
    mapLocation: "24.8823,67.0612",
    latitude: 24.8823,
    longitude: 67.0612,
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
    status: "published",
    createdAt: "2026-03-24T08:15:00.000Z",
    updatedAt: "2026-03-24T08:15:00.000Z"
  },
  {
    id: "fixture-karachi-4",
    ownerId: "system-owner-4",
    title: "Elegant 3-Bedroom Family House in Gulshan",
    description: "Comfortable single-story family home with airy bedrooms, expansive terrace, quiet surroundings, and walking distance to parks and schools.",
    price: 95000,
    purpose: "rent",
    propertyType: "house",
    bedrooms: 3,
    bathrooms: 3,
    kitchen: 1,
    parking: 1,
    squareFeet: 2000,
    city: "Karachi",
    area: "Gulshan-e-Iqbal",
    address: "Block 5, Gulshan-e-Iqbal, Karachi",
    mapLocation: "24.9180,67.0970",
    latitude: 24.9180,
    longitude: 67.0970,
    images: ["https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80"],
    status: "published",
    createdAt: "2026-03-25T11:45:00.000Z",
    updatedAt: "2026-03-25T11:45:00.000Z"
  }
]

export function searchProperties(source: Property[], filters: SearchFilters) {
  const q=filters.query.trim().toLowerCase(); const min=Number(filters.minPrice)||0; const max=Number(filters.maxPrice)||Infinity; const minSize=Number(filters.minSquareFeet)||0; const maxSize=Number(filters.maxSquareFeet)||Infinity
  const result=source.filter((p) => p.status==='published' && (!q || `${p.title} ${p.city} ${p.area} ${p.address}`.toLowerCase().includes(q)) && (!filters.city || p.city===filters.city) && (!filters.area || p.area===filters.area) && p.price>=min && p.price<=max && p.squareFeet>=minSize && p.squareFeet<=maxSize && (!filters.bedrooms || p.bedrooms>=Number(filters.bedrooms)) && (!filters.bathrooms || p.bathrooms>=Number(filters.bathrooms)) && (!filters.purpose || p.purpose===filters.purpose) && (!filters.propertyType || p.propertyType===filters.propertyType))
  return result.sort((a,b) => filters.sort==='price-low'?a.price-b.price:filters.sort==='price-high'?b.price-a.price:filters.sort==='oldest'?Date.parse(a.createdAt)-Date.parse(b.createdAt):Date.parse(b.createdAt)-Date.parse(a.createdAt))
}

export function suggestions(source:Property[],query:string) { const q=query.trim().toLowerCase(); if(q.length<2)return []; const values=new Set<string>(); source.forEach((p)=>{[p.title,p.city,p.area].forEach((v)=>{if(v.toLowerCase().includes(q))values.add(v)})}); return [...values].slice(0,6) }
