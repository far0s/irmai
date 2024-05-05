import s from "./fadeInWrapper.module.css";

const FadeInWrapper = ({
  show = false,
  delay = 0,
  className,
  children,
}: {
  show?: boolean;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={`${s.fadeInWrapper} ${className || ""}`} data-show={show}>
      <style jsx>{`
        .${s.fadeInWrapper} {
          --delay: ${delay}ms;
        }
      `}</style>
      {children}
    </div>
  );
};

export default FadeInWrapper;
