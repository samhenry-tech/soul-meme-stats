import {
  flip,
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
    placement: "right",
    middleware: [
      offset(8), // space from element
      flip(), // flip if no space
      shift(), // keep in viewport
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
        <div
          ref={refs.setFloating}
          className="border border-white/15 bg-neutral-900 px-3 py-2 text-sm font-normal text-white shadow-lg"
          style={{
            ...floatingStyles,
            background: "#111",
            color: "white",
            padding: "6px 10px",
            borderRadius: 6,
            fontSize: 12,
            zIndex: 1000,
          }}
          {...getFloatingProps()}
        >
          {content}
        </div>
      )}
    </>
  );
};
