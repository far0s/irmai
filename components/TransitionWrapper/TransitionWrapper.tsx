import s from "./transitionWrapper.module.css";

const TransitionWrapper = ({
  show = false,
  delay = 0,
  className,
  variant = "fade",
  children,
}: {
  show?: boolean;
  delay?: number;
  className?: string;
  variant?: "fade" | null;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`${s.transitionWrapper} ${className || ""}`}
      data-show={show}
      data-variant={variant}
    >
      <style jsx>{`
        .${s.transitionWrapper} {
          --delay: ${delay}ms;
        }
      `}</style>
      {children}
    </div>
  );
};

export default TransitionWrapper;
