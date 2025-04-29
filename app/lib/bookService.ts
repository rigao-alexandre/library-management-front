import {
  BookCheckoutSchema,
  type BookFormSchema,
  BookSchema,
} from "@/features/books/model/book";
import { APIBaseService } from "./apiService";
import { z } from "zod";
import {
  HistorySchema,
  HistoryWithRelated,
} from "@/features/history/model/history";

export class BookService extends APIBaseService {
  constructor() {
    super("books");
  }

  async create(data: BookFormSchema) {
    return super._create(data, BookSchema);
  }

  async getAll() {
    return super._getAll(z.array(BookSchema));
  }

  async getByID(id: number) {
    return super._getByID(id, BookSchema);
  }

  async update(id: number, data: BookFormSchema) {
    return super._update(id, BookSchema);
  }

  async delete(id: number) {
    return super._delete(id);
  }

  async getAllHistory(id: number) {
    const responseData = await this.makeRequest(
      `/${this.model}/${id}/history`,
      {
        method: "GET",
      }
    );

    const parsedResult = z.array(HistoryWithRelated).safeParse(responseData);

    if (parsedResult.success) {
      return parsedResult.data;
    }

    throw new Error(`Unexpected response shape`);
  }

  async checkOut(id: number, data: BookCheckoutSchema) {
    const responseData = await this.makeRequest(
      `/${this.model}/${id}/check-out`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    const parsedResult = HistorySchema.safeParse(responseData);

    if (parsedResult.success) {
      return parsedResult.data;
    }

    throw new Error(`Unexpected response shape`);
  }

  async checkIn(id: number) {
    const responseData = await this.makeRequest(
      `/${this.model}/${id}/check-in`,
      {
        method: "POST",
      }
    );

    const parsedResult = HistorySchema.safeParse(responseData);

    if (parsedResult.success) {
      return parsedResult.data;
    }

    throw new Error(`Unexpected response shape`);
  }
}
