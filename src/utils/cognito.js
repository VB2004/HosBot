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
  RedirectUri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
});

export function initiateCognitoSignIn() {
  auth.getSession();
  auth.signIn();
}

export function handleCognitoRedirect() {
  // Check if there's an authentication result after redirect
  auth.parseCognitoWebResponse(window.location.href);
}
