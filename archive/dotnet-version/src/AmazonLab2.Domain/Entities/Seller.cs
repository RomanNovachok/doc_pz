namespace AmazonLab2.Domain.Entities;

public sealed class Seller
{
    public int Id { get; set; }
    public string ExternalId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public List<Listing> Listings { get; set; } = [];
}
