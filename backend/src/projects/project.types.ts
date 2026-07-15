export interface ProjectRecord {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  published: boolean;
  createdAt: string;
  updatedAt?: string;
}
