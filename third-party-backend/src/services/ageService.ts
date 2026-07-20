import { ResponseObject } from "../utils/constants";


export const fetchAge = async (
  dob: string,
  queryMode: string | undefined,
  _resp: ResponseObject
) => {
  try {
    const mode = (queryMode || "callback").toLowerCase();
    console.log(`[ageService] mode=${mode} dob=${dob}`);

    switch (mode) {
      case "callback":
      case "polling":
      case "webhook":
      case "mqtt":
        return {
          error: true,
          error_message: `${mode} mode is not implemented yet on third-party-backend`,
        };
      default:
        return {
          error: true,
          error_message: `Invalid mode: ${mode}`,
        };
    }
  } catch (error: any) {
    return {
      error: true,
      error_message: error.message || "Failed to resolve age",
    };
  }
};
