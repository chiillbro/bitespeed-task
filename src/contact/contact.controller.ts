import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { IdentifyContactDto } from './dto/identify-contact.dto';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('/identify')
  identify(@Body() identifyContactDto: IdentifyContactDto) {
    return this.contactService.identifyContact(identifyContactDto);
  }
}
