'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CustomerFlowSummary } from '@/lib/queries';

const TEMPLATE_JSON = JSON.stringify(
  {
    title: 'New Flow',
    initiateLabel: 'Initiate',
    actors: [
      { id: 'actor-1', label: 'Actor 1', kind: 'person', color: '#005BA0' },
      { id: 'actor-2', label: 'Actor 2', kind: 'service', color: '#009EDA' },
    ],
    messages: [
      {
        id: 'm1',
        from: 'actor-1',
        to: 'actor-2',
        label: 'Step 1',
        detail: 'Describe what happens at this step.',
      },
    ],
    annotations: [],
  },
  null,
  2,
);

export function CustomerFlowManager({
  flows,
  services,
}: {
  flows: CustomerFlowSummary[];
  services: Array<{ slug: string; name: string }>;
}) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {flows.map((flow) => (
          <FlowRow key={flow.id} flow={flow} services={services} onChanged={() => router.refresh()} />
        ))}
        {flows.length === 0 && (
          <p className="text-sm text-slate-400">No customer flows yet.</p>
        )}
      </div>

      {addOpen ? (
        <AddFlowForm
          services={services}
          onDone={() => {
            setAddOpen(false);
            router.refresh();
          }}
          onCancel={() => setAddOpen(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="w-fit rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-500 hover:border-cellulant-blue hover:text-cellulant-blue"
        >
          + Add customer flow
        </button>
      )}
    </div>
  );
}

function FlowRow({
  flow,
  services,
  onChanged,
}: {
  flow: CustomerFlowSummary;
  services: Array<{ slug: string; name: string }>;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(flow.name);
  const [serviceSlug, setServiceSlug] = useState(flow.serviceSlug);
  const [dataJson, setDataJson] = useState('');
  const [loadingJson, setLoadingJson] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function startEditing() {
    setEditing(true);
    setLoadingJson(true);
    const res = await fetch(`/api/admin/customer-flows/${flow.id}`);
    if (res.ok) {
      const data = await res.json();
      setDataJson(JSON.stringify(JSON.parse(data.dataJson), null, 2));
    }
    setLoadingJson(false);
  }

  async function save() {
    setError(null);
    setBusy(true);
    const res = await fetch(`/api/admin/customer-flows/${flow.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, serviceSlug, dataJson: dataJson || undefined }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? 'Failed to save.');
      return;
    }
    setEditing(false);
    onChanged();
  }

  async function remove() {
    if (!confirm(`Delete "${flow.name}"?`)) return;
    await fetch(`/api/admin/customer-flows/${flow.id}`, { method: 'DELETE' });
    onChanged();
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900">{flow.name}</p>
          <p className="text-xs text-slate-400">
            {flow.serviceName} · /payment-flows/{flow.slug}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => (editing ? setEditing(false) : startEditing())}
            className="rounded border border-slate-200 px-2 py-1 text-cellulant-blue hover:border-cellulant-blue"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={remove}
            className="rounded border border-slate-200 px-2 py-1 text-red-600 hover:border-red-300"
          >
            Delete
          </button>
        </div>
      </div>

      {editing && (
        <div className="mt-3 flex flex-col gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cellulant-blue"
            placeholder="Name"
          />
          <select
            value={serviceSlug}
            onChange={(e) => setServiceSlug(e.target.value)}
            className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
          >
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
          <textarea
            value={dataJson}
            onChange={(e) => setDataJson(e.target.value)}
            rows={10}
            placeholder={loadingJson ? 'Loading…' : 'Paste updated diagram JSON here to replace it (leave blank to keep as-is)'}
            className="rounded-md border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-cellulant-blue"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="w-fit rounded-full bg-cellulant-blue px-4 py-1.5 text-sm font-semibold text-white hover:bg-cellulant-navy disabled:opacity-60"
          >
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}
    </div>
  );
}

function AddFlowForm({
  services,
  onDone,
  onCancel,
}: {
  services: Array<{ slug: string; name: string }>;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [serviceSlug, setServiceSlug] = useState(services[0]?.slug ?? '');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [dataJson, setDataJson] = useState(TEMPLATE_JSON);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function create() {
    setError(null);
    setBusy(true);
    const res = await fetch('/api/admin/customer-flows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceSlug, name, slug, dataJson }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? 'Failed to create.');
      return;
    }
    onDone();
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-cellulant-blue/40 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">New customer flow</p>
      <select
        value={serviceSlug}
        onChange={(e) => setServiceSlug(e.target.value)}
        className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
      >
        {services.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name}
          </option>
        ))}
      </select>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name (e.g. Customer YYYY)"
        className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cellulant-blue"
      />
      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="URL slug (e.g. checkout-customer-yyyy)"
        className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cellulant-blue"
      />
      <textarea
        value={dataJson}
        onChange={(e) => setDataJson(e.target.value)}
        rows={12}
        className="rounded-md border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-cellulant-blue"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={create}
          disabled={busy}
          className="rounded-full bg-cellulant-blue px-4 py-1.5 text-sm font-semibold text-white hover:bg-cellulant-navy disabled:opacity-60"
        >
          {busy ? 'Creating…' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-600 hover:border-slate-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
