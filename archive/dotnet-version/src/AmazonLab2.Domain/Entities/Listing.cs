namespace AmazonLab2.Domain.Entities;

public sealed class Listing
{
    public int Id { get; set; }

    public int SellerId { get; set; }
    public Seller Seller { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public decimal Price { get; set; }
    public string Currency { get; set; } = "USD";
    public int StockQuantity { get; set; }

    public List<OrderItem> OrderItems { get; set; } = [];
}
