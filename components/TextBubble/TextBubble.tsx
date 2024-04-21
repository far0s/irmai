import s from "./textBubble.module.css";

const TextBubble = ({
  symbol,
  children,
}: {
  symbol?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={s.bubble}>
      {symbol && <span className={s.symbol}>{symbol}</span>}
      {children}
    </div>
  );
};

export default TextBubble;
