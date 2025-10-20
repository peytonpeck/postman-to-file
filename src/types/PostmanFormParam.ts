import type { PostmanDescription } from './PostmanDescription';

export type PostmanFormParam = {
  key: string;
  value?: string;
  type?: string;
  src?: string;
  disabled?: boolean;
  contentType?: string;
  description?: string | PostmanDescription;
}
