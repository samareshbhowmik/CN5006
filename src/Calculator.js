import React, { useMemo, useState } from "react";
import Button from "./Button";
import "./Calculator.css";

// Simple safe evaluator for a classroom calculator
const safeEval = (expression) => {
  // Allow only digits, operators, dot, brackets, and spaces
  const allowed = /^[0-9+\-*/.()\s]+$/;
  if (!allowed.test(expression)) return "Error";

  try {
    // ESLint warns about Function constructor; we suppress it here
    // because this is a controlled calculator with a strict whitelist above.
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${expression})`)();

    if (result === Infinity || Number.isNaN(result)) return "Error";
    return String(result);
  } catch {
    return "Error";
  }
};

const Calculator = () => {
  const [display, setDisplay] = useState("");
  const [showImage, setShowImage] = useState(false);

  // Button layout
  const buttons = useMemo(
    () => [
      "7", "8", "9", "/",
      "4", "5", "6", "*",
      "1", "2", "3", "-",
      "0", ".", "=", "+",
      "C", "square", "show me"
    ],
    []
  );

  const handleButtonClick = (caption) => {
    // Optional: hide image when using normal calculator actions
    if (caption !== "show me") setShowImage(false);

    switch (caption) {
      case "C":
        setDisplay("");
        return;

      case "=": {
        if (!display.trim()) return;
        setDisplay(safeEval(display));
        return;
      }

      case "square": {
        if (!display.trim()) return;

        // If display is an expression, evaluate first
        const evaluated = safeEval(display);
        if (evaluated === "Error") {
          setDisplay("Error");
          return;
        }

        const num = parseFloat(evaluated);
        if (Number.isNaN(num)) {
          setDisplay("Error");
          return;
        }

        setDisplay(String(num * num));
        return;
      }

      case "show me":
        setShowImage((prev) => !prev);
        return;

      default:
        setDisplay((prev) => prev + caption);
        return;
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">{display || "0"}</div>

        <div className="buttons-grid">
          {buttons.map((b, idx) => (
            <Button
              key={`${b}-${idx}`}
              caption={b}
              onButtonClick={handleButtonClick}
              className={
                b === "=" ? "btn-equals"
                : b === "C" ? "btn-clear"
                : b === "square" ? "btn-square"
                : b === "show me" ? "btn-show"
                : ["+", "-", "*", "/"].includes(b) ? "btn-op"
                : ""
              }
            />
          ))}
        </div>

        {showImage && (
          <div className="show-image-box">
            <img
              src="/my-picture.png"
              alt="My profile"
              className="my-picture"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
