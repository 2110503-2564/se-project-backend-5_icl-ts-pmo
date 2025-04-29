import { Request } from "express";

export function readPagination(req: Request, defaultLimit = 25) {
  return { page: Number(req.query.page) || 0, limit: Number(req.query.limit) || defaultLimit };
}

export function validateRegex(value: string) {
  try {
    new RegExp(value);
  } catch {
    return "^$.";
  }
  return value;
}
