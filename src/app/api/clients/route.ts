

import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = 'Stripe';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || '';
    const status = searchParams.get('status') || '';

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('Logs'); // substitua pelo nome real

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