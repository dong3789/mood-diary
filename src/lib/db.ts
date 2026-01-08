import Dexie, { type EntityTable } from 'dexie';
import { DiaryEntry } from '@/types';

const db = new Dexie('MoodDiaryDB') as Dexie & {
  entries: EntityTable<DiaryEntry, 'id'>;
};

db.version(1).stores({
  entries: '++id, date, createdAt, updatedAt',
});

export { db };

export async function getEntryByDate(date: string): Promise<DiaryEntry | undefined> {
  return db.entries.where('date').equals(date).first();
}

export async function getAllEntries(): Promise<DiaryEntry[]> {
  return db.entries.toArray();
}

export async function getEntriesByDateRange(
  startDate: string,
  endDate: string
): Promise<DiaryEntry[]> {
  return db.entries
    .where('date')
    .between(startDate, endDate, true, true)
    .toArray();
}

export async function saveEntry(entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  const now = new Date();
  const existing = await getEntryByDate(entry.date);
  
  if (existing && existing.id !== undefined) {
    await db.entries.update(existing.id, {
      ...entry,
      updatedAt: now,
    });
    return existing.id;
  }
  
  const id = await db.entries.add({
    ...entry,
    createdAt: now,
    updatedAt: now,
  } as DiaryEntry);
  
  return id as number;
}

export async function deleteEntry(id: number): Promise<void> {
  await db.entries.delete(id);
}

export async function getEntriesByMonth(year: number, month: number): Promise<DiaryEntry[]> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
  
  return getEntriesByDateRange(startDate, endDate);
}

export async function getEntriesByYear(year: number): Promise<DiaryEntry[]> {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  
  return getEntriesByDateRange(startDate, endDate);
}
