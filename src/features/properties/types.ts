export type PropertyStatus = 'draft' | 'published' | 'archived' | 'sold' | 'rented'
export type PropertyPurpose = 'sale' | 'rent'
export type PropertyType = 'house' | 'apartment' | 'villa' | 'townhouse' | 'land' | 'commercial'

export type Property = {
  id: string
  ownerId: string
  title: string
  description: string
  price: number
  purpose: PropertyPurpose
  propertyType: PropertyType
  bedrooms: number
  bathrooms: number
  kitchen: number
  parking: number
  squareFeet: number
  city: string
  area: string
  address: string
  mapLocation: string
  latitude: number
  longitude: number
  images: string[]
  status: PropertyStatus
  createdAt: string
  updatedAt: string
}

export type PropertyInput = Omit<Property, 'id' | 'ownerId' | 'status' | 'createdAt' | 'updatedAt'>
