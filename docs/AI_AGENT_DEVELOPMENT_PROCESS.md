
# AI Agent Development Process

## UI Layout Rules - Updated 2025-07-03

This document outlines the development standards and UI guidelines for the FuelSync ERP system.

### 🎨 Global UI Rules

#### Mobile-First Responsive Design
- Always implement mobile-first responsive layouts
- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Grid layouts should start with `grid-cols-1` and expand: `sm:grid-cols-2 md:grid-cols-3`
- Cards must use `overflow-hidden` to prevent layout breaks

#### Spacing and Layout
- Use consistent spacing with Tailwind's `gap-*` classes
- Implement proper padding with `p-4 sm:p-6` pattern
- Button bars should use `flex-wrap` for mobile compatibility
- Stack elements vertically on mobile using `flex-col sm:flex-row`

#### Component Standards
- All cards should have `overflow-hidden` class
- Text should use `text-ellipsis` for long content
- Use responsive visibility: `sm:hidden`, `md:block`
- Implement proper loading states with skeleton components

### 📱 Page-Specific Guidelines

#### Navigation Pattern
```tsx
// Standard navigation header
<div className="flex flex-col gap-4">
  <div className="flex items-center gap-3 min-w-0">
    <Button variant="outline" size="sm" onClick={handleBack}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      <span className="hidden sm:inline">Back to Previous</span>
      <span className="sm:hidden">Back</span>
    </Button>
    <div className="min-w-0 flex-1">
      <h1 className="text-xl sm:text-2xl font-bold">Page Title</h1>
      <p className="text-muted-foreground text-sm">Description</p>
    </div>
  </div>
  <Button className="w-full sm:w-auto sm:self-start">
    <Plus className="mr-2 h-4 w-4" />
    Action Button
  </Button>
</div>
```

#### Form Layout Pattern
```tsx
// Responsive form sections
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label className="text-sm font-medium">Field Label</Label>
    <Input placeholder="Enter value" />
  </div>
</div>
```

#### Card Grid Pattern
```tsx
// Responsive card grids
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map(item => (
    <div key={item.id} className="overflow-hidden">
      <Card>...</Card>
    </div>
  ))}
</div>
```

### 🔧 API Integration Standards

#### Error Handling
- Always implement try-catch blocks in mutation handlers
- Show toast notifications for success/error states
- Provide meaningful error messages to users
- Log errors to console for debugging

#### Loading States
- Use React Query's `isLoading` states
- Implement skeleton components for better UX
- Show loading spinners for form submissions
- Disable buttons during async operations

#### Form Validation
- Validate required fields before submission
- Show real-time validation feedback
- Use proper TypeScript types for form data
- Implement optimistic updates where appropriate

### 📋 Development Checklist

Before considering a feature complete, ensure:

- [ ] Mobile responsive design implemented
- [ ] Loading states handled properly
- [ ] Error boundaries in place
- [ ] Form validation working
- [ ] Navigation flow tested
- [ ] TypeScript errors resolved
- [ ] Toast notifications implemented
- [ ] Proper spacing and overflow handling
- [ ] Accessibility considerations met
- [ ] Cross-browser compatibility verified

### 🚀 Best Practices

1. **Keep Components Small**: Aim for components under 200 lines
2. **Separate Concerns**: Use custom hooks for business logic
3. **Consistent Naming**: Follow established naming conventions
4. **Document Changes**: Update changelog and relevant docs
5. **Test Thoroughly**: Verify on multiple screen sizes
6. **Performance**: Optimize re-renders with proper dependencies

### 🐛 Common Issues to Avoid

- Cards breaking on small screens (use `overflow-hidden`)
- Cramped button layouts (use proper `gap-*` spacing)
- Missing loading states (implement skeleton components)
- Poor mobile navigation (stack elements vertically)
- Broken form submissions (proper error handling)
- Route context loss (preserve navigation state)

This document should be referenced for all UI/UX development work to ensure consistency across the application.
