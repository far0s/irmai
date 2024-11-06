import { ImageTemplateProps } from "@/utils/shared-types";
import styles from "./styles";

const getImageURL = (name: string): string =>
  `https://sacred-texts.com/tarot/pkt/img/${name}.jpg`;
const dummyCards = [
  {
    type: "major",
    name_short: "ar01",
    name: "The Magician",
    value: "1",
    value_int: 1,
    meaning_up:
      "Skill, diplomacy, address, subtlety; sickness, pain, loss, disaster, snares of enemies; self-confidence, will; the Querent, if male.",
    meaning_rev: "Physician, Magus, mental disease, disgrace, disquiet.",
    desc: 'A youthful figure in the robe of a magician, having the countenance of divine Apollo, with smile of confidence and shining eyes. Above his head is the mysterious sign of the Holy Spirit, the sign of life, like an endless cord, forming the figure 8 in a horizontal position . About his waist is a serpent-cincture, the serpent appearing to devour its own tail. This is familiar to most as a conventional symbol of eternity, but here it indicates more especially the eternity of attainment in the spirit. In the Magician\'s right hand is a wand raised towards heaven, while the left hand is pointing to the earth. This dual sign is known in very high grades of the Instituted Mysteries; it shews the descent of grace, virtue and light, drawn from things above and derived to things below. The suggestion throughout is therefore the possession and communication of the Powers and Gifts of the Spirit. On the table in front of the Magician are the symbols of the four Tarot suits, signifying the elements of natural life, which lie like counters before the adept, and he adapts them as he wills. Beneath are roses and lilies, the flos campi and lilium convallium, changed into garden flowers, to shew the culture of aspiration. This card signifies the divine motive in man, reflecting God, the will in the liberation of its union with that which is above. It is also the unity of individual being on all planes, and in a very high sense it is thought, in the fixation thereof. With further reference to what I have called the sign of life and its connexion with the number 8, it may be remembered that Christian Gnosticism speaks of rebirth in Christ as a change "unto the Ogdoad." The mystic number is termed Jerusalem above, the Land flowing with Milk and Honey, the Holy Spirit and the Land of the Lord. According to Martinism, 8 is the number of Christ.',
    image: getImageURL("ar01"),
    color: "#CCA300",
    reverse: false,
  },
  {
    type: "major",
    name_short: "ar02",
    name: "The High Priestess",
    value: "2",
    value_int: 2,
    meaning_up:
      "Secrets, mystery, the future as yet unrevealed; the woman who interests the Querent, if male; the Querent herself, if female; silence, tenacity; mystery, wisdom, science.",
    meaning_rev:
      "Passion, moral or physical ardour, conceit, surface knowledge.",
    desc: "She has the lunar crescent at her feet, a horned diadem on her head, with a globe in the middle place, and a large solar cross on her breast. The scroll in her hands is inscribed with the word Tora, signifying the Greater Law, the Secret Law and the second sense of the Word. It is partly covered by her mantle, to shew that some things are implied and some spoken. She is seated between the white and black pillars--J. and B.--of the mystic Temple, and the veil of the Temple is behind her: it is embroidered with palms and pomegranates. The vestments are flowing and gauzy, and the mantle suggests light--a shimmering radiance. She has been called occult Science on the threshold of the Sanctuary of Isis, but she is really the Secret Church, the House which is of God and man. She represents also the Second Marriage of the Prince who is no longer of this world; she is the spiritual Bride and Mother, the daughter of the stars and the Higher Garden of Eden. She is, in fine, the Queen of the borrowed light, but this is the light of all. She is the Moon nourished by the milk of the Supernal Mother.\nIn a manner, she is also the Supernal Mother herself--that is to say, she is the bright reflection. It is in this sense of reflection that her truest and highest name in bolism is Shekinah--the co-habiting glory. According to Kabalism, there is a Shekinah both above and below. In the superior world it is called Binah, the Supernal Understanding which reflects to the emanations that are beneath. In the lower world it is MaIkuth--that world being, for this purpose, understood as a blessed Kingdom that with which it is made blessed being the Indwelling Glory. Mystically speaking, the Shekinah is the Spiritual Bride of the just man, and when he reads the Law she gives the Divine meaning. There are some respects in which this card is the highest and holiest of the Greater Arcana.",
    image: getImageURL("ar02"),
    color: "#590059",
    reverse: false,
  },
  {
    type: "major",
    name_short: "ar03",
    name: "The Empress",
    value: "3",
    value_int: 3,
    meaning_up:
      "Fruitfulness, action, initiative, length of days; the unknown, clandestine; also difficulty, doubt, ignorance.",
    meaning_rev:
      "Light, truth, the unravelling of involved matters, public rejoicings; according to another reading, vacillation.",
    desc: "A stately figure, seated, having rich vestments and royal aspect, as of a daughter of heaven and earth. Her diadem is of twelve stars, gathered in a cluster. The symbol of Venus is on the shield which rests near her. A field of corn is ripening in front of her, and beyond there is a fall of water. The sceptre which she bears is surmounted by the globe of this world. She is the inferior Garden of Eden, the Earthly Paradise, all that is symbolized by the visible house of man. She is not Regina coeli, but she is still refugium peccatorum, the fruitful mother of thousands. There are also certain aspects in which she has been correctly described as desire and the wings thereof, as the woman clothed with the sun, as Gloria Mundi and the veil of the Sanctum Sanctorum; but she is not, I may add, the soul that has attained wings, unless all the symbolism is counted up another and unusual way. She is above all things universal fecundity and the outer sense of the Word. This is obvious, because there is no direct message which has been given to man like that which is borne by woman; but she does not herself carry its interpretation.\nIn another order of ideas, the card of the Empress signifies the door or gate by which an entrance is obtained into this life, as into the Garden of Venus; and then the way which leads out therefrom, into that which is beyond, is the secret known to the High Priestess: it is communicated by her to the elect. Most old attributions of this card are completely wrong on the symbolism--as, for example, its identification with the Word, Divine Nature, the Triad, and so forth.",
    image: getImageURL("ar03"),
    color: "#1E661E",
    reverse: false,
  },
];

