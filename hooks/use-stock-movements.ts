import { useEffect, useState } from "react";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

export type StockMovement = {
  id: string;
  productName: string;
  movementType: "IN" | "OUT" | "ADJUST";
  quantity: number;
  beforeQuantity: number | null;
  afterQuantity: number | null;
  description: string | null;
  createdAt: string;
};

type StockMovementRow = {
  id: string;
  movement_type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  before_quantity: number | null;
  after_quantity: number | null;
  description: string | null;
  created_at: string;
  products?: { name: string } | { name: string }[] | null;
};

function getProductName(row: StockMovementRow) {
  if (Array.isArray(row.products)) return row.products[0]?.name ?? "-";
  return row.products?.name ?? "-";
}

export function useStockMovements() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovements = async () => {
      if (!supabase || !hasSupabaseConfig) {
        setError("ยังไม่ได้ตั้งค่า Supabase");
        setMovements([]);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: movementError } = await supabase
        .from("stock_movements")
        .select("*, products(name)")
        .order("created_at", { ascending: false });

      if (movementError) {
        console.error("Supabase stock_movements error", movementError);
        setError(movementError.message);
        setMovements([]);
        setLoading(false);
        return;
      }

      setMovements(
        ((data ?? []) as unknown as StockMovementRow[]).map((row) => ({
          id: row.id,
          productName: getProductName(row),
          movementType: row.movement_type,
          quantity: row.quantity,
          beforeQuantity: row.before_quantity,
          afterQuantity: row.after_quantity,
          description: row.description,
          createdAt: row.created_at
        }))
      );
      setLoading(false);
    };

    void loadMovements();
  }, []);

  return { movements, loading, error };
}
