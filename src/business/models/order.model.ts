export interface OrderModel {
  id: number;
  externalId: string;
  customerId: number;
  orderedAtUtc: string;
  status: string;
}
