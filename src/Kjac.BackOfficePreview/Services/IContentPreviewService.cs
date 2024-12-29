using Umbraco.Cms.Core.Models;

namespace Kjac.BackOfficePreview.Services;

public interface IContentPreviewService
{
    string? PreviewUrl(IContent content, string? culture);
}