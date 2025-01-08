import type {UmbControllerHost} from '@umbraco-cms/backoffice/controller-api';
import {UMB_DOCUMENT_WORKSPACE_CONTEXT} from '@umbraco-cms/backoffice/document';
import type {
    UmbConditionConfigBase,
    UmbConditionControllerArguments,
    UmbExtensionCondition
} from '@umbraco-cms/backoffice/extension-api';
import {UmbConditionBase} from '@umbraco-cms/backoffice/extension-registry';

// for the time being, invoking "Save and preview" from a list view modal closes the modal before the workspace has a
// chance to switch views within the modal. that effectively makes "Save and preview" useless for this package in a
// modal context. until it is fixed to keep the modal open, this condition lets us remove "Save and preview" in a modal
// context as a workaround. 
export class ListViewEditModalIsNotActiveCondition
    extends UmbConditionBase<UmbConditionConfigBase>
    implements UmbExtensionCondition {
    constructor(host: UmbControllerHost, args: UmbConditionControllerArguments<UmbConditionConfigBase>) {
        super(host, args);

        this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
            this.permitted = context.modalContext === undefined;
        });
    }
}

export {ListViewEditModalIsNotActiveCondition as api};
