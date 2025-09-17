// import { useState, useRef, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import { FaChevronDown } from 'react-icons/fa';
// import { useClickOutside } from '../hooks/useClickOutside';

// const getDropdownLinkClassName = ({ isActive }) =>
//   `block w-full text-left px-4 py-2 text-sm transition-colors duration-200 rounded-md ${
//     isActive 
//       ? 'bg-blue-100 text-blue-700' 
//       : 'text-gray-700 hover:bg-gray-100'
//   }`;

// export default function AdminDropdown({ user, closeAllMenus }) {
//   // `isOpen` will now control the animation classes
//   const [isOpen, setIsOpen] = useState(false);
  
//   // New state to manage the actual presence of the dropdown content in the DOM
//   const [isMounted, setIsMounted] = useState(false);
  
//   const dropdownRef = useRef(null);

//   useClickOutside(dropdownRef, () => setIsOpen(false));

//   // This effect synchronizes the mounting state with the animation
//   useEffect(() => {
//     let timeoutId;
//     if (isOpen) {
//       // If we are opening the dropdown, mount the content immediately
//       setIsMounted(true);
//     } else {
//       // If we are closing, wait for the animation to finish before unmounting
//       timeoutId = setTimeout(() => {
//         setIsMounted(false);
//       }, 200); // This duration MUST match the transition duration below (duration-200)
//     }

//     // Cleanup function to clear the timeout if the component unmounts or `isOpen` changes
//     return () => clearTimeout(timeoutId);
//   }, [isOpen]);


//   useEffect(() => {
//     const handleEscape = (event) => {
//       if (event.key === 'Escape') {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('keydown', handleEscape);
//     return () => document.removeEventListener('keydown', handleEscape);
//   }, []);

//   const handleLinkClick = () => {
//     setIsOpen(false);
//     if (closeAllMenus) closeAllMenus();
//   };

//   if (!user || user.role !== 'admin') {
//     return null;
//   }

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center gap-1.5 font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md px-2 py-1"
//         aria-haspopup="true"
//         aria-expanded={isOpen}
//       >
//         Admin Tools
//         <FaChevronDown
//           className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
//         />
//       </button>

//       <div
//         className={`absolute right-0 mt-3 w-48 bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-1 ring-1 ring-black ring-opacity-5 transition-all ease-out duration-200 origin-top ${
//           // Animation classes are still controlled by `isOpen`
//           isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
//         }`}
//       >
//         {/* NOTE: The content is now rendered based on `isMounted`, not `isOpen` */}
//         {isMounted && (
//           <>
//             <NavLink to="/admin" className={getDropdownLinkClassName} onClick={handleLinkClick}>
//               Dashboard
//             </NavLink>
//             <NavLink to="/admin/add-user" className={getDropdownLinkClassName} onClick={handleLinkClick}>
//               Add User
//             </NavLink>
//             <NavLink to="/admin/add-store" className={getDropdownLinkClassName} onClick={handleLinkClick}>
//               Add Store
//             </NavLink>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };


import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import { useClickOutside } from '../hooks/useClickOutside';

const getDropdownLinkClassName = ({ isActive }) =>
  `block w-full text-left px-4 py-2 text-sm transition-colors duration-200 rounded-md ${
    isActive 
      ? 'bg-blue-100 text-blue-700' 
      : 'text-gray-700 hover:bg-gray-100'
  }`;

export default function AdminDropdown({ user, closeAllMenus }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    let timeoutId;
    if (isOpen) setIsMounted(true);
    else timeoutId = setTimeout(() => setIsMounted(false), 200);
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
    if (closeAllMenus) closeAllMenus();
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md px-2 py-1"
      >
        Admin Tools
        <FaChevronDown
          className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`absolute right-0 mt-3 w-48 bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-1 ring-1 ring-black ring-opacity-5 transition-all ease-out duration-200 origin-top ${
          isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
        }`}
      >
        {isMounted && (
          <>
            <NavLink to="/admin" className={getDropdownLinkClassName} onClick={handleLinkClick}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/add-user" className={getDropdownLinkClassName} onClick={handleLinkClick}>
              Add User
            </NavLink>
            <NavLink to="/admin/add-store" className={getDropdownLinkClassName} onClick={handleLinkClick}>
              Add Store
            </NavLink>
            <NavLink to="/admin/stores" className={getDropdownLinkClassName} onClick={handleLinkClick}>
              Manage Stores
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}
