
"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

const Chart = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RechartsPrimitive.ResponsiveContainer>
>(({ className, children, ...props }, ref) => {
  return (
    <div className={cn("w-full", className)} ref={ref}>
      <RechartsPrimitive.ResponsiveContainer {...props}>
        <RechartsPrimitive.ComposedChart data={[]}>{children}</RechartsPrimitive.ComposedChart>
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  )
})
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config?: {
      [key: string]: {
        label?: string;
        color?: string;
        formatter?: (value: number, name: string) => string;
      };
    };
  }
>(({ className, children, config, ...props }, ref) => {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-background p-4",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = ({ ...props }: React.ComponentProps<typeof RechartsPrimitive.Tooltip>) => {
  return (
    <RechartsPrimitive.Tooltip
      {...props}
    />
  )
}
ChartTooltip.displayName = "ChartTooltip"

interface ChartContextProps {
  config: {
    [key: string]: {
      label?: string
      formatter?: (value: number, name: string) => string
    }
  }
}

const ChartContext = React.createContext<ChartContextProps>({
  config: {},
})

const useChart = () => {
  return React.useContext(ChartContext)
}

interface ChartProviderProps {
  children: React.ReactNode
  config: ChartContextProps["config"]
}

const ChartProvider = ({ children, config }: ChartProviderProps) => {
  return (
    <ChartContext.Provider value={{ config }}>{children}</ChartContext.Provider>
  )
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!hideLabel && label && (
          <div className={cn("font-medium", labelClassName)}>
            {label}
          </div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item, index) => (
            <div
              key={index}
              className="flex w-full flex-wrap items-stretch gap-2"
            >
              <div className="flex flex-1 justify-between leading-none">
                <div className="grid gap-1.5">
                  <span className="text-muted-foreground">
                    {item.name}
                  </span>
                </div>
                <div className="font-mono font-medium tabular-nums text-foreground">
                  {typeof item.value === "number" ? item.value : String(item.value)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartBar = ({ className, ...props }: React.ComponentProps<typeof RechartsPrimitive.Bar>) => {
  return <RechartsPrimitive.Bar className={cn("", className)} {...props} />
}
ChartBar.displayName = "ChartBar"

const ChartLine = ({ className, ...props }: React.ComponentProps<typeof RechartsPrimitive.Line>) => {
  return (
    <RechartsPrimitive.Line
      className={cn("", className)}
      strokeWidth={2}
      dot={false}
      {...props}
    />
  )
}
ChartLine.displayName = "ChartLine"

const ChartArea = ({ className, ...props }: React.ComponentProps<typeof RechartsPrimitive.Area>) => {
  return <RechartsPrimitive.Area className={cn("", className)} {...props} />
}
ChartArea.displayName = "ChartArea"

const ChartPie = ({ className, ...props }: React.ComponentProps<typeof RechartsPrimitive.Pie>) => {
  return <RechartsPrimitive.Pie className={cn("", className)} {...props} />
}
ChartPie.displayName = "ChartPie"

const ChartCell = ({ className, ...props }: React.ComponentProps<typeof RechartsPrimitive.Cell>) => {
  return <RechartsPrimitive.Cell className={cn("", className)} {...props} />
}
ChartCell.displayName = "ChartCell"

const ChartXAxis = ({ className, ...props }: React.ComponentProps<typeof RechartsPrimitive.XAxis>) => {
  return <RechartsPrimitive.XAxis className={cn("", className)} {...props} />
}
ChartXAxis.displayName = "ChartXAxis"

const ChartYAxis = ({ className, ...props }: React.ComponentProps<typeof RechartsPrimitive.YAxis>) => {
  return <RechartsPrimitive.YAxis className={cn("", className)} {...props} />
}
ChartYAxis.displayName = "ChartYAxis"

const ChartLegend = ({ className, ...props }: React.ComponentProps<typeof RechartsPrimitive.Legend>) => {
  return <RechartsPrimitive.Legend className={cn("", className)} {...props} />
}
ChartLegend.displayName = "ChartLegend"

export {
  Chart,
  ChartArea,
  ChartBar,
  ChartCell,
  ChartContainer,
  ChartContext,
  ChartLegend,
  ChartLine,
  ChartPie,
  ChartProvider,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
  useChart,
}
