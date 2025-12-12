import { Inbound } from "inboundemail";

export const inbound = new Inbound(process.env.INBOUND_API_KEY || "");

