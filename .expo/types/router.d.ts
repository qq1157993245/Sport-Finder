/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(auth)'}/login` | `/login`; params?: Router.UnknownInputParams; } | { pathname: `${'/(auth)'}/signUpFuncs` | `/signUpFuncs`; params?: Router.UnknownInputParams; } | { pathname: `${'/(auth)'}/config/firebaseConfig` | `/config/firebaseConfig`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(auth)'}/login` | `/login`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(auth)'}/signUpFuncs` | `/signUpFuncs`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(auth)'}/config/firebaseConfig` | `/config/firebaseConfig`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(auth)'}/login${`?${string}` | `#${string}` | ''}` | `/login${`?${string}` | `#${string}` | ''}` | `${'/(auth)'}/signUpFuncs${`?${string}` | `#${string}` | ''}` | `/signUpFuncs${`?${string}` | `#${string}` | ''}` | `${'/(auth)'}/config/firebaseConfig${`?${string}` | `#${string}` | ''}` | `/config/firebaseConfig${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(auth)'}/login` | `/login`; params?: Router.UnknownInputParams; } | { pathname: `${'/(auth)'}/signUpFuncs` | `/signUpFuncs`; params?: Router.UnknownInputParams; } | { pathname: `${'/(auth)'}/config/firebaseConfig` | `/config/firebaseConfig`; params?: Router.UnknownInputParams; };
    }
  }
}
