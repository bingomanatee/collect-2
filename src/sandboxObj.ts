import { sandbox } from "./types";

export const sandboxObj: sandbox = {
  create: (value: any) => {
    throw new Error("must be replaced with a real creator");
  }
};
