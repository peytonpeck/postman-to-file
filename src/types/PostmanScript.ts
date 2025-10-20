export type PostmanScript = {
  id?: string;
  type?: "text/javascript";
  exec?: string[];
  src?: string; // external script reference
  name?: string;
}
