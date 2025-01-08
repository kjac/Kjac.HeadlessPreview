import {UmbContextBase} from "@umbraco-cms/backoffice/class-api";
import {UmbContextToken} from "@umbraco-cms/backoffice/context-api";
import {PACKAGE_ALIAS} from "../constants.ts";
import {PreviewDevice} from "../models/previewDevice.ts";
import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";

export class WorkspaceContext extends UmbContextBase<WorkspaceContext> {
    private _lastDevice?: PreviewDevice;
    private _lastScrollPos?: string;

    constructor(host: UmbControllerHost) {
        super(host, BACK_OFFICE_PREVIEW_CONTEXT_TOKEN);
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

export const BACK_OFFICE_PREVIEW_CONTEXT_TOKEN = new UmbContextToken<WorkspaceContext>(
    `${PACKAGE_ALIAS}.Workspace.Context`
);
