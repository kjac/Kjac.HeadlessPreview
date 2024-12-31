using Umbraco.Cms.Core.Models;

namespace Kjac.BackOfficePreview.Services;

public interface IContentPreviewService
{
    Task<string?> PreviewUrlAsync(IContent content, string? culture);

    Task<bool> PreviewSupportedAsync(IContentType contentType);
}