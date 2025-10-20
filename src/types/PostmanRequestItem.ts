import type { PostmanAuth } from './PostmanAuth';
import type { PostmanDescription } from './PostmanDescription';
import type { PostmanEvent } from './PostmanEvent';
import type { PostmanRequest } from './PostmanRequest';
import type { PostmanResponse } from './PostmanResponse';
import type { PostmanVariable } from './PostmanVariable';

/**
 * A single request and its associated tests/responses
 */
export type PostmanRequestItem = {
  id?: string;
  name: string;
  description?: string | PostmanDescription;
  request: PostmanRequest;
  response?: PostmanResponse[];
  event?: PostmanEvent[];
  auth?: PostmanAuth;
  variable?: PostmanVariable[];
  protocolProfileBehavior?: Record<string, any>;
}
