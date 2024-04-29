import { useEffect, useState, useRef } from "react";
import TextBubble from "@/components/TextBubble/TextBubble";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";
import { Screen } from "../Stage.utils";
import s from "./screens.module.css";
import { cirka } from "@/utils/fonts";

const LandingScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { setGlobalState } = useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useState<
    null | "heading" | "copy1" | "copy2" | "end"
  >(null);
  const timeout1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeout2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeout3 = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isActive && setPartToShow("heading");
  }, [isActive]);

  const handlePress = () => {
    timeout1.current = setTimeout(() => {
      setPartToShow("copy1");
    }, 500);

    timeout2.current = setTimeout(() => {
      setPartToShow("copy2");
    }, 2000);

    timeout3.current = setTimeout(() => {
      setPartToShow("end");
    }, 4000);
  };

  const handleRelease = () => {
    timeout1.current && clearTimeout(timeout1.current);
    timeout2.current && clearTimeout(timeout2.current);
    timeout3.current && clearTimeout(timeout3.current);
    setPartToShow("heading");
  };

  return (
    <Screen isActive={isActive} id={id}>
      <div className={s.landing} data-show={partToShow}>
        <div className={s.landingHeading}>
          <h2 className={`${cirka.className} ${s.heading}`}>
            Ready to embark on a journey of self-discovery?
          </h2>
        </div>
        <div className={s.landingCopy1}>
          <TextBubble symbol="*">
            There is power within your fingertips
          </TextBubble>
        </div>
        <div className={s.landingCopy2}>
          <TextBubble symbol="&">
            Pressing, holding, and speaking, will let you connect with your
            spiritual guide
          </TextBubble>
        </div>

        <div className={s.landingCTA}>
          <PressAndHoldCTA
            onBeginPress={handlePress}
            onEndPress={() => setGlobalState("intro")}
            onRelease={handleRelease}
            pressDuration={5000}
          />
        </div>
      </div>
    </Screen>
  );
};

export default LandingScreen;
