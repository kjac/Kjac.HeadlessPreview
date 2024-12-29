using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Services;

namespace Kjac.BackOfficePreview.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "Content")]
    public class ContentController : BackOfficePreviewControllerBase
    {
        private readonly IContentService _contentService;

        public ContentController(IContentService contentService)
            => _contentService = contentService;

        [HttpGet("preview-url")]
        [ProducesResponseType<string>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult PreviewUrl(Guid documentId, string? culture)
        {
            var document = _contentService.GetById(documentId);
            if (document is null)
            {
                return NotFound();
            }

            // emulate content type that cannot be previewed
            if (document.ContentType.Alias == "authors")
            {
                return NotFound();
            }

            // TODO: clean up
            // NOTE: requires running next.js as: next dev --experimental-https
            // - see https://vercel.com/guides/access-nextjs-localhost-https-certificate-self-signed for details.
            //const previewUrl = `https://localhost:3000/api/preview?secret=super-secret-preview-key&redirect=/posts/preview-${this._documentId}`;
            return Ok($"https://localhost:44304/preview?id={documentId}&culture={culture}");
        }
    }
}
