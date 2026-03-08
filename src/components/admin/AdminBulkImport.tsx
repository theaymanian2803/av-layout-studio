import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

const REQUIRED_COLS = ["id", "name", "brand", "category", "subcategory", "price", "image"];
const TEMPLATE_CSV = `id,name,brand,category,subcategory,price,original_price,image,description,in_stock,stock_count
prod-001,Example Camera,Canon,Cameras,Mirrorless,2499,,https://example.com/img.jpg,A great camera,true,10
prod-002,Example Lens,Nikon,Lenses,Prime,799,999,https://example.com/lens.jpg,Sharp prime lens,true,5`;

export const AdminBulkImport = () => {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row");
    
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const missing = REQUIRED_COLS.filter(c => !headers.includes(c));
    if (missing.length > 0) throw new Error(`Missing required columns: ${missing.join(", ")}`);

    return lines.slice(1).map((line, idx) => {
      const values = line.split(",").map(v => v.trim());
      const row: Record<string, any> = {};
      headers.forEach((h, i) => { row[h] = values[i] || ""; });
      return { row, lineNum: idx + 2 };
    });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const { row, lineNum } of rows) {
        try {
          const product = {
            id: row.id,
            name: row.name,
            brand: row.brand,
            category: row.category,
            subcategory: row.subcategory || "",
            price: parseFloat(row.price),
            original_price: row.original_price ? parseFloat(row.original_price) : null,
            image: row.image,
            images: row.image ? [row.image] : [],
            description: row.description || "",
            in_stock: row.in_stock !== "false",
            stock_count: parseInt(row.stock_count) || 0,
          };

          if (!product.name || !product.brand || !product.price || isNaN(product.price)) {
            throw new Error("Missing required fields or invalid price");
          }

          const { error } = await supabase.from("products").upsert(product, { onConflict: "id" });
          if (error) throw error;
          success++;
        } catch (err: any) {
          failed++;
          errors.push(`Line ${lineNum}: ${err.message}`);
        }
      }

      setResult({ success, failed, errors });
      if (success > 0) {
        qc.invalidateQueries({ queryKey: ["products"] });
        toast.success(`Imported ${success} products`);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Bulk Product Import</h2>
        <Button variant="outline" size="sm" onClick={downloadTemplate}>
          <Download className="h-4 w-4 mr-1" /> Download Template
        </Button>
      </div>

      <div className="rounded-xl border border-dashed border-muted-foreground/30 p-8 text-center">
        <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-4">
          Upload a CSV file with columns: <span className="font-mono text-xs">{REQUIRED_COLS.join(", ")}</span>
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Products with existing IDs will be updated (upsert). Optional columns: original_price, description, in_stock, stock_count.
        </p>
        
        <input ref={fileRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />
        <Button onClick={() => fileRef.current?.click()} disabled={importing}>
          {importing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
          {importing ? "Importing..." : "Upload CSV"}
        </Button>
      </div>

      {result && (
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <div className="flex items-center gap-4">
            {result.success > 0 && (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">{result.success} imported</span>
              </div>
            )}
            {result.failed > 0 && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">{result.failed} failed</span>
              </div>
            )}
          </div>
          {result.errors.length > 0 && (
            <div className="bg-destructive/10 rounded-lg p-3 max-h-40 overflow-y-auto">
              {result.errors.map((err, i) => (
                <p key={i} className="text-xs text-destructive font-mono">{err}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
