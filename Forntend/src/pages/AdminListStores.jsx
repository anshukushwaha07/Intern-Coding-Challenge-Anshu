import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios.js";
import { FaSpinner } from "react-icons/fa";

export default function AdminListStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/admin/stores")
      .then((res) => setStores(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Error loading stores")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="p-4 flex items-center">
        <FaSpinner className="animate-spin mr-2 text-blue-500" />
        Loading stores...
      </div>
    );

  if (error)
    return <div className="p-4 text-red-600 font-medium">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Stores</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner ID
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="px-6 py-4 text-sm text-gray-700">{store.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{store.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{store.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {store.owner_id || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-blue-600">
                  <Link
                    to={`/admin/stores/${store.id}/edit`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
