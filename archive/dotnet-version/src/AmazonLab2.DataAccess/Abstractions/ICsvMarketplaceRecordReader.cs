namespace AmazonLab2.DataAccess.Abstractions;

public interface ICsvMarketplaceRecordReader
{
    Task<IReadOnlyCollection<CsvMarketplaceRecord>> ReadAsync(string filePath, CancellationToken cancellationToken = default);
}
