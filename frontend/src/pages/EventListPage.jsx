import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsApi } from '../api';

function EventListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    newsApi.get('/api/events')
      .then(response => {
        const data = Array.isArray(response.data) ? response.data : response.data.events || [];
        setEvents(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Greška pri dohvaćanju događaja:', error);
        setLoading(false);
      });
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(events.map(e => e.category).filter(Boolean))];

  return (
    <div className="space-y-8">
      {/* Hero sekcija - Oštriji dizajn */}
      <section className="border-b-2 border-black bg-white pb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">Latest coverage</p>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Agregirani događaji na jednom mjestu</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-gray-600">
              Pregled najvažnijih vijesti iz više izvora, s jasnim pregledom i provjerom sadržaja.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <input
              type="text"
              placeholder="Pretraži vijesti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:w-64"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="">Sve kategorije</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="border border-gray-200 bg-white py-16 text-center">
          <div className="mx-auto mb-3 inline-block h-8 w-8 animate-spin rounded-sm border-4 border-gray-200 border-t-black"></div>
          <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">Učitavanje vijesti...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="border border-gray-200 bg-white py-16 text-center">
          <p className="text-gray-500 font-medium">Nema pronađenih događaja za odabrane kriterije.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map(event => (
            <div key={event.id} className="flex flex-col justify-between border border-gray-200 bg-white p-6 transition-all hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <span className="inline-block border border-gray-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-800">
                  {event.category || 'Vijesti'}
                </span>
                <h3 className="mt-4 text-lg font-bold leading-snug text-gray-900 line-clamp-3">
                  {event.title}
                </h3>
              </div>

              <div className="mt-6">
                <div className="mb-4 truncate border-l-2 border-gray-300 bg-gray-50 px-3 py-1.5 text-[11px] font-mono text-gray-500">
                  ID: {event.id}
                </div>
                <Link
                  to={`/event/${event.id}`}
                  className="block w-full border border-black bg-black px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
                >
                  Pročitaj više
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventListPage;