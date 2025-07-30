'use client';

import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import "./globals.css"; // ou '@/app/globals.css'

interface Client {
  _id: string;
  user_id: string;
  email_sent: string;
  status: string;
  status_email: string;
  memberkit_status: string;
  sent_telegram: boolean;
  date_email: string;
}

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ email: '', status: '' });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/clients?email=${filters.email}&status=${filters.status}`)
      .then(res => res.json())
      .then(data => {
        setClients(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Erro ao carregar dados');
        setLoading(false);
      });
  }, [filters]);

const exportPDF = (client: Client) => {
  const doc = new jsPDF();
  let y = 10;

  const addLine = (label: string, value: any) => {
    doc.text(`${label}: ${typeof value === 'object' ? JSON.stringify(value) : String(value)}`, 10, y);
    y += 10;
  };

  addLine('User ID', client.user_id);
  addLine('Sent Telegram', client.sent_telegram);
  addLine('Course ID', (client as any).course_id);
  addLine('Memberkit ID', (client as any).memberkit_id);
  addLine('Memberkit Status', client.memberkit_status);
  addLine('Clicked', JSON.stringify((client as any).clicked));
  addLine('Email Delivered', (client as any).email_delivered);
  addLine('Email Sent', client.email_sent);
  addLine('ID', (client as any).id);
  addLine('Status', client.status);
  addLine('Date Email', client.date_email);
  addLine('IP', (client as any).ip);
  addLine('Status Email', client.status_email);
  addLine('User Agent Email', (client as any).user_agent_email);

  doc.save(`cliente-${client.user_id}.pdf`);
};

  return (
    <div className="min-h-screen bg-gray-50 p-8 sm:p-16 text-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Painel de Clientes</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Filtrar por email"
            value={filters.email}
            onChange={(e) => setFilters(f => ({ ...f, email: e.target.value }))}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="complete">Complete</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Carregando dados...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client._id} className="border-b hover:bg-gray-100 transition">
                    <td className="px-6 py-4">{client.email_sent}</td>
                    <td className="px-6 py-4">{client.status}</td>
                    <td className="px-6 py-4">{client.status_email}</td>
                    <td className="px-6 py-4">{client.date_email}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => exportPDF(client)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        Exportar PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
