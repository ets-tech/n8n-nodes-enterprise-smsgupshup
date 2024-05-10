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
                        name: 'Send Message with File',
                        value: 'sendMessageWithFile',
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
                displayName: 'Message',
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
                displayName: 'Message',
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
                displayName: 'File URL',
                name: 'fileUrl',
                type: 'string',
                default: '',
                placeholder: 'Enter URL',
                required: true,
                displayOptions: {
                    show: {
                        type: ['sendMessageWithFile'],
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
            if (type == 'sendMessage') {
                let whatsAppAdditionalFieldsValues = getWhatsappAdditionalFields(this.getNodeParameter('additionalFields', 0));
                response = await this.helpers.httpRequest({
                    url: 'https://media.smsgupshup.com/GatewayAPI/rest',
                    method: 'GET',
                    qs: {
                        method: 'SENDMESSAGE',
                        userid: credential?.userid as string,
                        password: credential?.password as string,
                        send_to: this.getNodeParameter('mobile', 0) as string,
                        msg: this.getNodeParameter('msg', 0) as string,
                        auth_scheme: 'plain',
                        format: 'json',
                        v: '1.1',
                        isTemplate: 'true',
                        msg_type: 'TEXT',
                        ...whatsAppAdditionalFieldsValues
                    },
                    json: true,
                });
            }
            else if (type == 'sendMessageWithFile') {
                let whatsAppAdditionalFieldsValues = getWhatsappAdditionalFields(this.getNodeParameter('additionalFields', 0));

                response = await this.helpers.httpRequest({
                    url: 'https://media.smsgupshup.com/GatewayAPI/rest',
                    method: 'GET',
                    qs: {
                        userid: credential?.userid as string,
                        password: credential?.password as string,
                        send_to: this.getNodeParameter('mobile', 0) as string,
                        v: '1.1',
                        format: 'json',
                        msg_type: 'IMAGE',
                        method: 'SENDMEDIAMESSAGE',
                        media_url: this.getNodeParameter('fileUrl', 0) as string,
                        is_template: 'true',
                        ...whatsAppAdditionalFieldsValues
                    },
                    json: true,
                });
            }
        } else {
            throw new NodeOperationError(this.getNode(), resource + ' operation is not implemented.');
        }

        return [this.helpers.returnJsonArray(response)];
    }
}
