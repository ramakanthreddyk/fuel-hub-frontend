import { AttendantReadingForm } from "@/components/attendant/AttendantReadingForm";

export default function AttendantReadingsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Record Readings</h1>
      <AttendantReadingForm />
    </div>
  );
}