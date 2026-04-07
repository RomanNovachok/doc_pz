using AmazonLab2.DataAccess.Abstractions;
using AmazonLab2.Domain.Entities;
using AmazonLab2.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace AmazonLab2.DataAccess.Persistence;

public sealed class MarketplaceImportRepository(AmazonLabDbContext dbContext) : IMarketplaceImportRepository
{
    public async Task<Category> GetOrCreateCategoryPathAsync(IReadOnlyList<string> categoryPathSegments, CancellationToken cancellationToken = default)
    {
        if (categoryPathSegments.Count == 0)
        {
            throw new ArgumentException("Category path must contain at least one segment.", nameof(categoryPathSegments));
        }

        Category? parent = null;

        foreach (var segment in categoryPathSegments.Where(static x => !string.IsNullOrWhiteSpace(x)).Select(static x => x.Trim()))
        {
            var parentCategoryId = parent?.Id;

            var current = await dbContext.Categories
                .FirstOrDefaultAsync(
                    x => x.Name == segment && x.ParentCategoryId == parentCategoryId,
                    cancellationToken);

            if (current is null)
            {
                current = new Category
                {
                    Name = segment,
                    ParentCategory = parent
                };

                dbContext.Categories.Add(current);
                await dbContext.SaveChangesAsync(cancellationToken);
            }

            parent = current;
        }

        return parent!;
    }

    public async Task<Seller> GetOrCreateSellerAsync(string externalId, string name, string email, CancellationToken cancellationToken = default)
    {
        var seller = await dbContext.Sellers.FirstOrDefaultAsync(x => x.ExternalId == externalId, cancellationToken);
        if (seller is not null)
        {
            seller.Name = name;
            seller.Email = email;
            return seller;
        }

        seller = new Seller
        {
            ExternalId = externalId,
            Name = name,
            Email = email
        };

        dbContext.Sellers.Add(seller);
        return seller;
    }

    public async Task<Product> GetOrCreateProductAsync(string asin, string title, string rawProductType, Category category, CancellationToken cancellationToken = default)
    {
        var product = await dbContext.Products.FirstOrDefaultAsync(x => x.Asin == asin, cancellationToken);
        if (product is not null)
        {
            product.Title = title;
            product.Category = category;
            product.ProductType = ParseProductType(rawProductType);
            return product;
        }

        product = new Product
        {
            Asin = asin,
            Title = title,
            Category = category,
            ProductType = ParseProductType(rawProductType)
        };

        dbContext.Products.Add(product);
        return product;
    }

    public async Task<Listing> GetOrCreateListingAsync(Seller seller, Product product, decimal price, string currency, int stockQuantity, CancellationToken cancellationToken = default)
    {
        var listing = await dbContext.Listings
            .FirstOrDefaultAsync(x => x.SellerId == seller.Id && x.ProductId == product.Id, cancellationToken);

        if (listing is not null)
        {
            listing.Price = price;
            listing.Currency = currency;
            listing.StockQuantity = stockQuantity;
            return listing;
        }

        listing = new Listing
        {
            Seller = seller,
            Product = product,
            Price = price,
            Currency = currency,
            StockQuantity = stockQuantity
        };

        dbContext.Listings.Add(listing);
        return listing;
    }

    public async Task<Customer> GetOrCreateCustomerAsync(string externalId, string fullName, string email, CancellationToken cancellationToken = default)
    {
        var customer = await dbContext.Customers.FirstOrDefaultAsync(x => x.ExternalId == externalId, cancellationToken);
        if (customer is not null)
        {
            customer.FullName = fullName;
            customer.Email = email;
            return customer;
        }

        customer = new Customer
        {
            ExternalId = externalId,
            FullName = fullName,
            Email = email
        };

        dbContext.Customers.Add(customer);
        return customer;
    }

    public async Task<Order> GetOrCreateOrderAsync(string externalId, Customer customer, DateTime orderedAtUtc, string status, CancellationToken cancellationToken = default)
    {
        var order = await dbContext.Orders.FirstOrDefaultAsync(x => x.ExternalId == externalId, cancellationToken);
        if (order is not null)
        {
            order.Status = status;
            order.OrderedAtUtc = orderedAtUtc;
            order.Customer = customer;
            return order;
        }

        order = new Order
        {
            ExternalId = externalId,
            OrderedAtUtc = orderedAtUtc,
            Status = status,
            Customer = customer
        };

        dbContext.Orders.Add(order);
        return order;
    }

    public Task<bool> OrderItemExistsAsync(Order order, Listing listing, CancellationToken cancellationToken = default)
    {
        return dbContext.OrderItems.AnyAsync(x => x.OrderId == order.Id && x.ListingId == listing.Id, cancellationToken);
    }

    public Task<OrderItem> AddOrderItemAsync(Order order, Listing listing, int quantity, decimal unitPrice, CancellationToken cancellationToken = default)
    {
        var orderItem = new OrderItem
        {
            Order = order,
            Listing = listing,
            Quantity = quantity,
            UnitPrice = unitPrice
        };

        dbContext.OrderItems.Add(orderItem);
        return Task.FromResult(orderItem);
    }

    public async Task<Shipment> UpsertShipmentAsync(
        string externalId,
        Order order,
        string status,
        string trackingNumber,
        string destinationCountry,
        string destinationCity,
        string destinationStreet,
        CancellationToken cancellationToken = default)
    {
        var shipment = await dbContext.Shipments.FirstOrDefaultAsync(x => x.ExternalId == externalId, cancellationToken)
            ?? await dbContext.Shipments.FirstOrDefaultAsync(x => x.OrderId == order.Id, cancellationToken);

        if (shipment is null)
        {
            shipment = new Shipment
            {
                ExternalId = externalId,
                Order = order,
                Status = status,
                TrackingNumber = trackingNumber,
                DestinationCountry = destinationCountry,
                DestinationCity = destinationCity,
                DestinationStreet = destinationStreet
            };

            dbContext.Shipments.Add(shipment);
            return shipment;
        }

        shipment.ExternalId = externalId;
        shipment.Order = order;
        shipment.Status = status;
        shipment.TrackingNumber = trackingNumber;
        shipment.DestinationCountry = destinationCountry;
        shipment.DestinationCity = destinationCity;
        shipment.DestinationStreet = destinationStreet;
        return shipment;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return dbContext.SaveChangesAsync(cancellationToken);
    }

    private static ProductType ParseProductType(string rawProductType)
    {
        return rawProductType.Equals("digital", StringComparison.OrdinalIgnoreCase)
            ? ProductType.Digital
            : ProductType.Physical;
    }
}
