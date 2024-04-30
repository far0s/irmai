import { useEffect, useState, useRef } from "react";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";
import { Screen } from "../Stage.utils";
import s from "./screens.module.css";
import { cirka } from "@/utils/fonts";
const TarotScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { setGlobalState, focus, setSelectedCards, selectedCards } =
    useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useState<
    null | "start" | "copy2" | "recording" | "end" | "result"
  >(null);

  useEffect(() => {
    isActive && setPartToShow("start");
  }, [isActive]);

  return (
    <Screen id={id} isActive={isActive}>
      <div className={s.wrapper} data-show={partToShow}>
        <div className={s.copy}>
          <p>
            <span className={`${cirka.className}`}>Your focus</span> {focus}
          </p>
          <p>
            {/* TODO: style this correctly */}
            <span className={`${cirka.className}`}>Cards</span> Lorem ipsum
            dolor sit amet consectetur. Leo nisi odio aliquam cursus egestas.
            Augue venenatis tincidunt in volutpat. Nascetur amet auctor sem non
            fermentum. Velit sem ullamcorper tellus sed scelerisque ipsum
            elementum.
          </p>
        </div>
      </div>

      <PressAndHoldCTA
        onEndPress={() => setGlobalState("question")}
        pressDuration={4000}
      />
    </Screen>
  );
};

export default TarotScreen;
