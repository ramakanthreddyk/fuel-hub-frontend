
# UI Design Guidelines - FuelSync ERP

## Overview
This document outlines the design system and guidelines for maintaining consistency across the FuelSync ERP application.

## Color Palette & Gradients

### Status-Based Colors
- **Active**: `from-green-50 via-emerald-50 to-teal-50` with `border-green-200`
- **Maintenance**: `from-yellow-50 via-orange-50 to-amber-50` with `border-yellow-200`
- **Inactive**: `from-red-50 via-pink-50 to-rose-50` with `border-red-200`
- **Default**: `from-gray-50 via-slate-50 to-zinc-50` with `border-gray-200`

### Fuel Type Colors
- **Petrol**: Green gradients (`from-green-500 to-emerald-600`)
- **Diesel**: Orange gradients (`from-orange-500 to-amber-600`)
- **Premium**: Purple gradients (`from-purple-500 to-indigo-600`)

## Card Design System

### ColorfulCard Component
- Base class: `bg-gradient-to-br shadow-lg border-0 rounded-2xl overflow-hidden`
- Hover effects: `hover:shadow-xl hover:scale-[1.02] transition-all duration-200`
- Responsive design with backdrop blur effects

### Card Structure
```tsx
<ColorfulCard>
  <CardHeader>
    <HeaderRow>
      <Icon + Title + StatusBadge>
    </HeaderRow>
    <StatsRow>
      <StatCards with backdrop-blur>
    </StatsRow>
  </CardHeader>
  <CardContent>
    <ActionButtons>
  </CardContent>
</ColorfulCard>
```

## Responsive Breakpoints

### Grid Systems
- Mobile: `grid-cols-1`
- Small: `sm:grid-cols-2`
- Medium: `md:grid-cols-3`
- Large: `lg:grid-cols-4`

### Text Sizes
- Mobile: `text-xs`
- Small: `sm:text-sm`
- Large: `lg:text-base`

### Button Layouts
- Mobile: Stack vertically, compact text
- Desktop: Horizontal layout, full text labels

## Component Library

### StatusBadge
- Displays status with appropriate icon and color
- Sizes: `sm`, `md`, `lg`
- Consistent gradient backgrounds

### FuelBadge
- Fuel type identification with icons
- Color-coded by fuel type
- Consistent sizing and styling

### Action Buttons
- Primary actions: Gradient backgrounds with shadows
- Secondary actions: Outline style with backdrop blur
- Destructive actions: Red text with hover effects

## Icons
- Use `lucide-react` icons consistently
- Standard sizes: 16px (`h-4 w-4`) for inline, 20px (`h-5 w-5`) for headers
- Consistent icon mapping:
  - Building2: Stations/Pumps
  - Hash: Numbers/IDs
  - Activity: Status/Actions
  - Settings: Configuration
  - Eye: View actions

## Layout Principles

1. **Visual Hierarchy**: Use size, color, and spacing to guide attention
2. **Consistency**: Maintain consistent spacing (Tailwind's spacing scale)
3. **Accessibility**: Ensure sufficient contrast and touch targets
4. **Mobile-First**: Design for mobile, enhance for desktop
5. **Performance**: Use CSS transforms for animations, avoid layout thrashing

## Animation Guidelines

- Hover effects: `transition-all duration-200`
- Scale effects: `hover:scale-[1.02]`
- Shadow transitions: `hover:shadow-xl`
- Keep animations subtle and performant

## Documentation
- Update component headers with modification dates
- Document gradient choices and reasoning
- Maintain consistent naming conventions
