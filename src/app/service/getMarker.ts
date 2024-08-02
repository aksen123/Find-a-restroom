import { RestRooms } from "../api/restrooms/route";
import api from "./axios";

export interface Param {
  sw_lat: number;
  ne_lat: number;
  sw_lng: number;
  ne_lng: number;
}

export const getMarker = {
  get(a: Param): Promise<RestRooms[]> {
    return api.get("/api/restrooms", { params: a });
  },
};
