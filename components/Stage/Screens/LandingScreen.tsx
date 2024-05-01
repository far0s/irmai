import { useEffect, useState, useRef } from "react";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";
import { Screen } from "../Stage.utils";
import s from "./screens.module.css";
import { cirka } from "@/utils/fonts";

const LandingScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { setGlobalState } = useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useState<
    null | "start" | "copy2" | "copy3" | "end"
  >(null);
  const timeout1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeout2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeout3 = useRef<ReturnType<typeof setTimeout> | null>(null);

  // TODO: make irmai talk

  useEffect(() => {
    isActive && setPartToShow("start");
  }, [isActive]);

  const handlePress = () => {
    timeout1.current = setTimeout(() => {
      setPartToShow("copy2");
    }, 500);

    timeout2.current = setTimeout(() => {
      setPartToShow("copy3");
    }, 2500);

    timeout3.current = setTimeout(() => {
      setPartToShow("end");
    }, 5000);
  };

  const handleRelease = () => {
    timeout1.current && clearTimeout(timeout1.current);
    timeout2.current && clearTimeout(timeout2.current);
    timeout3.current && clearTimeout(timeout3.current);
    setPartToShow("start");
  };

  const handleEndPress = () => {
    setGlobalState("focus");
  };

  return (
    <Screen isActive={isActive} id={id}>
      <div className={s.wrapper} data-show={partToShow}>
        <div className={s.copy}>
          <p>
            <span className={`${cirka.className}`}>Welcome</span>
            irmai is your audio-visual spiritual guide. This is a journey of
            self-discovery and inner peace to nurture your spiritual growth and
            self connection.
          </p>
          <p>Ready to embark on a journey of self-discovery?</p>
        </div>
        <div className={s.copy}>
          <p>There is power within your fingertips.</p>
        </div>
        <div className={s.copy}>
          <p>
            Pressing, holding, and speaking, will let you connect with your
            spiritual guide.
          </p>
        </div>

        <footer className={s.footer}>
          <PressAndHoldCTA
            onBeginPress={handlePress}
            onEndPress={handleEndPress}
            onRelease={handleRelease}
            pressDuration={6000}
          />
        </footer>
      </div>
    </Screen>
  );
};

export default LandingScreen;
