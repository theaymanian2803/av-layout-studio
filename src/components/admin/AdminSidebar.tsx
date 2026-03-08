import {
  BarChart3,
  LayoutDashboard,
  Package,
  Tag,
  Layers,
  ShoppingBag,
  Star,
  Users,
  Percent,
  Upload,
  Gift,
  Menu,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/admin", icon: BarChart3 },
  { title: "Landing Page", url: "/admin/landing", icon: LayoutDashboard },
  { title: "Mega Menu", url: "/admin/megamenu", icon: Menu },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Brands", url: "/admin/brands", icon: Tag },
  { title: "Categories", url: "/admin/categories", icon: Layers },
  { title: "Orders", url: "/admin/orders", icon: ShoppingBag },
  { title: "Reviews", url: "/admin/reviews", icon: Star },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Coupons", url: "/admin/coupons", icon: Percent },
  { title: "Import", url: "/admin/import", icon: Upload },
  { title: "Popup", url: "/admin/popup", icon: Gift },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) =>
    path === "/admin"
      ? currentPath === "/admin"
      : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
