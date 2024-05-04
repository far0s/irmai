"use client";

import s from "./stage.module.css";

export const Screen = ({
  isActive,
  id,
  children,
}: {
  isActive: boolean;
  id: string;
  children?: React.ReactNode;
}) => {
  return (
    <div id={id} className={s.screen} data-is-active={isActive}>
      {children}
    </div>
  );
};

const Stage = ({ children }: { children: React.ReactNode }) => {
  return <div className={s.stage}>{children}</div>;
};

export default Stage;
