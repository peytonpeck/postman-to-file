/**
 * Authentication
 */
export type PostmanAuth = {
  type: string;
  [scheme: string]: any; // flexible for bearer/apikey/etc.
}
