import type { PostmanDescription } from './PostmanDescription';

export type PostmanEnvVar = {
  key: string;
  value: string;
  enabled?: boolean;
  type?: string;
  description?: string | PostmanDescription;
}
