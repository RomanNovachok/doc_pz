using AmazonLab2.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AmazonLab2.DataAccess.Persistence;

public sealed class AmazonLabDbContext(DbContextOptions<AmazonLabDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Seller> Sellers => Set<Seller>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Listing> Listings => Set<Listing>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Shipment> Shipments => Set<Shipment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");
            entity.Property(x => x.Name).HasMaxLength(200).IsRequired();
            entity.HasOne(x => x.ParentCategory)
                .WithMany(x => x.Children)
                .HasForeignKey(x => x.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(x => new { x.Name, x.ParentCategoryId }).IsUnique();
        });

        modelBuilder.Entity<Seller>(entity =>
        {
            entity.ToTable("Sellers");
            entity.Property(x => x.ExternalId).HasMaxLength(64).IsRequired();
            entity.Property(x => x.Name).HasMaxLength(200).IsRequired();
            entity.Property(x => x.Email).HasMaxLength(200).IsRequired();
            entity.HasIndex(x => x.ExternalId).IsUnique();
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("Products");
            entity.Property(x => x.Asin).HasMaxLength(64).IsRequired();
            entity.Property(x => x.Title).HasMaxLength(250).IsRequired();
            entity.HasIndex(x => x.Asin).IsUnique();
        });

        modelBuilder.Entity<Listing>(entity =>
        {
            entity.ToTable("Listings");
            entity.Property(x => x.Price).HasColumnType("decimal(18,2)");
            entity.Property(x => x.Currency).HasMaxLength(10).IsRequired();
            entity.HasIndex(x => new { x.SellerId, x.ProductId }).IsUnique();
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.ToTable("Customers");
            entity.Property(x => x.ExternalId).HasMaxLength(64).IsRequired();
            entity.Property(x => x.FullName).HasMaxLength(200).IsRequired();
            entity.Property(x => x.Email).HasMaxLength(200).IsRequired();
            entity.HasIndex(x => x.ExternalId).IsUnique();
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("Orders");
            entity.Property(x => x.ExternalId).HasMaxLength(64).IsRequired();
            entity.Property(x => x.Status).HasMaxLength(50).IsRequired();
            entity.HasIndex(x => x.ExternalId).IsUnique();
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable("OrderItems");
            entity.Property(x => x.UnitPrice).HasColumnType("decimal(18,2)");
            entity.HasIndex(x => new { x.OrderId, x.ListingId }).IsUnique();
        });

        modelBuilder.Entity<Shipment>(entity =>
        {
            entity.ToTable("Shipments");
            entity.Property(x => x.ExternalId).HasMaxLength(64).IsRequired();
            entity.Property(x => x.Status).HasMaxLength(50).IsRequired();
            entity.Property(x => x.TrackingNumber).HasMaxLength(80).IsRequired();
            entity.Property(x => x.DestinationCountry).HasMaxLength(120).IsRequired();
            entity.Property(x => x.DestinationCity).HasMaxLength(120).IsRequired();
            entity.Property(x => x.DestinationStreet).HasMaxLength(200).IsRequired();
            entity.HasIndex(x => x.ExternalId).IsUnique();
            entity.HasIndex(x => x.OrderId).IsUnique();
        });
    }
}
