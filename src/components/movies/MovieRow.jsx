// src/components/movies/MovieRow.jsx
import CardMovie from './CardMovie';

export default function MovieRow({ title, movies }) {
  return (
    <div className="mb-8 px-4">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {movies.map(movie => (
            <div key={movie._id} className="flex-none w-48">
              <CardMovie movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}