import type { SearchFilters } from '../search/search-service'
import type { Property } from '../properties/types'
export type AITask='title'|'description'|'price'|'search'|'recommend'|'chat'
export type ListingContext=Pick<Property,'title'|'description'|'price'|'purpose'|'propertyType'|'bedrooms'|'bathrooms'|'kitchen'|'parking'|'squareFeet'|'city'|'area'|'address'>
export type SearchAIResult={filters:SearchFilters;summary:string;assumptions:string[]}
export type PriceAIResult={suggestedPrice:number;low:number;high:number;confidence:number;rationale:string;currency:string}
export type RecommendationAIResult={propertyIds:string[];reason:string}
export type ChatAIResult={answer:string;suggestedPrompts:string[];propertyIds:string[]}
