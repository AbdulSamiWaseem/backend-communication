import { ResponseObject } from "../utils/constants";

export const getPage = async (page: string, resp: ResponseObject) => ({
  ...resp,
  success_message: `${page} retrieved`,
  data: {
    message: page.toUpperCase(),
    note: `This page requires the ${page} permission.`,
    status: "ok",
  },
});
