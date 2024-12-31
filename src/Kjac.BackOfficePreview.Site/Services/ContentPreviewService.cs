using Kjac.BackOfficePreview.Services;
using Umbraco.Cms.Core.Models;

namespace Kjac.BackOfficePreview.Site.Services;

public class ContentPreviewService : IContentPreviewService
{
    public Task<string?> PreviewUrlAsync(IContent content, string? culture)
        => Task.FromResult(
            ContentTypeIsSupported(content.ContentType.Alias)
                ? $"https://localhost:44304/preview?id={content.Key}&culture={culture}"
                : null
        );

    public Task<bool> PreviewSupportedAsync(IContentType contentType)
        => Task.FromResult(ContentTypeIsSupported(contentType.Alias));

    // emulate content that does not support preview (the posts and authors root types)
    private bool ContentTypeIsSupported(string alias)
        => alias != "posts" && alias != "authors";
}