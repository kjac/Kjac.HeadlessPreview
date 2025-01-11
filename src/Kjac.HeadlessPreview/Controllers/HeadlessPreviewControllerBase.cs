using Microsoft.AspNetCore.Authorization;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Web.Common.Authorization;

namespace Kjac.HeadlessPreview.Controllers
{
    [MapToApi(Constants.ApiName)]
    [Authorize(Policy = AuthorizationPolicies.SectionAccessContent)]
    public abstract class HeadlessPreviewControllerBase : ManagementApiControllerBase
    {
    }
}
