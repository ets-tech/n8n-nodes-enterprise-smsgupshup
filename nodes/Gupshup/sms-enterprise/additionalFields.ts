import type { INodeProperties } from "n8n-workflow";
export const smsEnterpriseAdditionalField: INodeProperties[] = [{
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
        show: {
            resource: ['sms_enterprise'],
        },
    },
    default: {},

    options: [
        {
            displayName: 'Version',
            name: 'v',
            type: 'string',
            default: '1.1',
            placeholder: 'Enter version',
            displayOptions: {
                show: {
                    '/resource': ['sms_enterprise'],
                },
            },
        },
        {
            displayName: 'Format',
            name: 'format',
            type: 'options',
            default: 'JSON',
            displayOptions: {
                show: {
                    '/resource': ['sms_enterprise'],
                },
            },
            options: [
                {
                    name: 'TEXT',
                    value: 'TEXT',
                },
                {
                    name: 'XML',
                    value: 'XML',
                },
                {
                    name: 'JSON',
                    value: 'JSON',
                },
            ]
        },
        {
            displayName: 'Mask ',
            name: 'mask',
            type: 'string',
            default: '',
            placeholder: 'Enter mask',
            displayOptions: {
                show: {
                    '/resource': ['sms_enterprise'],
                },
            },
        },
        {
            displayName: 'Port ',
            name: 'port',
            type: 'string',
            default: '',
            placeholder: 'Enter port',
            displayOptions: {
                show: {
                    '/resource': ['sms_enterprise'],
                },
            },
        },
        
        {
            displayName: 'Auth Sheme ',
            name: 'auth_scheme',
            type: 'string',
            default: '',
            placeholder: 'Enter auth scheme',
            displayOptions: {
                show: {
                    '/resource': ['sms_enterprise'],
                },
            },
        },
        {
            displayName: 'Timestamp ',
            name: 'timestamp',
            type: 'string',
            default: '',
            placeholder: 'Enter timestamp',
            description: 'Timestamp in the format yyyy-MM-dd HH:mm:ss, MM/dd/yy HH:mm:ss, MM/dd/yy hh:mm:ss a, MM/dd/yy hh:mm a',
            displayOptions: {
                show: {
                    '/resource': ['sms_enterprise'],
                },
            },
        },
        {
            displayName: 'Override DND ',
            name: 'override_dnd',
            type: 'boolean',
            default: false,
            placeholder: 'Enter override_dnd',
            description: '',
            displayOptions: {
                show: {
                    '/resource': ['sms_enterprise'],
                },
            },
        },
    ]

}];

const defaultValues = {
    v: '1.1',
    format: 'JSON',
    override_dnd: false,
    auth_scheme: 'plain',
};

export function getAdditionalFields(additionalFields: any) {

    // Merge default values with additionalFields
    additionalFields = { ...defaultValues, ...additionalFields };

    return additionalFields; // Return the result as JSON
}
