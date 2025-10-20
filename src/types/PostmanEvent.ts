import type { PostmanScript } from './PostmanScript';

/**
 * Scripts: pre-request or test events
 */
export type PostmanEvent = {
  id?: string;
  listen: "prerequest" | "test" | string;
  script: PostmanScript;
}
