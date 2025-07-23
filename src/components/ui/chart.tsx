"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

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
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
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

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
    children: React.ReactNode
  }
>(({ className, children, ...props }, ref) => {
  return (
    <RechartsPrimitive.Tooltip
      ref={ref}
      content={<ChartTooltipContent />}
      className={cn("z-50", className)}
      {...props}
    >
      {children}
    </RechartsPrimitive.Tooltip>
  )
})
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

interface PayloadConfig {
  label?: string
  formatter?: (value: number, name: string) => string
}

function getPayloadConfigFromPayload(
  config: ChartContextProps["config"],
  item: Payload<ValueType, NameType>,
  key: string
): PayloadConfig | undefined {
  if (config && config[key]) {
    return config[key]
  }
  return undefined
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ChartTooltip> &
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
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return labelFormatter(label, payload)
      }

      return value
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelKey,
      config,
    ])

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
        {!hideLabel && tooltipLabel && (
          <div className={cn("font-medium", labelClassName)}>
            {tooltipLabel}
          </div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload?.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && typeof item?.value === "number" && (
                  <div className="flex flex-1 justify-between leading-none">
                    <div className="grid gap-1.5">
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    <div className="font-mono font-medium tabular-nums text-foreground">
                      {formatter(item.value, item.name, item, index, payload)}
                    </div>
                  </div>
                )}
                {!formatter && (
                  <div className="flex flex-1 justify-between leading-none">
                    <div className="grid gap-1.5">
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    <div className="font-mono font-medium tabular-nums text-foreground">
                      {typeof item.value === "number" ? item.value : String(item.value)}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartBar = React.forwardRef<
  RechartsPrimitive.Bar,
  React.ComponentProps<typeof RechartsPrimitive.Bar>
>(({ className, ...props }, ref) => {
  return <RechartsPrimitive.Bar ref={ref} className={cn("", className)} {...props} />
})
ChartBar.displayName = "ChartBar"

const ChartLine = React.forwardRef<
  RechartsPrimitive.Line,
  React.ComponentProps<typeof RechartsPrimitive.Line>
>(({ className, ...props }, ref) => {
  return (
    <RechartsPrimitive.Line
      ref={ref}
      className={cn("", className)}
      strokeWidth={2}
      dot={false}
      {...props}
    />
  )
})
ChartLine.displayName = "ChartLine"

const ChartArea = React.forwardRef<
  RechartsPrimitive.Area,
  React.ComponentProps<typeof RechartsPrimitive.Area>
>(({ className, ...props }, ref) => {
  return <RechartsPrimitive.Area ref={ref} className={cn("", className)} {...props} />
})
ChartArea.displayName = "ChartArea"

const ChartPie = React.forwardRef<
  RechartsPrimitive.Pie,
  React.ComponentProps<typeof RechartsPrimitive.Pie>
>(({ className, ...props }, ref) => {
  return <RechartsPrimitive.Pie ref={ref} className={cn("", className)} {...props} />
})
ChartPie.displayName = "ChartPie"

const ChartCell = React.forwardRef<
  RechartsPrimitive.Cell,
  React.ComponentProps<typeof RechartsPrimitive.Cell>
>(({ className, ...props }, ref) => {
  return <RechartsPrimitive.Cell ref={ref} className={cn("", className)} {...props} />
})
ChartCell.displayName = "ChartCell"

const ChartXAxis = React.forwardRef<
  RechartsPrimitive.XAxis,
  React.ComponentProps<typeof RechartsPrimitive.XAxis>
>(({ className, ...props }, ref) => {
  return <RechartsPrimitive.XAxis ref={ref} className={cn("", className)} {...props} />
})
ChartXAxis.displayName = "ChartXAxis"

const ChartYAxis = React.forwardRef<
  RechartsPrimitive.YAxis,
  React.ComponentProps<typeof RechartsPrimitive.YAxis>
>(({ className, ...props }, ref) => {
  return <RechartsPrimitive.YAxis ref={ref} className={cn("", className)} {...props} />
})
ChartYAxis.displayName = "ChartYAxis"

const ChartLegend = React.forwardRef<
  RechartsPrimitive.Legend,
  React.ComponentProps<typeof RechartsPrimitive.Legend>
>(({ className, ...props }, ref) => {
  return <RechartsPrimitive.Legend ref={ref} className={cn("", className)} {...props} />
})
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
  ChartXAxis,
  ChartYAxis,
  useChart,
}
