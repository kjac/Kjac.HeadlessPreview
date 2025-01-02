import {UmbLitElement} from '@umbraco-cms/backoffice/lit-element';
import {css, customElement, html, nothing, query, repeat, state, when} from '@umbraco-cms/backoffice/external/lit';
import {UMB_DOCUMENT_WORKSPACE_CONTEXT} from '@umbraco-cms/backoffice/document';
import {UMB_APP_CONTEXT} from '@umbraco-cms/backoffice/app';
import {UmbEntityUnique} from '@umbraco-cms/backoffice/entity';
import {ActiveVariant} from '@umbraco-cms/backoffice/workspace';
import {UMB_INVARIANT_CULTURE} from '@umbraco-cms/backoffice/variant';
import {BACK_OFFICE_PREVIEW_CONTEXT_TOKEN, WorkspaceContext} from '../workspace.context.ts';
import {PreviewDevice} from '../../models/previewDevice.ts';
import {UmbDocumentTypeDetailRepository} from '@umbraco-cms/backoffice/document-type';
import {DocumentPreviewUrlInfoModel, DocumentService} from '../../api';

@customElement('back-office-preview-view')
export default class FiltersWorkspaceViewElement extends UmbLitElement {
    private _serverUrl?: string;
    private _documentId?: UmbEntityUnique;
    private _documentTypeId?: UmbEntityUnique;
    private _webSocket?: WebSocket;
    private _activeVariant?: ActiveVariant;
    private _workspaceContext?: WorkspaceContext;
    private _iframe?: HTMLIFrameElement;

    @state()
    private _previewUrlInfo?: DocumentPreviewUrlInfoModel;

    @state()
    private _device: PreviewDevice;

    @state()
    private _loading: boolean = true;

    @query('#devices-popover')
    private _popoverContainer!: HTMLElement

    @query('#toolbar-container')
    private _toolbarContainer!: HTMLElement
    
    private _boundMessageHandler = this._messageHandler.bind(this);

    private readonly _devices: PreviewDevice[] = [
        {
            alias: 'desktop',
            label: 'Desktop',
            isDevice: false,
            icon: 'icon-display',
            flipIcon: false,
            dimensions: {height: '100%', width: '100%'},
        },
        {
            alias: 'ipad-portrait',
            label: 'Tablet portrait',
            isDevice: true,
            icon: 'icon-ipad',
            flipIcon: false,
            dimensions: {height: '929px', width: '769px'},
        },
        {
            alias: 'ipad-landscape',
            label: 'Tablet landscape',
            isDevice: true,
            icon: 'icon-ipad',
            flipIcon: true,
            dimensions: {height: '675px', width: '1024px'},
        },
        {
            alias: 'smartphone-portrait',
            label: 'Smartphone portrait',
            isDevice: true,
            icon: 'icon-iphone',
            flipIcon: false,
            dimensions: {height: '640px', width: '360px'},
        },
        {
            alias: 'smartphone-landscape',
            label: 'Smartphone landscape',
            isDevice: true,
            icon: 'icon-iphone',
            flipIcon: true,
            dimensions: {height: '360px', width: '640px'},
        },
    ];

    constructor() {
        super();
        this._device = this._devices[0];

        this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (instance) => {
            const document = instance.getData();
            if (!document) {
                console.error("No document found in the workspace context, aborting preview.")
                return;
            }
            this._documentId = document.unique;
            this._documentTypeId = document.documentType.unique;
            const knownVariants = document.variants.filter(variant => !!variant.createDate);

            this.observe(instance.splitView.activeVariantsInfo, async (activeVariants) => {
                const activeVariant = activeVariants.length ? activeVariants[0] : undefined;
                this._activeVariant = activeVariant && knownVariants.find(variant =>
                    (variant.culture === activeVariant.culture || variant.culture === null && activeVariant.culture === UMB_INVARIANT_CULTURE)
                    && variant.segment === activeVariant.segment
                )
                    ? activeVariant
                    : undefined;

                const previewUrlResponse = await DocumentService.getBackOfficePreviewPreviewUrlInfo({
                    query: {
                        documentId: this._documentId!,
                        culture: this._activeVariant?.culture ?? undefined
                    }
                })

                if (previewUrlResponse.error) {
                    console.error("The preview URL info endpoint yielded an error", previewUrlResponse.error);
                }
                else {
                    this._previewUrlInfo = previewUrlResponse?.data;
                }
            })
        });

