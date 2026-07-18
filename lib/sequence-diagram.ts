export type ActorKind = 'person' | 'service' | 'cloud';
export type SystemIcon = 'queue' | 'cache' | 'database';

export interface SequenceActor {
  id: string;
  label: string;
  kind: ActorKind;
  color: string;
}

export interface SequenceMessage {
  id: string;
  from: string;
  to: string;
  label: string;
  style?: 'solid' | 'dashed';
  note?: string;
  icon?: SystemIcon;
  /** Self-referential step (from === to) rendered as a note box on the lifeline. */
  self?: boolean;
  /** Plain-language explanation shown in the side panel when this step is clicked. */
  detail?: string;
}

export interface SequenceAnnotation {
  id: string;
  actorId: string;
  afterMessageId: string;
  text: string;
}

export interface SequenceDiagramData {
  title: string;
  actors: SequenceActor[];
  messages: SequenceMessage[];
  annotations: SequenceAnnotation[];
  /** Label for the animated "run the flow" button, placed under the first actor. */
  initiateLabel?: string;
}

const COLUMN_WIDTH = 150;
const LEFT_PADDING = 70;
const HEADER_HEIGHT = 110;
const ROW_HEIGHT = 46;
const BOTTOM_PADDING = 50;

export function layoutSequenceDiagram(data: SequenceDiagramData) {
  const actorX = new Map<string, number>();
  data.actors.forEach((actor, index) => {
    actorX.set(actor.id, LEFT_PADDING + index * COLUMN_WIDTH);
  });

  const messageY = data.messages.map((_, index) => HEADER_HEIGHT + index * ROW_HEIGHT);

  const annotationY = new Map<string, number>();
  data.annotations.forEach((annotation) => {
    const messageIndex = data.messages.findIndex((m) => m.id === annotation.afterMessageId);
    annotationY.set(annotation.id, messageIndex >= 0 ? messageY[messageIndex] : HEADER_HEIGHT);
  });

  const width = LEFT_PADDING * 2 + (data.actors.length - 1) * COLUMN_WIDTH;
  const height = HEADER_HEIGHT + data.messages.length * ROW_HEIGHT + BOTTOM_PADDING;

  return { actorX, messageY, annotationY, width, height, headerHeight: HEADER_HEIGHT, rowHeight: ROW_HEIGHT };
}

