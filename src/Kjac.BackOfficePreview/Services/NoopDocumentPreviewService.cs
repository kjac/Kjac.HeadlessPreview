using Kjac.BackOfficePreview.Models;
using Umbraco.Cms.Core.Models;

namespace Kjac.BackOfficePreview.Services;

public class NoopDocumentPreviewService : IDocumentPreviewService
{
    public Task<DocumentPreviewUrlInfo> PreviewUrlInfoAsync(IContent document, string? culture)
        => Task.FromResult(new DocumentPreviewUrlInfo
        {
            Info = $"To preview documents, please replace the default {nameof(IDocumentPreviewService)} implementation with your own implementation. See the documentation for details."
        });

    public Task<bool> PreviewSupportedAsync(IContentType documentType) => Task.FromResult(true);
}