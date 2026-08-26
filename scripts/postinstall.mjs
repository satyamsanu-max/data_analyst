/**
 * Generate the Prisma client after install — without letting a failure abort
 * the whole install.
 *
 * On Windows this reliably breaks when a dev server is already running: Prisma
 * writes the query engine to a temp file and renames it into place, and Windows
 * refuses to rename a DLL that a live process has open. npm then reports
 *
 *   EPERM: operation not permitted, rename '...query_engine-windows.dll.node.tmp1234'
 *   npm error command failed ... prisma generate
 *
 * and exits non-zero, so the install "fails" even though every package landed
 * correctly. `npm run dev` regenerates the client anyway, so a failure here is
 * a warning, not a fatal error.
 */

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

try {
  const pkgJsonPath = require.resolve("prisma/package.json", { paths: [root] });
  const { bin } = require(pkgJsonPath);
  const rel = typeof bin === "string" ? bin : bin.prisma;
  execFileSync(process.execPath, [join(dirname(pkgJsonPath), rel), "generate"], {
    cwd: root,
    stdio: "inherit",
  });
} catch (err) {
  const message = String(err?.message ?? err);
  const locked = /EPERM|EBUSY|operation not permitted|resource busy/i.test(message);

  console.warn("\n" + "-".repeat(70));
  console.warn("Could not generate the Prisma client during install.");
  if (locked) {
    console.warn(
      "\nA dev server is almost certainly still running and holding the query\n" +
        "engine open. Windows will not let Prisma replace a file that is in use.\n" +
        "\nStop it and try again:\n" +
        "  Windows :  taskkill /IM node.exe /F\n" +
        "  macOS   :  pkill -f 'next dev'\n" +
        "  Linux   :  pkill -f 'next dev'\n",
    );
  } else {
    console.warn("\n" + message.split("\n").slice(0, 4).join("\n") + "\n");
  }
  console.warn("The install itself is fine. `npm run dev` will generate the client.");
  console.warn("-".repeat(70) + "\n");
  // Deliberately exit 0: the packages installed correctly, and the next step
  // regenerates. Failing here sends people down a rabbit hole for nothing.
}
