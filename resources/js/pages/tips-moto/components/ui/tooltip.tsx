"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "./utils";

function TooltipProvider({
  delayDuration = 300,
  skipDelayDuration = 100,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  side = "top",
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        side={side}
        sideOffset={sideOffset}
        className={cn(
          // Base styles
          "z-50 w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin)",
          // Background and border
          "bg-gray-900 dark:bg-gray-800 border border-gray-700 dark:border-gray-600",
          // Text styles
          "text-white text-sm leading-tight",
          // Shape and spacing
          "rounded-lg px-3 py-2",
          // Shadow and backdrop
          "shadow-xl backdrop-blur-sm",
          // Animations
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          // Custom tooltip styles
          "tips-moto-tooltip",
          className,
        )}
        {...props}
      >
        <div className="relative">
          {children}
        </div>
        <TooltipPrimitive.Arrow 
          className={cn(
            "fill-gray-900 dark:fill-gray-800",
            "z-50 h-2 w-2",
            "drop-shadow-sm"
          )} 
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

// Enhanced tooltip variants for different contexts
function TooltipSuccess({
  children,
  className,
  ...props
}: React.ComponentProps<typeof TooltipContent>) {
  return (
    <TooltipContent
      className={cn(
        "bg-green-600 border-green-500 text-white",
        "[&_.arrow]:fill-green-600",
        className
      )}
      {...props}
    >
      {children}
    </TooltipContent>
  );
}

function TooltipWarning({
  children,
  className,
  ...props
}: React.ComponentProps<typeof TooltipContent>) {
  return (
    <TooltipContent
      className={cn(
        "bg-yellow-600 border-yellow-500 text-white",
        "[&_.arrow]:fill-yellow-600",
        className
      )}
      {...props}
    >
      {children}
    </TooltipContent>
  );
}

function TooltipError({
  children,
  className,
  ...props
}: React.ComponentProps<typeof TooltipContent>) {
  return (
    <TooltipContent
      className={cn(
        "bg-red-600 border-red-500 text-white",
        "[&_.arrow]:fill-red-600",
        className
      )}
      {...props}
    >
      {children}
    </TooltipContent>
  );
}

function TooltipInfo({
  children,
  className,
  ...props
}: React.ComponentProps<typeof TooltipContent>) {
  return (
    <TooltipContent
      className={cn(
        "bg-blue-600 border-blue-500 text-white",
        "[&_.arrow]:fill-blue-600",
        className
      )}
      {...props}
    >
      {children}
    </TooltipContent>
  );
}

function TooltipPremium({
  children,
  className,
  ...props
}: React.ComponentProps<typeof TooltipContent>) {
  return (
    <TooltipContent
      className={cn(
        "bg-gradient-to-r from-orange-600 to-orange-500 border-orange-400 text-white",
        "shadow-orange-500/25 shadow-lg",
        "[&_.arrow]:fill-orange-600",
        className
      )}
      {...props}
    >
      {children}
    </TooltipContent>
  );
}

export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider,
  TooltipSuccess,
  TooltipWarning,
  TooltipError,
  TooltipInfo,
  TooltipPremium
};
