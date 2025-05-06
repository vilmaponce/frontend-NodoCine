// src/components/MovieFormSimple.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { XMarkIcon, CheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Validación con Yup
const movieSchema = yup.object({
  title: yup.string().required('El título es obligatorio'),
  director: yup.string(),
  year: yup.number().typeError('Debe ser un número'),
  genre: yup.string().required('Selecciona un género'),
  rating: yup.number().typeError('Debe ser un número'),
  imageUrl: yup.string(),
  description: yup.string()
});

export default function MovieFormSimple(props) {
  console.log("MovieFormSimple props recibidas:", props);
  console.log("Tipo de props.onSave:", typeof props.onSave);
  console.log("Tipo de props.onClose:", typeof props.onClose);
  console.log("Tipo de props.onBackToList:", typeof props.onBackToList);
  console.log("Contenido de props.movie:", props.movie);

  // Desestructurar props con valores por defecto
  const {
    movie = {},
    onSave = () => console.log("No se proporcionó onSave"),
    onClose = () => console.log("No se proporcionó onClose"),
    onBackToList = () => console.log("No se proporcionó onBackToList")
  } = props;

  // Log de tipos
  console.log("Tipos de props:", {
    movieType: typeof movie,
    onSaveType: typeof onSave,
    onCloseType: typeof onClose,
    onBackToListType: typeof onBackToList
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(movieSchema),
    defaultValues: movie
  });

  const handleFormSubmit = (data) => {
    console.log("✅ Formulario enviado con datos:", data);
    onSave({
      ...data,
      _id: movie?._id
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <button
            type="button"
            className="absolute top-4 left-4 text-blue-400 hover:text-blue-300 z-10"
            onClick={onBackToList}
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>

          <h2 className="text-xl font-bold text-white mb-6 text-center pt-4">
            {movie?._id ? 'EDITAR PELÍCULA' : 'NUEVA PELÍCULA'}
          </h2>

          {/* Campos del formulario */}
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
                <option value="Romance">Romance</option>
                <option value="Aventura">Aventura</option>
                <option value="Animación">Animación</option>
                <option value="Documental">Documental</option>
                <option value="Fantasía">Fantasía</option>
                <option value="Drama">Drama</option>
                <option value="Ciencia ficción">Ciencia ficción</option>
                <option value="Terror">Terror</option>
              </select>
              {errors.genre && <p className="text-red-400 text-sm mt-1">{errors.genre.message}</p>}
            </div>

            {/* Campo de rating en el formulario */}
            <div>
              <label className="block text-gray-300 mb-2">Rating (0-10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                {...register('rating', {
                  valueAsNumber: true  // Asegura que se envíe como número
                })}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              />
              {errors.rating && (
                <p className="text-red-400 text-sm mt-1">{errors.rating.message}</p>
              )}
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
            <button
              type="button"
              onClick={onClose}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded"
            >
              <XMarkIcon className="h-5 w-5 mr-1" />
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded"
            >
              <CheckIcon className="h-5 w-5 mr-1" />
              {movie?._id ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

