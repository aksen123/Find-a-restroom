import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: "localhost",
  user: "testman",
  password: "test123",
  database: "testdb",
  connectionLimit: 10, // 연결 풀 크기 조정
  connectTimeout: 10000, // 연결 시도 타임아웃 설정
  acquireTimeout: 10000, // 연결 풀에서 연결 가져오기 타임아웃 설정
});

export default pool;
