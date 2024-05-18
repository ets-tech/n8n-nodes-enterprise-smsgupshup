import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';
import { smsEnterpriseAdditionalField, getAdditionalFields } from './sms-enterprise/additionalField';
import { whatsAppAdditionalField, getWhatsappAdditionalFields } from './whatsapp/additionalFields'

export class GupshupNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Gupshup',
        name: 'Gupshup',
        group: ['transform'],
        version: 1,
        description: 'Node to send messages using Gupshup API',
        icon: "file:gupshup.svg",
        defaults: {
            name: 'Gupshup',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'gupshupApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                default: '',
                description: 'Resource from which the message will be sent',
                required: true,
                noDataExpression: true,
                options: [
                    {
                        name: 'SMS (Enterprise)',
                        value: 'sms_enterprise',
                    },
                    {
                        name: 'WhatsApp',
                        value: 'whatsapp',
                    },
                ]
            },
            {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                default: '',
                description: 'How to send the message',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['whatsapp'],
                    },
                },
                options: [
                    {
                        name: 'Send Message',
                        value: 'sendMessage',
                    },
                    {
                        name: 'Send Message with Image',
                        value: 'sendMessageWithImage',
                    },
                    {
                        name: 'Send Message with Video',
                        value: 'sendMessageWithVideo',
                    },
                    {
                        name: 'Send Message with PDF',
                        value: 'sendMessageWithPDF',
                    },
                ]
            },
            {
                displayName: 'Mobile',
                name: 'mobile',
                type: 'string',
                default: '',
                placeholder: 'Enter recipient',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['sms_enterprise', 'whatsapp'],
                    },
                },
            },
            {
                displayName: 'SMS Message',
                name: 'msg',
                type: 'string',
                default: '',
                placeholder: 'Enter message',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['sms_enterprise'],
                    },
                    hide: {
                        resource: ['whatsapp']
                    }
                },
                typeOptions: {
                    rows: 4,
                },
            },
            {
                displayName: 'Whatsapp Message',
                name: 'msg',
                type: 'string',
                default: '',
                placeholder: 'Enter message',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['whatsapp'],
                        type: ['sendMessage']
                    },
                },
                typeOptions: {
                    rows: 4,
                },
            },
            {
                displayName: 'Caption',
                name: 'caption',
                type: 'string',
                default: '',
                required: true,
                placeholder: 'Enter caption',
                description: '',
                displayOptions: {
                    show: {
                        resource: ['whatsapp'],
                        '/type': ['sendMessageWithImage', 'sendMessageWithVideo', 'sendMessageWithPDF'],
                    },
                },
                typeOptions: {
                    rows: 4,
                },
            },
            {
                displayName: 'File URL',
                name: 'fileUrl',
                type: 'string',
                default: '',
                placeholder: 'Enter URL',
                required: true,
                displayOptions: {
                    show: {
                        type: ['sendMessageWithImage', 'sendMessageWithVideo', 'sendMessageWithPDF'],
                        resource: ['whatsapp'],
                    },
                },
            },
            ...smsEnterpriseAdditionalField,
            ...whatsAppAdditionalField
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        let resource = this.getNodeParameter('resource', 0);
        let credential = await this.getCredentials('gupshupApi')

        let response = null;

        if (resource == 'sms_enterprise') {
            let AdditionalFieldsValues = getAdditionalFields(this.getNodeParameter('additionalFields', 0));
            response = await this.helpers.httpRequest({
                url: 'http://enterprise.smsgupshup.com/GatewayAPI/rest',
                method: 'GET',
                qs: {
                    method: 'SENDMESSAGE',
                    msg_type: 'TEXT',
                    userid: credential?.userid as string,
                    password: credential?.password as string,
                    send_to: this.getNodeParameter('mobile', 0) as string,
                    msg: this.getNodeParameter('msg', 0) as string,
                    ...AdditionalFieldsValues
                },
                json: true,
            });
        } else if (resource == 'whatsapp') {
            let type = this.getNodeParameter('type', 0);
            let whatsAppAdditionalFieldsValues = getWhatsappAdditionalFields(this.getNodeParameter('additionalFields', 0));

            let msgType = '';
            let method = 'SENDMESSAGE';
            let additionalQs: { [key: string]: string } = {};

            switch (type) {
                case 'sendMessage':
                    msgType = 'TEXT';
                    additionalQs = { msg: this.getNodeParameter('msg', 0) as string};
                    break;
                case 'sendMessageWithImage':
                    msgType = 'IMAGE';
                    method = 'SENDMEDIAMESSAGE';
                    additionalQs = { media_url: this.getNodeParameter('fileUrl', 0) as string,
                                     caption: this.getNodeParameter('caption', 0) as string};
                    break;
                case 'sendMessageWithVideo':
                    msgType = 'VIDEO';
                    method = 'SENDMEDIAMESSAGE';
                    additionalQs = { media_url: this.getNodeParameter('fileUrl', 0) as string,
                                     caption: this.getNodeParameter('caption', 0) as string};
                    break;
                case 'sendMessageWithPDF':
                    msgType = 'DOCUMENT';
                    method = 'SENDMEDIAMESSAGE';
                    additionalQs = { media_url: this.getNodeParameter('fileUrl', 0) as string,
                                     caption: this.getNodeParameter('caption', 0) as string};
                    break;
                default:
                    throw new NodeOperationError(this.getNode(), `The type ${type} is not supported.`);
            }

            response = await this.helpers.httpRequest({
                url: 'https://media.smsgupshup.com/GatewayAPI/rest',
                method: 'GET',
                qs: {
                    method: method,
                    userid: credential?.userid as string,
                    password: credential?.password as string,
                    send_to: this.getNodeParameter('mobile', 0) as string,
                    msg_type: msgType,
                    format: 'json',
                    v: '1.1',
                    auth_scheme: 'plain',
                    isTemplate: 'true',
                    ...additionalQs,
                    ...whatsAppAdditionalFieldsValues,
                },
                json: true,
            });
        } else {
            throw new NodeOperationError(this.getNode(), resource + ' operation is not implemented.');
        }

        return [this.helpers.returnJsonArray(response)];
    }
}
