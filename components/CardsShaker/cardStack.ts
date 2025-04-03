// Author blog: https://www.abjt.dev/lab/card-stack

interface Transforms {
  translateX: number;
  translateZ: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
}

const MAX_CARD_ON_ONE_SIDE = 5;
const CARD_TRANSLATE_X = 136;
const PERSPECTIVE_BASE = 200;
const PERSPECTIVE_FACTOR = 20;
const CARD_MAX_ROTATE_Y = 75;
const CARD_ACTIVE_MAX_ROTATE_Y = 90;
const CARD_SCALE_DOWN_FACTOR = 0.05;

class CardStack {
  private scrollableContainer: HTMLElement;
  private activeIndex: number;
  private globalScrollProgress: number;
  private cardCount: number;
  private visibleCards: VisibleCard[];
  private rafId: number | null = null;
  private isUpdating: boolean = false;

  constructor() {
    this.scrollableContainer = document.querySelector(
      "#scrollable-container"
    ) as HTMLElement;
    this.activeIndex = 0;
    this.globalScrollProgress = 0;
    this.cardCount = document.querySelectorAll(".scrollable-card").length;
    this.visibleCards = [];
    this.init();
  }

  private init(): void {
    this.scrollableContainer.addEventListener(
      "scroll",
      this.handleScroll.bind(this)
    );
    this.createVisibleCards();
    this.activeIndex = Math.floor(this.cardCount / 2);
    this.globalScrollProgress = this.activeIndex / (this.cardCount - 1);
    this.scrollableContainer.scrollLeft =
      this.scrollableContainer.scrollWidth * this.globalScrollProgress;
    this.scheduleUpdate();
    document.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.scrollableContainer.removeEventListener(
      "scroll",
      this.handleScroll.bind(this)
    );
    document.removeEventListener("keydown", this.handleKeydown.bind(this));
    this.visibleCards.forEach((card) => {
      card.update(0, 0);
    });
  }

  private createVisibleCards(): void {
    const children = document.querySelectorAll("#visible-cards-container > *");

    for (let i = 0; i < children.length; i++) {
      this.visibleCards.push(
        new VisibleCard(
          this.cardCount,
          this.globalScrollProgress,
          this.activeIndex,
          i
        )
      );
    }
  }

  private scheduleUpdate(): void {
    if (!this.isUpdating) {
      this.isUpdating = true;
      this.rafId = requestAnimationFrame(() => this.update());
    }
  }

  private handleScroll(): void {
    const { scrollLeft, scrollWidth, clientWidth } = this.scrollableContainer;
    const newScrollProgress = scrollLeft / (scrollWidth - clientWidth);
    this.globalScrollProgress = newScrollProgress;
    this.handleActiveIndex();
    this.scheduleUpdate();
  }

  private handleActiveIndex(): void {
    const relativeScrollPerCard = 1 / (this.cardCount - 1);
    const previousScrollSnapPoint =
      relativeScrollPerCard * (this.activeIndex - 1);
    const nextScrollSnapPoint = relativeScrollPerCard * (this.activeIndex + 1);

    const shouldDecrement =
      this.globalScrollProgress <= previousScrollSnapPoint &&
      this.activeIndex > 0;
    const shouldIncrement =
      this.globalScrollProgress >= nextScrollSnapPoint &&
      this.activeIndex < this.cardCount - 1;

    this.activeIndex = shouldDecrement
      ? this.activeIndex - 1
      : shouldIncrement
      ? this.activeIndex + 1
      : this.activeIndex;
  }

  private update(): void {
    this.visibleCards.forEach((card) => {
      card.update(this.globalScrollProgress, this.activeIndex);
    });
    this.isUpdating = false;
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();

    const isLeft = event.key === "ArrowLeft";
    const newIndex = this.activeIndex + (isLeft ? -1 : 1);

    if (newIndex < 0 || newIndex >= this.cardCount) return;

    const relativeScrollPerCard = 1 / (this.cardCount - 1);
    const newScrollPosition =
      (this.scrollableContainer.scrollWidth -
        this.scrollableContainer.clientWidth) *
      (relativeScrollPerCard * newIndex);

    this.scrollableContainer.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
  }

  public setGlobalScrollProgress(progress: number): void {
    this.globalScrollProgress = progress;
    this.scrollableContainer.scrollLeft =
      this.scrollableContainer.scrollWidth * this.globalScrollProgress;
    this.handleActiveIndex();
    this.update();
  }
}

class VisibleCard {
  private element: HTMLElement;
  private transforms: Transforms;
  private cardCount: number;
  private globalScrollProgress: number;
  private activeIndex: number;
  private index: number;
  private maxCardsOnOneSide: number;
  private zIndex: number;
  private opacity: number;
  private relativeScrollPerCard: number;
  private cardRelativeScrollStart: number;
  private cardScrollProgress: number;
  private absoluteCardScrollProgress: number;
  private activeCardScrollProgress: number;
  private absoluteActiveCardScrollProgress: number;
  private lastTransform: string = "";

  constructor(
    cardCount: number,
    globalScrollProgress: number,
    activeIndex: number,
    index: number
  ) {
    this.element = document.querySelectorAll("#visible-cards-container > *")[
      index
    ] as HTMLElement;
    this.transforms = {
      translateX: -50,
      translateZ: -50,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
    };

    this.cardCount = cardCount;
    this.globalScrollProgress = globalScrollProgress;
    this.activeIndex = activeIndex;
    this.index = index;
    this.maxCardsOnOneSide = MAX_CARD_ON_ONE_SIDE;
    this.zIndex = 0;
    this.opacity = 1;
    this.relativeScrollPerCard = 0;
    this.cardRelativeScrollStart = 0;
    this.cardScrollProgress = 0;
    this.absoluteCardScrollProgress = 0;
    this.activeCardScrollProgress = 0;
    this.absoluteActiveCardScrollProgress = 0;

    this.update(this.globalScrollProgress, this.activeIndex);
  }

