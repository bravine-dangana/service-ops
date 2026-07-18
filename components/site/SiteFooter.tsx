import { Logo } from './Logo';

export function SiteFooter() {
  return (
    <div className="border-t border-white/10 bg-cellulant-dark py-10 sm:py-16">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:gap-2">
          <div className="max-w-[425px]">
            <Logo />
            <p className="my-4 text-slate-400">
              An interactive knowledge base of Cellulant&rsquo;s payment services — for
              engineers, sales, operations, and support.
            </p>
            <div className="text-sm text-slate-500">
              <p>
                &copy; Cellulant Service Ops {new Date().getFullYear()}
                <span className="mx-1.5">&middot;</span>
                <a href="#" className="hover:text-cellulant-blue">
                  Terms
                </a>
                <span className="mx-1.5">&middot;</span>
                <a href="#" className="hover:text-cellulant-blue">
                  Privacy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