// Best-effort reconstruction of a real customer's Airtel/M-Pesa checkout charge flow,
// rebuilt from a shared architecture screenshot. Some labels/ordering are approximate
// where the source image was too small to read with full confidence.
export const customerXxxxCheckout: SequenceDiagramData = {
  title: 'Customer XXXX — Checkout charge flow',
  initiateLabel: 'Initiate Payment',
  actors: [
    { id: 'sub-airtel', label: 'Airtel Subscriber', kind: 'person', color: '#f472b6' },
    { id: 'airtel', label: 'Airtel', kind: 'service', color: '#DC2626' },
    { id: 'airtel-api', label: 'airtel-api', kind: 'service', color: '#2563EB' },
    { id: 'charge-consumer', label: 'chargephoenix-airtel-consumer', kind: 'service', color: '#2563EB' },
    { id: 'airtel-poller', label: 'v3-phoenix-airtel-poller', kind: 'service', color: '#2563EB' },
    { id: 'refund-consumer', label: 'v3-phoenix-refund-consumer', kind: 'service', color: '#2563EB' },
    { id: 'charge', label: 'Charge', kind: 'service', color: '#B91C1C' },
    { id: 'core', label: 'Core', kind: 'service', color: '#B91C1C' },
    { id: 'mno', label: 'MNO', kind: 'service', color: '#0D9488' },
    { id: 'mpesa-gateway', label: 'M-Pesa Gateway', kind: 'cloud', color: '#0EA5E9' },
    { id: 'sub-mpesa', label: 'M-Pesa Subscriber', kind: 'person', color: '#a78bfa' },
  ],
  messages: [
    {
      id: 'm1',
      from: 'sub-airtel',
      to: 'airtel',
      label: 'Checkout',
      detail: "The subscriber begins a purchase and chooses to pay via Airtel Money.",
    },
    {
      id: 'm2',
      from: 'airtel',
      to: 'airtel-api',
      label: 'Initiate Charge Request',
      detail: "Airtel forwards the subscriber's payment request to Cellulant's airtel-api.",
    },
    {
      id: 'm3',
      from: 'airtel-api',
      to: 'charge-consumer',
      label: 'Publish Charge Request',
      icon: 'queue',
      note: 'RabbitMQ: v3-charge-airtel-phoenix-queue',
      detail: 'airtel-api publishes the charge request onto a RabbitMQ queue for asynchronous processing.',
    },
    {
      id: 'm4',
      from: 'charge-consumer',
      to: 'airtel-api',
      label: 'Response to Airtel',
      style: 'dashed',
      detail: "The consumer acknowledges the queued request back to Airtel so the subscriber isn't left waiting.",
    },
    {
      id: 'm5',
      from: 'airtel-api',
      to: 'charge',
      label: 'Raise Charge Request',
      detail: "airtel-api raises the actual charge request with Cellulant's Charge service.",
    },
    {
      id: 'm6',
      from: 'charge',
      to: 'mno',
      label: 'Charge Request to MNO',
      detail: 'Charge forwards the request to the Mobile Network Operator (MNO) to debit the subscriber.',
    },
    {
      id: 'm7',
      from: 'mno',
      to: 'mpesa-gateway',
      label: 'STK Push',
      style: 'dashed',
      detail: "The MNO pushes an authorization prompt to the subscriber's phone.",
    },
    {
      id: 'm8',
      from: 'mpesa-gateway',
      to: 'sub-mpesa',
      label: 'Authorize',
      detail: 'The subscriber authorizes the transaction on their handset.',
    },
    {
      id: 'm9',
      from: 'mno',
      to: 'mno',
      label: 'Validate Balance, Debit Wallet',
      self: true,
      detail: 'The MNO checks the subscriber has sufficient balance and debits their wallet.',
    },
    {
      id: 'm10',
      from: 'mno',
      to: 'charge',
      label: 'Callback',
      style: 'dashed',
      detail: 'The MNO calls back to Charge with the result of the debit.',
    },
    {
      id: 'm11',
      from: 'charge',
      to: 'core',
      label: 'Log Payment to Tingg',
      style: 'dashed',
      detail: 'Charge forwards the payment result to Core for logging against the Tingg platform.',
    },
    {
      id: 'm12',
      from: 'core',
      to: 'core',
      label: 'Log to Charge DB',
      self: true,
      icon: 'database',
      detail: 'Core writes the transaction record to the Charge database.',
    },
    {
      id: 'm13',
      from: 'charge',
      to: 'airtel-poller',
      label: 'Publish',
      style: 'dashed',
      icon: 'queue',
      note: 'RabbitMQ: charge-merchant-notification',
      detail: 'Charge publishes a merchant-notification event onto a second RabbitMQ queue.',
    },
    {
      id: 'm14',
      from: 'airtel-poller',
      to: 'airtel-poller',
      label: 'Validation',
      self: true,
      detail: "The poller validates the charge before it's treated as final.",
    },
    {
      id: 'm15',
      from: 'airtel-poller',
      to: 'refund-consumer',
      label: 'Validation Failed',
      style: 'dashed',
      note: 'Routed to charge/refund',
      detail: 'If validation fails, the event is routed to the refund consumer instead.',
    },
    {
      id: 'm16',
      from: 'airtel-poller',
      to: 'airtel-poller',
      label: 'Validation Passed',
      self: true,
      detail: 'If validation passes, the flow continues on to notify the merchant.',
    },
    {
      id: 'm17',
      from: 'airtel-poller',
      to: 'airtel',
      label: 'Send Callback to Airtel',
      detail: 'The poller sends the final callback back to Airtel.',
    },
    {
      id: 'm18',
      from: 'sub-airtel',
      to: 'airtel',
      label: 'Query Status Request',
      detail: 'The subscriber (or Airtel on their behalf) asks for the current status of the transaction.',
    },
    {
      id: 'm19',
      from: 'airtel',
      to: 'airtel-poller',
      label: 'Query Cache',
      icon: 'cache',
      detail: "Airtel checks a cache first, since it's faster than querying the database directly.",
    },
    {
      id: 'm20',
      from: 'airtel-poller',
      to: 'airtel',
      label: 'Query Status',
      style: 'dashed',
      detail: 'The cache returns whatever status it currently holds.',
    },
    {
      id: 'm21',
      from: 'airtel',
      to: 'sub-airtel',
      label: 'Query Status Response (Status 176/130)',
      style: 'dashed',
      note: 'Cache record exists',
      detail: 'If the cache has the record, Airtel returns the status immediately.',
    },
    {
      id: 'm22',
      from: 'airtel',
      to: 'charge',
      label: 'Route Query Status to Charge',
      note: 'Cache record does not exist',
      detail: "If the cache doesn't have the record yet, the request is routed to Charge instead.",
    },
    {
      id: 'm23',
      from: 'charge',
      to: 'charge',
      label: 'Query Charge DB',
      self: true,
      icon: 'database',
      detail: 'Charge looks up the authoritative transaction status directly from its database.',
    },
    {
      id: 'm24',
      from: 'charge',
      to: 'airtel',
      label: 'Charge Query Status Response',
      style: 'dashed',
      detail: 'Charge returns the status it found back to Airtel.',
    },
    {
      id: 'm25',
      from: 'airtel',
      to: 'sub-airtel',
      label: 'Query Status Response (Status 176/130)',
      style: 'dashed',
      detail: 'Airtel passes that status back to the subscriber.',
    },
    {
      id: 'm26',
      from: 'sub-airtel',
      to: 'sub-airtel',
      label: 'Airtel Issues Service',
      self: true,
      detail: 'Once a successful status is confirmed, Airtel fulfills the request — completing the transaction.',
    },
  ],
  annotations: [
    {
      id: 'a1',
      actorId: 'charge',
      afterMessageId: 'm5',
      text: 'Receives charge, query-status, and refund requests.',
    },
    {
      id: 'a2',
      actorId: 'charge',
      afterMessageId: 'm6',
      text: 'Raises the charge request to the MNO, applies the convenience fee, and load-balances across the charge pipeline.',
    },
    {
      id: 'a3',
      actorId: 'airtel-poller',
      afterMessageId: 'm14',
      text: 'Validates the request has been committed, not just built; validates the bind is on the query-status poller; caches the callback for query status.',
    },
    {
      id: 'a4',
      actorId: 'mpesa-gateway',
      afterMessageId: 'm8',
      text: 'M-Pesa subscriber enters their PIN to authorize the transaction.',
    },
    {
      id: 'a5',
      actorId: 'airtel-poller',
      afterMessageId: 'm22',
      text: 'Checks the cache first — if the record isn’t present, routes the request to Charge instead.',
    },
  ],
};

export interface CustomerImplementationLink {
  name: string;
  href: string;
}

// Real-customer technical diagrams, linked from their owning service's page
// (see app/[service]/page.tsx) rather than listed on the home page grid.
export const customerImplementationsByServiceSlug: Record<string, CustomerImplementationLink[]> = {
  checkout: [{ name: 'Customer XXXX', href: '/checkout-customer-xxxx' }],
};
