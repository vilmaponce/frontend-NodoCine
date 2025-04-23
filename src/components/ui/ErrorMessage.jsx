export default function ErrorMessage({ message, error, onRetry }) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h2 className="text-2xl text-red-500 mb-2">{message}</h2>
        <p className="text-gray-300 mb-4 max-w-md">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }