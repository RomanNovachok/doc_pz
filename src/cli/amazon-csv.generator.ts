import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export class AmazonCsvGenerator {
  async generate(outputPath: string, rowCount: number): Promise<{ outputPath: string; rowCount: number }> {
    const finalRowCount = rowCount < 1000 ? 1000 : rowCount;
    const absolutePath = resolve(outputPath);
    await mkdir(dirname(absolutePath), { recursive: true });

    const categories = [
      'Electronics>Computers>Laptops',
      'Electronics>Audio>Headphones',
      'Books>Technology>Software Engineering',
      'Home & Kitchen>Appliances>Coffee Machines',
      'Toys & Games>Board Games>Strategy',
    ];

    const productTitles = [
      'Nova Laptop 14',
      'EchoSound Pro Headphones',
      'Patterns for Scalable Systems',
      'Barista Smart Brewer',
      'Kingdoms of Logic',
    ];

    const cities = ['Kyiv', 'Lviv', 'Odesa', 'Dnipro', 'Kharkiv'];
    const streets = ['Shevchenka 10', 'Soborna 25', 'Centralna 7', 'Independence 18', 'Naukova 12'];
    const orderStatuses = ['Created', 'Paid', 'Packed', 'Shipped', 'Delivered'];
    const shipmentStatuses = ['Preparing', 'InTransit', 'Delivered'];

    const lines: string[] = [
      'SellerExternalId,SellerName,SellerEmail,CategoryPath,ProductAsin,ProductTitle,ProductType,Price,Currency,StockQuantity,CustomerExternalId,CustomerFullName,CustomerEmail,OrderExternalId,OrderedAtUtc,OrderStatus,Quantity,ShipmentExternalId,ShipmentStatus,TrackingNumber,DestinationCountry,DestinationCity,DestinationStreet',
    ];

    for (let index = 0; index < finalRowCount; index += 1) {
      const bucket = index % categories.length;
      const sellerId = `SEL-${String((index % 60) + 1).padStart(3, '0')}`;
      const customerId = `CUS-${String((index % 250) + 1).padStart(3, '0')}`;
      const asin = `ASIN-${String(bucket + 1).padStart(3, '0')}-${String((index % 80) + 1).padStart(3, '0')}`;
      const orderId = `ORD-${String(Math.floor(index / 2) + 1).padStart(4, '0')}`;
      const shipmentId = `SHP-${String(Math.floor(index / 2) + 1).padStart(4, '0')}`;
      const orderDate = new Date(Date.UTC(2026, 0, 1 + (index % 90), 8 + (index % 12), index % 60, 0));
      const price = (15 + bucket * 30 + (index % 17) + 0.49).toFixed(2);
      const stockQuantity = String(20 + (index % 150));
      const quantity = String((index % 3) + 1);
      const productType = bucket % 2 === 0 ? 'Physical' : 'Digital';

      const columns = [
        sellerId,
        `Seller ${sellerId}`,
        `${sellerId.toLowerCase()}@amazon-demo.local`,
        categories[bucket],
        asin,
        productTitles[bucket],
        productType,
        price,
        'USD',
        stockQuantity,
        customerId,
        `Customer ${customerId}`,
        `${customerId.toLowerCase()}@mail.local`,
        orderId,
        orderDate.toISOString(),
        orderStatuses[index % orderStatuses.length],
        quantity,
        shipmentId,
        shipmentStatuses[index % shipmentStatuses.length],
        `TRK${String(100000 + index).padStart(6, '0')}`,
        'Ukraine',
        cities[index % cities.length],
        streets[index % streets.length],
      ];

      lines.push(columns.map((column) => this.escape(column)).join(','));
    }

    await writeFile(absolutePath, lines.join('\n'), 'utf8');
    return { outputPath: absolutePath, rowCount: finalRowCount };
  }

  private escape(value: string): string {
    if (value.includes(',') || value.includes('"')) {
      return `"${value.replaceAll('"', '""')}"`;
    }

    return value;
  }
}
