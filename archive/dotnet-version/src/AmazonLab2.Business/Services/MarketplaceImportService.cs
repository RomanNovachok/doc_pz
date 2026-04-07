using AmazonLab2.Business.Abstractions;
using AmazonLab2.Business.Models;
using AmazonLab2.DataAccess.Abstractions;

namespace AmazonLab2.Business.Services;

public sealed class MarketplaceImportService(
    ICsvMarketplaceRecordReader csvReader,
    IMarketplaceImportRepository repository,
    IDatabaseInitializer databaseInitializer) : IMarketplaceImportService
{
    public async Task<ImportSummary> ImportAsync(string csvFilePath, CancellationToken cancellationToken = default)
    {
        await databaseInitializer.InitializeAsync(cancellationToken);

        var rows = await csvReader.ReadAsync(csvFilePath, cancellationToken);

        var categoryCache = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var sellerCache = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var productCache = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var listingCache = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var customerCache = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var orderCache = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var shipmentCache = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var createdOrderItems = 0;

        foreach (var row in rows)
        {
            cancellationToken.ThrowIfCancellationRequested();
            ValidateRow(row);

            var categorySegments = row.CategoryPath
                .Split('>', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);

            for (var i = 0; i < categorySegments.Length; i++)
            {
                categoryCache.Add(string.Join(">", categorySegments.Take(i + 1)));
            }

            var category = await repository.GetOrCreateCategoryPathAsync(categorySegments, cancellationToken);
            var seller = await repository.GetOrCreateSellerAsync(row.SellerExternalId, row.SellerName, row.SellerEmail, cancellationToken);
            await repository.SaveChangesAsync(cancellationToken);
            sellerCache.Add(row.SellerExternalId);

            var product = await repository.GetOrCreateProductAsync(row.ProductAsin, row.ProductTitle, row.ProductType, category, cancellationToken);
            await repository.SaveChangesAsync(cancellationToken);
            productCache.Add(row.ProductAsin);

            var listing = await repository.GetOrCreateListingAsync(seller, product, row.Price, row.Currency, row.StockQuantity, cancellationToken);
            await repository.SaveChangesAsync(cancellationToken);
            listingCache.Add($"{row.SellerExternalId}:{row.ProductAsin}");

            var customer = await repository.GetOrCreateCustomerAsync(row.CustomerExternalId, row.CustomerFullName, row.CustomerEmail, cancellationToken);
            await repository.SaveChangesAsync(cancellationToken);
            customerCache.Add(row.CustomerExternalId);

            var order = await repository.GetOrCreateOrderAsync(row.OrderExternalId, customer, row.OrderedAtUtc, row.OrderStatus, cancellationToken);
            await repository.SaveChangesAsync(cancellationToken);
            orderCache.Add(row.OrderExternalId);

            if (!await repository.OrderItemExistsAsync(order, listing, cancellationToken))
            {
                await repository.AddOrderItemAsync(order, listing, row.Quantity, row.Price, cancellationToken);
                createdOrderItems++;
            }

            await repository.UpsertShipmentAsync(
                row.ShipmentExternalId,
                order,
                row.ShipmentStatus,
                row.TrackingNumber,
                row.DestinationCountry,
                row.DestinationCity,
                row.DestinationStreet,
                cancellationToken);

            shipmentCache.Add(row.ShipmentExternalId);
            await repository.SaveChangesAsync(cancellationToken);
        }

        return new ImportSummary(
            rows.Count,
            categoryCache.Count,
            sellerCache.Count,
            productCache.Count,
            listingCache.Count,
            customerCache.Count,
            orderCache.Count,
            createdOrderItems,
            shipmentCache.Count);
    }

    private static void ValidateRow(CsvMarketplaceRecord row)
    {
        if (string.IsNullOrWhiteSpace(row.CategoryPath))
        {
            throw new InvalidOperationException("Category path is required.");
        }

        if (row.Price <= 0)
        {
            throw new InvalidOperationException($"Price must be greater than zero for ASIN {row.ProductAsin}.");
        }

        if (row.Quantity <= 0)
        {
            throw new InvalidOperationException($"Quantity must be greater than zero for order {row.OrderExternalId}.");
        }

        if (row.StockQuantity < 0)
        {
            throw new InvalidOperationException($"Stock quantity cannot be negative for listing {row.SellerExternalId}/{row.ProductAsin}.");
        }
    }
}
