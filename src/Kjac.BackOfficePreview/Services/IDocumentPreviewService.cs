using Kjac.BackOfficePreview.Models;
using Umbraco.Cms.Core.Models;

namespace Kjac.BackOfficePreview.Services;

public interface IDocumentPreviewService
{
    Task<DocumentPreviewUrlInfo> PreviewUrlInfoAsync(IContent document, string? culture);

    Task<bool> PreviewSupportedAsync(IContentType documentType);
}