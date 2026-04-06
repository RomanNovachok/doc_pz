export interface ShipmentModel {
  id: number;
  externalId: string;
  orderId: number;
  status: string;
  trackingNumber: string;
  destinationCountry: string;
  destinationCity: string;
  destinationStreet: string;
}
