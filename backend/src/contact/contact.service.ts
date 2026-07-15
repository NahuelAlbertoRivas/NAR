import { Injectable } from '@nestjs/common';

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

@Injectable()
export class ContactService {
  private readonly messages: ContactMessageRecord[] = [];

  getMessages(): ContactMessageRecord[] {
    return this.messages;
  }

  createMessage(body: Omit<ContactMessageRecord, 'id' | 'submittedAt'>): ContactMessageRecord {
    const message: ContactMessageRecord = {
      id: `msg-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      ...body,
    };

    this.messages.push(message);
    return message;
  }
}
