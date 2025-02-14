import { useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { getDB } from "~/db/getDB";
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import { createViewDay, createViewWeek, createViewMonthGrid, createViewMonthAgenda } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import '@schedule-x/theme-default/dist/index.css';
import type { AnyAaaaRecord } from "node:dns";

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );

  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");

  
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: timesheetsAndEmployees.map((timesheet: any) => ({
      id: timesheet.id.toString(),
      title: `${timesheet.name} (Timesheet #${timesheet.id})`,
      start: timesheet.start_time.split('T')[0], 
      end: timesheet.end_time.split('T')[0], 
    })),
    plugins: [eventsService],
  });

  useEffect(() => {
    
    eventsService.getAll();
  }, []);

  
  const filteredTimesheets = timesheetsAndEmployees.filter((timesheet: any) => {
    const fullName = timesheet.name || ""; 
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Timesheets</h1>

      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by employee name..."
          className="w-full max-w-md px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Toggle Buttons for Views */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${
            viewMode === "table" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setViewMode("table")}
        >
          Table View
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            viewMode === "calendar" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setViewMode("calendar")}
        >
          Calendar View
        </button>
      </div>

      {/* Display Table or Calendar Based on View Mode */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Timesheet ID</th>
                <th className="border border-gray-300 px-4 py-2">Employee</th>
                <th className="border border-gray-300 px-4 py-2">Start Time</th>
                <th className="border border-gray-300 px-4 py-2">End Time</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimesheets.length > 0 ? (
                filteredTimesheets.map((timesheet: any) => (
                  <tr key={timesheet.id} className="border border-gray-300 hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">#{timesheet.id}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {timesheet.name} (ID: {timesheet.employee_id})
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{timesheet.start_time}</td>
                    <td className="border border-gray-300 px-4 py-2">{timesheet.end_time}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <a
                        href={`/timesheets/${timesheet.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center py-4 text-gray-500">
                    No matching results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      )}

      {/* Navigation Links */}
      <div className="mt-6 flex justify-between">
        <a href="/timesheets/new" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          + New Timesheet
        </a>
        <a href="/employees" className="text-blue-500 hover:underline">
          View Employees
        </a>
      </div>
    </div>
  );
}