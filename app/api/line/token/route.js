// app/api/line/token/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
    const { code, redirectUri } = await request.json();

    const clientId = process.env.LINE_CHANNEL_ID;
    const clientSecret = process.env.LINE_CHANNEL_SECRET;

    const tokenUrl = 'https://api.line.me/oauth2/v2.1/token';

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    try {
        const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
        });
        const data = await response.json();

        if (data.error) {
        return NextResponse.json(
            { error: data.error, error_description: data.error_description },
            { status: 400 }
        );
        }

        const access_token = data.access_token;

        // Get user profile
        const profileResponse = await fetch('https://api.line.me/v2/profile', {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        });
        const profile = await profileResponse.json();

        return NextResponse.json({ accessToken: access_token, profile });
    } catch (err) {
        return NextResponse.json(
        { error: 'Internal Server Error', details: err.message },
        { status: 500 }
        );
    }
}
