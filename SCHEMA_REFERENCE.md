# Data Schema Reference

This document defines the core data schemas for the Magic: The Gathering Collection App MVP. Update this file as schemas evolve.

---

## User
```ts
export interface User {
  _id: string; // MongoDB ObjectId as string
  email: string;
  passwordHash: string;
  displayName: string;
  mainLanguage: string; // e.g., 'en' (default: 'en')
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}
```

---

## CollectionCard
```ts
export interface CollectionCard {
  _id: string;
  userId: string;
  scryfallId: string;
  quantity: number;
  condition: string; // default: 'NM'
  language: string; // default: 'en'
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## ImportJob
```ts
export interface ImportJob {
  _id: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  errorMessage?: string;
  // Optionally: fileName?: string; importedCount?: number;
}
```
