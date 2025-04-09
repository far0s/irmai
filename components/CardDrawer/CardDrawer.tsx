"use client";
import { createContext, useContext, useState } from "react";
import { Drawer } from "vaul";
import Tilt from "react-parallax-tilt";
import Image from "next/image";

import TransitionWrapper from "@/components/TransitionWrapper/TransitionWrapper";
import { ITarotCard } from "@/utils/shared-types";

import s from "./cardDrawer.module.css";

// Context to manage the drawer state globally
type CardDrawerContextType = {
  openDrawer: (card: ITarotCard) => void;
  closeDrawer: () => void;
  card: ITarotCard | null;
  isOpen: boolean;
};

const CardDrawerContext = createContext<CardDrawerContextType>({
  openDrawer: () => {},
  closeDrawer: () => {},
  card: null,
  isOpen: false,
});

// Context provider component
export const CardDrawerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [card, setCard] = useState<ITarotCard | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = (selectedCard: ITarotCard) => {
    setCard(selectedCard);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <CardDrawerContext.Provider
      value={{ openDrawer, closeDrawer, card, isOpen }}
    >
      {children}
      <CardDrawer />
    </CardDrawerContext.Provider>
  );
};

// Hook to use the drawer
export const useCardDrawer = () => useContext(CardDrawerContext);

// The actual CardDrawer component (internal use only)
const CardDrawer = () => {
  const { card, isOpen, closeDrawer } = useCardDrawer();

  if (!card) return null;

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <Drawer.Portal>
        <Drawer.Overlay className={s.drawerOverlay} />
        <div className={s.drawerWindow}>
          <Drawer.Content
            className={s.drawerContent}
            aria-describedby="card-details"
          >
            <Drawer.Description id="card-details" style={{ display: "none" }}>
              Card Details: {card.name}
            </Drawer.Description>
            <div className={s.lightboxContent}>
              <Tilt
                tiltEnable={true}
                tiltReverse={true}
                tiltAngleXInitial={0}
                tiltAngleYInitial={0}
                tiltMaxAngleX={35}
                tiltMaxAngleY={35}
                perspective={2000}
                trackOnWindow={true}
                transitionSpeed={2000}
                gyroscope={false}
                glareEnable={true}
                glareMaxOpacity={0.5}
                glareColor={card.reverse ? "#0b0216" : "#fffbf2"}
                glarePosition="all"
                glareBorderRadius="1rem"
                glareReverse={true}
              >
                <div
                  style={
                    {
                      "--size": "min(400px, 75vw)",
                      "--spacing-1": "0.75rem",
                      "--spacing-2": "1.5rem",
                      "--font-size": "18px",
                      "--card-color": card.color || "var(--purple)",
                      position: "relative",
                      flex: "0 0 var(--size)",
                      width: "var(--size)",
                      aspectRatio: "7/12",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "var(--spacing-2)",
                      boxShadow:
                        "0 10px 15px 3px rgba(0, 0, 0, 0.1), 0 4px 6px 2px rgba(0, 0, 0, 0.05)",
                    } as React.CSSProperties
                  }
                >
                  {card.image && (
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        background: card.color || "var(--purple)",
                        borderRadius: "var(--spacing-2)",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={card.image}
                        alt={card.name}
                        width={300}
                        height={527}
                        style={{
                          padding: "var(--spacing-1)",
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          filter: card.reverse ? "invert(1)" : "none",
                        }}
                        priority
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          boxShadow:
                            "0 0 var(--spacing-1) var(--spacing-2) var(--card-color) inset",
                          zIndex: 1,
                          pointerEvents: "none",
                        }}
                      ></div>
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background: card.color || "var(--purple)",
                          mixBlendMode: "color",
                          pointerEvents: "none",
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </Tilt>
              <TransitionWrapper className={s.cardName} show={true} delay={200}>
                <span>{card.name}</span>
                {card.reverse && <span> (reverse)</span>}
              </TransitionWrapper>
            </div>
          </Drawer.Content>
        </div>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default CardDrawer;
