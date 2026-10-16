import { BusinessProfile, EmailThread, Invoice, Quotation } from '../types';

export const initialProfile: BusinessProfile = {
  companyName: 'Gleamcore Operations & Tech',
  ownerName: 'Ethan Lim',
  email: 'ethan.lim@gleamcore.com',
  phone: '+1 (555) 438-9201',
  address: 'Suite 800, Tech Quarter, Singapore / Global Ops',
  currency: 'USD',
  taxRate: 7,
  bankDetails: {
    bankName: 'Standard Chartered Bank',
    accountName: 'Gleamcore Operations Pte Ltd',
    accountNumber: '029-482910-44',
    routingOrIban: 'SCBLSG22XXX'
  }
};

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-081',
    clientName: 'Marcus Vance',
    clientEmail: 'marcus@apexventures.co',
    clientCompany: 'Apex Ventures Corp',
    issueDate: '2026-09-12',
    dueDate: '2026-09-28', // overdue by ~17 days
    items: [
      { id: 'item-1', description: 'Enterprise Workflow Automation Architecture & Sprint 1', quantity: 1, unitPrice: 4200, amount: 4200 },
      { id: 'item-2', description: 'API Middleware Integration & Webhooks Setup', quantity: 12, unitPrice: 150, amount: 1800 }
    ],
    subtotal: 6000,
    taxRate: 7,
    taxAmount: 420,
    totalAmount: 6420,
    paidAmount: 0,
    status: 'overdue',
    notes: 'Payment terms: Net 16. Late interest applicable after 30 days.',
    reminderHistory: [
      {
        id: 'rem-1',
        date: '2026-10-02',
        tone: 'gentle',
        sentTo: 'marcus@apexventures.co',
        subject: 'Friendly Reminder: Invoice INV-2026-081 is Past Due',
        notes: 'Client replied they were waiting for CFO sign-off.'
      }
    ],
    paymentMethod: 'Bank Wire'
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-085',
    clientName: 'Elena Rostova',
    clientEmail: 'elena@solardrive.tech',
    clientCompany: 'SolarDrive Technologies',
    issueDate: '2026-09-25',
    dueDate: '2026-10-09', // overdue by 6 days
    items: [
      { id: 'item-3', description: 'Monthly Retainer: Full-Stack Maintenance & Cloud Ops (Oct)', quantity: 1, unitPrice: 3200, amount: 3200 },
      { id: 'item-4', description: 'Security Patching & High-Traffic Load Balancing', quantity: 1, unitPrice: 850, amount: 850 }
    ],
    subtotal: 4050,
    taxRate: 7,
    taxAmount: 283.5,
    totalAmount: 4333.5,
    paidAmount: 0,
    status: 'overdue',
    notes: 'Monthly billing cycle. Standard Net 14.',
    reminderHistory: [],
    paymentMethod: 'ACH / Wire'
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-088',
    clientName: 'Julian Meyer',
    clientEmail: 'julian@kinetichaus.design',
    clientCompany: 'Kinetic Haus Design',
    issueDate: '2026-10-05',
    dueDate: '2026-10-20', // Due in 5 days
    items: [
      { id: 'item-5', description: 'E-commerce Custom Checkout Flow & Stripe Elements', quantity: 1, unitPrice: 2800, amount: 2800 }
    ],
    subtotal: 2800,
    taxRate: 7,
    taxAmount: 196,
    totalAmount: 2996,
    paidAmount: 0,
    status: 'pending',
    notes: 'Deliverables deployed to staging. Awaiting final acceptance sign-off.',
    reminderHistory: [],
    paymentMethod: 'Stripe Credit Card'
  },
  {
    id: 'inv-104',
    invoiceNumber: 'INV-2026-090',
    clientName: 'Sophia Chang',
    clientEmail: 'sophia@luminahealth.io',
    clientCompany: 'Lumina Health Labs',
    issueDate: '2026-10-10',
    dueDate: '2026-10-25', // Due in 10 days
    items: [
      { id: 'item-6', description: 'Patient Intake Portal Phase 1 Design System', quantity: 1, unitPrice: 4500, amount: 4500 },
      { id: 'item-7', description: 'HIPAA Compliance Security Audit Consultation', quantity: 6, unitPrice: 200, amount: 1200 }
    ],
    subtotal: 5700,
    taxRate: 7,
    taxAmount: 399,
    totalAmount: 6099,
    paidAmount: 0,
    status: 'pending',
    notes: 'Quotation QT-2026-042 converted to official invoice.',
    quotationRefId: 'qt-201',
    reminderHistory: []
  },
  {
    id: 'inv-105',
    invoiceNumber: 'INV-2026-077',
    clientName: 'David Kalu',
    clientEmail: 'david@zenithlogistics.com',
    clientCompany: 'Zenith Global Logistics',
    issueDate: '2026-09-01',
    dueDate: '2026-09-15',
    items: [
      { id: 'item-8', description: 'Fleet Tracking Dashboard Real-time Telemetry WebSocket', quantity: 1, unitPrice: 5500, amount: 5500 }
    ],
    subtotal: 5500,
    taxRate: 7,
    taxAmount: 385,
    totalAmount: 5885,
    paidAmount: 5885,
    status: 'paid',
    notes: 'Paid in full via Wire Transfer on 2026-09-14.',
    reminderHistory: []
  },
  {
    id: 'inv-106',
    invoiceNumber: 'INV-2026-092',
    clientName: 'Chloe Bennett',
    clientEmail: 'chloe@velocitymedia.org',
    clientCompany: 'Velocity Media Studios',
    issueDate: '2026-10-14',
    dueDate: '2026-10-28',
    items: [
      { id: 'item-9', description: 'Automated Content Pipeline & Metadata Generator', quantity: 1, unitPrice: 1950, amount: 1950 }
    ],
    subtotal: 1950,
    taxRate: 7,
    taxAmount: 136.5,
    totalAmount: 2086.5,
    paidAmount: 0,
    status: 'draft',
    notes: 'Draft awaiting client approval on final line items.',
    reminderHistory: []
  },
  // Additional historical paid invoices for rich monthly growth trend visualization
  {
    id: 'inv-095',
    invoiceNumber: 'INV-2026-071',
    clientName: 'Olivia Reed',
    clientEmail: 'olivia@auroradesign.co',
    clientCompany: 'Aurora Creative Agency',
    issueDate: '2026-09-10',
    dueDate: '2026-09-24',
    items: [
      { id: 'item-h1', description: 'Headless CMS Migration & Next.js Frontend', quantity: 1, unitPrice: 4800, amount: 4800 }
    ],
    subtotal: 4800,
    taxRate: 7,
    taxAmount: 336,
    totalAmount: 5136,
    paidAmount: 5136,
    status: 'paid',
    notes: 'Paid on Sep 22, 2026.',
    reminderHistory: []
  },
  {
    id: 'inv-090',
    invoiceNumber: 'INV-2026-064',
    clientName: 'Jonathan Vance',
    clientEmail: 'jvance@cascadefin.com',
    clientCompany: 'Cascade Financial',
    issueDate: '2026-08-08',
    dueDate: '2026-08-22',
    items: [
      { id: 'item-h2', description: 'Financial Dashboard & Client Reporting Pipeline', quantity: 1, unitPrice: 6200, amount: 6200 }
    ],
    subtotal: 6200,
    taxRate: 7,
    taxAmount: 434,
    totalAmount: 6634,
    paidAmount: 6634,
    status: 'paid',
    notes: 'Paid on Aug 20, 2026 via ACH.',
    reminderHistory: []
  },
  {
    id: 'inv-085',
    invoiceNumber: 'INV-2026-059',
    clientName: 'Sarah Jenkins',
    clientEmail: 'sarah@beaconlabs.org',
    clientCompany: 'Beacon Labs',
    issueDate: '2026-08-18',
    dueDate: '2026-09-01',
    items: [
      { id: 'item-h3', description: 'Automated Microservice Monitoring & Sentry Alerting', quantity: 1, unitPrice: 3800, amount: 3800 }
    ],
    subtotal: 3800,
    taxRate: 7,
    taxAmount: 266,
    totalAmount: 4066,
    paidAmount: 4066,
    status: 'paid',
    notes: 'Paid on Aug 28, 2026.',
    reminderHistory: []
  },
  {
    id: 'inv-080',
    invoiceNumber: 'INV-2026-051',
    clientName: 'Michael Chang',
    clientEmail: 'mchang@novabiotech.com',
    clientCompany: 'Nova BioTech',
    issueDate: '2026-07-05',
    dueDate: '2026-07-19',
    items: [
      { id: 'item-h4', description: 'Laboratory Inventory Tracking System', quantity: 1, unitPrice: 7500, amount: 7500 }
    ],
    subtotal: 7500,
    taxRate: 7,
    taxAmount: 525,
    totalAmount: 8025,
    paidAmount: 8025,
    status: 'paid',
    notes: 'Paid in full on Jul 17, 2026.',
    reminderHistory: []
  },
  {
    id: 'inv-075',
    invoiceNumber: 'INV-2026-042',
    clientName: 'Rachel Simmons',
    clientEmail: 'rachel@urbanroots.shop',
    clientCompany: 'Urban Roots Botanicals',
    issueDate: '2026-06-12',
    dueDate: '2026-06-26',
    items: [
      { id: 'item-h5', description: 'Omnichannel POS Sync & Inventory Alerts Phase 1', quantity: 1, unitPrice: 5200, amount: 5200 }
    ],
    subtotal: 5200,
    taxRate: 7,
    taxAmount: 364,
    totalAmount: 5564,
    paidAmount: 5564,
    status: 'paid',
    notes: 'Paid on Jun 24, 2026.',
    reminderHistory: []
  },
  {
    id: 'inv-070',
    invoiceNumber: 'INV-2026-035',
    clientName: 'Alexander Drake',
    clientEmail: 'alex@drakelogic.io',
    clientCompany: 'Drake Logic',
    issueDate: '2026-05-15',
    dueDate: '2026-05-29',
    items: [
      { id: 'item-h6', description: 'Automated Email Ingestion & CRM Lead Routing', quantity: 1, unitPrice: 3900, amount: 3900 }
    ],
    subtotal: 3900,
    taxRate: 7,
    taxAmount: 273,
    totalAmount: 4173,
    paidAmount: 4173,
    status: 'paid',
    notes: 'Paid on May 27, 2026.',
    reminderHistory: []
  },
  {
    id: 'inv-108',
    invoiceNumber: 'INV-2026-095',
    clientName: 'Hannah Lee',
    clientEmail: 'hannah@blossomtech.sg',
    clientCompany: 'Blossom Floral & Botanical Tech',
    issueDate: '2026-10-02',
    dueDate: '2026-10-16',
    items: [
      { id: 'item-h7', description: 'Botanical Inventory & Floral Subscription Engine', quantity: 1, unitPrice: 4600, amount: 4600 }
    ],
    subtotal: 4600,
    taxRate: 7,
    taxAmount: 322,
    totalAmount: 4922,
    paidAmount: 4922,
    status: 'paid',
    notes: 'Paid on Oct 11, 2026.',
    reminderHistory: []
  }
];

