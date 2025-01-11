using Kjac.HeadlessPreview.Models;
using Umbraco.Cms.Core.Models;

namespace Kjac.HeadlessPreview.Services;

public interface IDocumentPreviewService
{
    Task<DocumentPreviewUrlInfo> PreviewUrlInfoAsync(IContent document, string? culture, string? segment);
}