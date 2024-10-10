"use client";

import FadeInWrapper from "@/components/TransitionWrapper/TransitionWrapper";

import s from "./stage.module.css";

export const Screen = ({
  isActive,
  children,
}: {
  isActive: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <FadeInWrapper
      show={isActive}
      delay={isActive ? 500 : 0}
      className={s.screen}
    >
      {children}
    </FadeInWrapper>
  );
};

const Stage = ({ children }: { children: React.ReactNode }) => {
  return <div className={s.stage}>{children}</div>;
};

export default Stage;
