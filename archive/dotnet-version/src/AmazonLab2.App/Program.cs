using AmazonLab2.Business.Services;
using AmazonLab2.DataAccess.Csv;
using AmazonLab2.DataAccess.Persistence;

if (args.Length == 0 || args.Contains("--help", StringComparer.OrdinalIgnoreCase))
{
    PrintHelp();
    return;
}

var csvPath = GetArgument(args, "--csv") ?? Path.Combine("data", "amazon_marketplace_seed.csv");
var databasePath = GetArgument(args, "--db") ?? Path.Combine("data", "amazon_lab2.db");

var dbContext = AmazonLabDbContextFactory.Create(databasePath);
var importService = new MarketplaceImportService(
    new CsvMarketplaceRecordReader(),
    new MarketplaceImportRepository(dbContext),
    new SqliteDatabaseInitializer(dbContext));

var summary = await importService.ImportAsync(csvPath);

Console.WriteLine("Import completed successfully.");
Console.WriteLine($"Processed rows: {summary.ProcessedRows}");
Console.WriteLine($"Categories: {summary.CreatedCategories}");
Console.WriteLine($"Sellers: {summary.CreatedSellers}");
Console.WriteLine($"Products: {summary.CreatedProducts}");
Console.WriteLine($"Listings: {summary.CreatedListings}");
Console.WriteLine($"Customers: {summary.CreatedCustomers}");
Console.WriteLine($"Orders: {summary.CreatedOrders}");
Console.WriteLine($"Order items: {summary.CreatedOrderItems}");
Console.WriteLine($"Shipments: {summary.UpsertedShipments}");

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

static void PrintHelp()
{
    Console.WriteLine("AmazonLab2.App");
    Console.WriteLine("Usage:");
    Console.WriteLine("  dotnet run --project src/AmazonLab2.App -- --csv data/amazon_marketplace_seed.csv --db data/amazon_lab2.db");
}
