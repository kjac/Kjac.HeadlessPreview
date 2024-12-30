import { UmbEntryPointOnInit, UmbEntryPointOnUnload } from '@umbraco-cms/backoffice/extension-api';
import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import { client } from '../api';

// load up the manifests here
export const onInit: UmbEntryPointOnInit = (_host, _extensionRegistry) => {
  // remove the default "Save and preview" button from the extension registry. we could also choose to overwrite it
  // in the manifest, but this way we can avoid having the button entirely, if the doctype does not support preview.
  _extensionRegistry.unregister('Umb.WorkspaceAction.Document.SaveAndPreview');
  
  // Will use only to add in Open API config with generated TS OpenAPI HTTPS Client
  // Do the OAuth token handshake stuff
  _host.consumeContext(UMB_AUTH_CONTEXT, async (authContext) => {

    // Get the token info from Umbraco
    const config = authContext.getOpenApiConfiguration();

    client.setConfig({
      baseUrl: config.base,
      credentials: config.credentials
    });

    // For every request being made, add the token to the headers
    // Can't use the setConfig approach above as its set only once and
    // tokens expire and get refreshed
    client.interceptors.request.use(async (request, _options) => {
      const token = await config.token();
      request.headers.set('Authorization', `Bearer ${token}`);
      return request;
    });
  });
};

export const onUnload: UmbEntryPointOnUnload = (_host, _extensionRegistry) => {
};
