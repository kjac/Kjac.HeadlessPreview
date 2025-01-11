using Kjac.HeadlessPreview.Models;
using Kjac.HeadlessPreview.Services;
using Umbraco.Cms.Core.Models;

namespace Kjac.HeadlessPreview.Site.Services;

public class DocumentPreviewService : IDocumentPreviewService
{
    public Task<DocumentPreviewUrlInfo> PreviewUrlInfoAsync(IContent document, string? culture, string? segment)
        => Task.FromResult(
            // emulate content that for some reason cannot be previewed (in this case the "Code Coder" author) 
            document.Name == "Code Coder"
                ? new DocumentPreviewUrlInfo
                {
                    Info = "Code Coder cannot be previewed because [some made up reason]."
                }
                : new DocumentPreviewUrlInfo
                {
                    PreviewUrl = $"https://localhost:44304/preview?id={document.Key}&culture={culture}"
                }
        );
}
