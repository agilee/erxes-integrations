export interface IFilter {
  [key: string]: string;
}

interface ICommonType {
  name?: string;
  email: string;
}

export interface IMessageDraft {
  to?: [ICommonType];
  from?: [ICommonType];
  reply_to?: [ICommonType];
  cc?: [ICommonType];
  bcc?: [ICommonType];
  replyToMessageId?: string;
  subject: string;
  body?: string;
}

export interface IProviderSettings {
  microsoft_client_id?: string;
  microsoft_client_secret?: string;
  microsoft_refresh_token?: string;
  redirect_uri?: string;
  google_refresh_token?: string;
  google_client_id?: string;
  google_client_secret?: string;
  email?: string;
  password?: string;
}

// API ====================
export interface IAPICustomer {
  emails: string[];
  primaryEmail: string;
  integrationId: string;
  firstName: string;
  lastName: string;
  kind: string;
}

export interface IAPIConversation {
  integrationId: string;
  customerId: string;
  content: string;
}

export interface IAPIConversationMessage {}

// Store =======================
export interface INylasAccountArguments {
  kind: string;
  email: string;
  accountId: string;
  accessToken: string;
}

export interface INylasCustomerArguments {
  kind: string;
  toEmail: string;
  message: any;
  from: {
    email: string;
    name: string;
  };
  integrationIds: {
    id: string;
    erxesApiId: string;
  };
}

export interface INylasConversationArguments {
  kind: string;
  customerId: string;
  subject: string;
  threadId: string;
  emails: {
    toEmail: string;
    fromEmail: string;
  };
  integrationIds: {
    id: string;
    erxesApiId: string;
  };
}

export interface INylasConversationMessageArguments {}
