import type { PostmanAuth } from './PostmanAuth';
import type { PostmanDescription } from './PostmanDescription';
import type { PostmanEvent } from './PostmanEvent';
import type { PostmanRequestItem } from './PostmanRequestItem';
import type { PostmanVariable } from './PostmanVariable';

/**
 * Folders can contain nested items (folders or requests)
 */
export type PostmanFolder = {
  id?: string;
  name: string;
  description?: string | PostmanDescription;
  item: (PostmanRequestItem | PostmanFolder)[];
  event?: PostmanEvent[];
  auth?: PostmanAuth;
  variable?: PostmanVariable[];
  protocolProfileBehavior?: Record<string, any>;
}
