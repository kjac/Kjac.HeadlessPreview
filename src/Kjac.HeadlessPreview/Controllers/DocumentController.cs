using Asp.Versioning;
using Kjac.HeadlessPreview.Models;
using Kjac.HeadlessPreview.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Management.Routing;
using Umbraco.Cms.Core.Services;

namespace Kjac.HeadlessPreview.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "Document")]
    [VersionedApiBackOfficeRoute($"{Constants.ApiName}/document")]
    public sealed class DocumentController : HeadlessPreviewControllerBase
    {
        private readonly IContentService _contentService;
        private readonly IContentTypeService _contentTypeService;
        private readonly IDocumentPreviewService _documentPreviewService;

        public DocumentController(
            IContentService contentService,
            IContentTypeService contentTypeService,
            IDocumentPreviewService documentPreviewService)
        {
            _contentService = contentService;
            _contentTypeService = contentTypeService;
            _documentPreviewService = documentPreviewService;
        }

        [HttpGet("preview-url-info")]
        [ProducesResponseType<DocumentPreviewUrlInfo>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PreviewUrlInfo(Guid documentId, string? culture, string? segment)
        {
            var document = _contentService.GetById(documentId);
            if (document is null)
            {
                return NotFound("Document could not be found.");
            }

            var previewUrlInfo = await _documentPreviewService.PreviewUrlInfoAsync(document, culture, segment);
            return Ok(previewUrlInfo);
        }
    }
}
