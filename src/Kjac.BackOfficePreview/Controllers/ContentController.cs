using Asp.Versioning;
using Kjac.BackOfficePreview.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Services;

namespace Kjac.BackOfficePreview.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "Content")]
    public sealed class ContentController : BackOfficePreviewControllerBase
    {
        private readonly IContentService _contentService;
        private readonly IContentTypeService _contentTypeService;
        private readonly IContentPreviewService _contentPreviewService;

        public ContentController(
            IContentService contentService,
            IContentTypeService contentTypeService,
            IContentPreviewService contentPreviewService)
        {
            _contentService = contentService;
            _contentTypeService = contentTypeService;
            _contentPreviewService = contentPreviewService;
        }

        [HttpGet("preview-url")]
        [ProducesResponseType<string>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PreviewUrl(Guid documentId, string? culture)
        {
            var document = _contentService.GetById(documentId);
            if (document is null)
            {
                return BadRequest("Document could not be found.");
            }

            var previewUrl = await _contentPreviewService.PreviewUrlAsync(document, culture);
            return previewUrl is not null
                ? Ok(previewUrl)
                : NotFound();
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

            var supported = await _contentPreviewService.PreviewSupportedAsync(documentType);
            return Ok(supported);
        }
    }
}
