"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, Check, Loader2, Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<any>(`${API_ENDPOINTS.NOTIFICATIONS.BASE}?limit=5`);
      const data = res.data || res;
      setNotifications(data.data || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id: string, link?: string) => {
    try {
      await api.patch(API_ENDPOINTS.NOTIFICATIONS.BASE, { id });
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      if (link) {
        setOpen(false);
        router.push(link);
      }
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {});
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "alert": return <AlertCircle className="h-4 w-4 text-rose-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 rounded-full border-border/40 bg-card/40 backdrop-blur-xl hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
        >
          <Bell className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border-2 border-background"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-[380px] rounded-3xl border-border/40 bg-card/95 backdrop-blur-3xl p-0 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/10 bg-muted/20">
          <div>
            <h4 className="text-sm font-black text-foreground">Notifications</h4>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold mt-0.5">
              {unreadCount} unread messages
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead();
              }}
              className="h-8 text-[10px] font-black uppercase tracking-wider text-primary hover:bg-primary/10 hover:text-primary rounded-xl"
            >
              <Check className="h-3 w-3 mr-1.5" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[340px] overflow-y-auto custom-scrollbar flex flex-col">
          {loading && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-50">
              <Loader2 className="h-6 w-6 animate-spin text-primary mb-3" />
              <p className="text-xs font-bold">Loading updates...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => markAsRead(notification._id, notification.link)}
                className={cn(
                  "relative flex gap-4 p-4 hover:bg-primary/5 transition-colors cursor-pointer border-b border-border/5 last:border-0",
                  !notification.isRead ? "bg-primary/[0.02]" : "opacity-70 grayscale-[0.2]"
                )}
              >
                {!notification.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                )}
                
                <div className="mt-1 shrink-0">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full shadow-sm",
                    notification.type === "success" && "bg-emerald-500/10",
                    notification.type === "warning" && "bg-amber-500/10",
                    notification.type === "alert" && "bg-rose-500/10",
                    notification.type === "info" && "bg-blue-500/10"
                  )}>
                    {getIcon(notification.type)}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 w-full min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                      "text-sm font-bold truncate",
                      !notification.isRead ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {notification.title}
                    </p>
                    <span className="text-[9px] font-bold text-muted-foreground/50 whitespace-nowrap pt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Bell className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-black text-foreground">All caught up!</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                You have no new notifications right now.
              </p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-2 border-t border-border/10 bg-card/40">
            <Button variant="ghost" className="w-full h-9 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground">
              View All Notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
