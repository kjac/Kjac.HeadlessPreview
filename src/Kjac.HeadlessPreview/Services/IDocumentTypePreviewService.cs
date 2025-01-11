using Umbraco.Cms.Core.Models;

namespace Kjac.HeadlessPreview.Services;

public interface IDocumentTypePreviewService
{
    Task<bool> PreviewSupportedAsync(IContentType documentType);
}