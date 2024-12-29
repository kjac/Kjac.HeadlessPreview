using Asp.Versioning;
using Kjac.BackOfficePreview.Services;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Api.Management.OpenApi;
using Umbraco.Cms.Api.Common.OpenApi;
using Umbraco.Extensions;

namespace Kjac.BackOfficePreview.Composers
{
    public sealed class Composer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.Services.AddSingleton<ISchemaIdHandler, BackOfficePreviewSchemaIdHandler>();
            builder.Services.AddSingleton<IOperationIdHandler, BackOfficePreviewOperationIdHandler>();
            builder.Services.AddUnique<IContentPreviewService, NoopContentPreviewService>();
            builder.Services.ConfigureOptions<BackOfficePreviewSwaggerGenOptions>();
        }

        private class BackOfficePreviewSwaggerGenOptions : IConfigureOptions<SwaggerGenOptions>
        {
            public void Configure(SwaggerGenOptions options)
            {
                options.SwaggerDoc(
                    Constants.ApiName,
                    new OpenApiInfo { Title = "Back-Office Preview API", Version = "1.0" }
                );

                options.OperationFilter<BackOfficePreviewOperationSecurityFilter>();
            }
        }

        private class BackOfficePreviewOperationSecurityFilter : BackOfficeSecurityRequirementsOperationFilterBase
        {
            protected override string ApiName => Constants.ApiName;
        }

        private class BackOfficePreviewSchemaIdHandler : SchemaIdHandler
        {
            public override bool CanHandle(Type type)
                => type.Namespace?.StartsWith("Kjac.BackOfficePreview") is true;
        }

        private class BackOfficePreviewOperationIdHandler : OperationIdHandler
        {
            public BackOfficePreviewOperationIdHandler(IOptions<ApiVersioningOptions> apiVersioningOptions)
                : base(apiVersioningOptions)
            {
            }

            protected override bool CanHandle(ApiDescription apiDescription, ControllerActionDescriptor controllerActionDescriptor)
                => controllerActionDescriptor.ControllerTypeInfo.Namespace?.StartsWith("Kjac.BackOfficePreview") is true;
        }
    }
}
