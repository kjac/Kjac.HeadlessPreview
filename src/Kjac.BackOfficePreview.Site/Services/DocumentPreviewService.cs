using Kjac.BackOfficePreview.Models;
using Kjac.BackOfficePreview.Services;
using Umbraco.Cms.Core.Models;

namespace Kjac.BackOfficePreview.Site.Services;

public class DocumentPreviewService : IDocumentPreviewService
{
    public Task<DocumentPreviewUrlInfo> PreviewUrlInfoAsync(IContent document, string? culture)
        => Task.FromResult(
            ContentTypeIsSupported(document.ContentType.Alias)
                // emulate content that for some reason cannot be previewed (in this case the "Code Coder" author) 
                ? document.Name == "Code Coder"
                    ? new DocumentPreviewUrlInfo
                    {
                        Info = "Code Coder cannot be previewed because [some made up reason]."
                    }
                    : new DocumentPreviewUrlInfo
                    {
                        PreviewUrl = $"https://localhost:44304/preview?id={document.Key}&culture={culture}"
                    }
                : new DocumentPreviewUrlInfo
                {
                    Info = "The document type is not supported"
                }
        );

    public Task<bool> PreviewSupportedAsync(IContentType documentType)
        => Task.FromResult(ContentTypeIsSupported(documentType.Alias));

    // emulate content that does not support preview (in this case the posts and authors root types)
    private bool ContentTypeIsSupported(string alias)
        => alias != "posts" && alias != "authors";
}