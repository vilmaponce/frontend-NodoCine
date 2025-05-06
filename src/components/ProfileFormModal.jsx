// import { useState, useEffect } from 'react';
// import { XMarkIcon } from '@heroicons/react/24/outline';


// const ProfileFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     isChild: false,
//     image: null,
//     imagePreview: null
//   });

//   // Inicialización correcta del estado
//   useEffect(() => {
//     if (isOpen) {
//       setFormData({
//         name: initialData?.name || '',
//         isChild: initialData?.isChild || false,
//         image: null,
//         // Asegúrate de construir la URL completa si la imagen existe
//         imagePreview: initialData?.imageUrl 
//           ? `http://localhost:3001${initialData.imageUrl}` 
//           : '/images/profiles/default-profile.png'
//       });
//     }
//   }, [isOpen, initialData]);
  

//   // Manejo de cambios corregido
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   // Manejo de archivos separado
//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({
//           ...prev,
//           image: file,
//           imagePreview: reader.result
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = new FormData();
//       data.append('name', formData.name);
//       data.append('isChild', formData.isChild);

//       if (formData.image) {
//         data.append('image', formData.image);
//       }

//       console.log('Datos a enviar:', {
//         name: formData.name,
//         hasImage: !!formData.image
//       });

//       await onSubmit(data); // Esta función debe llamar a handleUpdateProfile
//       onClose();
//     } catch (error) {
//       console.error('Error en submit:', error);
//       // Mostrar error al usuario (puedes usar toast, alert, etc.)
//       alert(error.message || 'Error al actualizar perfil');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">
//             {initialData ? 'Editar Perfil' : 'Crear Nuevo Perfil'}
//           </h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <XMarkIcon className="h-6 w-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-6 flex flex-col items-center">
//             <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mb-4">
//               {formData.imagePreview ? (
//                 <img
//                   src={formData.imagePreview}
//                   alt="Preview"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                   <span className="text-gray-500">Sin imagen</span>
//                 </div>
//               )}
//             </div>
//             <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
//               Cambiar imagen
//               <input
//                 type="file"
//                 name="image"
//                 onChange={handleImageChange}
//                 accept="image/*"
//                 className="hidden"
//               />
//             </label>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white" // Añadido text-gray-900 y bg-white
//               required
//               autoComplete="off"
//             />
//           </div>

//           <div className="mb-6">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="isChild"
//                 checked={formData.isChild}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <span className="ml-2 text-sm text-gray-700">Perfil infantil</span>
//             </label>
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               Cancelar
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               {initialData ? 'Actualizar' : 'Crear'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProfileFormModal;