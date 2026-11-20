export interface ShippingAddress {
  details: string;
  city: string;
  phone: string;
  postalCode?: string;
}
export interface SavedAddress extends ShippingAddress {
  _id: string;
  name: string;
}
