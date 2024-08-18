import { RestroomsData } from "../api/restrooms/route";
import { Coordinate } from "../Map/page";
import api from "./axios";

export interface Range {
  sw_lat: number;
  ne_lat: number;
  sw_lng: number;
  ne_lng: number;
}

export const getMarker = {
  get(range: Range): Promise<RestroomsData[]> {
    return api.get("/api/restrooms", { params: range });
  },
};
