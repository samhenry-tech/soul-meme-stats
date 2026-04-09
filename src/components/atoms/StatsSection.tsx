import clsx from "clsx";

export const StatsSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section
      className={clsx("flex justify-between gap-12 text-center", className)}
    >
      {children}
    </section>
  );
};
