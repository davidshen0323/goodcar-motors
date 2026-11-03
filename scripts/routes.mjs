import { copyFile } from "node:fs/promises";
await copyFile("dist/index.html", "dist/admin.html");
