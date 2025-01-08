using Kjac.HeadlessPreview.Site.Models.PropertyValues;

namespace Kjac.HeadlessPreview.Site.Models;

public class PostProperties
{
    public required Document Author { get; init; }

    public required Image[] CoverImage { get; init; }

    public required string Excerpt { get; init; }

    public required RichText Content { get; init; }

    public required string[] Tags { get; init; }
}