using Umbraco.Cms.Core.Models;

namespace Kjac.BackOfficePreview.Services;

public class NoopContentPreviewService : IContentPreviewService
{
    public Task<string?> PreviewUrlAsync(IContent content, string? culture) => Task.FromResult((string?)null);

    public Task<bool> PreviewSupportedAsync(IContentType contentType) => Task.FromResult(true);
}