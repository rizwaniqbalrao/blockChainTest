import { Response } from "miragejs";

export const paymentHandler = function (schema, request) {
    try {
      const attributes = JSON.parse(request.requestBody);
      console.log("Received payment data:", attributes);
  
      return {
        status: "ok",
        message: "Payment received",
        txHash: attributes.txHash || "no-txHash",
        sender: attributes.sender || "no-sender"
      };
    } catch (err) {
      return new Response(
        400,
        {},
        {
          status: "error",
          message: "Invalid request body",
        }
      );
    }
  };
  