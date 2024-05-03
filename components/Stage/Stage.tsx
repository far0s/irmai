import s from "./stage.module.css";

const Stage = ({ children }: { children: React.ReactNode }) => {
  return <div className={s.stage}>{children}</div>;
};

export default Stage;
