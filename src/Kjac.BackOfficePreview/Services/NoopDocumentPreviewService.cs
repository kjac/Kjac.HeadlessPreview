using Kjac.BackOfficePreview.Models;
using Umbraco.Cms.Core.Models;

namespace Kjac.BackOfficePreview.Services;

public class NoopDocumentPreviewService : IDocumentPreviewService
{
    public Task<DocumentPreviewUrlInfo> PreviewUrlInfoAsync(IContent document, string? culture, string? segment)
        => Task.FromResult(new DocumentPreviewUrlInfo
        {
            Info = $"""
                    To preview documents, please replace the default {nameof(IDocumentPreviewService)} implementation with your own implementation.
                    
                    Check the documentation in the package GitHub repository for details.
                    """
        });

    public Task<bool> PreviewSupportedAsync(IContentType documentType)
        => Task.FromResult(true);
}