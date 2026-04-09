import clsx from "clsx";

export const StatCard = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <article
      className={clsx(
        `flex w-70 flex-col items-stretch justify-center gap-4 rounded-lg border-2 p-4`,
        className
      )}
    >
      {children}
    </article>
  );
};
