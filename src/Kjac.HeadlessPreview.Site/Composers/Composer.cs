using Kjac.HeadlessPreview.Services;
using Kjac.HeadlessPreview.Site.Services;
using Umbraco.Cms.Core.Composing;

namespace Kjac.HeadlessPreview.Site.Composers;

public class Composer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
        => builder.Services.AddUnique<IDocumentPreviewService, DocumentPreviewService>();
}