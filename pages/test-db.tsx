import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

type CategoryRow = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  created_at?: string;
  updated_at?: string;
};

type TestState = {
  loading: boolean;
  connected: boolean;
  error: string | null;
  warning: string | null;
  categories: CategoryRow[];
  categoryCount: number;
  productCount: number;
  queryTimeMs: number | null;
};

const initialState: TestState = {
  loading: true,
  connected: false,
  error: null,
  warning: null,
  categories: [],
  categoryCount: 0,
  productCount: 0,
  queryTimeMs: null
};

export default function TestDbPage() {
  const [state, setState] = useState<TestState>(initialState);

  useEffect(() => {
    const testConnection = async () => {
      if (!supabase || !hasSupabaseConfig) {
        setState({
          ...initialState,
          loading: false,
          error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
        });
        return;
      }

      const startedAt = performance.now();

      const { data: categories, error: categoriesError, count: categoryCount } = await supabase
        .from("categories")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: true });

      if (categoriesError) {
        console.error("Supabase categories error", categoriesError);
        setState({
          ...initialState,
          loading: false,
          error: categoriesError.message,
          queryTimeMs: Math.round(performance.now() - startedAt)
        });
        return;
      }

      const { error: productsError, count: productCount } = await supabase.from("products").select("*", { count: "exact", head: true });

      if (productsError) {
        console.error("Supabase products error", productsError);
        setState({
          ...initialState,
          loading: false,
          error: productsError.message,
          queryTimeMs: Math.round(performance.now() - startedAt)
        });
        return;
      }

      const nextCategories = (categories ?? []) as CategoryRow[];
      const nextCategoryCount = categoryCount ?? nextCategories.length;
      const nextProductCount = productCount ?? 0;

      console.log("Supabase Connected");
      console.log(nextCategories);

      setState({
        loading: false,
        connected: true,
        error: null,
        warning:
          nextCategoryCount === 0
            ? "Connected to Supabase, but no category rows are visible to the frontend. If Supabase Table Editor has rows, run supabase/rls-policies.sql to allow anon reads."
            : null,
        categories: nextCategories,
        categoryCount: nextCategoryCount,
        productCount: nextProductCount,
        queryTimeMs: Math.round(performance.now() - startedAt)
      });
    };

    void testConnection();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Supabase Test Connection</p>
            <h1 className="mt-1 text-2xl font-semibold">Database Connection Status</h1>
          </div>
          {state.connected ? (
            <Badge variant={state.warning ? "amber" : "green"}>{state.warning ? "Connected - No Visible Data" : "Database Connected"}</Badge>
          ) : (
            <Badge variant="red">Not Connected</Badge>
          )}
        </div>

        {state.loading ? (
          <Card>
            <CardContent className="p-6 text-sm text-slate-500">Checking Supabase connection...</CardContent>
          </Card>
        ) : state.connected ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${state.warning ? "text-amber-700" : "text-emerald-700"}`}>
                  {state.warning ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  {state.warning ? "Connected, but data is not visible" : "Database Connected"}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                <SummaryItem icon={Database} label="Categories" value={state.categoryCount} />
                <SummaryItem icon={Database} label="Products" value={state.productCount} />
                <SummaryItem icon={Clock} label="Query Time" value={`${state.queryTimeMs ?? 0} ms`} />
              </CardContent>
            </Card>

            {state.warning ? (
              <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-200">
                    <AlertTriangle className="h-5 w-5" />
                    Data visibility warning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-amber-800 dark:text-amber-100">
                  <p>{state.warning}</p>
                  <p>If this page shows 0 while Supabase Table Editor has rows, the environment is correct but Row Level Security is blocking the anon client.</p>
                </CardContent>
              </Card>
            ) : null}

            <Card>
              <CardHeader>
                <CardTitle>Category Names</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {state.categories.length > 0 ? (
                    state.categories.map((category) => (
                      <Badge key={category.id} variant="blue">
                        {category.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No categories are visible to the frontend client.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>First 5 Categories</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800">
                    <tr>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Description</th>
                      <th className="py-2 pr-4">Icon</th>
                      <th className="py-2 pr-4">Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.categories.slice(0, 5).map((category) => (
                      <tr key={category.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-3 pr-4 font-medium">{category.name}</td>
                        <td className="py-3 pr-4 text-slate-500">{category.description ?? "-"}</td>
                        <td className="py-3 pr-4">{category.icon ?? "-"}</td>
                        <td className="py-3 pr-4">{category.color ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-200">
                <AlertTriangle className="h-5 w-5" />
                Supabase Connection Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-rose-700 dark:text-rose-200">
              <p>{state.error}</p>
              <p>Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

function SummaryItem({ icon: Icon, label, value }: { icon: typeof Database; label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
