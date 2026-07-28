export type AdminSection='overview'|'users'|'properties'|'reports'|'fake-listings'|'revenue'
export type AdminUserStatus='active'|'suspended'|'pending'
export type AdminUser={id:string;name:string;email:string;role:'Buyer'|'Owner'|'Agent';status:AdminUserStatus;verified:boolean;properties:number;joinedAt:string;revenue:number}
export type ModerationStatus='pending'|'approved'|'rejected'|'sold'|'flagged'
export type AdminProperty={id:string;title:string;owner:string;city:string;type:string;price:number;status:ModerationStatus;risk:number;reports:number;createdAt:string;image:string}
export type ReportReason='Fraud'|'Duplicate'|'Misleading'|'Unavailable'|'Spam'
export type AdminReport={id:string;propertyId:string;propertyTitle:string;reporter:string;reason:ReportReason;details:string;status:'open'|'investigating'|'resolved'|'dismissed';createdAt:string;priority:'low'|'medium'|'high'|'critical'}
