import type { PostmanEnvVar } from './PostmanEnvVar';

/**
 * Environment file format (separate from collections)
 */
export type PostmanEnvironment = {
  id?: string;
  name: string;
  values: PostmanEnvVar[];
  _postman_variable_scope?: string;
  _postman_exported_at?: string;
  _postman_exported_using?: string;
}
