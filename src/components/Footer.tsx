import { Box } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        color: "#00ff00",
        padding: 2,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          fontFamily: "'Courier New', monospace",
          whiteSpace: "pre-wrap",
          fontSize: { xs: "0.8rem", md: "1rem" },
          maxWidth: "90%",
          "& a": {
            color: "#00ff00",
            textDecoration: "none",
            transition: "color 0.3s ease",
          },
          "& a:hover": {
            color: "#00cc00",
          },
        }}
      >
        {`Omnia - v0.0.1 | © 2025 Buberry Worldwide`}
        <br />
        Built on Hedera |{" "}
        <a
          href="https://buberryworldwide.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.buberryworldwide.com
        </a>
        <br />
        <span
          style={{
            animation: "blinker 1.8s infinite",
          }}
        >
          Gamify your impact. Grow the world.
        </span>
      </Box>
      <style>{`
        @keyframes blinker {
          50% { opacity: 0; }
        }
      `}</style>
    </Box>
  );
}
