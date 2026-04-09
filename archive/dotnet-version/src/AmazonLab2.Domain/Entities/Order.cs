namespace AmazonLab2.Domain.Entities;

public sealed class Order
{
    public int Id { get; set; }
    public string ExternalId { get; set; } = string.Empty;
    public DateTime OrderedAtUtc { get; set; }
    public string Status { get; set; } = string.Empty;

    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    public Shipment? Shipment { get; set; }
    public List<OrderItem> Items { get; set; } = [];
}
