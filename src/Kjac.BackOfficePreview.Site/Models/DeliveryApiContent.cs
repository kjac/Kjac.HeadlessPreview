namespace Kjac.BackOfficePreview.Site.Models;

public class DeliveryApiContent
{
    public required string Name { get; init; }

    public required string ContentType { get; init; }

    public required Dictionary<string, object> Properties { get; init; }
}