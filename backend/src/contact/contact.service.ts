import { Injectable } from '@nestjs/common';
import { supabase } from '../database/supabase.client';

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

  async getMessages(): Promise<ContactMessageRecord[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('contacts').select('*').order('submitted_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          const mapped = data.map((item) => this.toRecord(item));
          if (mapped.length > 0) {
            return mapped;
          }
        }
      } catch {
        // fall back to in-memory messages
      }
    }

    return this.messages;
  }

  async createMessage(body: Omit<ContactMessageRecord, 'id' | 'submittedAt'>): Promise<ContactMessageRecord> {
    const message: ContactMessageRecord = {
      id: `msg-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      ...body,
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .insert({
            id: message.id,
            name: message.name,
            email: message.email,
            subject: message.subject,
            message: message.message,
            submitted_at: message.submittedAt,
          })
          .select()
          .single();

        if (!error && data) {
          this.messages.push(this.toRecord(data));
          return this.toRecord(data);
        }
      } catch {
        // fall back to in-memory messages
      }
    }

    this.messages.push(message);
    return message;
  }

  private toRecord(record: Record<string, unknown>): ContactMessageRecord {
    return {
      id: String(record.id ?? `msg-${Date.now()}`),
      name: String(record.name ?? ''),
      email: String(record.email ?? ''),
      subject: String(record.subject ?? ''),
      message: String(record.message ?? ''),
      submittedAt: String(record.submitted_at ?? record.submittedAt ?? new Date().toISOString()),
    };
  }
}
