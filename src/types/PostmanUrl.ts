import type { PostmanQueryParam } from './PostmanQueryParam';
import type { PostmanVariable } from './PostmanVariable';

/**
 * URL representation
 */
export type PostmanUrl = {
  raw?: string;
  protocol?: string;
  host?: string[];
  path?: string[];
  port?: string;
  query?: PostmanQueryParam[];
  variable?: PostmanVariable[];
  hash?: string;
}
