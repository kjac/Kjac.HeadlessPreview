using Kjac.BackOfficePreview.Site.Models;
using Microsoft.AspNetCore.Mvc;

namespace Kjac.BackOfficePreview.Site.Controllers;

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

        var deliveryApiContent = await client.GetFromJsonAsync<DeliveryApiContent>($"https://localhost:44304/umbraco/delivery/api/v2/content/item/{id}")
                                 ?? throw new InvalidOperationException("Unable to get Delivery API content");

        return View(deliveryApiContent);
    }
}