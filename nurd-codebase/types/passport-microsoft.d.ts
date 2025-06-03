declare module 'passport-microsoft' {
  import { Request } from 'express';
  import { Strategy as PassportStrategy } from 'passport';

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    tenant?: string;
    authorizationURL?: string;
    tokenURL?: string;
    customHeaders?: object;
    pkce?: boolean;
    store?: object;
    state?: boolean;
    passReqToCallback?: false;
  }

  export interface StrategyOptionsWithRequest {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    tenant?: string;
    authorizationURL?: string;
    tokenURL?: string;
    customHeaders?: object;
    pkce?: boolean;
    store?: object;
    state?: boolean;
    passReqToCallback: true;
  }

  export interface Profile {
    id: string;
    displayName: string;
    name?: {
      familyName?: string;
      givenName?: string;
      middleName?: string;
    };
    emails?: Array<{ value: string; type?: string }>;
    photos?: Array<{ value: string }>;
    provider: string;
    _raw: string;
    _json: any;
  }

  export type VerifyCallback = (
    err?: Error | null,
    user?: object,
    info?: object
  ) => void;

  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => void | Promise<void>;

  export type VerifyFunctionWithRequest = (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => void | Promise<void>;

  export class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOptions,
      verify: VerifyFunction
    );
    constructor(
      options: StrategyOptionsWithRequest,
      verify: VerifyFunctionWithRequest
    );

    authenticate(req: Request, options?: any): void;
    userProfile(accessToken: string, done: (err?: Error | null, profile?: Profile) => void): void;
  }
}