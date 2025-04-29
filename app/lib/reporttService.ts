import { APIBaseService } from "./apiService";
import { Dashboard } from "@/features/dashboard/model/report";

export class ReporttService extends APIBaseService {
  constructor() {
    super("report");
  }

  async index() {
    const responseData = await this.makeRequest(`/${this.model}`, {
      method: "GET",
    });

    const parsedResult = Dashboard.safeParse(responseData);

    if (parsedResult.success) {
      return parsedResult.data;
    }

    throw new Error(`Unexpected response shape`);
  }
}
