import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ProductImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export const ProductImageUpload = ({ value, onChange }: ProductImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [useUrl, setUseUrl] = useState(!value || value.startsWith("http"));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    onChange(urlData.publicUrl);
    setUploading(false);
    toast.success("Image uploaded!");
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Product Image *</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-muted-foreground"
          onClick={() => setUseUrl(!useUrl)}
        >
          {useUrl ? "Upload instead" : "Use URL instead"}
        </Button>
      </div>

      {useUrl ? (
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full h-10"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="h-4 w-4 mr-2" /> Choose Image</>
            )}
          </Button>
        </div>
      )}

      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="w-20 h-20 rounded-md object-cover border border-border"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {!value && !useUrl && (
        <div className="flex items-center justify-center w-20 h-20 rounded-md border border-dashed border-border bg-muted/50">
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
