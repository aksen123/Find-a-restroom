import pool from "@/lib/db";
import { PublicRestroom } from "@/types/service";
import { NextRequest } from "next/server";

export type RestroomsData = Pick<
  PublicRestroom,
  "toilet_name" | "latitude" | "longitude" | "detailed_opening_hours"
>;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  let searchBounds: number[] = [];
  searchParams.forEach((el) => searchBounds.push(+el));

  const conn = await pool.getConnection();
  const rows: RestroomsData = await conn.execute(
    `SELECT toilet_name, latitude, longitude, detailed_opening_hours
    FROM public_restrooms
    WHERE latitude BETWEEN ? AND ?
    AND longitude BETWEEN ? AND ?`,
    searchBounds
  );

  conn.release();
  console.log(rows, searchBounds);

  return Response.json({ data: rows });
}
