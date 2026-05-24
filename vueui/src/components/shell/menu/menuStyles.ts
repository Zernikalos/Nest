/** Shared Tailwind classes for application menu bar (title bar). */
export const menuTriggerClass =
  'rounded px-2 py-1 text-xs outline-none hover:bg-base-300 data-[state=open]:bg-base-300';

export const menuContentClass =
  'z-[100] min-w-[12rem] rounded-md border border-base-300 bg-base-100 p-1 shadow-md';

export const menuSubContentClass =
  'z-[100] min-w-[14rem] rounded-md border border-base-300 bg-base-100 p-1 shadow-md';

export const menuItemClass =
  'cursor-default rounded px-2 py-1.5 text-xs outline-none data-[disabled]:opacity-50 data-[highlighted]:bg-base-200';

export const menuSubTriggerClass =
  'flex cursor-default items-center rounded px-2 py-1.5 text-xs outline-none data-[disabled]:opacity-50 data-[highlighted]:bg-base-200';

export const menuSeparatorClass = 'my-1 h-px bg-base-300';
