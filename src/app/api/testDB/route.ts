import axios from "axios";
import fs from "fs";
import path from "path";

export async function GET() {
  const name = "seoul.csv";
  const readPath = path.join(
    process.cwd(),
    "src",
    "app",
    "api",
    "testDB",
    name
  );
  const writePath = path.join(
    process.cwd(),
    "src",
    "app",
    "api",
    "testDB",
    "seoul_new.csv"
  );
  const writePath2 = path.join(
    process.cwd(),
    "src",
    "app",
    "api",
    "testDB",
    "testDB.csv"
  );
  const csv = fs.readFileSync(readPath, "utf-8").split(/\n/);
  const result: any[] = [];
  const errTest: any[] = [];

  result.push(csv[0]);
  errTest.push(csv[0]);
  for (let i = 1; i < csv.length; i++) {
    const arr = csv[i].split(",");
    if (+arr[20] === 0) {
      const address = arr[4].length <= 4 ? arr[5] : arr[4];
      const test = await getGeocode(address.replace(/"/g, ""));
      if (test === false) {
        errTest.push(arr.join(","));
      } else {
        arr[20] = test.lat;
        arr[21] = test.lng;
        result.push(arr.join(","));
      }
    } else {
      result.push(arr.join(","));
    }
  }

  console.log(errTest.length, result);

  fs.writeFile(writePath, result.join("\n"), "utf-8", (err) => {
    if (err) {
      console.error("Error writing to CSV file:", err);
    } else {
      console.log("Write to CSV successfully!");
    }
  });
  fs.writeFile(writePath2, errTest.join("\n"), "utf-8", (err) => {
    if (err) {
      console.error("Error writing to CSV file:", err);
    } else {
      console.log("Write to CSV successfully!");
    }
  });
  return Response.json({ data: 123123 });
}

const getGeocode = async (address: string) => {
  if (address === "") return false;
  const response = await axios.get(
    "https://dapi.kakao.com/v2/local/search/address.json",
    {
      params: {
        query: address,
        page: 1,
        size: 10,
      },
      headers: {
        Authorization: "KakaoAK cf6d2026face7a19e0a4d818ce63abca",
        Ka: "sdk/4.4.19 os/javascript lang/ko device/MacIntel origin/https%3A%2F%2Fdeveapp.com",
      },
    }
  );
  if (response.data.documents.length === 0) {
    // console.log(address, "오류!!!");
    return false;
  }
  return {
    lat: response.data.documents[0].y,
    lng: response.data.documents[0].x,
  };
};
