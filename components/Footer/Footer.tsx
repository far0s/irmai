import Link from "next/link";
import s from "./footer.module.css";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import StageScreens from "@/components/Stage/Stage.utils";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";

const Footer = () => {
  const { globalState, setGlobalState } = useIrmaiStore((s) => s);

  return (
    <footer className={s.footer}>
      {/* insert actions here */}
      {/* Press and hold CTA */}
      {/* Cards thumbnails */}
      {/* Shortlinks ("Learn more, End conversation") */}
      {Object.entries(StageScreens).map(
        ([key], i) =>
          globalState === key && (
            <PressAndHoldCTA
              key={key}
              onBeginPress={null}
              onEndPress={() => {
                const keys = Object.keys(StageScreens);
                const nextKey: any = keys[i + 1];
                setGlobalState(nextKey || "splash");
              }}
              pressDuration={2000}
            />
          )
      )}

      {/* <Link href="#" className={s.link}>
        Learn more
      </Link> */}
    </footer>
  );
};

export default Footer;
