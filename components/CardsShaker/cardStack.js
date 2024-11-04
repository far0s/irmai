// Author blog: https://www.abjt.dev/lab/card-stack

const MAX_CARD_ON_ONE_SIDE = 5;
const CARD_TRANSLATE_X = 136;
const PERSPECTIVE_BASE = 200;
const PERSPECTIVE_FACTOR = 20;
const CARD_MAX_ROTATE_Y = 75;
const CARD_ACTIVE_MAX_ROTATE_Y = 90;
const CARD_SCALE_DOWN_FACTOR = 0.05;

class CardStack {
  constructor() {
    this.scrollableContainer = document.querySelector("#scrollable-container");
    this.activeIndex = 0;
    this.globalScrollProgress = 0;
    this.cardCount = document.querySelectorAll(".scrollable-card").length;
    this.visibleCards = [];
    this.init();
  }

  init() {
    this.scrollableContainer.addEventListener(
      "scroll",
      this.handleScroll.bind(this)
    );
    this.createVisibleCards();
    this.activeIndex = Math.floor(this.cardCount / 2);
    this.globalScrollProgress = this.activeIndex / (this.cardCount - 1);
    this.scrollableContainer.scrollLeft =
      this.scrollableContainer.scrollWidth * this.globalScrollProgress;
    this.update();
    this.visibleCards.forEach((card) => {
      card.update(this.globalScrollProgress, this.activeIndex);
    });
  }

