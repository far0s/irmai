"use client";

import TransitionWrapper from "@/components/TransitionWrapper/TransitionWrapper";

import s from "./stage.module.css";

export const Screen = ({
  isActive,
  children,
}: {
  isActive: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <TransitionWrapper
      show={isActive}
      delay={isActive ? 500 : 0}
      className={s.screen}
    >
      {children}
    </TransitionWrapper>
  );
};

const Stage = ({ children }: { children: React.ReactNode }) => {
  return <div className={s.stage}>{children}</div>;
};

export default Stage;
