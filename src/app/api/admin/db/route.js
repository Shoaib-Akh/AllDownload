import { store } from "../../../../db/store.js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get("table");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const platform = searchParams.get("platform") || "all";
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // If no table requested, return list of tables with row counts and descriptions
    if (!table) {
      const tables = store.getTableList();
      return Response.json({
        success: true,
        tables,
        databaseName: "savefrompro-d1 (Production / Edge Memory Store)",
        engine: "Cloudflare D1 / Reactive Store",
        timestamp: new Date().toISOString(),
      });
    }

    const data = store.getTableData(table, {
      limit,
      offset,
      search,
      status,
      platform,
    });

    if (data.error) {
      return Response.json({ success: false, error: data.error }, { status: 404 });
    }

    return Response.json({
      success: true,
      ...data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message || "Failed to inspect database" },
      { status: 500 }
    );
  }
}
