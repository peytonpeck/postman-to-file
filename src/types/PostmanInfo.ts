import type { PostmanDescription } from './PostmanDescription';

export type PostmanInfo = {
  _postman_id?: string;
  name: string;
  description?: string | PostmanDescription;
  schema?: string;
  _exporter_id?: string;
}
