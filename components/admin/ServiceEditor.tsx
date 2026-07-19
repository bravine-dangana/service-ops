'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ServiceDefinition, FlowStep, StepRole, StepStatus } from '@/data/services';

const ROLES: StepRole[] = ['customer', 'external', 'cellulant', 'success', 'failure'];
const STATUSES: StepStatus[] = ['draft', 'reviewed'];

export function ServiceEditor({ service }: { service: ServiceDefinition }) {
  const router = useRouter();
  const [name, setName] = useState(service.name);
  const [tagline, setTagline] = useState(service.tagline);
  const [description, setDescription] = useState(service.description);
  const [savingService, setSavingService] = useState(false);

  async function saveService() {
    setSavingService(true);
    await fetch(`/api/admin/services/${service.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, tagline, description }),
    });
    setSavingService(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Service details
        </p>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cellulant-blue"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Tagline
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cellulant-blue"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cellulant-blue"
            />
          </label>
          <button
            type="button"
            onClick={saveService}
            disabled={savingService}
            className="w-fit rounded-full bg-cellulant-blue px-4 py-1.5 text-sm font-semibold text-white hover:bg-cellulant-navy disabled:opacity-60"
          >
            {savingService ? 'Saving…' : 'Save details'}
          </button>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Steps ({service.steps.length})
        </p>
        <div className="flex flex-col gap-3">
          {service.steps.map((step, index) => (
            <StepRow
              key={step.id}
              step={step}
              index={index}
              total={service.steps.length}
              prevStepId={index > 0 ? service.steps[index - 1].id : null}
              nextStepId={index < service.steps.length - 1 ? service.steps[index + 1].id : null}
              onChanged={() => router.refresh()}
            />
          ))}
        </div>

        <AddStepForm serviceSlug={service.slug} onAdded={() => router.refresh()} />
      </div>
    </div>
  );
}

function StepRow({
  step,
  index,
  total,
  prevStepId,
  nextStepId,
  onChanged,
}: {
  step: FlowStep;
  index: number;
  total: number;
  prevStepId: string | null;
  nextStepId: string | null;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(step.title);
  const [explanation, setExplanation] = useState(step.explanation);
  const [status, setStatus] = useState<StepStatus>(step.status);
  const [role, setRole] = useState<StepRole>(step.role);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    await fetch(`/api/admin/steps/${step.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, explanation, status, role }),
    });
    setBusy(false);
    setEditing(false);
    onChanged();
  }

  async function remove() {
    if (!confirm(`Delete step "${step.title}"?`)) return;
    setBusy(true);
    await fetch(`/api/admin/steps/${step.id}`, { method: 'DELETE' });
    onChanged();
  }

  async function move(direction: 'up' | 'down') {
    const neighborId = direction === 'up' ? prevStepId : nextStepId;
    if (!neighborId) return;
    setBusy(true);
    await fetch(`/api/admin/steps/${step.id}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction }),
    });
    setBusy(false);
    onChanged();
  }

  if (!editing) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900">
            {index + 1}. {step.title}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {step.status} · {step.role}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => move('up')}
            disabled={busy || !prevStepId}
            className="rounded border border-slate-200 px-2 py-1 text-slate-500 hover:border-slate-300 disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => move('down')}
            disabled={busy || !nextStepId}
            className="rounded border border-slate-200 px-2 py-1 text-slate-500 hover:border-slate-300 disabled:opacity-30"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded border border-slate-200 px-2 py-1 text-cellulant-blue hover:border-cellulant-blue"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="rounded border border-slate-200 px-2 py-1 text-red-600 hover:border-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-cellulant-blue/40 bg-white p-3 shadow-sm">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cellulant-blue"
        placeholder="Title"
      />
      <textarea
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        rows={3}
        className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cellulant-blue"
        placeholder="Explanation"
      />
      <div className="flex gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StepStatus)}
          className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as StepRole)}
          className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded-full bg-cellulant-blue px-4 py-1.5 text-sm font-semibold text-white hover:bg-cellulant-navy disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-600 hover:border-slate-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function AddStepForm({ serviceSlug, onAdded }: { serviceSlug: string; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [explanation, setExplanation] = useState('');
  const [status, setStatus] = useState<StepStatus>('draft');
  const [role, setRole] = useState<StepRole>('cellulant');
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!title.trim()) return;
    setBusy(true);
    await fetch(`/api/admin/services/${serviceSlug}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, explanation, status, role }),
    });
    setBusy(false);
    setTitle('');
    setExplanation('');
    setOpen(false);
    onAdded();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-500 hover:border-cellulant-blue hover:text-cellulant-blue"
      >
        + Add step
      </button>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cellulant-blue"
      />
      <textarea
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        rows={3}
        placeholder="Explanation"
        className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cellulant-blue"
      />
      <div className="flex gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StepStatus)}
          className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as StepRole)}
          className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={add}
          disabled={busy}
          className="rounded-full bg-cellulant-blue px-4 py-1.5 text-sm font-semibold text-white hover:bg-cellulant-navy disabled:opacity-60"
        >
          {busy ? 'Adding…' : 'Add step'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-600 hover:border-slate-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
