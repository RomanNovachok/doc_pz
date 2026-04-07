using Microsoft.EntityFrameworkCore;

namespace AmazonLab2.DataAccess.Persistence;

public static class AmazonLabDbContextFactory
{
    public static AmazonLabDbContext Create(string databasePath)
    {
        var normalizedPath = Path.GetFullPath(databasePath);
        Directory.CreateDirectory(Path.GetDirectoryName(normalizedPath)!);

        var options = new DbContextOptionsBuilder<AmazonLabDbContext>()
            .UseSqlite($"Data Source={normalizedPath}")
            .Options;

        return new AmazonLabDbContext(options);
    }
}
