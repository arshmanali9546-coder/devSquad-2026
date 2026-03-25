import { NextResponse } from 'next/server';
import data from '@/data.json';

export async function GET() {
  // Simulate network delay for learning purposes
  await new Promise((resolve) => setTimeout(resolve, 500));
  return NextResponse.json(data);
}
