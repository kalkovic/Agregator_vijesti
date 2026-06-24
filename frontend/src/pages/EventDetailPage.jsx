import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsApi } from '../api';

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    newsApi.get(`/api/events/${id}`)
      .then(response => {
        setEvent(response.data);
        setLoading(false);
        if (!response.data.blockchain_tx_hash) {
          newsApi.get(`/api/events/${id}/verify`)
            .then(verifyRes => {
              if (verifyRes.data.is_valid) {
                setEvent(prev => ({
                  ...prev,
                  blockchain_tx_hash: verifyRes.data.blockchain_hash
                }));
              }
            })
            .catch(() => console.log('Blockchain verifikacija još nije spremna.'));
        }
      })
      .catch(err => {
        console.error('Greška pri dohvaćanju detalja događaja:', err);
        setError('Nije moguće učitati detalje događaja.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="border border-gray-200 bg-white py-16 text-center">
        <div className="mx-auto mb-3 inline-block h-8 w-8 animate-spin border-4 border-gray-200 border-t-black"></div>
        <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">Učitavanje detalja i provjera blockchaina...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="mx-auto max-w-md border border-red-300 bg-red-50 p-6 text-center">
        <p className="text-sm font-bold text-red-800 uppercase tracking-wide">{error || 'Događaj nije pronađen.'}</p>
        <Link to="/" className="mt-4 inline-flex text-xs font-bold uppercase tracking-widest text-gray-700 underline decoration-gray-300 underline-offset-4 hover:text-black">
          ← Povratak na naslovnicu
        </Link>
      </div>
    );
  }

  const isVerified = event.blockchain_tx_hash !== null && event.blockchain_tx_hash !== undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-black">
        ← Natrag na sve vijesti
      </Link>

      <div className="border border-gray-200 bg-white p-6 sm:p-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <span className="inline-block border border-gray-800 bg-black px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
            {event.category || 'Vijesti'}
          </span>

          {isVerified ? (
            <div className="inline-flex items-center gap-2 border border-green-700 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-green-700">
              <span className="h-1.5 w-1.5 bg-green-600"></span>
              <span>Verificirano na Blockchainu</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 border border-yellow-600 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-yellow-700">
              <span className="h-1.5 w-1.5 bg-yellow-500"></span>
              <span>Čeka se blockchain verifikacija</span>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-black leading-tight text-gray-900 sm:text-4xl">
          {event.title}
        </h1>

        {isVerified && (
          <div className="mt-8 border border-gray-200 bg-gray-50 p-4 font-mono text-xs text-gray-700">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Blockchain Tx Hash</div>
            <div className="break-all font-medium">{event.blockchain_tx_hash}</div>
          </div>
        )}

        <hr className="my-10 border-gray-200" />

        <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-900">
          Analiza izvora i povezani članci ({event.articles?.length || 0})
        </h2>

        <div className="space-y-4">
          {event.articles && event.articles.length > 0 ? (
            event.articles.map((article, index) => (
              <div key={index} className="flex flex-col gap-4 border-l-4 border-gray-300 bg-gray-50 p-4 transition-colors hover:border-black sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <span className="border border-gray-300 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-800">
                      {article.source}
                    </span>
                    <span className="text-[11px] font-medium text-gray-500">
                      {article.published_at ? new Date(article.published_at).toLocaleString('hr-HR') : 'Nepoznat datum'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2">
                    {article.title}
                  </h4>
                </div>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center justify-center border border-black bg-transparent px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-black hover:text-white"
                >
                  Izvorna vijest ↗
                </a>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 font-medium">Ovaj događaj nema dodatnih analiziranih izvora.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;