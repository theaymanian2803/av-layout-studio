import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface WidgetCardProps {
  id: string;
  isEditing: boolean;
  children: React.ReactNode;
  className?: string;
}

export const WidgetCard = ({ id, isEditing, children, className }: WidgetCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className={cn(
        "relative rounded-lg border bg-card text-card-foreground overflow-hidden",
        isEditing && "ring-2 ring-primary/30 cursor-grab",
        isDragging && "z-50 shadow-2xl neon-glow opacity-90 scale-[1.02]",
        className
      )}
    >
      {isEditing && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-primary/20 text-primary hover:bg-primary/30 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}
      {children}
    </motion.div>
  );
};
