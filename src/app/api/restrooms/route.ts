import pool from "@/lib/db";
import { PublicRestroom } from "@/types/service";
import { NextRequest } from "next/server";

export interface RestroomsData {
  name: string;
  lat: number;
  lng: number;
  open_time: string;
  detail_time: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  console.log("🚀 ~ GET ~ searchParams:", searchParams);
  let searchBounds: number[] = [];
  searchParams.forEach((el) => searchBounds.push(+el));

  const conn = await pool.getConnection();
  const rows: RestroomsData = await conn.execute(
    `SELECT toilet_name AS name, latitude AS lat, longitude AS lng,opening_hours AS open_time ,detailed_opening_hours AS detail_time
    FROM public_restrooms
    WHERE latitude BETWEEN ? AND ?
    AND longitude BETWEEN ? AND ?`,
    searchBounds
  );

  conn.release();

  return Response.json({ data: rows });
}
