export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  totalPages: number;
  currentPage: number;
  startDate?: Date;
  finishDate?: Date;
  status: 'reading' | 'completed' | 'on-hold' | 'dropped';
  rating?: number;
  genre?: string;
  isbn?: string;
} 