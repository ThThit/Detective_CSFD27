import { NextResponse } from 'next/server';

async function generatePkce() {
  const verifierBytes = crypto.getRandomValues(new Uint8Array(32));
  const verifier = btoa(String.fromCharCode(...verifierBytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  return { verifier, challenge };
}

export async function GET() {
  const state = crypto.randomUUID();
  const { verifier, challenge } = await generatePkce();

  const params = new URLSearchParams({
    client_id: process.env.AZURE_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: process.env.AZURE_REDIRECT_URI!,
    scope: 'openid profile email User.Read',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    response_mode: 'query',
  });

  const authUrl = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize?${params}`;

  const response = NextResponse.redirect(authUrl);
  const cookieOpts = { httpOnly: true, sameSite: 'lax' as const, maxAge: 300, path: '/', secure: process.env.NODE_ENV === 'production' };
  response.cookies.set('oauth_state', state, cookieOpts);
  response.cookies.set('oauth_verifier', verifier, cookieOpts);
  return response;
}
