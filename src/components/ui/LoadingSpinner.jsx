export default function LoadingSpinner({ message = "Cargando..." }) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
        <p className="text-gray-300">{message}</p>
      </div>
    );
  }