export const initialQuotations: Quotation[] = [
  {
    id: 'qt-201',
    quoteNumber: 'QT-2026-044',
    clientName: 'Aura Fitness & Wellness',
    clientEmail: 'billing@aurafit.com',
    clientCompany: 'Aura Fitness Group',
    issueDate: '2026-10-12',
    validUntil: '2026-11-12',
    projectTitle: 'Automated Member Onboarding & Booking Web Portal',
    scopeSummary: 'Development of an automated self-serve member booking engine with class schedules, trainer bookings, and automatic SMS/Email notifications.',
    items: [
      { id: 'q-item-1', description: 'Mobile-Responsive Booking UI & Calendar Schedule View', quantity: 1, unitPrice: 2200, amount: 2200 },
      { id: 'q-item-2', description: 'Stripe Subscription & Recurring Class Pass Integration', quantity: 1, unitPrice: 1400, amount: 1400 },
      { id: 'q-item-3', description: 'Automated Twilio/SendGrid Reminders & WhatsApp Trigger', quantity: 1, unitPrice: 900, amount: 900 }
    ],
    subtotal: 4500,
    taxRate: 7,
    totalAmount: 4815,
    status: 'accepted', // Ready for 1-click conversion to invoice!
    timeline: '3 weeks from receipt of 50% kick-off deposit',
    paymentTerms: '50% upon project commencement, 50% upon deployment to production',
    notes: 'Client reviewed and clicked Accept on proposal. Ready to issue deposit invoice.'
  },
  {
    id: 'qt-202',
    quoteNumber: 'QT-2026-045',
    clientName: 'Nexus Retail Pte Ltd',
    clientEmail: 'procurement@nexusretail.com',
    clientCompany: 'Nexus Retail Network',
    issueDate: '2026-10-14',
    validUntil: '2026-11-14',
    projectTitle: 'Inventory Tracking & Automated Stock Reorder Engine',
    scopeSummary: 'Centralized barcode scanning and low-stock threshold alert system connecting warehouse inventory to supplier purchase orders automatically.',
    items: [
      { id: 'q-item-4', description: 'Inventory Database Schema & Real-time Stock Sync', quantity: 1, unitPrice: 3000, amount: 3000 },
      { id: 'q-item-5', description: 'Automated Supplier PO Generation with PDF Dispatch', quantity: 1, unitPrice: 1600, amount: 1600 }
    ],
    subtotal: 4600,
    taxRate: 7,
    totalAmount: 4922,
    status: 'sent',
    timeline: '4 weeks',
    paymentTerms: '30% upfront, 40% midway milestone, 30% handover',
    notes: 'Sent to procurement committee. Decision meeting scheduled for Thursday.'
  },
  {
    id: 'qt-203',
    quoteNumber: 'QT-2026-046',
    clientName: 'Dr. Arthur Pendelton',
    clientEmail: 'arthur@pendelton-clinic.sg',
    clientCompany: 'Pendelton Dental & Medical Group',
    issueDate: '2026-10-15',
    validUntil: '2026-11-15',
    projectTitle: 'Patient Digital Intake & WhatsApp Appointment Confirmation Bot',
    scopeSummary: 'Bespoke intake forms with secure signature capture and interactive WhatsApp flow reducing front-desk calls by 70%.',
    items: [
      { id: 'q-item-6', description: 'Digital Intake Form with Electronic Signatures', quantity: 1, unitPrice: 1800, amount: 1800 },
      { id: 'q-item-7', description: 'WhatsApp Business API Bot Flow for Rescheduling', quantity: 1, unitPrice: 1250, amount: 1250 }
    ],
    subtotal: 3050,
    taxRate: 7,
    totalAmount: 3263.5,
    status: 'draft',
    timeline: '2 weeks',
    paymentTerms: 'Full payment upon completion or 2 equal installments',
    notes: 'Need to confirm if client requires multilingual English/Mandarin support.'
  }
];

