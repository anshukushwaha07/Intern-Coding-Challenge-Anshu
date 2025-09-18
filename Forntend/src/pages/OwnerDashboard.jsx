import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import { FaStar, FaSpinner } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiInbox } from "react-icons/fi";

const RatingStars = ({ rating }) => {
  const totalStars = 5;
  const filledStars = Math.round(rating); 
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        <FaStar
          key={index}
          className={index < filledStars ? "text-yellow-400" : "text-gray-300"}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">{Number(rating).toFixed(1)}</span>
    </div>
  );
};

// --- Helper Component for the Table Skeleton Loader ---
const TableSkeleton = () => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="bg-gray-500/10">
          <th className="px-6 py-3 h-12"></th>
          <th className="px-6 py-3 h-12"></th>
          <th className="px-6 py-3 h-12"></th>
          <th className="px-6 py-3 h-12"></th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, i) => (
          <tr key={i} className="border-b border-gray-500/10 animate-pulse">
            <td className="px-6 py-4"><div className="h-4 bg-gray-300/50 rounded w-3/4"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-300/50 rounded w-1/2"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-300/50 rounded w-3/4"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-300/50 rounded w-full"></div></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


export default function OwnerDashboard() {
  const [ratings, setRatings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const limit = 5; // items per page

  const fetchRatings = async (pageNum) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.get(`/owner/ratings?page=${pageNum}&limit=${limit}`);
      setRatings(res.data.data);
      setTotal(res.data.total);
      setPage(res.data.page);
    } catch (err) {
      setError(err.response?.data?.message || "Error loading ratings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings(page);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- Intentionally only fetch on mount, pagination handled manually

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    fetchRatings(newPage);
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Owner Dashboard</h1>
          <p className="mt-1 text-gray-600">Recent ratings submitted for your stores.</p>
        </div>

        {error && (
            <div className="p-3 mb-6 rounded-lg text-sm font-medium border bg-red-500/10 border-red-500/30 text-red-700">
                {error}
            </div>
        )}

        {/* Main Content Area */}
        <div className="min-h-[350px]">
          {isLoading ? (
            <TableSkeleton />
          ) : ratings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 text-gray-500">
              <FiInbox className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No Ratings Yet</h3>
              <p>When users rate your stores, the ratings will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-neutral-600">
                <thead className="text-xs text-neutral-700 uppercase bg-gray-500/10">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-l-lg">Store</th>
                    <th scope="col" className="px-6 py-3">Rating</th>
                    <th scope="col" className="px-6 py-3">Rated By</th>
                    <th scope="col" className="px-6 py-3 rounded-r-lg">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((r) => (
                    <tr key={r.rating_id} className="border-b border-gray-500/10 last:border-b-0">
                      <td className="px-6 py-4 font-medium text-neutral-900">{r.store_name}</td>
                      <td className="px-6 py-4"><RatingStars rating={r.rating} /></td>
                      <td className="px-6 py-4">{r.rated_by}</td>
                      <td className="px-6 py-4">{r.rated_by_email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && !isLoading && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-500/20">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}