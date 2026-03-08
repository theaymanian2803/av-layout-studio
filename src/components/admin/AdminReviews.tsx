import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, XCircle, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const AdminReviews = () => {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, products(name, image)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleApproval = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("reviews").update({ approved }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(approved ? "Review approved" : "Review rejected");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    }
  };

  const deleteReview = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews ({reviews.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : reviews.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No reviews yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review: any) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {review.products?.image && <img src={review.products.image} alt="" className="w-8 h-8 rounded object-cover" />}
                      <span className="text-sm truncate max-w-[120px]">{review.products?.name || "Unknown"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-accent fill-accent" : "text-muted"}`} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {review.title && <p className="text-sm font-medium">{review.title}</p>}
                      <p className="text-xs text-muted-foreground line-clamp-2">{review.content}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {review.approved ? (
                      <Badge variant="outline" className="text-xs border-green-500/30 text-green-500">Approved</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-500">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {!review.approved ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500" onClick={() => toggleApproval(review.id, true)}>
                          <CheckCircle className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-500" onClick={() => toggleApproval(review.id, false)}>
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteReview(review.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
