using AmazonLab2.DataAccess.Abstractions;

namespace AmazonLab2.DataAccess.Persistence;

public sealed class SqliteDatabaseInitializer(AmazonLabDbContext dbContext) : IDatabaseInitializer
{
    public Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        return dbContext.Database.EnsureCreatedAsync(cancellationToken);
    }
}
