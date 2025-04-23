import { CognitoAuth } from "amazon-cognito-auth-js";

// Configure Cognito User Pool and App Client
// const poolData = {
//   UserPoolId: import.meta.env.VITE_USER_POOL_ID,
//   ClientId: import.meta.env.VITE_CLIENT_ID,
// };

// Create an Auth instance
const auth = new CognitoAuth({
  UserPoolId: import.meta.env.VITE_USER_POOL_ID,
  ClientId: import.meta.env.VITE_CLIENT_ID,
  RedirectUri: window.location.origin,  // Ensure this is the redirect URI in your Cognito app settings
});

export function initiateCognitoSignIn() {
  auth.getSession();
  auth.signIn();
}

export function handleCognitoRedirect() {
  // Check if there's an authentication result after redirect
  auth.parseCognitoWebResponse(window.location.href);
}
