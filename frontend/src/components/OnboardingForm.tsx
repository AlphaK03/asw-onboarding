import { useEffect, useState } from "react";
import axios from "axios";

interface Department {
  id: number;
  name: string;
}

export default function OnboardingForm() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState<number | null>(null);

  const fetchDepartments = async () => {
    const res = await axios.get("http://localhost:8080/api/departments");
    setDepartments(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !departmentId) return;

    try {
      await axios.post("http://localhost:8080/api/onboardings", {
        title,
        description,
        department: { id: departmentId },
      });
      setTitle("");
      setDescription("");
      setDepartmentId(null);
      alert("Onboarding created!");
    } catch (err) {
      console.error("Error creating onboarding", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white space-y-3">
      <h3 className="font-semibold text-lg">Create Onboarding</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded w-full"
      />
        <select
            value={departmentId ?? ""}
            onChange={(e) =>
                setDepartmentId(e.target.value === "" ? null : Number(e.target.value))
            }
            className="border p-2 rounded w-full"
        >
            <option value="">Select Department</option>
            {Array.isArray(departments) && departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
            ))}
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Create
        </button>
    </form>
  );
}
