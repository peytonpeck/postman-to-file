import type { PostmanAuth } from './PostmanAuth';
import type { PostmanBody } from './PostmanBody';
import type { PostmanDescription } from './PostmanDescription';
import type { PostmanHeader } from './PostmanHeader';
import type { PostmanUrl } from './PostmanUrl';

/**
 * Core HTTP request definition
 */
export type PostmanRequest = {
  method: string;
  header?: PostmanHeader[];
  body?: PostmanBody;
  url: PostmanUrl | string;
  description?: string | PostmanDescription;
  auth?: PostmanAuth;
}
