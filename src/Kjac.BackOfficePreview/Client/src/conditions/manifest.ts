import {PACKAGE_NAME, SPLIT_VIEW_IS_NOT_ACTIVE_CONDITION_ALIAS} from '../constants.ts';

export const manifests: Array<UmbExtensionManifest> = [
    {
        type: 'condition',
        name: `${PACKAGE_NAME} Split View Is Not Active Condition`,
        alias: SPLIT_VIEW_IS_NOT_ACTIVE_CONDITION_ALIAS,
        api: () => import('./split-view-is-not-active.condition.ts'),
    }
];
