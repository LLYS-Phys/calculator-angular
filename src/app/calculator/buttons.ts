import { CalculatorButton } from "./button.model";

export const BUTTONS: CalculatorButton[][] = [
    [
      { label: "Percentage button", class: "operation", text: "%", event: "%" },
      { label: "7 button", class: null, text: "7", event: 7 },
      { label: "8 button", class: null, text: "8", event: 8 },
      { label: "9 button", class: null, text: "9", event: 9 },
      { label: "Division button", class: "operation", text: "÷", event: "/" }
    ],
    [
      { label: "Square root button", class: "operation", text: "√", event: "sqrt" },
      { label: "4 button", class: null, text: "4", event: 4 },
      { label: "5 button", class: null, text: "5", event: 5 },
      { label: "6 button", class: null, text: "6", event: 6 },
      { label: "Multiplication button", class: "operation", text: "x", event: "*" }
    ],
    [
      { label: "Plus/Minus button", class: "operation", text: "±", event: "+-" },
      { label: "1 button", class: null, text: "1", event: 1 },
      { label: "2 button", class: null, text: "2", event: 2 },
      { label: "3 button", class: null, text: "3", event: 3 },
      { label: "Subtraction button", class: "operation", text: "-", event: "-" }
    ],
    [
      { label: "Clear button", class: "clear", text: "C", event: "C" },
      { label: "0 button", class: null, text: "0", event: 0 },
      { label: "Decimal point button", class: null, text: ".", event: "." },
      { label: "Equal button", class: "operation", text: "=", event: "=" },
      { label: "Addition button", class: "operation", text: "+", event: "+" }
    ]
];