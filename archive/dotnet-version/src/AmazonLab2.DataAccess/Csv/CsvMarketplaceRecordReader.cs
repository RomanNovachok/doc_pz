using System.Globalization;
using AmazonLab2.DataAccess.Abstractions;

namespace AmazonLab2.DataAccess.Csv;

public sealed class CsvMarketplaceRecordReader : ICsvMarketplaceRecordReader
{
    private const int ExpectedColumnCount = 23;

    public async Task<IReadOnlyCollection<CsvMarketplaceRecord>> ReadAsync(string filePath, CancellationToken cancellationToken = default)
    {
        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException("CSV file was not found.", filePath);
        }

        var lines = await File.ReadAllLinesAsync(filePath, cancellationToken);
        if (lines.Length <= 1)
        {
            return Array.Empty<CsvMarketplaceRecord>();
        }

        var result = new List<CsvMarketplaceRecord>(lines.Length - 1);

        for (var index = 1; index < lines.Length; index++)
        {
            var line = lines[index];
            if (string.IsNullOrWhiteSpace(line))
            {
                continue;
            }

            var columns = SimpleCsvParser.ParseLine(line);
            if (columns.Count != ExpectedColumnCount)
            {
                throw new InvalidOperationException($"Line {index + 1} has {columns.Count} columns instead of {ExpectedColumnCount}.");
            }

            result.Add(new CsvMarketplaceRecord(
                columns[0].Trim(),
                columns[1].Trim(),
                columns[2].Trim(),
                columns[3].Trim(),
                columns[4].Trim(),
                columns[5].Trim(),
                columns[6].Trim(),
                decimal.Parse(columns[7], CultureInfo.InvariantCulture),
                columns[8].Trim(),
                int.Parse(columns[9], CultureInfo.InvariantCulture),
                columns[10].Trim(),
                columns[11].Trim(),
                columns[12].Trim(),
                columns[13].Trim(),
                DateTime.Parse(columns[14], CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal),
                columns[15].Trim(),
                int.Parse(columns[16], CultureInfo.InvariantCulture),
                columns[17].Trim(),
                columns[18].Trim(),
                columns[19].Trim(),
                columns[20].Trim(),
                columns[21].Trim(),
                columns[22].Trim()));
        }

        return result;
    }
}
