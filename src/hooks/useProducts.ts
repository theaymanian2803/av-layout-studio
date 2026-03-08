import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  original_price: number | null;
  image: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
  in_stock: boolean;
  stock_count: number;
  rating: number;
  review_count: number;
  compatible_ids: string[];
  mount_type: string | null;
  sensor_size: string | null;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("name");
      if (error) throw error;
      return data as unknown as DbProduct[];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
      if (error) throw error;
      return data as unknown as DbProduct;
    },
    enabled: !!id,
  });
};

export const useIsAdmin = () => {
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    },
  });
};

export const useBrandsAndCategories = () => {
  const brandsQuery = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brands").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const subcategoriesQuery = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subcategories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  return {
    brands: brandsQuery.data || [],
    categories: categoriesQuery.data || [],
    subcategories: subcategoriesQuery.data || [],
    isLoading: brandsQuery.isLoading || categoriesQuery.isLoading || subcategoriesQuery.isLoading,
  };
};
