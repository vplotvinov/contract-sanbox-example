import { Address } from "ton-core";

export const zeroAddress = new Address(0, Buffer.alloc(32, 0));
