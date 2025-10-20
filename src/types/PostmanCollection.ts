import type { PostmanAuth } from './PostmanAuth';
import type { PostmanEvent } from './PostmanEvent';
import type { PostmanFolder } from './PostmanFolder';
import type { PostmanInfo } from './PostmanInfo';
import type { PostmanItem } from './PostmanItem';
import type { PostmanVariable } from './PostmanVariable';

export type PostmanCollection = {
  info: PostmanInfo;
  item: (PostmanItem | PostmanFolder)[];
  event?: PostmanEvent[];
  variable?: PostmanVariable[];
  auth?: PostmanAuth;
  protocolProfileBehavior?: Record<string, any>;
}