  createVisibleCards() {
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

  handleScroll() {
    const { scrollLeft, scrollWidth, clientWidth } = this.scrollableContainer;
    const newScrollProgress = scrollLeft / (scrollWidth - clientWidth); // normalized to a value between 0 and 1
    this.globalScrollProgress = newScrollProgress;
    this.handleActiveIndex();
    this.update();
  }

  handleActiveIndex() {
    const relativeScrollPerCard = 1 / (this.cardCount - 1); // scroll amount per card normalized to a value between 0 and 1

    // the relative and normalized scroll position where the previous and next card starts
    const previousScrollSnapPoint =
      relativeScrollPerCard * (this.activeIndex - 1);
    const nextScrollSnapPoint = relativeScrollPerCard * (this.activeIndex + 1);

    // increment or decrement the active index when the scroll position reaches the previous or the next card
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

  update() {
    this.visibleCards.forEach((card) => {
      card.update(this.globalScrollProgress, this.activeIndex);
    });
  }
}

class VisibleCard {
  constructor(cardCount, globalScrollProgress, activeIndex, index) {
    this.element = document.querySelectorAll("#visible-cards-container > *")[
      index
    ];

    this.cardCount = cardCount;
    this.globalScrollProgress = globalScrollProgress;
    this.activeIndex = activeIndex;
    this.index = index;
    // the maximum number of cards that can be visible on either side of the active card
    this.maxCardsOnOneSide = MAX_CARD_ON_ONE_SIDE;

    this.update();
  }

  calculateTranslateX() {
    this.translateX =
      this.activeIndex === this.index
        ? this.absoluteCardScrollProgress < 0.5
          ? // we translate the card by 136% of its width when it is active and the scroll distance is less than half if its width
            -CARD_TRANSLATE_X * this.cardScrollProgress
          : // we translate the card by 136% of its width when it is active and the scroll distance is more than half if its width
            // we also add a slight offset to the translation so that when the card reaches the final position,
            // it is not completely centered, rather takes its final position as the card next or previous to the new active card
            -CARD_TRANSLATE_X * Math.sign(this.cardScrollProgress) +
            CARD_TRANSLATE_X * this.cardScrollProgress +
            -((1 - this.absoluteCardScrollProgress / this.cardCount / 4) * 10) *
              (this.absoluteCardScrollProgress - 0.5) *
              2 *
              Math.sign(this.cardScrollProgress)
        : // if the card is not active, we translate it away from the center
          // based on the relative and normalized scroll distance from the active card
          this.cardScrollProgress *
          -((1 - this.absoluteCardScrollProgress / this.cardCount / 4) * 10);
  }

  calculateTranslateZ() {
    // translateZ adds a slight perspective effect to the cards when they are being rotated
    // the parent has it's own perspective value, so we need to adjust the translateZ value based on the scroll progress
    // to make the cards look like they are being rotated in a 3D space
    this.translateZ =
      PERSPECTIVE_BASE - this.absoluteCardScrollProgress * PERSPECTIVE_FACTOR;
  }

  calculateRotateY() {
    let rotateY = 0;

    // we rotate the card based on the relative and normalized scroll distance from the active card
    // the maximum rotation is 75 degrees
    // the active card rotates more than the other cards when it moves away from the center
    rotateY =
      this.index === this.activeIndex
        ? this.absoluteCardScrollProgress < 0.5
          ? this.absoluteCardScrollProgress * -CARD_ACTIVE_MAX_ROTATE_Y
          : (1 - this.absoluteCardScrollProgress) * -CARD_ACTIVE_MAX_ROTATE_Y
        : this.absoluteActiveCardScrollProgress < 0.5
        ? this.absoluteActiveCardScrollProgress * -CARD_MAX_ROTATE_Y
        : (1 - this.absoluteActiveCardScrollProgress) * -CARD_MAX_ROTATE_Y;

    // the further the card is from the active card, the less it rotates
    rotateY *=
      Math.sign(this.activeCardScrollProgress) *
      (1 - Math.abs(this.activeIndex - this.index) / this.cardCount);

    this.rotateY = rotateY;
  }

  calculateRotateZ() {
    this.rotateZ = this.cardScrollProgress * 0.5 * -1;
  }

  calculateScale() {
    // cards scale down as they move away from the active card
    let scale = 1 - this.absoluteCardScrollProgress * CARD_SCALE_DOWN_FACTOR;

    // the active card scales down more than the other cards when it is away from the center
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

    this.scale = scale;
  }

  calculateZIndex() {
    const distanceIndex = Math.abs(this.activeIndex - this.index); // the distance of the card from the active card in terms of index
    let zIndex = this.cardCount - distanceIndex; // the further the card is from the active card, the less the z-index

    // normally the cards at equal distance from the active card should have the same z-index
    // so we switch the z-index of the cards based on the scroll direction
    // this is so that the cards that are visible when the active card is moved in either direction need to be on top
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

  calculateOpacity() {
    // the further the card is from the active card, the less the opacity
    // the cards with index difference of more than maxCardsOnOneSide from the center have 0 opacity
    // they fade in as they move towards the center, and fade out as they move away from the center
    let opacity = this.maxCardsOnOneSide - this.absoluteCardScrollProgress;
    this.opacity = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity;
  }

  applyStyles() {
    const noElement = !this.element;
    const invalidStyles = [
      this.translateX,
      this.translateZ,
      this.rotateY,
      this.rotateZ,
      this.scale,
      this.zIndex,
      this.opacity,
    ].some((style) => style === undefined);
    if (noElement || invalidStyles) return;

    this.element.style.transform = `translateX(${
      this.translateX - 50
    }%) translateY(-50%) translateZ(${this.translateZ}px) rotateY(${
      this.rotateY
    }deg) rotateZ(${this.rotateZ}deg) scale(${this.scale})`;
    this.element.style.zIndex = this.zIndex;
    this.element.style.opacity = this.opacity;
  }

  update(globalScrollProgress, activeIndex) {
    this.globalScrollProgress = globalScrollProgress;
    this.activeIndex = activeIndex;

    this.relativeScrollPerCard =
      this.cardCount > 1 ? 1 / (this.cardCount - 1) : 1; // scroll amount per card normalized to a value between 0 and 1
    this.cardRelativeScrollStart = this.relativeScrollPerCard * this.index; // the relative and normalized scroll position where the card starts
    this.cardScrollProgress =
      (this.globalScrollProgress - this.cardRelativeScrollStart) /
      this.relativeScrollPerCard; // normalized relative scroll progress of the card
    this.absoluteCardScrollProgress = Math.abs(this.cardScrollProgress); // absolute version of the card scroll progress
    this.activeCardScrollProgress =
      this.globalScrollProgress / this.relativeScrollPerCard - this.activeIndex; // normalized relative scroll progress of the active card
    this.absoluteActiveCardScrollProgress = Math.abs(
      this.activeCardScrollProgress
    ); // absolute version of the active card scroll progress

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
