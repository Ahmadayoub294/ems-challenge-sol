import { useLoaderData, Form, Link, useNavigate, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import { useState, useEffect } from "react"; 

export async function loader({ params }: any) {
  console.log("Params:", params); 
  console.log("Employee ID from URL:", params.employeeId); 

  if (!params.employeeId) {
    throw new Error("Employee ID is missing in the URL.");
  }

  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", Number(params.employeeId));

  console.log("Fetched Employee:", employee); 

  return { employee };
}


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData(); 

  const name = formData.get("name");
  const phone = formData.get("phone");
  const date_of_birth = formData.get("date_of_birth");
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = formData.get("salary");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");
  const id = formData.get("id");

  const db = await getDB();
  await db.run(
    `UPDATE employees 
     SET name = ?, phone = ?, date_of_birth = ?, job_title = ?, department = ?, salary = ?, start_date = ?, end_date = ?
     WHERE id = ?`,
    [name, phone, date_of_birth, job_title, department, salary, start_date, end_date, id]
  );

  return redirect("/employees");
};

export default function EmployeePage() {
  const { employee } = useLoaderData();
  const [isEditing, setIsEditing] = useState(true); 
  const navigate = useNavigate(); 

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Employee Not Found</h1>
        <p className="text-center text-gray-500">The requested employee does not exist.</p>
        <ul className="mt-6 space-y-2">
          <li>
            <Link to="/employees" className="text-blue-500 hover:underline">
              Back to Employees
            </Link>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        {isEditing ? "Edit Employee" : "Employee Details"}
      </h1>

      {/* Edit Button */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mb-6"
        >
          Edit Employee
        </button>
      )}

      {/* Display Mode */}
      {!isEditing && (
        <div className="space-y-4">
          <div>
            <strong>Name:</strong> {employee.name}
          </div>
          <div>
            <strong>Phone:</strong> {employee.phone}
          </div>
          <div>
            <strong>Date of Birth:</strong> {employee.date_of_birth}
          </div>
          <div>
            <strong>Job Title:</strong> {employee.job_title}
          </div>
          <div>
            <strong>Department:</strong> {employee.department}
          </div>
          <div>
            <strong>Salary:</strong> {employee.salary}
          </div>
          <div>
            <strong>Start Date:</strong> {employee.start_date}
          </div>
          <div>
            <strong>End Date:</strong> {employee.end_date || "N/A"}
          </div>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <Form method="post" className="space-y-4">
          {/* Hidden input for employee ID */}
          <input type="hidden" name="id" value={employee.id} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={employee.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              defaultValue={employee.phone}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              defaultValue={employee.date_of_birth}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              name="job_title"
              defaultValue={employee.job_title}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              name="department"
              defaultValue={employee.department}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="number"
              name="salary"
              defaultValue={employee.salary}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="start_date"
              defaultValue={employee.start_date}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="end_date"
              defaultValue={employee.end_date || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </Form>
      )}

      {/* Navigation Links */}
      <ul className="mt-6 space-y-2">
        <li>
          <Link to="/employees" className="text-blue-500 hover:underline">
            Back to Employees
          </Link>
        </li>
        <li>
          <Link to="/employees/new" className="text-blue-500 hover:underline">
            Add New Employee
          </Link>
        </li>
        <li>
          <Link to="/timesheets" className="text-blue-500 hover:underline">
            View Timesheets
          </Link>
        </li>
      </ul>
    </div>
  );
}