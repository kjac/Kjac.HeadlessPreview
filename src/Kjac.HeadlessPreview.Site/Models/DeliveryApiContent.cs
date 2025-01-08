namespace Kjac.HeadlessPreview.Site.Models;

public class DeliveryApiContent<T>
{
    public required string Name { get; init; }

    public required string ContentType { get; init; }

    public required T Properties { get; init; }
}