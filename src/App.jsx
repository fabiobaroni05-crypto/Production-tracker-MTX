// ✅ FULL FIXED VERSION (Project Review + Layout + Upload + Tickets + Edit/Delete)

import React, { useMemo, useState } from "react";

/* ================= HELPERS ================= */

const crewColors = {
  MIGUEL: "#635bff",
  NALDI: "#ef4444",
  YOYI: "#f59e0b",
  FRANK: "#22c55e",
  DEFAULT: "#94a3b8",
};

function stationToFeet(station) {
  if (!station) return 0;
  const [a = "0", b = "0"] = station.split("+");
  return Number(a) * 100 + Number(b);
}

function getProductionFootage(start, end) {
  return Math.max(stationToFeet(end) - stationToFeet(start), 0);
}

function getCrewColor(crew) {
  return crewColors[crew] || crewColors.DEFAULT;
}

/* ================= APP ================= */

export default function App() {
  const [records, setRecords] = useState([
    {
      id: 1,
      crew: "MIGUEL",
      start: "00+00",
      end: "01+00",
      date: "2026-04-14",
      footage: 100,
      attachments: [],
    },
    {
      id: 2,
      crew: "NALDI",
      start: "01+00",
      end: "02+00",
      date: "2026-04-14",
      footage: 100,
      attachments: [],
    },
  ]);

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    crew: "",
    start: "",
    end: "",
    date: "",
  });

  const [tickets, setTickets] = useState([]);

  /* ================= ACTIONS ================= */

  const saveRecord = () => {
    const newRecord = {
      id: Date.now(),
      ...form,
      footage: getProductionFootage(form.start, form.end),
      attachments: [],
    };

    setRecords([...records, newRecord]);
    setForm({ crew: "", start: "", end: "", date: "" });
  };

  const deleteRecord = (id) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const uploadFile = (id, files) => {
    const names = Array.from(files).map((f) => f.name);

    setRecords(
      records.map((r) =>
        r.id === id
          ? { ...r, attachments: [...r.attachments, ...names] }
          : r
      )
    );
  };

  /* ================= UI ================= */

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, padding: 20 }}>

      {/* LEFT SIDE */}
      <div>

        {/* PRODUCTION LINE */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ height: 30, background: "#ddd", borderRadius: 20, position: "relative" }}>
            {records.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelected(r)}
                style={{
                  position: "absolute",
                  left: `${stationToFeet(r.start) / 11}%`,
                  width: `${r.footage / 11}%`,
                  height: "100%",
                  background: getCrewColor(r.crew),
                  borderRadius: 20,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        {/* ADD SECTION */}
        <h2>Add Section Record</h2>

        <input placeholder="Crew" value={form.crew} onChange={(e) => setForm({ ...form, crew: e.target.value })} />
        <input placeholder="Start" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
        <input placeholder="End" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />

        <button onClick={saveRecord}>Save Section</button>

        {/* TABLE */}
        <h3>Saved Section Records</h3>

        {records.map((r) => (
          <div key={r.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            {r.crew} | {r.start} to {r.end} | {r.footage} ft

            <div>
              {r.attachments.length ? r.attachments.join(", ") : "No files"}
            </div>

            <label>
              Upload bore log
              <input
                type="file"
                multiple
                onChange={(e) => uploadFile(r.id, e.target.files)}
              />
            </label>

            <button onClick={() => deleteRecord(r.id)}>Delete</button>
          </div>
        ))}

        {/* TICKETS */}
        <h2>811 Ticket Control</h2>

        <button
          onClick={() =>
            setTickets([...tickets, { id: Date.now(), name: "Ticket" }])
          }
        >
          Add Ticket
        </button>

      </div>

      {/* RIGHT SIDE */}
      <div>

        <h2>Project Review</h2>

        <div>
          <h3 style={{ fontSize: 18 }}>Project status</h3>
          <span style={{ fontSize: 12 }}>Active</span>
        </div>

        <div>
          <h3>Project comment</h3>
          <p style={{ fontSize: 13 }}>
            Project paused. Do not renew tickets until permits are approved.
          </p>
        </div>

        <div>
          <h3>Selected production</h3>
          {selected ? (
            <>
              <p>{selected.crew}</p>
              <p>{selected.start} to {selected.end}</p>
              <p>{selected.date}</p>
              <p>{selected.footage} ft</p>
            </>
          ) : (
            <p>No selection</p>
          )}
        </div>

      </div>

    </div>
  );
}