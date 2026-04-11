import {
  autoUpdate,
  flip,
  FloatingPortal,
  limitShift,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useState } from "react";

export const Tooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) => {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    strategy: "fixed",
    placement: "right",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({
        padding: 8,
        /**
         * Prefer right, then above/below — avoids widening the page on narrow
         * screens
         */
        fallbackPlacements: ["top", "bottom", "left"],
      }),
      shift({ padding: 8, limiter: limitShift() }),
    ],
  });

  const hover = useHover(context);
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        style={{ display: "inline-block" }}
        className="cursor-pointer"
      >
        {children}
      </div>

      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className="z-1000 max-w-[min(18rem,calc(100vw-1rem))] rounded-md border border-white/15 bg-neutral-900 px-2.5 py-1.5 text-xs font-normal text-white shadow-lg"
            style={{
              ...floatingStyles,
            }}
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
