import { z } from "zod";
import { APIBaseService } from "./apiService";
import {
  MemberSchema,
  type MemberFormSchema,
} from "@/features/members/model/member";

export class MemberService extends APIBaseService {
  constructor() {
    super("members");
  }

  async create(data: MemberFormSchema) {
    return super._create(data, MemberSchema);
  }

  async getAll() {
    return super._getAll(z.array(MemberSchema));
  }

  async getByID(id: number) {
    return super._getByID(id, MemberSchema);
  }

  async update(id: number, data: MemberFormSchema) {
    return super._update(id, MemberSchema);
  }

  async delete(id: number) {
    return super._delete(id);
  }
}
