using Asp.Versioning;
using Kjac.HeadlessPreview.Models.Configuration;
using Kjac.HeadlessPreview.Services;
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

namespace Kjac.HeadlessPreview.Composers
{
    public sealed class Composer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.Services.AddSingleton<ISchemaIdHandler, HeadlessPreviewSchemaIdHandler>();
            builder.Services.AddSingleton<IOperationIdHandler, HeadlessPreviewOperationIdHandler>();
            builder.Services.AddUnique<IDocumentPreviewService, NoopDocumentPreviewService>();
            builder.Services.AddUnique<IDocumentTypePreviewService, ConfigurableDocumentTypePreviewService>();
            builder.Services.ConfigureOptions<HeadlessPreviewSwaggerGenOptions>();
            builder.Services.Configure<HeadlessPreviewConfiguration>(
                builder.Config.GetSection(nameof(HeadlessPreview))
            );
        }

        private class HeadlessPreviewSwaggerGenOptions : IConfigureOptions<SwaggerGenOptions>
        {
            public void Configure(SwaggerGenOptions options)
            {
                options.SwaggerDoc(
                    Constants.ApiName,
                    new OpenApiInfo { Title = "Headless Preview API", Version = "1.0" }
                );

                options.OperationFilter<HeadlessPreviewOperationSecurityFilter>();
            }
        }

        private class HeadlessPreviewOperationSecurityFilter : BackOfficeSecurityRequirementsOperationFilterBase
        {
            protected override string ApiName => Constants.ApiName;
        }

        private class HeadlessPreviewSchemaIdHandler : SchemaIdHandler
        {
            public override bool CanHandle(Type type)
                => type.Namespace?.StartsWith("Kjac.HeadlessPreview") is true;
        }

        private class HeadlessPreviewOperationIdHandler : OperationIdHandler
        {
            public HeadlessPreviewOperationIdHandler(IOptions<ApiVersioningOptions> apiVersioningOptions)
                : base(apiVersioningOptions)
            {
            }

            protected override bool CanHandle(ApiDescription apiDescription, ControllerActionDescriptor controllerActionDescriptor)
                => controllerActionDescriptor.ControllerTypeInfo.Namespace?.StartsWith("Kjac.HeadlessPreview") is true;
        }
    }
}
