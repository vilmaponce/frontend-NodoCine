// src/components/SearchBar.jsx
export default function SearchBar() {
    const [query, setQuery] = useState('');
  
    return (
      <div className="relative max-w-md mx-auto mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar películas..."
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg pl-10 focus:ring-2 focus:ring-red-500"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
      </div>
    );
  }