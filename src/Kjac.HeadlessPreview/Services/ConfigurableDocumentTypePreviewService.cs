using Kjac.HeadlessPreview.Models.Configuration;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Core.Models;
using Umbraco.Extensions;

namespace Kjac.HeadlessPreview.Services;

public class ConfigurableDocumentTypePreviewService : IDocumentTypePreviewService
{
    private readonly HeadlessPreviewConfiguration _configuration;

    public ConfigurableDocumentTypePreviewService(IOptions<HeadlessPreviewConfiguration> configuration)
        => _configuration = configuration.Value;
    
    public Task<bool> PreviewSupportedAsync(IContentType documentType)
        => Task.FromResult(_configuration.SupportedDocumentTypes.Any() is false
                           || _configuration.SupportedDocumentTypes.InvariantContains(documentType.Alias));
}