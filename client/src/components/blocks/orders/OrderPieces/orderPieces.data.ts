import type { OrderPieceUpdateTypes } from "./orderPieces.types";

export const OrderPieceUpdate: OrderPieceUpdateTypes = {
  submitButton: {
    label: "Зачувај димензии",
    style: "tertiary",
  },

  filedsData: [
    {
      name: "width",
      type: "number",
      label: "Ширина",
      placeholder: "пример: 2.5",
      rules: {
        required: "Ширината е задолжителна",
        min: {
          value: 0.01,
          message: "Ширината мора да биде поголема од 0",
        },
      },
      width: "2",
    },
    {
      name: "height",
      type: "number",
      label: "Висина",
      placeholder: "пример: 3",
      rules: {
        required: "Висината е задолжителна",
        min: {
          value: 0.01,
          message: "Висината мора да биде поголема од 0",
        },
      },
      width: "2",
    },
    {
      name: "pieceNote",
      type: "text",
      filedType: "textarea",
      label: "Забелешка",
      placeholder: "Внеси забелешка за парчето",
      width: "1",
    },
  ],

  notification: {
    success: {
      title: "Успешно ажурирање",
      text: "Димензиите се успешно зачувани.",
    },
    error: {
      title: "Грешка",
      text: "Димензиите не беа зачувани. Обидете се повторно.",
    },
  },
};
