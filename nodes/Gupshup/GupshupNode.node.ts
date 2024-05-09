import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';

export class GupshupNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Gupshup',
        name: 'Gupshup',
        group: ['transform'],
        version: 1,
        description: 'Node to send messages using Gupshup API',
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
                        displayOptions: {
                            show: {
                                resource: ['whatsapp'],
                            },
                        },
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
                name: 'message',
                type: 'string',
                default: '',
                placeholder: 'Enter message',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['sms_enterprise', 'whatsapp'],
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
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        let resource = this.getNodeParameter('resource', 0);
        let credential = await this.getCredentials('gupshupApi')

        let response = null;

        if (resource == 'sms_enterprise') {
            response = await this.helpers.httpRequest({
                url: 'http://enterprise.smsgupshup.com/GatewayAPI/rest',
                method: 'GET',
                qs: {
                    method: 'SENDMESSAGE',
                    msg_type: 'TEXT',
                    userid: credential?.userid as string,
                    password: credential?.password as string,
                    send_to: this.getNodeParameter('mobile', 0) as string,
                    msg: this.getNodeParameter('message', 0) as string,
                    auth_scheme: 'plain',
                    format: 'json',
                    v: '1.1'
                },
                json: true,
            });
        } else if (resource == 'whatsapp') {
            let type = this.getNodeParameter('type', 0);
            if (type == 'sendMessage') {
                response = await this.helpers.httpRequest({
                    url: 'https://media.smsgupshup.com/GatewayAPI/rest',
                    method: 'GET',
                    qs: {
                        method: 'SENDMESSAGE',
                        msg_type: 'TEXT',
                        userid: credential?.userid as string,
                        password: credential?.password as string,
                        send_to: this.getNodeParameter('mobile', 0) as string,
                        msg: this.getNodeParameter('message', 0) as string,
                        auth_scheme: 'plain',
                        format: 'json',
                        v: '1.1',
                        isTemplate: 'true',
                    },
                    json: true,
                });
            }
            else if (type == 'sendMessageWithFile') {
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
                        caption: this.getNodeParameter('message', 0) as string,
                        media_url: this.getNodeParameter('fileUrl', 0) as string,
                        is_template: 'true',
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
