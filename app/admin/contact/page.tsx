'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 5;

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<any | null>(null);

  const fetchContacts = async () => {
    const res = await fetch('/api/contact');
    const data = await res.json();
    setContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const deleteContact = async (id: string) => {
    const res = await fetch(`/api/contact/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      toast.success('Deleted');
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } else {
      toast.error('Delete failed');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Service', 'Message', 'Date'];

    const rows = filtered.map((c) => [
      c.name,
      c.email,
      c.service || '',
      c.message,
      new Date(c.createdAt).toLocaleString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((e) => e.join(',')).join('\n');

    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = 'contacts.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = contacts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());

    const matchService =
      serviceFilter === 'all' || c.service === serviceFilter;

    return matchSearch && matchService;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-10">

      <div className="flex flex-col gap-4 mb-6">

        <h1 className="text-3xl font-black text-[#1a2744]">
          Contact Messages
        </h1>

        <div className="flex flex-wrap gap-3">

          <input
            placeholder="Search name or email..."
            className="border px-4 py-2 rounded-xl w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="border px-4 py-2 rounded-xl"
            value={serviceFilter}
            onChange={(e) => {
              setServiceFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Services</option>
            <option value="software">Software</option>
            <option value="ai">AI / ML</option>
            <option value="cloud">Cloud</option>
            <option value="mobile">Mobile</option>
            <option value="security">Security</option>
            <option value="other">Other</option>
          </select>

          <Button
            className="bg-green-600 text-white"
            onClick={exportToCSV}
          >
            Export CSV
          </Button>

        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid gap-4">

            {paginated.map((c) => (
              <Card key={c.id} className="p-5">

                <div className="flex justify-between items-start">

                  {/* LEFT */}
                  <div>
                    <h2 className="font-bold text-lg text-[#1a2744]">
                      {c.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {c.email}
                    </p>

                    <p className="text-xs text-blue-500 mt-1">
                      {c.service || 'No service'}
                    </p>

                    <p className="mt-3 text-gray-700 line-clamp-2">
                      {c.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col gap-2">

                    <Button
                      variant="outline"
                      onClick={() => setSelected(c)}
                    >
                      View
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => deleteContact(c.id)}
                    >
                      Delete
                    </Button>

                  </div>
                </div>
              </Card>
            ))}

          </div>

          {/* PAGINATION */}
          <div className="flex justify-center mt-8 gap-2">

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-xl border ${
                  page === i + 1
                    ? 'bg-[#69c8e4] text-white'
                    : 'bg-white'
                }`}
              >
                {i + 1}
              </button>
            ))}

          </div>
        </>
      )}

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-[500px] p-6 rounded-2xl shadow-xl">

            <h2 className="text-xl font-black mb-2 text-[#1a2744]">
              {selected.name}
            </h2>

            <p className="text-gray-500">{selected.email}</p>

            <p className="text-sm text-blue-500 mt-1">
              Service: {selected.service || 'N/A'}
            </p>

            <div className="bg-gray-50 p-4 rounded-xl mt-4 text-sm">
              {selected.message}
            </div>

            <div className="flex justify-end mt-5 gap-2">

              <Button
                variant="outline"
                onClick={() => setSelected(null)}
              >
                Close
              </Button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}