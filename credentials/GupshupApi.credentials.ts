import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GupshupApi implements ICredentialType {
	name = 'gupshupApi';
	displayName = 'Gupshup Credentials API';
	properties: INodeProperties[] = [
		{
			displayName: 'UserId',
			name: 'userid',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			required: true,
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}