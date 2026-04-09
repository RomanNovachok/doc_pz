using AmazonLab2.Business.Models;

namespace AmazonLab2.Business.Abstractions;

public interface IMarketplaceImportService
{
    Task<ImportSummary> ImportAsync(string csvFilePath, CancellationToken cancellationToken = default);
}
