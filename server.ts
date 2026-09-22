import express from "express";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // ==========================================
  // API ROUTES (Always placed before Vite)
  // ==========================================

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      time: new Date().toISOString(),
      appName: "SMK YAPEK Gombong Portal",
      version: "2026.1"
    });
  });

  // Get active database configuration summary
  app.get("/api/db/config", (req, res) => {
    const dbClient = process.env.DB_CLIENT || "mysql";
    const isMysql = dbClient.toLowerCase() === "mysql";

    res.json({
      client: isMysql ? "mysql" : "postgresql",
      host: process.env.DB_HOST || (isMysql ? "127.0.0.1" : "localhost"),
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : (isMysql ? 3306 : 5432),
      database: process.env.DB_NAME || "smk_yapek_db",
      user: process.env.DB_USER || (isMysql ? "root" : "yapek_admin"),
      ssl: process.env.DB_SSL === "true",
      isXamppDefault: isMysql && (!process.env.DB_USER || process.env.DB_USER === "root")
    });
  });

  // Test MySQL / XAMPP Database Connection
  app.post("/api/db/test-connection", async (req, res) => {
    const {
      client = "mysql",
      host = "127.0.0.1",
      port = 3306,
      user = "root",
      password = "",
      database = "smk_yapek_db"
    } = req.body || {};

    if (client === "mysql") {
      try {
        const mysql = await import("mysql2/promise");
        
        // Attempt connection with 4-second timeout
        const connection = await mysql.createConnection({
          host: host || "127.0.0.1",
          port: Number(port) || 3306,
          user: user || "root",
          password: password || "",
          database: database || "smk_yapek_db",
          connectTimeout: 4000
        });

        const [rows] = await connection.query("SELECT VERSION() AS mysql_version, DATABASE() as db_name, NOW() as current_server_time");
        await connection.end();

        return res.json({
          success: true,
          message: "Koneksi ke database MySQL / XAMPP berhasil!",
          data: rows,
          details: {
            host,
            port,
            user,
            database
          }
        });
      } catch (err: any) {
        console.error("MySQL connection error:", err.message);
        return res.json({
          success: false,
          message: `Gagal terhubung ke MySQL: ${err.message}`,
          code: err.code || "CONNECTION_FAILED",
          hint: err.code === "ECONNREFUSED"
            ? "Port 3306 ditolak. Pastikan modul MySQL di XAMPP Control Panel sudah di-Start (tombol Start berwarna hijau)."
            : err.code === "ER_BAD_DB_ERROR"
            ? `Database '${database}' belum dibuat. Silakan buka http://localhost/phpmyadmin dan buat database '${database}'.`
            : err.code === "ER_ACCESS_DENIED_ERROR"
            ? "Username atau Password salah. Bawaan instalasi XAMPP baru umumnya menggunakan user 'root' tanpa password."
            : "Pastikan XAMPP terinstal dan layanan MySQL berjalan pada port 3306."
        });
      }
    }

    // Default fallback response
    return res.json({
      success: false,
      message: `Driver '${client}' tidak didukung untuk tes koneksi langsung ini.`
    });
  });

  // Export MySQL SQL dump file directly
  app.get("/api/db/export/mysql", (req, res) => {
    const filePath = path.join(process.cwd(), "database_mysql_xampp.sql");
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Disposition", 'attachment; filename="database_mysql_xampp.sql"');
      res.setHeader("Content-Type", "application/sql; charset=utf-8");
      return res.sendFile(filePath);
    }
    return res.status(404).json({ error: "File database_mysql_xampp.sql tidak ditemukan" });
  });

  // Export Native PHP files directly
  app.get("/api/db/export/xampp-file", (req, res) => {
    const filename = String(req.query.file || "index.php").replace(/[^a-zA-Z0-9_.-]/g, "");
    const allowed = ["index.php", "koneksi.php", "ppdb.php", "admin.php", "berita.php", "README_XAMPP.md", "database_mysql_xampp.sql"];
    
    if (!allowed.includes(filename)) {
      return res.status(400).json({ error: "File tidak diizinkan untuk diunduh." });
    }

    const filePath = path.join(process.cwd(), "xampp", filename);
    const rootPath = path.join(process.cwd(), filename);
    const targetPath = fs.existsSync(filePath) ? filePath : rootPath;

    if (fs.existsSync(targetPath)) {
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", filename.endsWith(".sql") ? "application/sql" : "text/plain; charset=utf-8");
      return res.sendFile(targetPath);
    }
    return res.status(404).json({ error: `File ${filename} tidak ditemukan.` });
  });

  // ==========================================
  // VITE OR STATIC FILE SERVING
  // ==========================================
  const isProd = process.env.NODE_ENV === "production" || (Boolean(process.argv[1]) && process.argv[1].includes("dist"));

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
