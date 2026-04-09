namespace AmazonLab2.Domain.Entities;

public sealed class Shipment
{
    public int Id { get; set; }
    public string ExternalId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string TrackingNumber { get; set; } = string.Empty;
    public string DestinationCountry { get; set; } = string.Empty;
    public string DestinationCity { get; set; } = string.Empty;
    public string DestinationStreet { get; set; } = string.Empty;

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
}
