

import { NextRequest, NextResponse } from 'next/server'; 
import { MongoClient } from 'mongodb';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI indefinido');
      throw new Error('Missing env var');
    }

    const uri = process.env.MONGODB_URI!;
    const client = new MongoClient(uri);
    const dbName = 'Stripe';

    const email = req.nextUrl.searchParams.get('email') || '';
    const status = req.nextUrl.searchParams.get('status') || '';

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('Logs');

    const filter: any = {};
    if (email) filter.email_sent = { $regex: email, $options: 'i' };
    if (status) filter.status = status;

    const results = await collection.find(filter).limit(100).toArray();

    return NextResponse.json(results);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}