  private calculateTranslateX(): void {
    this.transforms.translateX =
      this.activeIndex === this.index
        ? this.absoluteCardScrollProgress < 0.5
          ? -CARD_TRANSLATE_X * this.cardScrollProgress
          : -CARD_TRANSLATE_X * Math.sign(this.cardScrollProgress) +
            CARD_TRANSLATE_X * this.cardScrollProgress +
            -((1 - this.absoluteCardScrollProgress / this.cardCount / 4) * 10) *
              (this.absoluteCardScrollProgress - 0.5) *
              2 *
              Math.sign(this.cardScrollProgress)
        : this.cardScrollProgress *
          -((1 - this.absoluteCardScrollProgress / this.cardCount / 4) * 10);
  }

  private calculateTranslateZ(): void {
    this.transforms.translateZ =
      PERSPECTIVE_BASE - this.absoluteCardScrollProgress * PERSPECTIVE_FACTOR;
  }

  private calculateRotateY(): void {
    let rotateY = 0;

    rotateY =
      this.index === this.activeIndex
        ? this.absoluteCardScrollProgress < 0.5
          ? this.absoluteCardScrollProgress * -CARD_ACTIVE_MAX_ROTATE_Y
          : (1 - this.absoluteCardScrollProgress) * -CARD_ACTIVE_MAX_ROTATE_Y
        : this.absoluteActiveCardScrollProgress < 0.5
        ? this.absoluteActiveCardScrollProgress * -CARD_MAX_ROTATE_Y
        : (1 - this.absoluteActiveCardScrollProgress) * -CARD_MAX_ROTATE_Y;

    rotateY *=
      Math.sign(this.activeCardScrollProgress) *
      (1 - Math.abs(this.activeIndex - this.index) / this.cardCount);

    this.transforms.rotateY = rotateY;
  }

  private calculateRotateZ(): void {
    this.transforms.rotateZ = this.cardScrollProgress * 0.5 * -1;
  }

  private calculateScale(): void {
    let scale = 1 - this.absoluteCardScrollProgress * CARD_SCALE_DOWN_FACTOR;

    scale =
      this.index === this.activeIndex
        ? scale < 0.75
          ? 0.75
          : scale
        : scale < 0.5
        ? 0.5
        : scale;

    if (scale < 0) {
      scale = 0;
    }

    this.transforms.scale = scale;
  }

  private calculateZIndex(): void {
    const distanceIndex = Math.abs(this.activeIndex - this.index);
    let zIndex = this.cardCount - distanceIndex;

    const activeScrollDirection = Math.sign(this.activeCardScrollProgress);
    if (activeScrollDirection === -1 && this.index < this.activeIndex) {
      zIndex += 1;
      if (this.activeCardScrollProgress < -0.5) {
        zIndex += 1;
      }
    }

    if (activeScrollDirection === 1) {
      if (this.index === this.activeIndex) {
        zIndex += 1;
      }
      if (
        this.index > this.activeIndex &&
        this.activeCardScrollProgress > 0.5
      ) {
        zIndex += 2;
      }
    }

    this.zIndex = zIndex;
  }

  private calculateOpacity(): void {
    let opacity = this.maxCardsOnOneSide - this.absoluteCardScrollProgress;
    this.opacity = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity;
  }

  private applyStyles(): void {
    if (!this.element) return;

    const transform = `translateX(${
      this.transforms.translateX - 50
    }%) translateY(-50%) translateZ(${this.transforms.translateZ}px) rotateY(${
      this.transforms.rotateY
    }deg) rotateZ(${this.transforms.rotateZ}deg) scale(${
      this.transforms.scale
    })`;

    // Only update styles if they've changed
    if (transform !== this.lastTransform) {
      this.lastTransform = transform;
      // Batch DOM updates
      requestAnimationFrame(() => {
        this.element.style.transform = transform;
        this.element.style.zIndex = this.zIndex.toString();
        this.element.style.opacity = this.opacity.toString();
      });
    }
  }

  public update(globalScrollProgress: number, activeIndex: number): void {
    this.globalScrollProgress = globalScrollProgress;
    this.activeIndex = activeIndex;

    this.relativeScrollPerCard =
      this.cardCount > 1 ? 1 / (this.cardCount - 1) : 1;
    this.cardRelativeScrollStart = this.relativeScrollPerCard * this.index;
    this.cardScrollProgress =
      (this.globalScrollProgress - this.cardRelativeScrollStart) /
      this.relativeScrollPerCard;
    this.absoluteCardScrollProgress = Math.abs(this.cardScrollProgress);
    this.activeCardScrollProgress =
      this.globalScrollProgress / this.relativeScrollPerCard - this.activeIndex;
    this.absoluteActiveCardScrollProgress = Math.abs(
      this.activeCardScrollProgress
    );

    this.calculateZIndex();
    this.calculateTranslateX();
    this.calculateTranslateZ();
    this.calculateRotateY();
    this.calculateRotateZ();
    this.calculateScale();
    this.calculateOpacity();

    this.applyStyles();
  }
}

export default CardStack;
