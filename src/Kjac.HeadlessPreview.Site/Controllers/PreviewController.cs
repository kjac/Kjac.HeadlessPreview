using System.Text.Json;
using Kjac.HeadlessPreview.Site.Models;
using Microsoft.AspNetCore.Mvc;

namespace Kjac.HeadlessPreview.Site.Controllers;

// [ApiController]
[Route("/preview")]
public class PreviewController : Controller
{
    private readonly IHttpClientFactory _httpClientFactory;

    public PreviewController(IHttpClientFactory httpClientFactory)
        => _httpClientFactory = httpClientFactory;

    [HttpGet]
    public async Task<IActionResult> Preview(Guid id, string? culture = null)
    {
        var client = _httpClientFactory.CreateClient("Preview");
        client.DefaultRequestHeaders.Add("Preview", "true");
        client.DefaultRequestHeaders.Add("Api-Key", "super-secret-key");
        if (culture is not null)
        {
            client.DefaultRequestHeaders.Add("Accept-Language", culture);
        }

        var content = await client.GetStringAsync($"https://localhost:44304/umbraco/delivery/api/v2/content/item/{id}")
                      ?? throw new InvalidOperationException("Unable to get Delivery API content");

        // since we only have one single entrypoint for preview, we first have to figure out the type of content being
        // previewed, before actually rendering the preview
        var contentType = JsonSerializer.Deserialize<DeliveryApiContentType>(content, JsonSerializerOptions.Web)?.ContentType
                          ?? throw new InvalidOperationException("Unable to detect the Delivery API content type");

        switch (contentType)
        {
            case "post":
                var post = JsonSerializer.Deserialize<DeliveryApiContent<PostProperties>>(content, JsonSerializerOptions.Web)
                           ?? throw new InvalidOperationException("Unable to get parse Delivery API response as a post");
                return View("Post", post);
            case "author":
                var author = JsonSerializer.Deserialize<DeliveryApiContent<AuthorProperties>>(content, JsonSerializerOptions.Web)
                           ?? throw new InvalidOperationException("Unable to get parse Delivery API response as an author");
                return View("Author", author);
            default:
                // fallback to generic Delivery API content
                var generic = JsonSerializer.Deserialize<DeliveryApiContent<Dictionary<string, object>>>(content, JsonSerializerOptions.Web)
                                         ?? throw new InvalidOperationException("Unable to get parse Delivery API response as generic Delivery API content");

                return View("Generic", generic);
        }
    }

    private class DeliveryApiContentType
    {
        public required string ContentType { get; init; }
    }
}