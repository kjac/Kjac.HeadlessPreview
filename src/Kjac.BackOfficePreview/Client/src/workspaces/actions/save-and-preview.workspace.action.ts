import {UMB_DOCUMENT_WORKSPACE_CONTEXT} from '@umbraco-cms/backoffice/document';
import {UmbSubmitWorkspaceAction} from '@umbraco-cms/backoffice/workspace';

export class DocumentSaveAndPreviewWorkspaceAction extends UmbSubmitWorkspaceAction {

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
        await super.execute();
        const workspaceContext = await this.getContext(UMB_DOCUMENT_WORKSPACE_CONTEXT);
        const unique = workspaceContext.getUnique();
        const match = window.location.href.match(new RegExp(`.*\/${unique}\/(?<variant>[\\w-]*)(?<view>\\S*)`))
        if (!match || !match.length) {
            console.error('Could not match against current location, unable to switch to preview.')
            return;
        }

        const previewUrl = `${window.location.href.replace(match.groups?.view ?? '', '')}/view/preview`
        if (window.location.href !== previewUrl) {
            // TODO: is there a more graceful way to navigate? ideally something that allows activating the "Preview" workspace view?
            window.history.pushState(null, '', previewUrl)
        }
    }
}

export {DocumentSaveAndPreviewWorkspaceAction as api};