using Kjac.BackOfficePreview.Services;
using Umbraco.Cms.Core.Models;

namespace Kjac.BackOfficePreview.Site.Services;

public class ContentPreviewService : IContentPreviewService
{
    public string? PreviewUrl(IContent content, string? culture)
        // emulate content that does not support preview (the authors root)
        => content.ContentType.Alias == "authors"
            ? null
            : $"https://localhost:44304/preview?id={content.Key}&culture={culture}";
}