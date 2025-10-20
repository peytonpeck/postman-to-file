import { PostmanDescription } from './PostmanDescription';

/**
 * Request/response headers
 */
export interface PostmanHeader {
  key: string;
  value: string;
  description?: string | PostmanDescription;
  type?: string;
  disabled?: boolean;
}
