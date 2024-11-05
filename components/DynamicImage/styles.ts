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
    justifyContent: "center",
    flexDirection: "column",
    flexWrap: "nowrap",
  },
  logo: {
    position: "absolute",
    top: "262px",
    left: "36px",
  },
  firstQuestion: {
    fontSize: 60,
    fontFamily: "Cirka",
    fontStyle: "normal",
    letterSpacing: "-0.025em",
    color: "white",
    marginTop: 30,
    padding: "0 10%",
    lineHeight: 1.4,
    whiteSpace: "pre-wrap",
  },
  conclusion: {
    fontSize: 40,
    fontFamily: "Poppins",
    fontStyle: "normal",
    letterSpacing: "-0.025em",
    color: "white",
    marginTop: 30,
    padding: "0 10%",
    lineHeight: 1.4,
    whiteSpace: "pre-wrap",
  },
} as const;

export default styles;
