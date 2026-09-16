import React from "react";

/**
 * Production me ek bhi render error pura page white kar deta tha.
 * Ab fallback UI dikhta hai aur error console me jaata hai.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[desire-lounge] render error:", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="lounge-page lounge-error" role="alert">
        <div style={{ padding: "48px 24px", textAlign: "center", color: "#fff" }}>
          <h1 style={{ fontSize: "20px", marginBottom: "12px" }}>Kuch galat ho gaya</h1>
          <p style={{ opacity: 0.8, marginBottom: "20px" }}>
            Page load nahi ho paya. Please refresh karein.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 22px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.35)",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
}