        this.consumeContext(BACK_OFFICE_PREVIEW_CONTEXT_TOKEN, (instance) => {
            this._workspaceContext = instance;
            this._device = this._workspaceContext.getLastDevice() ?? this._device;
        });

        this.consumeContext(UMB_APP_CONTEXT, (instance) => {
            this._serverUrl = instance.getServerUrl();
        });
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('message', this._boundMessageHandler);

        if (!this._serverUrl || !this._documentId) {
            console.warn('No document ID and/or server URL found, cannot connect to preview hub - live updates are disabled.')
            return;
        }

        // most of this was nicked from https://github.com/umbraco/Umbraco-CMS/blob/contrib/src/Umbraco.Web.UI.Client/src/apps/preview/preview.context.ts
        // - keep it in sync with the original
        const url = `${this._serverUrl.replace('https://', 'wss://')}/umbraco/PreviewHub`;
        this._webSocket = new WebSocket(url);
        this._webSocket.addEventListener('open', () => {
            // NOTE: SignalR protocol handshake; it requires a terminating control character.
            const endChar = String.fromCharCode(30);
            this._webSocket?.send(`{"protocol":"json","version":1}${endChar}`);
        });
        this._webSocket.addEventListener('message', (event) => {
            if (!event?.data)
                return;
            // NOTE: Strip the terminating control character, (from SignalR).
            const data = event.data.substring(0, event.data.length - 1);
            const json = JSON.parse(data);
            if (json.type === 1 && json.target === 'refreshed' && json.arguments && json.arguments.indexOf(this._documentId) >= 0) {
                this._reloadIFrame();
            }
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        window.removeEventListener('message', this._boundMessageHandler);

        if (this._webSocket) {
            this._webSocket.close();
            this._webSocket = undefined;
        }
    }

    render() {
        if (!this._activeVariant) {
            return html`
                <umb-body-layout header-transparent>
                    <uui-box>Please save the document before previewing it.</uui-box>
                </umb-body-layout>
            `;
        }

        if (!this._previewUrlInfo) {
            return html`<uui-loader></uui-loader>`;
        }

        if (!this._previewUrlInfo.previewUrl) {
            return html`
                <umb-body-layout header-transparent>
                    <uui-box>${this._previewUrlInfo.info ?? 'This document cannot be previewed.'}</uui-box>
                </umb-body-layout>
            `;
        }
        
        return html`
            <div class="iframe-container">
                <iframe
                        src="${this._previewUrlInfo.previewUrl}"
                        class="${this._device.isDevice ? 'device' : nothing}"
                        style="width: ${this._device.dimensions.width}; height: ${this._device.dimensions.height}"
                        @load=${this._onIFrameLoad}>
                </iframe>
            </div>
            ${when(
                    this._loading,
                    () => html`<uui-loader></uui-loader>`,
                    () => html`
                        <div class="toolbar-container" id="toolbar-container">
                            <div class="buttons">
                                <uui-button popovertarget="devices-popover" look="primary">
                                    <uui-icon name="icon-display"></uui-icon>
                                </uui-button>
                                <uui-button look="primary" href="${this._previewUrlInfo!.previewUrl}" target="_blank">
                                    <uui-icon name="icon-out"></uui-icon>
                                </uui-button>
                            </div>
                            <uui-popover-container id="devices-popover">
                                <umb-popover-layout>
                                    ${repeat(
                                            this._devices,
                                            (item) => item.alias,
                                            (item) => html`
                                                <uui-menu-item
                                                        label=${item.label}
                                                        ?active=${item === this._device}
                                                        @click=${() => this._changePreviewDevice(item)}>
                                                    <uui-icon slot="icon" name=${item.icon}
                                                              class=${item.flipIcon ? 'flip' : nothing}></uui-icon>
                                                </uui-menu-item>
                                            `,
                                    )}
                                </umb-popover-layout>
                            </uui-popover-container>
                            <div class="toggle">
                                <uui-button look="primary" @click=${this._toggleToolbar}>
                                    <uui-icon name="icon-left-double-arrow"></uui-icon>
                                </uui-button>
                            </div>
                        </div>`
            )}
        `;
    }

    private _toggleToolbar() {
        this._toolbarContainer.classList.toggle('active');
    }
    
    private _changePreviewDevice(device: PreviewDevice) {
        this._device = device;
        this._workspaceContext?.updateLastDevice(device);
        this._popoverContainer.togglePopover();
    }

    private _reloadIFrame() {
        if (!this._iframe?.contentWindow) {
            return;
        }

        this._loading = true;
        // re-setting the iframe source forces the iframe to reload
        this._iframe.src = this._iframe.src!;
    }

    private _onIFrameLoad(event: { target: HTMLIFrameElement }) {
        this._loading = false;
        this._iframe = event.target;
    }

    private _updateIFrameScrollPos() {
        if (!this._iframe) {
            return;
        }

        const lastScrollPos = this._workspaceContext?.getLastScrollPos();
        if (!lastScrollPos) {
            return;
        }

        this._iframe.contentWindow?.postMessage(`umb.preview|scrollTo|${lastScrollPos}`, '*');
    }

    private async _editProperty(alias: string) {
        if (!this._documentId || !this._documentTypeId) {
            console.error('No document or document type ID found yet. Cannot edit property. This really should not have happened.')
            return;
        }

        const documentTypeResponse = await new UmbDocumentTypeDetailRepository(this).requestByUnique(this._documentTypeId);
        if (documentTypeResponse.error) {
            console.error(`Could not fetch document type: ${this._documentTypeId}`, documentTypeResponse.error)
            return;
        }

        const documentType = documentTypeResponse.data!;
        const propertyType = documentType.properties.find(p => p.alias === alias);

        if (!propertyType) {
            console.warn(`The property type with alias "${alias}" could not be found on the document type with alias "${documentType.alias}"`);
            return;
        }

        let tabName = null;
        let containerIdentifier = propertyType.container;
        while (containerIdentifier?.id) {
            const container = documentType.containers.find(c => c.id === containerIdentifier!.id);
            if (!container) {
                break;
            }
            if (container.type !== 'Tab') {
                containerIdentifier = container.parent;
                continue;
            }
            tabName = container.name;
            break;
        }

        let editUrl = window.location.href.replace('/view/preview', '/view/content');
        if (tabName) {
            editUrl = `${editUrl}/tab/${tabName.toLowerCase().replace(' ', '-')}`;
        }

        // TODO: is there a more graceful way to navigate? ideally something that allows activating the "Edit" workspace view for the specific tab?
        window.history.pushState(null, '', editUrl);
    }

    private async _messageHandler(message: MessageEvent<any>) {
        if (typeof message.data !== 'string' || message.data.indexOf('umb.preview') !== 0) {
            return;
        }

        const parts = message.data.split('|');
        if (parts.length !== 3) {
            console.warn('Malformed message received', message);
            return;
        }
        switch (parts[1]) {
            case 'edit':
                await this._editProperty(parts[2]);
                break;
            case 'scrollPos':
                this._workspaceContext?.updateLastScrollPos(parts[2]);
                break;
            case 'init':
                switch (parts[2]) {
                    case 'ready':
                        this._updateIFrameScrollPos();
                        break;
                }
                break;
        }
    }

    static override styles = [
        css`
            umb-popover-layout {
                --uui-color-surface: var(--uui-color-header-surface);
                color: var(--uui-color-header-contrast);
            }

            uui-icon.flip {
                rotate: 90deg;
            }

            .iframe-container {
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: white;
            }

            iframe {
                border: 0;
                transition: 240ms cubic-bezier(0.165, 0.84, 0.44, 1);
            }

            iframe.device {
                box-shadow: rgba(0, 0, 0, 0.26) 0px 5px 20px 0px;
                border: 1px solid var(--uui-color-border-standalone);
                border-radius: 4px;
                max-width: 100%;
                max-height: calc(100% - 2px);
            }

            uui-loader {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .toolbar-container {
                position: absolute;
                top: -50px;
                left: 50%;
                transform: translateX(-50%);
                background: rgb(27, 38, 79);
                padding-top: 10px;
                border-radius: 0 0 5px 5px;
                border: 1px solid var(--uui-color-border);
                border-top: 0;
                transition: top 80ms ease-in-out;
            }

            .toolbar-container .buttons {
                margin: 0 10px;
            }

            .toolbar-container.active {
                top: 0;
                animation: 1s;
            }

            .toolbar-container uui-button {
                border: 1px solid var(--uui-color-border);
                border-radius: var(--uui-border-radius);
            }

            .toolbar-container .toggle {
                text-align: center;
            }

            .toolbar-container .toggle uui-button {
                border: 0;
                width: 100%;
                min-height: 20px;
                height: 20px;
                margin-top: 5px;
            }

            .toolbar-container .toggle uui-button uui-icon {
                rotate: -90deg;
            }

            .toolbar-container.active .toggle uui-button uui-icon {
                rotate: 90deg;
            }
        `,
    ];
}