import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd";

interface Step {
    id: number;
    description: string;
    mediaUrl: string;
    orderNumber: number;
}

interface Onboarding {
    id: number;
    title: string;
    description: string;
}

export default function OnboardingSteps() {
    const { onboardingId } = useParams();
    const [steps, setSteps] = useState<Step[]>([]);
    const [onboarding, setOnboarding] = useState<Onboarding | null>(null);
    const [showModal, setShowModal] = useState(false);

    const [description, setDescription] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [orderNumber, setOrderNumber] = useState(1);
    const [error, setError] = useState("");

    useEffect(() => {
        if (onboardingId) {
            fetchSteps();
            fetchOnboarding();
        }
    }, [onboardingId]);

    const fetchSteps = async () => {
        try {
            const res = await axios.get(`/api/steps/by-onboarding/${onboardingId}`);
            const sorted = Array.isArray(res.data)
                ? res.data.sort((a, b) => a.orderNumber - b.orderNumber)
                : [];
            setSteps(sorted);
            const nextOrder = sorted.length > 0 ? sorted[sorted.length - 1].orderNumber + 1 : 1;
            setOrderNumber(nextOrder);
        } catch (err) {
            console.error("Error fetching steps", err);
        }
    };

    const fetchOnboarding = async () => {
        try {
            const res = await axios.get(`/api/onboardings/${onboardingId}`);
            setOnboarding(res.data);
        } catch (err) {
            console.error("Error fetching onboarding", err);
        }
    };

    const handleCreate = async () => {
        if (!description.trim()) {
            setError("Description is required.");
            return;
        }

        try {
            await axios.post("/api/steps", {
                description,
                mediaUrl,
                orderNumber,
                onboarding: { id: onboardingId }
            });
            setDescription("");
            setMediaUrl("");
            setOrderNumber(steps.length + 1);
            setError("");
            fetchSteps();
        } catch (err) {
            console.error("Error creating step", err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/api/steps/${id}`);
            setSteps((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Error deleting step", err);
        }
    };

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const reordered = Array.from(steps);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);

        const updated = reordered.map((step, index) => ({
            ...step,
            orderNumber: index + 1
        }));

        setSteps(updated);

        try {
            await axios.put("/api/steps/reorder", updated);
        } catch (err) {
            console.error("Error updating step order", err);
        }
    };

    const extractYoutubeEmbed = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu.be\/)([a-zA-Z0-9_-]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-gray-100">

                {/* Modal para editar onboarding */}
                {showModal && onboarding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ✖
                            </button>
                            <h3 className="text-xl font-semibold text-blue-700 mb-4">✏️ Edit Onboarding</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={onboarding.title}
                                    onChange={(e) => setOnboarding({ ...onboarding, title: e.target.value })}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow text-sm"
                                    placeholder="Title"
                                />
                                <textarea
                                    value={onboarding.description}
                                    onChange={(e) => setOnboarding({ ...onboarding, description: e.target.value })}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow text-sm"
                                    placeholder="Description"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg shadow text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            await axios.put(`/api/onboardings/${onboardingId}`, onboarding);
                                            setShowModal(false);
                                        } catch (err) {
                                            console.error("Error updating onboarding", err);
                                        }
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow text-sm"
                                >
                                    💾 Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 🧭 Título y botón de edición */}
                {onboarding && (
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-700 mb-2">
                            🚀 {onboarding.title}
                        </h2>
                        <p className="text-gray-600 mb-4">{onboarding.description}</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow"
                        >
                            ✏️ Edit Onboarding
                        </button>
                    </div>
                )}

                {/* ➕ Crear nuevo paso */}
                <div className="space-y-4 mb-10">
          <textarea
              placeholder="📝 Step Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-xl px-4 py-3 text-sm shadow placeholder-gray-400 transition-all"
          />
                    <input
                        type="text"
                        placeholder="🌐 Media URL (optional)"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        className="w-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-xl px-4 py-3 text-sm shadow placeholder-gray-400 transition-all"
                    />
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <button
                            onClick={handleCreate}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow-lg font-medium text-sm"
                        >
                            ➕ Add Step
                        </button>
                        <button
                            onClick={() => {
                                setDescription("");
                                setMediaUrl("");
                                setOrderNumber(steps.length + 1);
                                setError("");
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-xl shadow font-medium text-sm"
                        >
                            🧼 Clear
                        </button>
                    </div>
                </div>

                {/* 📋 Lista de pasos */}
                {steps.length === 0 ? (
                    <p className="text-center text-gray-400 italic text-sm">No steps yet.</p>
                ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="stepsList">
                            {(provided) => (
                                <ul
                                    className="space-y-5 list-none p-0"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {steps.map((step, index) => (
                                        <Draggable key={step.id} draggableId={step.id.toString()} index={index}>
                                            {(provided) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="border border-gray-300 p-5 bg-white rounded-2xl shadow hover:shadow-lg transition"
                                                >
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-indigo-700 text-lg mb-1">
                                                                🪜 Step #{step.orderNumber}
                                                            </p>
                                                            <p className="text-gray-800 text-sm">{step.description}</p>
                                                            {step.mediaUrl &&
                                                                (extractYoutubeEmbed(step.mediaUrl) ? (
                                                                    <iframe
                                                                        width="100%"
                                                                        height="200"
                                                                        src={extractYoutubeEmbed(step.mediaUrl)!}
                                                                        className="mt-4 rounded-lg shadow"
                                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                        allowFullScreen
                                                                    ></iframe>
                                                                ) : (
                                                                    <p className="text-sm text-blue-600 mt-3">
                                                                        Media: {step.mediaUrl}
                                                                    </p>
                                                                ))}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDelete(step.id)}
                                                            className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </div>
        </div>
    );
}
