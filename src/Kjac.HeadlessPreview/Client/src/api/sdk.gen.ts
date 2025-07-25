// This file is auto-generated by @hey-api/openapi-ts

import type { Options as ClientOptions, TDataShape, Client } from '@hey-api/client-fetch';
import type { GetHeadlessPreviewDocumentTypePreviewSupportedData, GetHeadlessPreviewDocumentTypePreviewSupportedResponse, GetHeadlessPreviewDocumentPreviewUrlInfoData, GetHeadlessPreviewDocumentPreviewUrlInfoResponse } from './types.gen';
import { client as _heyApiClient } from './client.gen';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};

export class DocumentTypeService {
    public static getHeadlessPreviewDocumentTypePreviewSupported<ThrowOnError extends boolean = false>(options?: Options<GetHeadlessPreviewDocumentTypePreviewSupportedData, ThrowOnError>) {
        return (options?.client ?? _heyApiClient).get<GetHeadlessPreviewDocumentTypePreviewSupportedResponse, unknown, ThrowOnError>({
            security: [
                {
                    scheme: 'bearer',
                    type: 'http'
                }
            ],
            url: '/umbraco/management/api/v1/headless-preview/document-type/preview-supported',
            ...options
        });
    }
    
}

export class DocumentService {
    public static getHeadlessPreviewDocumentPreviewUrlInfo<ThrowOnError extends boolean = false>(options?: Options<GetHeadlessPreviewDocumentPreviewUrlInfoData, ThrowOnError>) {
        return (options?.client ?? _heyApiClient).get<GetHeadlessPreviewDocumentPreviewUrlInfoResponse, unknown, ThrowOnError>({
            security: [
                {
                    scheme: 'bearer',
                    type: 'http'
                }
            ],
            url: '/umbraco/management/api/v1/headless-preview/document/preview-url-info',
            ...options
        });
    }
    
}