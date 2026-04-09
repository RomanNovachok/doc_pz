using AmazonLab2.Business.Models;

namespace AmazonLab2.Presentation.Contracts;

public interface IImportEndpoint
{
    Task<ImportSummary> ImportAsync(ImportRequest request, CancellationToken cancellationToken = default);
}
