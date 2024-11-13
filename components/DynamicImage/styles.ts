import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";
import { opacity } from "html2canvas/dist/types/css/property-descriptors/opacity";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";

const styles = {
  container: {
    position: "relative",
    backgroundColor: "#0b0216",
    color: "#fffbf2",
    fontFamily: "Poppins",
    width: "100%",
    height: "100%",
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    flexWrap: "nowrap",
  },
  auraImage: {
    position: "relative",
    minWidth: "100%",
    minHeight: "100%",
    objectFit: "cover",
  },
  safeZone: {
    position: "absolute",
    width: "100%",
    height: "100%",
    padding: "250px 36px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    flexWrap: "nowrap",
  },
  header: {
    position: "absolute",
    top: "200px",
    left: "36px",
    right: "36px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headline: {
    textAlign: "right",
    fontFamily: "Cirka",
    fontStyle: "normal",
    letterSpacing: "-0.025em",
    fontSize: 60,
    lineHeight: "60px",
  },
  content: {
    position: "absolute",
    top: "305px",
    left: "36px",
    right: "36px",
    bottom: "200px",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 80,
    letterSpacing: "-0.025em",
  },
  textBlock: {
    fontSize: 80,
    fontFamily: "Cirka",
    fontStyle: "normal",
    lineHeight: 1.4,
    whiteSpace: "pre-wrap",
    display: "flex",
    flexDirection: "column",
    borderTop: "1px solid #fffbf2",
    paddingTop: 30,
    gap: 45,
  },
  textBlockHeader: {
    fontSize: 50,
    fontFamily: "Cirka",
    textTransform: "uppercase",
  },
  textBlockText: {
    width: "auto",
    margin: "0 auto",
    fontFamily: "Poppins",
    textAlign: "center",
    fontSize: 50,
    fontStyle: "normal",
    fontWeight: "300",
    lineHeight: 1,
    textWrap: "balance",
  },
  cards: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 36,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  cardImageWrapper: {
    position: "relative",
    width: 288,
    height: 493,
    borderRadius: 16,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    position: "absolute",
    padding: 12,
  },
  cardImageCover: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  cardName: {
    marginTop: 16,
    fontSize: 30,
    fontFamily: "Poppins",
    fontStyle: "italic",
    fontWeight: 400,
  },
} as const;

export default styles;