import { Body, Controller, Get, Post, BadRequestException } from '@nestjs/common';
import { ContactService } from './contact.service';

export interface ContactMessageDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  getMessages() {
    return this.contactService.getMessages();
  }

  @Post()
  createMessage(@Body() body: ContactMessageDto) {
    this.validatePayload(body);
    return this.contactService.createMessage(body);
  }

  private validatePayload(body: ContactMessageDto) {
    if (!body?.name?.trim() || !body?.email?.trim() || !body?.subject?.trim() || !body?.message?.trim()) {
      throw new BadRequestException('All fields are required');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(body.email)) {
      throw new BadRequestException('Please provide a valid email');
    }
  }
}
