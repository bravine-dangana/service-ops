import { FeaturedItem, type FeaturedItemType } from './FeaturedItem';

export function FeaturedItems({
  id,
  heading,
  items,
}: {
  id?: string;
  heading: string;
  items: FeaturedItemType[];
}) {
  return (
    <div id={id} className="relative border-b border-white/10 py-10 sm:py-14">
      <div className="container">
        <h2 className="text-md absolute -top-[17px] flex rounded-lg border border-white/10 bg-cellulant-dark px-3 py-1 font-medium text-slate-300 sm:left-1/2 sm:-translate-x-1/2">
          {heading}
        </h2>

        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.href}>
              <FeaturedItem {...item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
