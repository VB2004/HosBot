import { LexRuntimeV2Client, RecognizeTextCommand } from '@aws-sdk/client-lex-runtime-v2';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

const REGION = import.meta.env.VITE_AWS_REGION;
const IDENTITY_POOL_ID = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID;
const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID; // add this env var
const BOT_ID = import.meta.env.VITE_LEX_BOT_ID;
const BOT_ALIAS_ID = import.meta.env.VITE_LEX_BOT_ALIAS_ID;

function extractStudentId(email) {
  const match = email.match(/^[a-zA-Z0-9]+/);
  return match ? match[0] : `guest_${Date.now()}`; // fallback to timestamp
}


export const sendMessageToLex = async (text, user) => {
  const client = new LexRuntimeV2Client({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      identityPoolId: IDENTITY_POOL_ID,
      clientConfig: { region: REGION },
      logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: user.idToken,
      },
    }),
  });

  const sessionId = extractStudentId(user.email);

  const command = new RecognizeTextCommand({
    botId: BOT_ID,
    botAliasId: BOT_ALIAS_ID,
    localeId: 'en_US',
    text,
    sessionId: sessionId,
    sessionState: {
      sessionAttributes: {
        name: user.name,
        email: user.email,
      },
    },
  });

  return await client.send(command);
};
