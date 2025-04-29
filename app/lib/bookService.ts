import { type BookFormSchema, BookSchema } from "@/features/books/model/book";
import { APIBaseService } from "./apiService";
import { z } from "zod";

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
}
