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
        private readonly IContentPreviewService _contentPreviewService;

        public ContentController(IContentService contentService, IContentPreviewService contentPreviewService)
        {
            _contentService = contentService;
            _contentPreviewService = contentPreviewService;
        }

        [HttpGet("preview-url")]
        [ProducesResponseType<string>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult PreviewUrl(Guid documentId, string? culture)
        {
            var document = _contentService.GetById(documentId);
            if (document is null)
            {
                return BadRequest("Document could not be found.");
            }

            var previewUrl = _contentPreviewService.PreviewUrl(document, culture);
            return previewUrl is not null
                ? Ok(previewUrl)
                : NotFound();
        }
    }
}
