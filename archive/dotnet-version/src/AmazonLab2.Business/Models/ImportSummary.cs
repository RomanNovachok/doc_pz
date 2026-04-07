namespace AmazonLab2.Business.Models;

public sealed record ImportSummary(
    int ProcessedRows,
    int CreatedCategories,
    int CreatedSellers,
    int CreatedProducts,
    int CreatedListings,
    int CreatedCustomers,
    int CreatedOrders,
    int CreatedOrderItems,
    int UpsertedShipments);
