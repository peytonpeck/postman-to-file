import type { PostmanDescription } from './PostmanDescription';

export type PostmanQueryParam = {
  key: string;
  value?: string;
  disabled?: boolean;
  description?: string | PostmanDescription;
}
