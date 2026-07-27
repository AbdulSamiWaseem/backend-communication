import { ResponseObject } from "../utils/constants";

export const getOverview = async (resp: ResponseObject) => ({
  ...resp,
  success_message: "Admin overview retrieved",
  data: {
    message: "ADMIN",
    note: "This page is only visible to admin users.",
    status: "ok",
  },
});
