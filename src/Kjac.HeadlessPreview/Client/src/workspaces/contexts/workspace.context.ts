import {UmbContextBase} from '@umbraco-cms/backoffice/class-api';
import {UmbContextToken} from '@umbraco-cms/backoffice/context-api';
import {PACKAGE_ALIAS} from '../../constants.ts';
import {PreviewDevice} from '../../models/previewDevice.ts';
import {UmbControllerHost} from '@umbraco-cms/backoffice/controller-api';
import { UmbEntityUnique } from '@umbraco-cms/backoffice/entity';

export class WorkspaceContext extends UmbContextBase {
    private _lastDocumentId?: UmbEntityUnique;
    private _lastDevice?: PreviewDevice;
    private _lastScrollPos?: string;

    constructor(host: UmbControllerHost) {
        super(host, HEADLESS_PREVIEW_CONTEXT_TOKEN);
    }

    initializeContext(documentId: UmbEntityUnique) {
        if (this._lastDocumentId === documentId) {
            return;
        }
        this._lastScrollPos = undefined;
        this._lastDocumentId = documentId;
    }
    
    updateLastDevice = (device: PreviewDevice) => {
        this._lastDevice = device
    };

    getLastDevice = () => this._lastDevice;

    updateLastScrollPos = (scrollPos: string) => {
        this._lastScrollPos = scrollPos;
    };

    getLastScrollPos = () => this._lastScrollPos;
}

export const api = WorkspaceContext;

export const HEADLESS_PREVIEW_CONTEXT_TOKEN = new UmbContextToken<WorkspaceContext>(
    `${PACKAGE_ALIAS}.Workspace.Context`
);
