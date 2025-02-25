export interface Entry {
  id?: string;
  title: string;
  description: string;
  created_at: Date;
  scheduled_date?: Date | null; // 🔹 Add this line
}

export type EntryContextType = {
  entries: Entry[];
  saveEntry: (entry: Entry) => void;
  updateEntry: (id: string, entryData: Entry) => void;
  deleteEntry: (id: string) => void;
};
