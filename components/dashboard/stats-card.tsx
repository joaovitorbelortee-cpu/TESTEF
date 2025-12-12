import { cn } from "../../lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    subValue?: string;
    subLabel?: string;
    icon?: LucideIcon;
    trend?: "up" | "down" | "neutral";
    trendLabel?: string;
    className?: string;
    accentColor?: "primary" | "blue" | "purple" | "orange";
}

export function StatsCard({
    title,
    value,
    subValue,
    subLabel,
    icon: Icon,
    trend,
    trendLabel,
    className,
    accentColor = "primary"
}: StatsCardProps) {

    const colors = {
        primary: "text-primary border-primary/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
        blue: "text-cyan-400 border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]",
        purple: "text-fuchsia-500 border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.1)]",
        orange: "text-amber-500 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    };

    const textColors = {
        primary: "text-primary",
        blue: "text-cyan-400",
        purple: "text-fuchsia-500",
        orange: "text-amber-500",
    };

    return (
        <div className={cn(
            "hud-panel p-6 group transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]",
            className
        )}>
            {/* Linhas decorativas nos cantos superiores */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />

            <div className="flex justify-between items-start mb-4">
                <div className={cn("hud-text", textColors[accentColor])}>
                    {title}
                </div>
                {Icon && <Icon className={cn("h-5 w-5 opacity-70", textColors[accentColor])} />}
            </div>

            <div className="relative z-10">
                <div className={cn("text-3xl md:text-4xl font-mono font-bold tracking-tighter text-white mb-2 neon-text")}>
                    {value}
                </div>

                <div className="flex items-center gap-3">
                    {trendLabel && (
                        <div className={cn(
                            "px-2 py-0.5 text-[10px] font-mono border",
                            trend === 'up' ? "border-primary text-primary bg-primary/10" : "border-destructive text-destructive bg-destructive/10"
                        )}>
                            {trend === 'up' ? '▲' : '▼'} {trendLabel}
                        </div>
                    )}
                    <div className="text-xs text-muted-foreground font-mono">
                        {subLabel || subValue}
                    </div>
                </div>
            </div>

            {/* Grade decorativa de pontos no fundo */}
            <div className="absolute right-2 bottom-2 opacity-10">
                <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className={cn("w-1 h-1 rounded-full", textColors[accentColor], Math.random() > 0.5 ? "opacity-100" : "opacity-20")} />
                    ))}
                </div>
            </div>
        </div>
    );
}
