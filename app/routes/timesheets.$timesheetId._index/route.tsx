import { useLoaderData, Form, Link, useNavigate, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import { useState } from "react";


export async function loader({ params }: any) {
  if (!params.timesheetId) {
    throw new Error("Timesheet ID is missing in the URL.");
  }

  const db = await getDB();
  const timesheet = await db.get("SELECT * FROM timesheets WHERE id = ?", Number(params.timesheetId));

  if (!timesheet) {
    throw new Response("Timesheet Not Found", { status: 404 });
  }

  return { timesheet };
}


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary");

  if (!id) {
    throw new Error("Timesheet ID is missing.");
  }

  const db = await getDB();
  await db.run(
    `UPDATE timesheets 
     SET start_time = ?, end_time = ?, summary = ? 
     WHERE id = ?`,
    [start_time, end_time, summary, id]
  );

  return redirect(`/timesheets/`);
};

export default function TimesheetPage() {
  const { timesheet } = useLoaderData();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        {isEditing ? "Edit Timesheet" : "Timesheet Details"}
      </h1>

      {/* Edit Button */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mb-6"
        >
          Edit Timesheet
        </button>
      )}

      {/* Display Mode */}
      {!isEditing ? (
        <div className="space-y-4">
          <div><strong>Start Time:</strong> {timesheet.start_time}</div>
          <div><strong>End Time:</strong> {timesheet.end_time}</div>
          <div><strong>Summary:</strong> {timesheet.summary}</div>
        </div>
      ) : (
        // Edit Mode
        <Form method="post" className="space-y-4">
          {/* Hidden input for timesheet ID */}
          <input type="hidden" name="id" value={timesheet.id} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              name="start_time"
              defaultValue={timesheet.start_time}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="datetime-local"
              name="end_time"
              defaultValue={timesheet.end_time}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Summary</label>
            <input
              type="text"
              name="summary"
              defaultValue={timesheet.summary}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Submit and Cancel Buttons */}
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
      </ul>
    </div>
  );
}
