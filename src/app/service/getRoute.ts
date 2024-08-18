import { Coordinate } from "../Map/page";
import api from "./axios";

export const getRoute = {
  get(bounds: Coordinate[]): Promise<Coordinate[]> {
    return api.get("/api/path", { params: { bounds } });
  },
  walk(a: Coordinate[]): Promise<Coordinate[]> {
    console.log("🚀 ~ walk ~ a:", a);
    return api.get("/api/path/walk", { params: { a } });
  },
};
