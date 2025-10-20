import type { PostmanHeader } from './PostmanHeader';
import type { PostmanRequest } from './PostmanRequest';

/**
 * Example responses
 */
export interface PostmanResponse {
  id?: string;
  name?: string;
  originalRequest?: PostmanRequest | Record<string, any>;
  status?: string;
  code?: number;
  header?: PostmanHeader[];
  cookie?: Record<string, any>[];
  body?: string;
  _postman_previewlanguage?: string;
}
