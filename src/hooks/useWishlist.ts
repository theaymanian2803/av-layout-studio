import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("wishlist")
        .select("*, products(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const wishlistIds = useQuery({
    queryKey: ["wishlist-ids", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return data.map(d => d.product_id);
    },
    enabled: !!user,
  });

  const toggleWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("Must be logged in");
      const ids = wishlistIds.data || [];
      if (ids.includes(productId)) {
        const { error } = await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", productId);
        if (error) throw error;
        return { added: false };
      } else {
        const { error } = await supabase.from("wishlist").insert({ user_id: user.id, product_id: productId });
        if (error) throw error;
        return { added: true };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-ids"] });
      toast.success(result.added ? "Added to wishlist" : "Removed from wishlist");
    },
    onError: () => toast.error("Failed to update wishlist"),
  });

  return {
    wishlistItems: wishlistQuery.data || [],
    wishlistIds: wishlistIds.data || [],
    isLoading: wishlistQuery.isLoading,
    toggleWishlist: toggleWishlist.mutate,
    isInWishlist: (productId: string) => (wishlistIds.data || []).includes(productId),
  };
};
