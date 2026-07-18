import { Sparkles } from 'lucide-react';

export function FloatingAssistantBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-cellulant-dark px-4 py-2.5 text-sm text-slate-300 shadow-xl">
        <Sparkles className="h-4 w-4 text-cellulant-mustard" />
        <span className="font-medium text-white">Assistant</span>
        <span className="text-slate-400">Coming soon — ask a question about this flow</span>
      </div>
    </div>
  );
}
