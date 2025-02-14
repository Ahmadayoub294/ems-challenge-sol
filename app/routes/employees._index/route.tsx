import { useLoaderData } from "react-router";
import { getDB } from "~/db/getDB";
import { useState } from "react"; 

export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT * FROM employees;");
  return { employees };
}

export default function EmployeesPage() {
  const { employees } = useLoaderData();
  const [searchTerm, setSearchTerm] = useState(""); 
  const [sortField, setSortField] = useState("name"); 
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); 


  const filteredEmployees = employees.filter((employee: any) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEmployees = filteredEmployees.sort((a: any, b: any) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  
  const handleSort = (field: string) => {
    if (field === sortField) {
      
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Employees</h1>

      {/* Action Buttons and Search Bar */}
      <div className="flex justify-between mb-4">
        <a
          href="/employees/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + New Employee
        </a>
        <a href="/timesheets" className="text-blue-500 hover:underline">
          View Timesheets
        </a>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="text-left">
            <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort("job_title")}
              >
                Job Title {sortField === "job_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort("department")}
              >
                Department {sortField === "department" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort("salary")}
              >
                Salary {sortField === "salary" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.length > 0 ? (
              sortedEmployees.map((employee: any) => (
                <tr key={employee.id} className="border border-gray-300 hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{employee.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.job_title}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.department}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.salary}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <a
                      href={`/employees/${employee.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}