const Card = ({ card }: { card: any }): JSX.Element => (
  <div style={styles.card}>
    <div style={styles.cardImageWrapper}>
      <img
        src={card.image}
        alt={card.name}
        width={288}
        style={styles.cardImage}
      />
      <div
        style={{
          ...styles.cardImageCover,
          background: card.color,
          // mixBlendMode: "color", // FIXME: not supported in satori
          opacity: 0.5,
        }}
      />
      <div
        style={{
          ...styles.cardImageCover,
          boxShadow: `inset 0 0 9px 16px ${card.color}`,
        }}
      />
    </div>
    <span style={styles.cardName}>{card.name}</span>
  </div>
);

const DynamicImage = ({
  firstQuestion,
  selectedCards = dummyCards,
  conclusion,
  auraImage,
}: ImageTemplateProps) => {
  return (
    <div style={styles.container} lang="en">
      {auraImage && (
        <img src={auraImage} alt="Aura background" style={styles.auraImage} />
      )}
      <div style={styles.safeZone}>
        <div style={styles.header}>
          <svg width={294} height={75} viewBox="0 0 196 50" fill="#fffbf2">
            <path d="M189.6 41c0 2.1.5 3.6 1.5 4.4 1 .8 2.3 1.2 4 1.2v1.9H176.3v-2c1.7 0 3-.3 4-1 1-.9 1.5-2.4 1.5-4.5V9c0-2.1-.5-3.6-1.5-4.3-1-.8-2.3-1.3-4-1.3V1.6h13.4V41Z" />
            <path d="M162.3 48.5v-14h-.4a25 25 0 0 1-5 10.5c-2.3 2.8-5.8 4.2-10.3 4.2-4.1 0-7.3-1.3-9.7-4-2.3-2.6-3.4-6.7-3.4-12.2 0-3 .4-5.7 1.1-8.4l30.4-3v2l-23 4.1c-.5 1.7-.7 3.7-.7 6 0 3.4.6 6 1.8 8 1.3 1.7 3.3 2.6 6 2.6 2.8 0 5.3-1.1 7.2-3.3 2-2.2 3.3-5.2 4.2-8.8 1-3.8 1.5-8 1.5-12.5 0-4.7-.8-8.4-2.5-11-1.6-2.8-4.3-4.1-8.2-4.1-3 0-5.4.8-7 2.4a7.7 7.7 0 0 0-2.4 5.8c0 .8 0 1.6.3 2.3.3.6.6 1.2 1 1.6v.3l-7.9.9A11.6 11.6 0 0 1 139 4.5c3-2.6 7.3-3.9 13-3.9 5 0 8.9 1.1 11.4 3.4 2.7 2.2 4.3 4.8 5 8 .7 3 1 6.7 1 11v18c0 2.1.5 3.6 1.5 4.4 1 .8 2.3 1.2 4 1.2v1.9h-12.5Z" />
            <path d="M99.6 29.8H97V14h3c.5-3.5 1.9-6.6 4.2-9.3 2.3-2.7 5.5-4 9.8-4 4.6 0 8 1.4 10 4.2 2.2 2.8 3.3 6.8 3.3 12.2V41c0 2.1.5 3.6 1.5 4.4 1 .8 2.2 1.2 3.9 1.2v1.9h-18.8v-2c1.8 0 3.1-.3 4-1 1-.9 1.5-2.4 1.5-4.5V18.4c0-4.8-.5-8.2-1.6-10.3-1-2.1-3.1-3.2-6.2-3.2-3.5 0-6.4 2-8.7 5.9-2.2 4-3.3 10.3-3.3 19Zm-27.3 0h-2.7v-16h3c.5-3.3 1.9-6.3 4-9C79 2 82.4.6 86.7.6c4.5 0 7.8 1.5 9.9 4.3 2 2.8 3.1 6.8 3.1 12.2V41c0 2.1.5 3.6 1.5 4.4 1 .8 2.3 1.2 4 1.2v1.9H86.3v-2c1.7 0 3-.3 4-1 1-.9 1.5-2.4 1.5-4.5V18.4c0-4.8-.5-8.2-1.6-10.3C89.2 6 87 4.9 84 4.9c-3.4 0-6.2 2-8.4 5.8a40.2 40.2 0 0 0-3.4 19Zm0 11.2c0 2.1.5 3.6 1.5 4.4 1 .8 2.3 1.2 4 1.2v1.9H59v-2c1.7 0 3-.3 4-1 1-.9 1.5-2.4 1.5-4.5V9c0-2.1-.5-3.6-1.5-4.3a6 6 0 0 0-4-1.3V1.6h13.4V41Z" />
            <path d="M35.1 41c0 2.1.5 3.6 1.5 4.4 1 .8 2.2 1.2 3.9 1.2v1.9H21.7v-2c1.8 0 3.1-.3 4-1 1-.9 1.5-2.4 1.5-4.5V9c0-2.1-.5-3.6-1.4-4.3a6 6 0 0 0-4-1.3V1.6h13.4V41Zm.2-22.7c.8-4.7 2.3-8.7 4.5-12.2C42 2.7 45.2 1 49.2 1c1.8 0 3.4.4 4.9 1a7 7 0 0 1 3.3 2.6L54.3 13l-.7-.2a5 5 0 0 0-1.6-4c-1-1.1-2.7-1.7-4.8-1.7-3.6 0-6.5 2-8.8 6.3a48.8 48.8 0 0 0-3.3 21.2h-2.7V18.3h3Z" />
            <path d="M14 41c0 2.1.4 3.6 1.4 4.4 1 .8 2.3 1.2 4 1.2v1.9H.6v-2c1.7 0 3-.3 4-1C5.6 44.5 6 43 6 41V9c0-2.1-.5-3.6-1.5-4.3-1-.8-2.3-1.3-4-1.3V1.6H14V41Z" />
          </svg>
          <div style={styles.headline}>Gen AI x tarot reading</div>
        </div>
        <div style={styles.content}>
          {firstQuestion?.length > 0 && (
            <div style={styles.textBlock}>
              <div style={styles.textBlockHeader}>Your Question</div>
              <div style={styles.textBlockText}>{firstQuestion}</div>
            </div>
          )}
          {selectedCards.length > 0 && (
            <div style={styles.textBlock}>
              <div style={styles.textBlockHeader}>Your Cards</div>
              <div style={styles.cards}>
                <Card card={selectedCards[0]} />
                <Card card={selectedCards[1]} />
                <Card card={selectedCards[2]} />
              </div>
            </div>
          )}
          {conclusion?.length > 0 && (
            <div style={styles.textBlock}>
              <div style={styles.textBlockHeader}>Your Conclusion</div>
              <div style={styles.textBlockText}>
                {conclusion.startsWith(": ") ? conclusion.slice(2) : conclusion}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicImage;
