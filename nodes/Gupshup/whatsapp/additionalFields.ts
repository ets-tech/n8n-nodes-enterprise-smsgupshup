import type { INodeProperties } from "n8n-workflow";
export const whatsAppAdditionalField: INodeProperties[] = [{
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
        show: {
            '/type': ['sendMessage', 'sendMessageWithFile'],

        },
    },
    default: {},

    options: [
        {
            displayName: 'isHSM',
            name: 'isHSM',
            type: 'boolean',
            default: false,
            displayOptions: {
                show: {
                    '/type': ['sendMessage', 'sendMessageWithFile'],

                },
            },
        },
        {
            displayName: 'isTemplate ',
            name: 'isTemplate',
            type: 'boolean',
            default: false,
            placeholder: 'Enter mask',
            displayOptions: {
                show: {
                    '/type': ['sendMessage', 'sendMessageWithFile'],
                },
            },
        },
        {
            displayName: 'Button URL param ',
            name: 'buttonUrlParam',
            type: 'string',
            default: '',
            placeholder: 'Enter url',
            displayOptions: {
                show: {
                    '/type': ['sendMessage', 'sendMessageWithFile'],
                },
            },
        },
        
        {
            displayName: 'Data Encoding',
            name: 'data_encoding',
            type: 'string',
            default: '',
            placeholder: 'Enter data encoding',
            displayOptions: {
                show: {
                    '/type': ['sendMessage', 'sendMessageWithFile'],
                },
            },
        },
        {
            displayName: 'Format ',
            name: 'format',
            type: 'string',
            default: '',
            placeholder: 'Enter format',
            displayOptions: {
                show: {
                    '/type': ['sendMessage', 'sendMessageWithFile'],
                },
            },
        },
        {
            displayName: 'Message ID',
            name: 'msg_id',
            type: 'string',
            default: '',
            placeholder: 'Enter id',
            description: '',
            displayOptions: {
                show: {
                    '/type': ['sendMessage', 'sendMessageWithFile'],
                },
            },
        },
        {
            displayName: 'Extra',
            name: 'extra',
            type: 'string',
            default: '',
            placeholder: 'Enter extra',
            description: '',
            displayOptions: {
                show: {
                    '/type': ['sendMessage', 'sendMessageWithFile'],
                },
            },
        },
        {
            displayName: 'Header',
            name: 'header',
            type: 'string',
            default: '',
            placeholder: 'Enter header',
            description: '',
            displayOptions: {
                show: {
                    '/type': ['sendMessage', 'sendMessageWithFile'],
                },
            },
        },
        
        {
            displayName: 'Footer',
            name: 'footer',
            type: 'string',
            default: '',
            placeholder: 'Enter footer',
            description: '',
            displayOptions: {
                show: {
                    '/type': ['sendMessage', 'sendMessageWithFile'],
                },
            },
        },
        {
            displayName: 'Msg',
            name: 'msg',
            type: 'string',
            default: '',
            placeholder: 'Enter msg',
            description: '',
            displayOptions: {
                show: {
                    '/type': ['sendMessageWithFile'],
                },
            },
        },
        {
            displayName: 'File Name',
            name: 'filename',
            type: 'string',
            default: '',
            placeholder: 'Enter File name',
            description: '',
            displayOptions: {
                show: {
                    '/type': ['sendMessageWithFile'],
                },
            },
        },
    ]

}];

const defaultValues = {
    format: 'JSON',
};

export function getWhatsappAdditionalFields(additionalFields: any) {

    // Merge default values with additionalFields
    additionalFields = { ...defaultValues, ...additionalFields };

    return additionalFields; // Return the result as JSON
}
