export type BookCreateRequest = {
  title: string;
  author: string;
  isbn?: string;
  publishedDate?: string;
  pageCount?: number;
};

export type BookResponse = {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  publishedDate?: string;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
}; 