import { Form, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const phone = formData.get("phone");
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = formData.get("salary");
  const date_of_birth = formData.get("date_of_birth");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date") || null;

  const db = await getDB();
  await db.run(
    'INSERT INTO employees (name, phone, job_title, department, salary, date_of_birth, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, phone, job_title, department, salary, date_of_birth, start_date, end_date]
  );

  return redirect("/employees");
};

export default function NewEmployeePage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create New Employee
        </h1>

        <Form method="post" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Name */}
            <label className="block">
              <span className="text-gray-700 font-medium">Name:</span>
              <input
                name="name"
                required
                className="input-field"
                placeholder="Enter employee name"
              />
            </label>

            {/* Phone */}
            <label className="block">
              <span className="text-gray-700 font-medium">Phone:</span>
              <input
                name="phone"
                required
                className="input-field"
                placeholder="Enter phone number"
              />
            </label>

            {/* Job Title */}
            <label className="block">
              <span className="text-gray-700 font-medium">Job Title:</span>
              <input
                name="job_title"
                required
                className="input-field"
                placeholder="Enter job title"
              />
            </label>

            {/* Department */}
            <label className="block">
              <span className="text-gray-700 font-medium">Department:</span>
              <input
                name="department"
                required
                className="input-field"
                placeholder="Enter department"
              />
            </label>

            {/* Salary */}
            <label className="block">
              <span className="text-gray-700 font-medium">Salary ($):</span>
              <input
                type="number"
                name="salary"
                required
                className="input-field"
                placeholder="Enter salary amount"
              />
            </label>

            {/* Date of Birth */}
            <label className="block">
              <span className="text-gray-700 font-medium">Date of Birth:</span>
              <input
                type="date"
                name="date_of_birth"
                required
                className="input-field"
              />
            </label>

            {/* Start Date */}
            <label className="block">
              <span className="text-gray-700 font-medium">Start Date:</span>
              <input
                type="date"
                name="start_date"
                required
                className="input-field"
              />
            </label>

            {/* End Date */}
            <label className="block">
              <span className="text-gray-700 font-medium">End Date (Optional):</span>
              <input type="date" name="end_date" className="input-field" />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </Form>

        {/* Navigation Links */}
        <div className="mt-6 text-center">
          <a href="/employees" className="text-blue-500 hover:underline mr-4">
            View Employees
          </a>
          <a href="/timesheets" className="text-blue-500 hover:underline">
            View Timesheets
          </a>
        </div>
      </div>
    </div>
  );
}
