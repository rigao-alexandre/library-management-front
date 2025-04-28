import { APIBaseService } from "./apiService";
import { z } from "zod";

export class BookService extends APIBaseService {
  constructor() {
    super("books");
  }
}
