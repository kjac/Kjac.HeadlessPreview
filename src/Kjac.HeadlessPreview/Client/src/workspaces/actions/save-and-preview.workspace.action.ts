import {UMB_DOCUMENT_WORKSPACE_CONTEXT} from '@umbraco-cms/backoffice/document';
import {UmbWorkspaceActionBase} from '@umbraco-cms/backoffice/workspace';

export class DocumentSaveAndPreviewWorkspaceAction extends UmbWorkspaceActionBase {

    // TODO: need to implement this at some point (UmbDocumentUserPermissionCondition is not available atm)
    // constructor(host: UmbControllerHost, args: any) {
    //     super(host, args);
    //
    //     /* The action is disabled by default because the onChange callback
    //      will first be triggered when the condition is changed to permitted */
    //     this.disable();
    //
    //     // TODO: this check is not sufficient. It will show the save button if a use
    //     // has only create options. The best solution would be to split the two buttons into two separate actions
    //     // with a condition on isNew to show/hide them
    //     // The server will throw a permission error if this scenario happens
    //     const condition = new UmbDocumentUserPermissionCondition(host, {
    //         host,
    //         config: {
    //             alias: 'Umb.Condition.UserPermission.Document',
    //             oneOf: [UMB_USER_PERMISSION_DOCUMENT_CREATE, UMB_USER_PERMISSION_DOCUMENT_UPDATE],
    //         },
    //         onChange: () => {
    //             if (condition.permitted) {
    //                 this.enable();
    //             } else {
    //                 this.disable();
    //             }
    //         },
    //     });
    // }

    override async execute() {
        const workspaceContext = await this.getContext(UMB_DOCUMENT_WORKSPACE_CONTEXT);
        if (!workspaceContext) {
            throw new Error('Document workspace context not found');
        }

        // workspaceContext.saveAndPreview() calls window.open() to display the default preview in a new tab. we definitively
        // don't want the default preview in a new tab, so we'll temporarily monkey patch window.open() as a no-op.
        const windowOpen = window.open;
        try {
            window.open = _ => null;
            await workspaceContext.saveAndPreview();
        }
        finally {
            window.open = windowOpen;
        }

        const unique = workspaceContext.getUnique();
        const currentLocation = window.location.href.replace(/\/+$/, '');
        const match = currentLocation.match(new RegExp(`.*\/${unique}\/(?<variant>[\\w-]*)(?<view>\\S*)`))
        if (!match || !match.length) {
            console.error('Could not match against current location, unable to switch to preview.')
            return;
        }

        const previewUrl = `${currentLocation.replace(match.groups?.view ?? '', '')}/view/headless-preview`
        if (currentLocation !== previewUrl) {
            window.history.pushState(null, '', previewUrl)
        }
    }
}

export {DocumentSaveAndPreviewWorkspaceAction as api};