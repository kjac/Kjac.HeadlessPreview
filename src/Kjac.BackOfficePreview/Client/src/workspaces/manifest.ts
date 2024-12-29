import {UMB_WORKSPACE_CONDITION_ALIAS} from '@umbraco-cms/backoffice/workspace';
import {PACKAGE_ALIAS, PACKAGE_NAME, SPLIT_VIEW_IS_NOT_ACTIVE_CONDITION_ALIAS} from '../constants.ts';
import {UMB_DOCUMENT_WORKSPACE_ALIAS} from '@umbraco-cms/backoffice/document';
import {UMB_ENTITY_IS_NOT_TRASHED_CONDITION_ALIAS} from '@umbraco-cms/backoffice/recycle-bin';

export const manifests: Array<UmbExtensionManifest> = [
    {
        type: 'workspaceContext',
        alias: `${PACKAGE_ALIAS}.Workspace.Context`,
        name: `${PACKAGE_NAME} Workspace Context`,
        api: () => import('./workspace.context.ts'),
        conditions: [
            {
                alias: UMB_WORKSPACE_CONDITION_ALIAS,
                match: UMB_DOCUMENT_WORKSPACE_ALIAS,
            },
        ]
    },
    {
        type: 'workspaceView',
        alias: `${PACKAGE_ALIAS}.WorkspaceView`,
        element: () => import('./views/preview.workspace.view.ts'),
        name: `${PACKAGE_NAME} Workspace View`,
        meta: {
            label: '#general_preview',
            pathname: 'preview',
            icon: 'icon-eye'
        },
        conditions: [
            {
                alias: UMB_WORKSPACE_CONDITION_ALIAS,
                match: UMB_DOCUMENT_WORKSPACE_ALIAS
            },
            {
                alias: UMB_ENTITY_IS_NOT_TRASHED_CONDITION_ALIAS
            },
            {
                alias: SPLIT_VIEW_IS_NOT_ACTIVE_CONDITION_ALIAS
            }
        ],
    },
    {
        type: 'workspaceAction',
        kind: 'default',
        overwrites: 'Umb.WorkspaceAction.Document.SaveAndPreview',
        alias: `${PACKAGE_ALIAS}.WorkspaceAction.Document.SaveAndPreview`,
        api: () => import('./actions/save-and-preview.workspace.action.ts'),
        name: `${PACKAGE_ALIAS} Save And Preview Document Workspace Action`,
        weight: 90,
        meta: {
            label: '#buttons_saveAndPreview'
        },
        conditions: [
            {
                alias: UMB_WORKSPACE_CONDITION_ALIAS,
                match: UMB_DOCUMENT_WORKSPACE_ALIAS
            },
            {
                alias: UMB_ENTITY_IS_NOT_TRASHED_CONDITION_ALIAS
            }
        ],
    },
    // TODO: clean up
    // {
    //     type: 'modal',
    //     alias: `${PACKAGE_ALIAS}.Modal.EditProperty`,
    //     name: `${PACKAGE_NAME} Edit Property Modal View`,
    //     element: () => import('./views/edit-property.modal.view.ts')
    // }
];
