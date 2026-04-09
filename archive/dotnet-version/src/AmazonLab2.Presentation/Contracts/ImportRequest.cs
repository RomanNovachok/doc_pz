namespace AmazonLab2.Presentation.Contracts;

public sealed record ImportRequest(string CsvFilePath, string DatabasePath);
