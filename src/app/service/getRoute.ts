import { Coordinate } from "../Map/page";
import api from "./axios";

export const getRoute = {
  get(bounds: Coordinate[]): Promise<Coordinate[]> {
    return api.get("/api/path", { params: { bounds } });
  },
  walk(bounds: Coordinate[]): Promise<Coordinate[]> {
    return api.get("/api/path/walk", { params: { bounds } });
  },
};
