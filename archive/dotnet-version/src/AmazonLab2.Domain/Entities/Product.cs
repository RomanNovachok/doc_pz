using AmazonLab2.Domain.Enums;

namespace AmazonLab2.Domain.Entities;

public sealed class Product
{
    public int Id { get; set; }
    public string Asin { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public ProductType ProductType { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public List<Listing> Listings { get; set; } = [];
}
