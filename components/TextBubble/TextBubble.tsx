import s from "./textBubble.module.css";
import { cirka } from "@/utils/fonts";

const TextBubble = ({
  symbol,
  children,
}: {
  symbol?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={s.bubble}>
      {symbol && (
        <span className={`${cirka.className} ${s.symbol}`}>{symbol}</span>
      )}
      {children}
    </div>
  );
};

export default TextBubble;
