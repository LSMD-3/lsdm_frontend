import React, { ReactNode } from "react";

interface FlexBoxProps {
  children: ReactNode;
  direction?: "column" | "column-reverse" | "row" | "row-reverse";
  flex?: number;
  alignItems?:
    | "center"
    | "end"
    | "flex-end"
    | "flex-start"
    | "self-end"
    | "self-start"
    | "start"
    | "baseline"
    | "normal"
    | "stretch";
  justifyContent?:
    | "center"
    | "left"
    | "normal"
    | "right"
    | "space-around"
    | "space-between"
    | "space-evenly"
    | "stretch"
    | "space-around"
    | "space-between"
    | "space-evenly"
    | "stretch";
  style?: React.CSSProperties;
}

// i want to make

// [][][]

// []
// []
// []

// -- [] --

// [       ]

export default function FlexBox({
  children,
  flex,
  direction,
  alignItems,
  justifyContent,
  style,
}: FlexBoxProps) {
  let appliedStyle: React.CSSProperties = {
    display: "flex",
    flex,
    flexDirection: direction,
    alignItems: alignItems ?? "center",
    justifyContent: justifyContent,
    marginTop: 20,
    background: false ? "#aaa" : undefined,
  };
  appliedStyle = { ...appliedStyle, ...style };
  return <div style={appliedStyle}>{children}</div>;
}
