import type {UmbControllerHost} from '@umbraco-cms/backoffice/controller-api';
import {UMB_DOCUMENT_WORKSPACE_CONTEXT} from '@umbraco-cms/backoffice/document';
import type {
    UmbConditionConfigBase,
    UmbConditionControllerArguments,
    UmbExtensionCondition
} from '@umbraco-cms/backoffice/extension-api';
import {UmbConditionBase} from '@umbraco-cms/backoffice/extension-registry';
import {
    DocumentTypeService,
    type GetHeadlessPreviewDocumentTypePreviewSupportedError,
    type GetHeadlessPreviewDocumentTypePreviewSupportedResponse
} from "../api";
import { RequestResult } from '@hey-api/client-fetch';

export class PreviewIsSupportedCondition
    extends UmbConditionBase<UmbConditionConfigBase>
    implements UmbExtensionCondition {

    
    constructor(host: UmbControllerHost, args: UmbConditionControllerArguments<UmbConditionConfigBase>) {
        super(host, args);

        this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, async (context) => {
            const documentTypeId = context.getContentTypeUnique();
            if (!documentTypeId) {
                console.warn('Could not find the document type of the current document, preview is disabled.');
                this.permitted = false;
                return;
            }

            
            const response = await RequestManager.request(documentTypeId);
            this.permitted = response?.data ?? false;
        });
    }
}

// multiple simultaneous API requests will be made for the same resource, since the condition is used in multiple places.
// this workaround ensures we only create a single API request and yield the same promise for all consumers of the condition. 
class RequestManager {
    private static _activeRequest?: RequestResult<GetHeadlessPreviewDocumentTypePreviewSupportedResponse, GetHeadlessPreviewDocumentTypePreviewSupportedError, boolean>;

    public static request(documentTypeId: string)
    {
        if (!this._activeRequest) {
            this._activeRequest = DocumentTypeService.getHeadlessPreviewDocumentTypePreviewSupported({
                query: {
                    documentTypeId: documentTypeId
                }
            }).finally(() => this._activeRequest = undefined);
        }

        return this._activeRequest;
    }
}

export {PreviewIsSupportedCondition as api};
