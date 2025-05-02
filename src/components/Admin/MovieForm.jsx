import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { XMarkIcon, CheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';


// Validación con Yup
const movieSchema = yup.object({
  title: yup.string().required('El título es obligatorio'),
  director: yup.string(),
  year: yup
    .number()
    .typeError('Debe ser un número')
    .min(1900, 'El año debe ser mayor a 1900')
    .max(new Date().getFullYear(), 'No puede ser futuro'),
  genre: yup.string().required('Selecciona un género'),
  rating: yup
    .number()
    .typeError('Debe ser un número')
    .min(0, 'Mínimo 0')
    .max(10, 'Máximo 10'),
  imageUrl: yup
    .string()
    .test(
      'is-url-or-path',
      'Debe ser una URL válida o una ruta de imagen (ej: /images/photo.jpg)',
      (value) => {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return /^\/?images\/[a-zA-Z0-9_\-\.]+\.(png|jpg|jpeg|gif)$/i.test(value);
        }
      }
    ),
  description: yup.string().max(500, 'Máximo 500 caracteres'),
});

export default function MovieForm({ movie = {}, onSubmit = () => {}, onCancel = () => {}, onBackToList = () => {} }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(movieSchema),
    defaultValues: movie
  });

  useEffect(() => {
    reset(movie);
  }, [movie, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit({
        ...data,
        _id: movie?._id
      });
    } catch (error) {
      console.error('Error en el formulario:', error);
      throw error;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        
        <button type="button" onClick={onBackToList} className="absolute top-4 left-4 text-blue-400 hover:text-blue-300">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 text-center">
          {movie?._id ? 'EDITAR PELÍCULA' : 'NUEVA PELÍCULA'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-gray-300 mb-2">Título*</label>
            <input {...register('title')} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Director</label>
            <input {...register('director')} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Año</label>
            <input type="number" {...register('year')} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
            {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year.message}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Género*</label>
            <select {...register('genre')} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600">
              <option value="">Seleccionar...</option>
              <option value="Acción">Acción</option>
              <option value="Comedia">Comedia</option>
              <option value="Drama">Drama</option>
              <option value="Ciencia ficción">Ciencia ficción</option>
              <option value="Terror">Terror</option>
            </select>
            {errors.genre && <p className="text-red-400 text-sm mt-1">{errors.genre.message}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Rating (0-10)</label>
            <input type="number" step="0.1" {...register('rating')} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
            {errors.rating && <p className="text-red-400 text-sm mt-1">{errors.rating.message}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">URL de Imagen</label>
            <input {...register('imageUrl')} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
            {errors.imageUrl && <p className="text-red-400 text-sm mt-1">{errors.imageUrl.message}</p>}
          </div>

          <div className="col-span-2">
            <label className="block text-gray-300 mb-2">Descripción</label>
            <textarea {...register('description')} rows={3} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600" />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={onCancel} className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded">
            <XMarkIcon className="h-5 w-5 mr-1" />
            Cancelar
          </button>
          <button type="submit" className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded">
            <CheckIcon className="h-5 w-5 mr-1" />
            {movie?._id ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
