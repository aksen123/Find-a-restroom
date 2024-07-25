import pool from "@/lib/db";
import { NextRequest } from "next/server";

export interface RestRooms {
  toilet_name: string;
  latitude: number;
  longitude: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  let searchBounds: number[] = [];
  searchParams.forEach((el) => searchBounds.push(+el));

  const conn = await pool.getConnection();
  const rows: RestRooms = await conn.execute(
    `SELECT toilet_name, latitude, longitude
    FROM public_restrooms
    WHERE latitude BETWEEN ? AND ?
    AND longitude BETWEEN ? AND ?`,
    searchBounds
  );
  // const rows = await conn.query("SELECT * FROM public_restrooms WHERE id=939;");

  conn.release();
  console.log(rows, searchBounds);

  return Response.json({ data: rows });
}
