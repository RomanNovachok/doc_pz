using System.Text;

namespace AmazonLab2.DataAccess.Csv;

internal static class SimpleCsvParser
{
    public static IReadOnlyList<string> ParseLine(string line)
    {
        var values = new List<string>();
        var buffer = new StringBuilder();
        var insideQuotes = false;

        for (var i = 0; i < line.Length; i++)
        {
            var current = line[i];

            if (current == '"')
            {
                if (insideQuotes && i + 1 < line.Length && line[i + 1] == '"')
                {
                    buffer.Append('"');
                    i++;
                    continue;
                }

                insideQuotes = !insideQuotes;
                continue;
            }

            if (current == ',' && !insideQuotes)
            {
                values.Add(buffer.ToString());
                buffer.Clear();
                continue;
            }

            buffer.Append(current);
        }

        values.Add(buffer.ToString());
        return values;
    }
}
