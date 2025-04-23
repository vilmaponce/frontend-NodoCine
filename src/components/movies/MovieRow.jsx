export default function MovieRow({ title, movies }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map(movie => (
          <CardMovie key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}