import { OrderItemModel } from '../models/order-item.model';
import { OrderModel } from '../models/order.model';
import { ShipmentModel } from '../models/shipment.model';

export interface OrderRepository {
  upsertOrder(input: Omit<OrderModel, 'id'>): Promise<OrderModel>;
  addOrderItemIfMissing(input: Omit<OrderItemModel, 'id'>): Promise<{ orderItem: OrderItemModel; created: boolean }>;
  upsertShipment(input: Omit<ShipmentModel, 'id'>): Promise<ShipmentModel>;
  findAllOrders(): Promise<OrderModel[]>;
  findAllOrderItems(): Promise<OrderItemModel[]>;
  findAllShipments(): Promise<ShipmentModel[]>;
  countOrders(): Promise<number>;
  countOrderItems(): Promise<number>;
  countShipments(): Promise<number>;
}
