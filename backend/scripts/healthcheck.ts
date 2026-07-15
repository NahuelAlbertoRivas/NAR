import 'dotenv/config';
import fetch from 'node-fetch';

async function run() {
  const url = process.env.API_URL || 'http://localhost:3000/';
  try {
    const res = await fetch(url, { method: 'GET' as const });
    console.log('Health check response status:', res.status);
    const text = await res.text();
    console.log('Body:', text);
  } catch (err: any) {
    console.error('Health check failed:', err?.message ?? err);
    process.exit(1);
  }
}

run();
