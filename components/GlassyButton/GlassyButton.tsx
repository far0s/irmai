import s from "./glassyButton.module.css";

const GlassyButton = ({
  onClick,
  variant = "primary",
  children,
}: {
  onClick: () => void;
  variant?: "primary" | "small-square";
  children: React.ReactNode;
}) => {
  return (
    <div className={s.btnWrapper} data-variant={variant}>
      <button onClick={onClick} role="button" className={s.btn}>
        <span>{children}</span>
      </button>
      <div className={s.btnShadow} />
    </div>
  );
};

export default GlassyButton;
