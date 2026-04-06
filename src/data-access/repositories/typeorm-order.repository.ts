import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepository } from '../../business/interfaces/order-repository.interface';
import { OrderItemModel } from '../../business/models/order-item.model';
import { OrderModel } from '../../business/models/order.model';
import { ShipmentModel } from '../../business/models/shipment.model';
import { OrderEntity } from '../entities/order.entity';
import { OrderItemEntity } from '../entities/order-item.entity';
import { ShipmentEntity } from '../entities/shipment.entity';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity) private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(ShipmentEntity) private readonly shipmentRepository: Repository<ShipmentEntity>,
  ) {}

  async upsertOrder(input: Omit<OrderModel, 'id'>): Promise<OrderModel> {
    let order = await this.orderRepository.findOne({ where: { externalId: input.externalId } });
    if (!order) {
      order = this.orderRepository.create(input);
    } else {
      order.customerId = input.customerId;
      order.orderedAtUtc = input.orderedAtUtc;
      order.status = input.status;
    }

    return this.toOrderModel(await this.orderRepository.save(order));
  }

  async addOrderItemIfMissing(input: Omit<OrderItemModel, 'id'>): Promise<{ orderItem: OrderItemModel; created: boolean }> {
    let orderItem = await this.orderItemRepository.findOne({
      where: { orderId: input.orderId, listingId: input.listingId },
    });

    let created = false;
    if (!orderItem) {
      created = true;
      orderItem = this.orderItemRepository.create(input);
    } else {
      orderItem.quantity = input.quantity;
      orderItem.unitPrice = input.unitPrice;
    }

    orderItem = await this.orderItemRepository.save(orderItem);
    return { orderItem: this.toOrderItemModel(orderItem), created };
  }

  async upsertShipment(input: Omit<ShipmentModel, 'id'>): Promise<ShipmentModel> {
    let shipment = await this.shipmentRepository.findOne({ where: [{ externalId: input.externalId }, { orderId: input.orderId }] });
    if (!shipment) {
      shipment = this.shipmentRepository.create(input);
    } else {
      shipment.externalId = input.externalId;
      shipment.orderId = input.orderId;
      shipment.status = input.status;
      shipment.trackingNumber = input.trackingNumber;
      shipment.destinationCountry = input.destinationCountry;
      shipment.destinationCity = input.destinationCity;
      shipment.destinationStreet = input.destinationStreet;
    }

    return this.toShipmentModel(await this.shipmentRepository.save(shipment));
  }

  async findAllOrders(): Promise<OrderModel[]> {
    return (await this.orderRepository.find({ order: { id: 'ASC' } })).map((entity) => this.toOrderModel(entity));
  }

  async findAllOrderItems(): Promise<OrderItemModel[]> {
    return (await this.orderItemRepository.find({ order: { id: 'ASC' } })).map((entity) => this.toOrderItemModel(entity));
  }

  async findAllShipments(): Promise<ShipmentModel[]> {
    return (await this.shipmentRepository.find({ order: { id: 'ASC' } })).map((entity) => this.toShipmentModel(entity));
  }

  countOrders(): Promise<number> {
    return this.orderRepository.count();
  }

  countOrderItems(): Promise<number> {
    return this.orderItemRepository.count();
  }

  countShipments(): Promise<number> {
    return this.shipmentRepository.count();
  }

  private toOrderModel(entity: OrderEntity): OrderModel {
    return {
      id: entity.id,
      externalId: entity.externalId,
      customerId: entity.customerId,
      orderedAtUtc: entity.orderedAtUtc,
      status: entity.status,
    };
  }

  private toOrderItemModel(entity: OrderItemEntity): OrderItemModel {
    return {
      id: entity.id,
      orderId: entity.orderId,
      listingId: entity.listingId,
      quantity: entity.quantity,
      unitPrice: entity.unitPrice,
    };
  }

  private toShipmentModel(entity: ShipmentEntity): ShipmentModel {
    return {
      id: entity.id,
      externalId: entity.externalId,
      orderId: entity.orderId,
      status: entity.status,
      trackingNumber: entity.trackingNumber,
      destinationCountry: entity.destinationCountry,
      destinationCity: entity.destinationCity,
      destinationStreet: entity.destinationStreet,
    };
  }
}
