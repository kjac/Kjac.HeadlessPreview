using Microsoft.AspNetCore.Authorization;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Api.Management.Routing;
using Umbraco.Cms.Web.Common.Authorization;

namespace Kjac.BackOfficePreview.Controllers
{
    [VersionedApiBackOfficeRoute(Constants.ApiName)]
    [MapToApi(Constants.ApiName)]
    [Authorize(Policy = AuthorizationPolicies.SectionAccessContent)]
    public abstract class BackOfficePreviewControllerBase : ManagementApiControllerBase
    {
    }
}
