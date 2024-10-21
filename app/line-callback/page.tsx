// app/line-callback/page.tsx

'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LineCallback() {
    const searchParams = useSearchParams(); // const searchParams = useSearchParams()!; TODO:Assert That searchParams is Not Null

    useEffect(() => {
        if (!searchParams) {
            console.error('No search parameters found.');
            return;
          }
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
            console.error('Error during LINE login:', error);
        } else if (code && state) {
        // Verify state parameter
        const storedState = localStorage.getItem('line_login_state');
        if (state !== storedState) {
            console.error('State does not match. Potential CSRF attack.');
            return;
        }
        localStorage.removeItem('line_login_state');

        fetch('/api/line/token', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, redirectUri: 'https://yourapp.com/line-callback' }),
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.error) {
                console.error('Error from API:', data.error_description || data.error);
            } else {
                console.log('Access Token:', data.accessToken);
                console.log('User Info:', data.profile);
                // Proceed with your application logic
            }
            })
            .catch((err) => {
            console.error('Error exchanging code for token:', err);
            });
        }
    }, [searchParams]);

    return (
        <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-xl">Processing LINE login...</h1>
        </div>
    );
}
