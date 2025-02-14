import { useLoaderData, Form, redirect } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all('SELECT id, name FROM employees');
  return { employees };
}

import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id"); 
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary");

  const db = await getDB();
  await db.run(
    'INSERT INTO timesheets (employee_id, start_time, end_time,summary) VALUES (?, ?, ?, ?)',
    [employee_id, start_time, end_time,summary]
  );

  return redirect("/timesheets");
}

export default function NewTimesheetPage() {
  const { employees } = useLoaderData(); 
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-4">Create New Timesheet</h1>

      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="employee_id" className="block text-gray-700 font-medium">
            Select Employee
          </label>
          <select name="employee_id" id="employee_id" required className="input-field">
            <option value="">-- Select an Employee --</option>
            {employees.map((employee: any) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="start_time" className="block text-gray-700 font-medium">
            Start Time
          </label>
          <input type="datetime-local" name="start_time" id="start_time" required className="input-field" />
        </div>

        <div>
          <label htmlFor="end_time" className="block text-gray-700 font-medium">
            End Time
          </label>
          <input type="datetime-local" name="end_time" id="end_time" required className="input-field" />
        </div>

        <div>
          <label className="block">
            <span className="text-gray-700">Summary:</span>
            <input name="summary" required className="input-field" />
          </label>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Create Timesheet
        </button>
      </Form>

      <hr className="my-4" />
      <div className="flex justify-between">
        <a href="/timesheets" className="text-blue-500 hover:underline">View Timesheets</a>
        <a href="/employees" className="text-blue-500 hover:underline">View Employees</a>
      </div>
    </div>
  );
}
