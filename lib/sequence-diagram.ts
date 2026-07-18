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
    { id: 'm1', from: 'sub-airtel', to: 'airtel', label: 'Checkout' },
    { id: 'm2', from: 'airtel', to: 'airtel-api', label: 'Initiate Charge Request' },
    {
      id: 'm3',
      from: 'airtel-api',
      to: 'charge-consumer',
      label: 'Publish Charge Request',
      icon: 'queue',
      note: 'RabbitMQ: v3-charge-airtel-phoenix-queue',
    },
    { id: 'm4', from: 'charge-consumer', to: 'airtel-api', label: 'Response to Airtel', style: 'dashed' },
    { id: 'm5', from: 'airtel-api', to: 'charge', label: 'Raise Charge Request' },
    { id: 'm6', from: 'charge', to: 'mno', label: 'Charge Request to MNO' },
    { id: 'm7', from: 'mno', to: 'mpesa-gateway', label: 'STK Push', style: 'dashed' },
    { id: 'm8', from: 'mpesa-gateway', to: 'sub-mpesa', label: 'Authorize' },
    { id: 'm9', from: 'mno', to: 'mno', label: 'Validate Balance, Debit Wallet', self: true },
    { id: 'm10', from: 'mno', to: 'charge', label: 'Callback', style: 'dashed' },
    { id: 'm11', from: 'charge', to: 'core', label: 'Log Payment to Tingg', style: 'dashed' },
    { id: 'm12', from: 'core', to: 'core', label: 'Log to Charge DB', self: true, icon: 'database' },
    {
      id: 'm13',
      from: 'charge',
      to: 'airtel-poller',
      label: 'Publish',
      style: 'dashed',
      icon: 'queue',
      note: 'RabbitMQ: charge-merchant-notification',
    },
    { id: 'm14', from: 'airtel-poller', to: 'airtel-poller', label: 'Validation', self: true },
    {
      id: 'm15',
      from: 'airtel-poller',
      to: 'refund-consumer',
      label: 'Validation Failed',
      style: 'dashed',
      note: 'Routed to charge/refund',
    },
    { id: 'm16', from: 'airtel-poller', to: 'airtel-poller', label: 'Validation Passed', self: true },
    { id: 'm17', from: 'airtel-poller', to: 'airtel', label: 'Send Callback to Airtel' },
    { id: 'm18', from: 'sub-airtel', to: 'airtel', label: 'Query Status Request' },
    { id: 'm19', from: 'airtel', to: 'airtel-poller', label: 'Query Cache', icon: 'cache' },
    { id: 'm20', from: 'airtel-poller', to: 'airtel', label: 'Query Status', style: 'dashed' },
    {
      id: 'm21',
      from: 'airtel',
      to: 'sub-airtel',
      label: 'Query Status Response (Status 176/130)',
      style: 'dashed',
      note: 'Cache record exists',
    },
    { id: 'm22', from: 'airtel', to: 'charge', label: 'Route Query Status to Charge', note: 'Cache record does not exist' },
    { id: 'm23', from: 'charge', to: 'charge', label: 'Query Charge DB', self: true, icon: 'database' },
    { id: 'm24', from: 'charge', to: 'airtel', label: 'Charge Query Status Response', style: 'dashed' },
    {
      id: 'm25',
      from: 'airtel',
      to: 'sub-airtel',
      label: 'Query Status Response (Status 176/130)',
      style: 'dashed',
    },
    { id: 'm26', from: 'sub-airtel', to: 'sub-airtel', label: 'Airtel Issues Service', self: true },
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
