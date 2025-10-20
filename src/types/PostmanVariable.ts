import type { PostmanDescription } from './PostmanDescription';

/**
 * Variables (collection, folder, or request level)
 */
export type PostmanVariable = {
  id?: string;
  key: string;
  value?: string | boolean | number | object;
  type?: string;
  disabled?: boolean;
  description?: string | PostmanDescription;
}
