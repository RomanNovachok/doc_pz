using AmazonLab2.Domain.Entities;

namespace AmazonLab2.DataAccess.Abstractions;

public interface IMarketplaceImportRepository
{
    Task<Category> GetOrCreateCategoryPathAsync(IReadOnlyList<string> categoryPathSegments, CancellationToken cancellationToken = default);
    Task<Seller> GetOrCreateSellerAsync(string externalId, string name, string email, CancellationToken cancellationToken = default);
    Task<Product> GetOrCreateProductAsync(string asin, string title, string rawProductType, Category category, CancellationToken cancellationToken = default);
    Task<Listing> GetOrCreateListingAsync(Seller seller, Product product, decimal price, string currency, int stockQuantity, CancellationToken cancellationToken = default);
    Task<Customer> GetOrCreateCustomerAsync(string externalId, string fullName, string email, CancellationToken cancellationToken = default);
    Task<Order> GetOrCreateOrderAsync(string externalId, Customer customer, DateTime orderedAtUtc, string status, CancellationToken cancellationToken = default);
    Task<bool> OrderItemExistsAsync(Order order, Listing listing, CancellationToken cancellationToken = default);
    Task<OrderItem> AddOrderItemAsync(Order order, Listing listing, int quantity, decimal unitPrice, CancellationToken cancellationToken = default);
    Task<Shipment> UpsertShipmentAsync(
        string externalId,
        Order order,
        string status,
        string trackingNumber,
        string destinationCountry,
        string destinationCity,
        string destinationStreet,
        CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
