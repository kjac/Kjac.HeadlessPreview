using Asp.Versioning;
using Kjac.HeadlessPreview.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Management.Routing;
using Umbraco.Cms.Core.Services;

namespace Kjac.HeadlessPreview.Controllers;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "Document Type")]
[VersionedApiBackOfficeRoute($"{Constants.ApiName}/document-type")]
public class DocumentTypeController : HeadlessPreviewControllerBase
{
    private readonly IContentTypeService _contentTypeService;
    private readonly IDocumentTypePreviewService _documentTypePreviewService;

    public DocumentTypeController(IContentTypeService contentTypeService, IDocumentTypePreviewService documentTypePreviewService)
    {
        _contentTypeService = contentTypeService;
        _documentTypePreviewService = documentTypePreviewService;
    }
    
    [HttpGet("preview-supported")]
    [ProducesResponseType<bool>(StatusCodes.Status200OK)]
    public async Task<IActionResult> PreviewSupported(Guid documentTypeId)
    {
        var documentType = await _contentTypeService.GetAsync(documentTypeId);
        if (documentType is null)
        {
            return BadRequest("Document type could not be found.");
        }

        var supported = await _documentTypePreviewService.PreviewSupportedAsync(documentType);
        return Ok(supported);
    }
}