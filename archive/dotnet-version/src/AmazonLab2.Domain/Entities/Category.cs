namespace AmazonLab2.Domain.Entities;

public sealed class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public int? ParentCategoryId { get; set; }
    public Category? ParentCategory { get; set; }

    public List<Category> Children { get; set; } = [];
    public List<Product> Products { get; set; } = [];
}
