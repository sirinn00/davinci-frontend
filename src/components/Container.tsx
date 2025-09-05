import type { PropsWithChildren, CSSProperties } from "react";

const containerStyle: CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "0 16px",
};

export default function Container({ children }: PropsWithChildren) {
  return <div style={containerStyle}>{children}</div>;
}
