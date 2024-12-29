using Umbraco.Cms.Core.Models;

namespace Kjac.BackOfficePreview.Services;

public class NoopContentPreviewService : IContentPreviewService
{
    public string? PreviewUrl(IContent content, string? culture) => null;
}