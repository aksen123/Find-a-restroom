import { RestroomsData } from "../api/restrooms/route";
import api from "./axios";

export interface Param {
  sw_lat: number;
  ne_lat: number;
  sw_lng: number;
  ne_lng: number;
}

export const getMarker = {
  get(a: Param): Promise<RestroomsData[]> {
    return api.get("/api/restrooms", { params: a });
  },
  test(a: any, b: any): Promise<any> {
    return api.get("/api/path", { params: a });
  },
};
