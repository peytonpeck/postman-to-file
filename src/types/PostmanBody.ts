import type { PostmanFormParam } from './PostmanFormParam';

/**
 * Request body definitions
 */
export type PostmanBody = {
  mode?: "raw" | "formdata" | "urlencoded" | "file" | "graphql";
  raw?: string;
  formdata?: PostmanFormParam[];
  urlencoded?: PostmanFormParam[];
  graphql?: {
    query?: string;
    variables?: string;
  };
  file?: { src?: string };
  options?: Record<string, any>;
}
