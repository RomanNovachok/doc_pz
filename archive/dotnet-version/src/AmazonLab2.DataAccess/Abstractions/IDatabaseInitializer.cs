namespace AmazonLab2.DataAccess.Abstractions;

public interface IDatabaseInitializer
{
    Task InitializeAsync(CancellationToken cancellationToken = default);
}
