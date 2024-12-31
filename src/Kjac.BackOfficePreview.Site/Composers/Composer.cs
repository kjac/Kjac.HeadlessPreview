using Kjac.BackOfficePreview.Services;
using Kjac.BackOfficePreview.Site.Services;
using Umbraco.Cms.Core.Composing;

namespace Kjac.BackOfficePreview.Site.Composers;

public class Composer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
        => builder.Services.AddUnique<IDocumentPreviewService, DocumentPreviewService>();
}