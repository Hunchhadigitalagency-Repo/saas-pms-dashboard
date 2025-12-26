import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
    value: string;
    setValue: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ defaultValue, value, onValueChange, className, ...props }, ref) => {
        const [internal, setInternal] = React.useState(defaultValue);

        const currentValue = value ?? internal;

        const setValue = (v: string) => {
            onValueChange?.(v);
            if (value === undefined) setInternal(v);
        };

        return (
            <TabsContext.Provider value={{ value: currentValue, setValue }}>
                <div ref={ref} className={cn("w-full", className)} {...props} />
            </TabsContext.Provider>
        );
    }
);
Tabs.displayName = "Tabs";

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> { }

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
                className
            )}
            {...props}
        />
    )
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, ...props }, ref) => {
        const ctx = React.useContext(TabsContext);
        if (!ctx) throw new Error("TabsTrigger must be used within Tabs");

        const isActive = ctx.value === value;

        return (
            <button
                ref={ref}
                type="button"
                aria-selected={isActive}
                data-state={isActive ? "active" : "inactive"}
                onClick={() => ctx.setValue(value)}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    isActive
                        ? "bg-background text-foreground shadow-sm"
                        : "hover:text-foreground",
                    className
                )}
                {...props}
            />
        );
    }
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, ...props }, ref) => {
        const ctx = React.useContext(TabsContext);
        if (!ctx) throw new Error("TabsContent must be used within Tabs");

        const isActive = ctx.value === value;

        if (!isActive) return null;

        return (
            <div
                ref={ref}
                role="tabpanel"
                className={cn("mt-2 ring-offset-background focus-visible:outline-none", className)}
                {...props}
            />
        );
    }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
