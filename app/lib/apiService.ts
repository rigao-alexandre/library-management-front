import { z } from "zod";
// import { fromError } from "zod-validation-error";

// import { config } from "@/config.server";
import { fetcher } from "./fetcher";

type OtherOptions = {
  parseResponseAsJson?: boolean;
};

export class APIBaseService {
  constructor(private model: string) {}

  protected async makeRequest(
    route: string,
    reqOptions?: RequestInit,
    otherOptions?: OtherOptions
  ) {
    const url = new URL(
      route,
      import.meta.env.VITE_API_URL ?? "http://localhost:3000"
    ); // TODO: check
    const { parseResponseAsJson = true } = otherOptions || {};

    const defaultOptions: RequestInit = {
      method: "GET",
      cache: "no-store",
      headers: {
        ...reqOptions?.headers,
        "Content-Type": "application/json",
        "Api-Key": "challenge", // TODO: check
      },
    };

    const finalOptions: RequestInit = { ...defaultOptions, ...reqOptions };
    const response = await fetcher(url, finalOptions).then(async (res) => {
      if (res.ok && parseResponseAsJson) {
        return res.json().catch((err: Error) => {
          throw new Error("Error while parsing response as JSON");
        }) as Promise<unknown>;
      }

      if (res.status >= 400) {
        // Clone the response first since reading the body is a one-time operation
        const clonedRes = res.clone();
        try {
          // Extract the response body text
          //   const errorBody = await clonedRes.text();
          //   logger.error(
          //     { url, request: reqOptions?.body, response: errorBody },
          //     `Request failed with status ${res.status}`
          //   );
        } catch (bodyReadError) {
          //   logger.error(
          //     { url, request: reqOptions?.body, bodyReadError },
          //     `Failed to read error response body`
          //   );
        }

        throw new Error(`ErrorResponse ${res.status}: ${res.statusText}`);
      }

      return res;
    });

    return response;
  }

  async create<T>(data: T, validator: z.ZodType<T> = z.any()) {
    const responseData = await this.makeRequest(`/${this.model}`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const parsedResult = validator.safeParse(responseData);

    if (parsedResult.success) {
      return parsedResult.data;
    }

    throw new Error(`Unexpected response shape`);
  }

  async getAll<T>(validator: z.ZodType<T> = z.any()) {
    const responseData = await this.makeRequest(`/${this.model}`, {
      method: "GET",
    });

    const parsedResult = validator.safeParse(responseData);

    if (parsedResult.success) {
      return parsedResult.data;
    }

    throw new Error(`Unexpected response shape`);
  }

  async getByID<T>(id: number, validator: z.ZodType<T> = z.any()) {
    const responseData = await this.makeRequest(`/${this.model}/${id}`, {
      method: "GET",
    });

    const parsedResult = validator.safeParse(responseData);

    if (parsedResult.success) {
      return parsedResult.data;
    }

    throw new Error(`Unexpected response shape`);
  }

  async update<T>(id: number, data: T, validator: z.ZodType<T> = z.any()) {
    const responseData = await this.makeRequest(`/${this.model}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    const parsedResult = validator.safeParse(responseData);

    if (parsedResult.success) {
      return parsedResult.data;
    }

    throw new Error(`Unexpected response shape`);
  }

  async delete<T>(id: number, validator: z.ZodType<T> = z.any()) {
    const responseData = await this.makeRequest(`/${this.model}/${id}`, {
      method: "DELETE",
    });

    const parsedResult = validator.safeParse(responseData);

    if (parsedResult.success) {
      return parsedResult.data;
    }

    throw new Error(`Unexpected response shape`);
  }
}