export const initialEmails: EmailThread[] = [
  {
    id: 'email-301',
    senderName: 'Marcus Vance',
    senderEmail: 'marcus@apexventures.co',
    senderCompany: 'Apex Ventures',
    subject: 'Update on overdue invoice INV-2026-081 & payment run schedule',
    receivedAt: '2 hours ago',
    preview: 'Hi Ethan, apologize for the delay on invoice INV-2026-081. Our finance team was undergoing quarterly audits...',
    body: `Hi Ethan,\n\nApologies for the delay on invoice INV-2026-081 ($6,420). Our finance team was undergoing quarterly audits which delayed the batch approvals. We have scheduled the wire for this Friday afternoon.\n\nCould you send over your updated bank wire instruction document just to make sure our accounts payable team has the correct IBAN/routing code on file?\n\nThanks for your patience!\n\nBest,\nMarcus Vance\nManaging Partner, Apex Ventures`,
    category: 'invoice_inquiry',
    status: 'unreplied',
    priority: 'high'
  },
  {
    id: 'email-302',
    senderName: 'Rachel Tan',
    senderEmail: 'rachel@urbanroots.shop',
    senderCompany: 'Urban Roots Botanicals',
    subject: 'Quotation Request: Automated Order Notification & Inventory sync',
    receivedAt: 'Today, 10:14 AM',
    preview: 'Hi Gleamcore team, we are expanding our Shopify store to 3 physical pop-ups in November and need an automated system...',
    body: `Hi Ethan and the Gleamcore team,\n\nWe love your work on the retail dashboards. We are expanding our Shopify store to 3 physical pop-up locations next month and desperately need an automated solution to prevent overselling.\n\nSpecifically, when an item sells in the store via POS, it should instantly deduct stock from Shopify and notify our warehouse manager if stock hits less than 5 units.\n\nCould you send quotation with an estimated price and timeline? We need this live before the holiday rush (Nov 15th).\n\nWarm regards,\nRachel Tan\nFounder, Urban Roots`,
    category: 'quote_request',
    status: 'unreplied',
    priority: 'high'
  },
  {
    id: 'email-303',
    senderName: 'Julian Meyer',
    senderEmail: 'julian@kinetichaus.design',
    senderCompany: 'Kinetic Haus',
    subject: 'Quick question regarding Invoice INV-2026-088 due date',
    receivedAt: 'Yesterday, 4:30 PM',
    preview: 'Hey Ethan, we tested the Stripe checkout flow on staging and it looks fantastic. Just wanted to check if our accounts team...',
    body: `Hey Ethan,\n\nWe tested the Stripe checkout flow on staging and it looks fantastic! The team is thrilled with how fast the checkout converts.\n\nJust wanted to confirm: our corporate AP run happens on the 25th of the month. The invoice is currently dated due on Oct 20th. Is it fine if our finance officer issues the payment on the 25th with our normal payroll and vendor cycle?\n\nLet me know if that works for you!\n\nCheers,\nJulian`,
    category: 'invoice_inquiry',
    status: 'unreplied',
    priority: 'medium'
  },
  {
    id: 'email-304',
    senderName: 'Brenda Wu',
    senderEmail: 'b.wu@novastack.tech',
    senderCompany: 'NovaStack Enterprise',
    subject: 'Discount negotiation on Enterprise Consultation proposal',
    receivedAt: 'Yesterday, 11:20 AM',
    preview: 'Dear Ethan, our leadership reviewed your proposal. We are very keen to partner, however our allocated Q4 budget is capped...',
    body: `Dear Ethan,\n\nOur executive leadership reviewed your proposal. We are very keen to partner with Gleamcore, however our allocated Q4 budget for external digital advisory is capped at $7,500 rather than the $9,200 quoted.\n\nCan you offer a 15% discount or adjust the scope slightly so we can get immediate sign-off without waiting for Q1 budget allocation?\n\nLooking forward to your thoughts.\n\nSincerely,\nBrenda Wu\nHead of Digital Ops`,
    category: 'discount_request',
    status: 'unreplied',
    priority: 'high'
  }
];

export const sampleProofreadingTexts = [
  {
    title: 'Client Email with Spelling & Grammar Errors',
    text: `Dear Sir, we recieved you inquiry yesterday and we would like to send quotation soon. Our team are work hard to provide the best soultion for your bussiness problems. There is many invoices to track and we can help you automate them without any grammer and spelling error. Please kindly let us know when can you attend meeting with us.`
  },
  {
    title: 'Rough Quotation Scope Description',
    text: `we will build the web application that automate all your problems. includes tracking inovice, reply customer email automatically, and send proposal. also fixing all spelling mistakes and bad grammer so your business look very professoinal.`
  },
  {
    title: 'Awkward Payment Overdue Notice',
    text: `Hey, your invoice is very late and you did not pay us yet. We need money today otherwise we stop work immediately. Please pay now.`
  }
];
