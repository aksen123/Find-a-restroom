import pool from "@/lib/db";
import { PublicRestroom } from "@/types/service";
import { NextRequest } from "next/server";

export interface RestroomsData {
  name: string;
  lat: number;
  lng: number;
  time: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  console.log("🚀 ~ GET ~ searchParams:", searchParams);
  let searchBounds: number[] = [];
  searchParams.forEach((el) => searchBounds.push(+el));

  const conn = await pool.getConnection();
  const rows: RestroomsData = await conn.execute(
    `SELECT toilet_name AS name, latitude AS lat, longitude AS lng,detailed_opening_hours AS time
    FROM public_restrooms
    WHERE latitude BETWEEN ? AND ?
    AND longitude BETWEEN ? AND ?`,
    searchBounds
  );

  conn.release();

  return Response.json({ data: rows });
}
