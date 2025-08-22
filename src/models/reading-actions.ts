export interface ReadingCardActions {
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onVoid?: (id: string) => void;
  // Add more actions as needed
}
