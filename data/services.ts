export type StepStatus = 'draft' | 'reviewed';

// Mirrors the color-coding used in the real Checkout diagram (payment-roadmap's
// src/data/roadmaps/checkout/checkout.json, renderer: balsamiq):
//   customer  -> yellow  (#FFFF00) customer/merchant-facing action
//   external  -> orange  (#FF9900) MNO / external network step
//   cellulant -> forest green (#228B22) Cellulant's own platform processing
//   success   -> green   (#009900) positive terminal outcome
//   failure   -> red     (#CC3333) negative terminal outcome
export type StepRole = 'customer' | 'external' | 'cellulant' | 'success' | 'failure';

export interface FlowStep {
  id: string;
  title: string;
  explanation: string;
  status: StepStatus;
  role: StepRole;
}

export interface ServiceDefinition {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  icon: 'landmark' | 'shopping-cart' | 'send' | 'message-square' | 'layers';
  isExample: boolean;
  steps: FlowStep[];
}

export const services: ServiceDefinition[] = [
  {
    slug: 'digital-banking',
    name: 'Digital Banking',
    tagline: 'Payment processing, USSD applications, and mobile apps',
    description:
      'Banking-grade payment processing, USSD applications, and mobile banking apps.',
    accent: '#009EDA',
    icon: 'landmark',
    isExample: false,
    steps: [
      {
        id: 'ussd-session',
        title: 'USSD session journey',
        explanation:
          'A customer dials the shortcode on their phone, which opens a session with our USSD gateway. The gateway presents a menu, the customer navigates it by replying with numbers, and the session ends once the transaction (e.g. a balance check or transfer) completes or times out.',
        status: 'draft',
        role: 'customer',
      },
      {
        id: 'mpesa-integration',
        title: 'M-Pesa integration',
        explanation:
          "Money moving in or out of an account is routed through Safaricom's M-Pesa APIs. Cellulant's core platform authenticates the request, converts it into the format M-Pesa expects, and reconciles the result back into the customer's account once M-Pesa confirms the transaction.",
        status: 'draft',
        role: 'external',
      },
      {
        id: 'account-management',
        title: 'Account management',
        explanation:
          'Covers onboarding a new customer (identity capture and verification), assigning account limits based on KYC tier, and updating those limits as the customer’s status changes.',
        status: 'draft',
        role: 'cellulant',
      },
      {
        id: 'loan-disbursement',
        title: 'Loan disbursement',
        explanation:
          'From a loan application, through credit scoring and approval, to the funds being disbursed to the customer’s account — and the scheduled repayments that follow.',
        status: 'draft',
        role: 'cellulant',
      },
      {
        id: 'statement-generation',
        title: 'Statement generation',
        explanation:
          'Statements can be generated in real time on request, or produced on a schedule (e.g. monthly) and delivered to the customer automatically.',
        status: 'draft',
        role: 'cellulant',
      },
    ],
  },
  {
    slug: 'checkout',
    name: 'Checkout',
    tagline: 'Collections and payment processing for merchants',
    description: 'How merchants collect payments from customers.',
    accent: '#05E386',
    icon: 'shopping-cart',
    isExample: true,
    steps: [
      {
        id: 'customer-initiates',
        title: 'Customer initiates payment',
        explanation:
          'The customer starts a purchase on the merchant’s site or app and chooses to pay via mobile money.',
        status: 'reviewed',
        role: 'customer',
      },
      {
        id: 'request-to-mno',
        title: 'Request reaches the MNO',
        explanation:
          'The merchant sends the payment request to Cellulant, which forwards it to the relevant Mobile Network Operator (MNO) for the customer’s number.',
        status: 'reviewed',
        role: 'external',
      },
      {
        id: 'stk-push',
        title: 'STK push is sent to the customer',
        explanation:
          'The MNO pushes a prompt (STK push) directly to the customer’s phone, asking them to authorize the payment.',
        status: 'reviewed',
        role: 'customer',
      },
      {
        id: 'customer-enters-pin',
        title: 'Customer enters their M-Pesa PIN',
        explanation:
          'The customer confirms the amount and enters their M-Pesa PIN on the prompt to authorize the debit.',
        status: 'reviewed',
        role: 'customer',
      },
      {
        id: 'safaricom-processes',
        title: 'Safaricom (M-Pesa) processes the payment',
        explanation:
          'Safaricom validates the PIN, debits the customer’s M-Pesa wallet, and processes the transfer.',
        status: 'reviewed',
        role: 'success',
      },
      {
        id: 'gateway-receives',
        title: 'Cellulant payment gateway receives it',
        explanation:
          'Safaricom sends the transaction result back to the Cellulant payment gateway for processing.',
        status: 'reviewed',
        role: 'cellulant',
      },
      {
        id: 'validated-risk-checked',
        title: 'Transaction is validated and risk-checked',
        explanation:
          'The gateway validates the transaction details and runs it through fraud and risk checks before it can be marked successful.',
        status: 'reviewed',
        role: 'cellulant',
      },
      {
        id: 'status-confirmed',
        title: 'Payment status is confirmed',
        explanation:
          'Once validation passes, the transaction is marked as successful (or failed) in Cellulant’s records.',
        status: 'reviewed',
        role: 'cellulant',
      },
      {
        id: 'webhook-notifies',
        title: 'Webhook notifies the merchant',
        explanation:
          'Cellulant sends a webhook to the merchant’s system with the final payment status, in real time.',
        status: 'reviewed',
        role: 'cellulant',
      },
      {
        id: 'order-fulfilled',
        title: 'Order is fulfilled',
        explanation:
          'On receiving a successful webhook, the merchant fulfills the order — releasing goods, activating a service, or updating the customer’s account.',
        status: 'reviewed',
        role: 'success',
      },
    ],
  },
  {
    slug: 'payouts',
    name: 'Payouts',
    tagline: 'Remittance and bill payments',
    description: 'Sending money out — remittance and bill payments.',
    accent: '#7030A0',
    icon: 'send',
    isExample: false,
    steps: [
      {
        id: 'bulk-payouts',
        title: 'Bulk payouts',
        explanation:
          'A merchant uploads or submits a batch of payments (e.g. salaries, supplier payments). Cellulant validates the batch, processes each payout, and reports back the status of every individual payment.',
        status: 'draft',
        role: 'customer',
      },
      {
        id: 'bill-payments',
        title: 'Bill payments',
        explanation:
          'A customer pays a biller (e.g. utility, TV subscription) through Cellulant. The request is validated against the biller’s system, the payment is collected, and the biller is notified so the customer’s account is updated.',
        status: 'draft',
        role: 'customer',
      },
      {
        id: 'remittance',
        title: 'Remittance',
        explanation:
          'Cross-border transfers where the sending currency is converted to the recipient’s local currency at the point of payout, before the funds are delivered.',
        status: 'draft',
        role: 'external',
      },
      {
        id: 'retries-reconciliation',
        title: 'Retries and reconciliation',
        explanation:
          'Failed payouts are automatically retried according to a defined policy. Payouts that still fail, along with any refunds, are reconciled against the merchant’s ledger.',
        status: 'draft',
        role: 'cellulant',
      },
    ],
  },
  {
    slug: 'tingg-engage',
    name: 'Tingg Engage',
    tagline: 'Messaging — SMS, OTP, and USSD notifications',
    description: 'Messaging services — SMS, one-time passwords, and USSD notifications.',
    accent: '#294383',
    icon: 'message-square',
    isExample: false,
    steps: [
      {
        id: 'sms-delivery',
        title: 'SMS delivery',
        explanation:
          'From a client’s send request, the message is routed to the relevant network, delivered to the subscriber’s handset, and a delivery report is returned to the client.',
        status: 'draft',
        role: 'external',
      },
      {
        id: 'otp-flow',
        title: 'OTP flow',
        explanation:
          'A one-time password is generated, sent to the subscriber, and held valid for a short window. The subscriber submits the code for verification, and the code expires automatically once used or timed out.',
        status: 'draft',
        role: 'customer',
      },
      {
        id: 'ussd-push',
        title: 'USSD push',
        explanation:
          'Cellulant initiates a USSD session directly to the subscriber’s phone (rather than the subscriber dialling in), and captures whatever response they submit.',
        status: 'draft',
        role: 'external',
      },
      {
        id: 'campaign-management',
        title: 'Campaign management',
        explanation:
          'Bulk messages are scheduled and sent as a campaign, with delivery reporting aggregated across the whole recipient list.',
        status: 'draft',
        role: 'cellulant',
      },
    ],
  },
  {
    slug: 'core-platform',
    name: 'Core Platform',
    tagline: 'The underlying platform that powers all the services',
    description: 'The foundation that powers every other service.',
    accent: '#005BA0',
    icon: 'layers',
    isExample: false,
    steps: [
      {
        id: 'api-gateway',
        title: 'API gateway',
        explanation:
          'Every request into Cellulant’s services passes through the API gateway first, which handles authentication, security checks, and routes the request to the correct downstream service.',
        status: 'draft',
        role: 'cellulant',
      },
      {
        id: 'settlement-engine',
        title: 'Settlement engine',
        explanation:
          'Aggregates transactions across services, matches them against provider and bank records, and produces the reconciliation reports used to settle funds with merchants and partners.',
        status: 'draft',
        role: 'cellulant',
      },
      {
        id: 'fraud-risk',
        title: 'Fraud and risk',
        explanation:
          'Transactions are scored in real time against fraud and risk rules. Suspicious activity raises an alert and can block or hold a transaction for review.',
        status: 'draft',
        role: 'external',
      },
      {
        id: 'merchant-portal',
        title: 'Merchant portal',
        explanation:
          'Where merchants onboard, view dashboards of their transactions, and manage their account and integration settings.',
        status: 'draft',
        role: 'customer',
      },
      {
        id: 'monitoring',
        title: 'Monitoring',
        explanation:
          'Health checks and observability tooling watch every service so incidents are caught and resolved before they affect customers.',
        status: 'draft',
        role: 'cellulant',
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return services.find((service) => service.slug === slug);
}
