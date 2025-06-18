import { Injectable } from '@nestjs/common';
import { IdentifyContactDto } from './dto/identify-contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Contact, LinkPrecedence } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async identifyContact(dto: IdentifyContactDto) {
    const { email, phoneNumber } = dto;

    // Find existing contacts by email or phone number
    const existingContacts = await this.prisma.contact.findMany({
      where: {
        OR: [{ email: email }, { phoneNumber: phoneNumber }],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Case 1: No existing contacts found, create a new primary contact
    if (existingContacts.length === 0) {
      const newContact = await this.prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: LinkPrecedence.primary,
        },
      });
      return this.buildResponse(newContact);
    }

    // Identify the primary contact (as per the task description: the oldest one) from the list
    const primaryContact = existingContacts[0];
    let primaryId = primaryContact.id;

    // Check if we are linking two different primary contacts
    const primaryContacts = existingContacts.filter(
      (c) => c.linkPrecedence === 'primary',
    );
    if (primaryContacts.length > 1) {
      // More than one primary contact means we need to merge.
      // The oldest one remains primary, the newer one becomes secondary.
      const newestPrimary = primaryContacts[1]; // second one is the newer one due to 'asc' order
      await this.prisma.contact.update({
        where: { id: newestPrimary.id },
        data: {
          linkedId: primaryId,
          linkPrecedence: LinkPrecedence.secondary,
        },
      });
    }

    // Check if the incoming request has new information
    const allEmails = new Set(
      existingContacts.map((c) => c.email).filter(Boolean),
    );
    const allPhoneNumbers = new Set(
      existingContacts.map((c) => c.phoneNumber).filter(Boolean),
    );

    const hasNewEmail = email && !allEmails.has(email);
    const hasNewPhoneNumber = phoneNumber && !allPhoneNumbers.has(phoneNumber);

    // Case 2: New information is present, create a new secondary contact
    if (hasNewEmail || hasNewPhoneNumber) {
      await this.prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkedId: primaryId,
          linkPrecedence: LinkPrecedence.secondary,
        },
      });
    }

    // After all potential modifications, fetch the final consolidated contact list
    const consolidatedContacts = await this.prisma.contact.findMany({
      where: {
        OR: [{ id: primaryId }, { linkedId: primaryId }],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return this.buildResponseFromList(consolidatedContacts);
  }

  // Helper function to build the final response payload from a single contact
  private buildResponse(primaryContact: Contact) {
    return {
      contact: {
        primaryContatctId: primaryContact.id,
        emails: [primaryContact.email].filter(Boolean),
        phoneNumbers: [primaryContact.phoneNumber].filter(Boolean),
        secondaryContactIds: [],
      },
    };
  }

  // Helper function to build the final response
  private buildResponseFromList(contacts: Contact[]) {
    if (contacts.length === 0) return { contact: {} };

    const primaryContact =
      contacts.find((c) => c.linkPrecedence === 'primary') || contacts[0];

    const emails = Array.from(
      new Set(contacts.map((c) => c.email).filter(Boolean)),
    );
    const phoneNumbers = Array.from(
      new Set(contacts.map((c) => c.phoneNumber).filter(Boolean)),
    );
    const secondaryContactIds = contacts
      .filter((c) => c.id !== primaryContact.id)
      .map((c) => c.id);

    return {
      contact: {
        primaryContatctId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds,
      },
    };
  }
}
