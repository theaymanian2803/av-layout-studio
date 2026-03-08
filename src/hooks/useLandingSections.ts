import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LandingSection {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  image_url: string;
  visible: boolean;
  sort_order: number;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useLandingSections = () => {
  return useQuery({
    queryKey: ["landing_sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_sections")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as unknown as LandingSection[];
    },
  });
};

export const useUpdateLandingSection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LandingSection> }) => {
      const { error } = await supabase
        .from("landing_sections")
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["landing_sections"] }),
  });
};

export const useAddLandingSection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (section: Partial<LandingSection>) => {
      const { error } = await supabase
        .from("landing_sections")
        .insert(section as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["landing_sections"] }),
  });
};

export const useDeleteLandingSection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("landing_sections")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["landing_sections"] }),
  });
};
