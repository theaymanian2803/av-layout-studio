import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { WidgetCard } from "./WidgetCard";
import { FeaturedCameras } from "@/components/widgets/FeaturedCameras";
import { NewAudioGear } from "@/components/widgets/NewAudioGear";
import { CurrentDeals } from "@/components/widgets/CurrentDeals";
import { TopBrands } from "@/components/widgets/TopBrands";
import { CategoryShowcase } from "@/components/widgets/CategoryShowcase";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";

export interface WidgetConfig {
  id: string;
  label: string;
}

const WIDGET_COMPONENTS: Record<string, React.FC> = {
  "featured-cameras": FeaturedCameras,
  "new-audio": NewAudioGear,
  "current-deals": CurrentDeals,
  "top-brands": TopBrands,
  "category-showcase": CategoryShowcase,
};

const DEFAULT_LAYOUT: WidgetConfig[] = [
  { id: "featured-cameras", label: "Featured Cameras" },
  { id: "category-showcase", label: "Shop by Category" },
  { id: "current-deals", label: "Current Deals" },
  { id: "new-audio", label: "New Audio Gear" },
  { id: "top-brands", label: "Top Brands" },
];

const STORAGE_KEY = "av-store-layout";

export const LayoutEngine = () => {
  const { user } = useAuth();
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
    } catch {
      return DEFAULT_LAYOUT;
    }
  });
  const [isEditing, setIsEditing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Load layout from DB for authenticated users
  useEffect(() => {
    if (user) {
      supabase
        .from("user_layout_preferences")
        .select("layout")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.layout && Array.isArray(data.layout) && data.layout.length > 0) {
            setWidgets(data.layout as unknown as WidgetConfig[]);
          }
        });
    }
  }, [user]);

  const saveLayout = useCallback(
    (newWidgets: WidgetConfig[]) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newWidgets));
      if (user) {
        supabase
          .from("user_layout_preferences")
          .upsert({ user_id: user.id, layout: newWidgets as unknown as Record<string, unknown>[] }, { onConflict: "user_id" })
          .then(() => {});
      }
    },
    [user]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setWidgets(prev => {
        const oldIndex = prev.findIndex(w => w.id === active.id);
        const newIndex = prev.findIndex(w => w.id === over.id);
        const updated = arrayMove(prev, oldIndex, newIndex);
        saveLayout(updated);
        return updated;
      });
    }
  };

  const resetLayout = () => {
    setWidgets(DEFAULT_LAYOUT);
    localStorage.removeItem(STORAGE_KEY);
    if (user) {
      supabase.from("user_layout_preferences").delete().eq("user_id", user.id);
    }
  };

  return (
    <div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 p-4 rounded-lg border bg-card"
        >
          <div className="flex items-center gap-3">
            <Pencil className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="edit-mode" className="text-sm font-medium cursor-pointer">
              Customize Layout
            </Label>
            <Switch id="edit-mode" checked={isEditing} onCheckedChange={setIsEditing} />
          </div>
          {isEditing && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={resetLayout}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Reset to Default
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {widgets.map(widget => {
              const Component = WIDGET_COMPONENTS[widget.id];
              if (!Component) return null;
              return (
                <WidgetCard key={widget.id} id={widget.id} isEditing={isEditing}>
                  {isEditing && (
                    <div className="px-6 pt-3">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {widget.label}
                      </span>
                    </div>
                  )}
                  <Component />
                </WidgetCard>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
