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
      className={clsx(
        "flex flex-wrap justify-evenly gap-8 self-stretch text-center",
        className
      )}
    >
      {children}
    </section>
  );
};
