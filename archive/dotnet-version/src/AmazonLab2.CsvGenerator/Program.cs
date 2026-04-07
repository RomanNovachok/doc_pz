using System.Globalization;
using System.Text;

var outputPath = GetArgument(args, "--output") ?? Path.Combine("data", "amazon_marketplace_seed.csv");
var rowCount = int.TryParse(GetArgument(args, "--rows"), out var parsedRows) ? parsedRows : 1200;

if (rowCount < 1000)
{
    rowCount = 1000;
}

var fullPath = Path.GetFullPath(outputPath);
Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

var categories = new[]
{
    "Electronics>Computers>Laptops",
    "Electronics>Audio>Headphones",
    "Books>Technology>Software Engineering",
    "Home & Kitchen>Appliances>Coffee Machines",
    "Toys & Games>Board Games>Strategy"
};

var productTitles = new[]
{
    "Nova Laptop 14",
    "EchoSound Pro Headphones",
    "Patterns for Scalable Systems",
    "Barista Smart Brewer",
    "Kingdoms of Logic"
};

var cities = new[] { "Kyiv", "Lviv", "Odesa", "Dnipro", "Kharkiv" };
var streets = new[] { "Shevchenka 10", "Soborna 25", "Centralna 7", "Independence 18", "Naukova 12" };
var orderStatuses = new[] { "Created", "Paid", "Packed", "Shipped", "Delivered" };
var shipmentStatuses = new[] { "Preparing", "InTransit", "Delivered" };
var random = new Random(42);

using var writer = new StreamWriter(fullPath, false, new UTF8Encoding(false));
await writer.WriteLineAsync("SellerExternalId,SellerName,SellerEmail,CategoryPath,ProductAsin,ProductTitle,ProductType,Price,Currency,StockQuantity,CustomerExternalId,CustomerFullName,CustomerEmail,OrderExternalId,OrderedAtUtc,OrderStatus,Quantity,ShipmentExternalId,ShipmentStatus,TrackingNumber,DestinationCountry,DestinationCity,DestinationStreet");

for (var i = 0; i < rowCount; i++)
{
    var bucket = i % categories.Length;
    var sellerId = $"SEL-{(i % 60) + 1:000}";
    var customerId = $"CUS-{(i % 250) + 1:000}";
    var asin = $"ASIN-{bucket + 1:000}-{(i % 80) + 1:000}";
    var orderId = $"ORD-{(i / 2) + 1:0000}";
    var shipmentId = $"SHP-{(i / 2) + 1:0000}";
    var orderDate = DateTime.UtcNow.Date.AddDays(-(i % 90)).AddMinutes(i % 1440);
    var price = 15 + (bucket * 30) + (i % 17) + Math.Round((decimal)random.NextDouble(), 2);
    var stock = 20 + (i % 150);
    var quantity = (i % 3) + 1;

    var columns = new[]
    {
        sellerId,
        $"Seller {sellerId}",
        $"{sellerId.ToLowerInvariant()}@amazon-demo.local",
        categories[bucket],
        asin,
        productTitles[bucket],
        bucket % 2 == 0 ? "Physical" : "Digital",
        price.ToString("0.00", CultureInfo.InvariantCulture),
        "USD",
        stock.ToString(CultureInfo.InvariantCulture),
        customerId,
        $"Customer {customerId}",
        $"{customerId.ToLowerInvariant()}@mail.local",
        orderId,
        orderDate.ToString("O", CultureInfo.InvariantCulture),
        orderStatuses[i % orderStatuses.Length],
        quantity.ToString(CultureInfo.InvariantCulture),
        shipmentId,
        shipmentStatuses[i % shipmentStatuses.Length],
        $"TRK{(100000 + i):000000}",
        "Ukraine",
        cities[i % cities.Length],
        streets[i % streets.Length]
    };

    await writer.WriteLineAsync(string.Join(",", columns.Select(Escape)));
}

Console.WriteLine($"CSV file generated: {fullPath}");
Console.WriteLine($"Rows written: {rowCount}");

static string Escape(string value)
{
    if (value.Contains(',') || value.Contains('"'))
    {
        return $"\"{value.Replace("\"", "\"\"")}\"";
    }

    return value;
}

static string? GetArgument(IReadOnlyList<string> arguments, string name)
{
    for (var i = 0; i < arguments.Count - 1; i++)
    {
        if (arguments[i].Equals(name, StringComparison.OrdinalIgnoreCase))
        {
            return arguments[i + 1];
        }
    }

    return null;
}
