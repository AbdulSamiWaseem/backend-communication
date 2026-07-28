import { ResponseObject } from "../utils/constants";

export const getOverview = async (resp: ResponseObject) => ({
  ...resp,
  success_message: "Admin overview retrieved",
  data: {
    message: "ADMIN",
    note: "This page requires the admin permission.",
    status: "ok",
  },
});
