import { useEffect, useState } from "react";
import axios from "axios";

interface Onboarding {
    id: number;
    title: string;
}

interface OnboardingStep {
    id: number;
    description: string;
    mediaUrl: string;
    orderNumber: number;
    onboarding: Onboarding;
}

export default function OnboardingStepManager() {
    const [steps, setSteps] = useState<OnboardingStep[]>([]);
    const [onboardings, setOnboardings] = useState<Onboarding[]>([]);
    const [newDescription, setNewDescription] = useState("");
    const [newMediaUrl, setNewMediaUrl] = useState("");
    const [newOrder, setNewOrder] = useState<number>(1);
    const [selectedOnboardingId, setSelectedOnboardingId] = useState<number | null>(null);

    useEffect(() => {
        fetchOnboardings();
    }, []);

    useEffect(() => {
        if (selectedOnboardingId) {
            fetchSteps(selectedOnboardingId);
        }
    }, [selectedOnboardingId]);

    const fetchOnboardings = async () => {
        const res = await axios.get("http://localhost:8080/api/onboardings");
        setOnboardings(res.data);
    };

    const fetchSteps = async (onboardingId: number) => {
        const res = await axios.get(`http://localhost:8080/api/steps/by-onboarding/${onboardingId}`);
        setSteps(res.data);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDescription.trim() || !selectedOnboardingId) return;

        try {
            await axios.post("http://localhost:8080/api/steps", {
                description: newDescription,
                mediaUrl: newMediaUrl,
                orderNumber: newOrder,
                onboarding: { id: selectedOnboardingId }
            });
            setNewDescription("");
            setNewMediaUrl("");
            setNewOrder(1);
            fetchSteps(selectedOnboardingId);
        } catch (err) {
            console.error("Error creating step", err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/api/steps/${id}`);
            if (selectedOnboardingId) fetchSteps(selectedOnboardingId);
        } catch (err) {
            console.error("Error deleting step", err);
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded">
            <h2 className="text-2xl font-semibold mb-4">Manage Onboarding Steps</h2>

            <select
                value={selectedOnboardingId ?? ""}
                onChange={(e) => setSelectedOnboardingId(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded mb-4"
            >
                <option value="">Select Onboarding</option>
                {onboardings.map((o) => (
                    <option key={o.id} value={o.id}>
                        {o.title}
                    </option>
                ))}
            </select>

            <form onSubmit={handleCreate} className="space-y-4 mb-6">
                <input
                    type="text"
                    placeholder="Step description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Media URL (optional)"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Order"
                    value={newOrder}
                    onChange={(e) => setNewOrder(Number(e.target.value))}
                    className="w-full border px-3 py-2 rounded"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Add Step
                </button>
            </form>

            <ul className="space-y-2">
                {steps.map((step) => (
                    <li key={step.id} className="flex justify-between items-center border-b py-2">
                        <div>
                            <p className="font-bold">#{step.orderNumber} - {step.description}</p>
                            {step.mediaUrl && <a href={step.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">View media</a>}
                        </div>
                        <button
                            onClick={() => handleDelete(step.id)}
                            className="text-red-600 hover:underline"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
