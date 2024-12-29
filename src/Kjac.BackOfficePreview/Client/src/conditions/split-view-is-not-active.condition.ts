import type {UmbControllerHost} from '@umbraco-cms/backoffice/controller-api';
import {UMB_DOCUMENT_WORKSPACE_CONTEXT} from '@umbraco-cms/backoffice/document';
import type {
    UmbConditionConfigBase,
    UmbConditionControllerArguments,
    UmbExtensionCondition
} from '@umbraco-cms/backoffice/extension-api';
import {UmbConditionBase} from '@umbraco-cms/backoffice/extension-registry';

export class SplitViewIsNotActiveCondition
    extends UmbConditionBase<UmbConditionConfigBase>
    implements UmbExtensionCondition {
    constructor(host: UmbControllerHost, args: UmbConditionControllerArguments<UmbConditionConfigBase>) {
        super(host, args);

        this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
            this.observe(
                context.splitView.activeVariantsInfo,
                (activeVariants) => {
                    this.permitted = activeVariants.length === 1;
                }
            );
        });
    }
}

export {SplitViewIsNotActiveCondition as api};
