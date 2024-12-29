// TODO: clean up
// import {UmbModalContext, UmbModalExtensionElement, UmbModalToken} from "@umbraco-cms/backoffice/modal";
// import {PACKAGE_ALIAS} from "../../constants.ts";
// import {customElement, html, property, state} from "@umbraco-cms/backoffice/external/lit";
// import {UmbLitElement} from "@umbraco-cms/backoffice/lit-element";
// import {UMB_DOCUMENT_WORKSPACE_CONTEXT} from "@umbraco-cms/backoffice/document";
// import {
//     UMB_PROPERTY_DATASET_CONTEXT,
//     UmbPropertyDatasetContext,
//     UmbPropertyDatasetElement,
//     UmbPropertyValueData
// } from "@umbraco-cms/backoffice/property";
// import { UmbDocumentTypeDetailRepository } from "@umbraco-cms/backoffice/document-type";
// import {UmbDataTypeDetailModel, UmbDataTypeDetailRepository } from "@umbraco-cms/backoffice/data-type";
// import { UmbPropertyTypeModel } from "@umbraco-cms/backoffice/content-type";
//
// export type EditPropertyModalData = {
//     alias: string;
// }
//
// export type EditPropertyModalValue = {}
//
// export const BACK_OFFICE_PREVIEW_EDIT_PROPERTY_MODAL_TOKEN = new UmbModalToken<EditPropertyModalData, EditPropertyModalValue>(
//     `${PACKAGE_ALIAS}.Modal.EditProperty`,
//     {
//         modal: {
//             type: 'sidebar',
//             size: 'large'
//         }
//     }
// );
//
// @customElement('back-office-preview-edit-property-modal-view')
// export default class EditFilterModalElement
//     extends UmbLitElement
//     implements UmbModalExtensionElement<EditPropertyModalData, EditPropertyModalValue> {
//
//     @property({attribute: false})
//     modalContext?: UmbModalContext<EditPropertyModalData, EditPropertyModalValue>;
//
//     @property({attribute: false})
//     data?: EditPropertyModalData;
//
//     @property({attribute: false})
//     value?: EditPropertyModalValue;
//
//     @state()
//     private _propertyValues: UmbPropertyValueData[] = [];
//
//     @state()
//     private _propertyType?: UmbPropertyTypeModel;
//
//     @state()
//     private _dataType?: UmbDataTypeDetailModel;
//    
//     private _propertyDatasetContext?: UmbPropertyDatasetContext;
//
//     private _documentName?: string;
//    
//     constructor() {
//         super();
//
//         this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, async (instance) => {
//             this._documentName = instance.getName();
//             const documentTypeDetails = await new UmbDocumentTypeDetailRepository(this).requestByUnique(instance.getContentTypeUnique()!);
//             this._propertyType = documentTypeDetails.data!.properties.find(p =>  p.alias === this.data!.alias)!;
//             const dataTypeDetails = await new UmbDataTypeDetailRepository(this).requestByUnique(this._propertyType.dataType.unique);
//             this._dataType = dataTypeDetails.data!;
//         });
//
//         this.consumeContext(UMB_PROPERTY_DATASET_CONTEXT, async (instance) => {
//             this._propertyDatasetContext = instance;
//             this.observe(await instance?.propertyValueByAlias(this.data!.alias), (value) => {
//                 this._propertyValues = [
//                     {
//                         alias: this.data!.alias,
//                         value: value
//                     }
//                 ];
//             });
//         });
//     }
//
//     #onDataChange(e: Event) {
//         const oldValue = this._propertyValues;
//         this._propertyValues = (e.target as UmbPropertyDatasetElement).value;
//         this.requestUpdate('_propertyValues', oldValue);
//     }
//
//
//     #close() {
//         this.modalContext?.reject();
//     }
//
//     #submit() {
//         this._propertyDatasetContext!.setPropertyValue(
//             this.data!.alias,
//             this._propertyValues[0].value
//         );
//
//         this.modalContext?.submit();
//     }
//
//     render() {
//         if (!this._propertyValues.length || !this._propertyType || !this._dataType) {
//             return html`
//                 <umb-body-layout header-transparent>
//                     <uui-box>TODO: loading...</uui-box>
//                 </umb-body-layout>
//             `;
//         }
//         return html`
//             <umb-body-layout headline="${this._documentName}">
//                 <uui-box>
//                     <umb-property-dataset .value=${this._propertyValues} @change=${this.#onDataChange}>
//                         <umb-property
//                                 label="${this._propertyType!.name}"
//                                 description="${this._propertyType!.description}"
//                                 alias="${this._propertyType!.alias}"
//                                 property-editor-ui-alias="${this._dataType!.editorUiAlias}"
//                                 .config=${this._dataType!.values}></umb-property>
//                     </umb-property-dataset>
//                 </uui-box>
//                 <div slot="actions">
//                     <uui-button label=${this.localize.term('general_cancel')} @click=${this.#close}></uui-button>
//                     <uui-button
//                             id="submitButton"
//                             label=${this.localize.term('general_submit')}
//                             look="primary"
//                             color="positive"
//                             @click=${this.#submit}></uui-button>
//                 </div>
//             </umb-body-layout>
//         `;
//     }
// }
