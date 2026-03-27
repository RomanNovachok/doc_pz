export interface MarketplaceCsvRowModel {
  sellerExternalId: string;
  sellerName: string;
  sellerEmail: string;
  categoryPath: string;
  productAsin: string;
  productTitle: string;
  productType: 'Physical' | 'Digital';
  price: number;
  currency: string;
  stockQuantity: number;
  customerExternalId: string;
  customerFullName: string;
  customerEmail: string;
  orderExternalId: string;
  orderedAtUtc: string;
  orderStatus: string;
  quantity: number;
  shipmentExternalId: string;
  shipmentStatus: string;
  trackingNumber: string;
  destinationCountry: string;
  destinationCity: string;
  destinationStreet: string;
}
