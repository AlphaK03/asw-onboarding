import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Step {
    id: number;
    description: string;
    mediaUrl: string;
    orderNumber: number;
}

export default function EmployeeOnboardingSteps() {
    const { id } = useParams(); // onboardingId
    const [steps, setSteps] = useState<Step[]>([]);

    useEffect(() => {
        if (id) {
            axios
                .get(`/api/steps/by-onboarding/${id}`)
                .then((res) => {
                    const sorted = res.data.sort((a: Step, b: Step) => a.orderNumber - b.orderNumber);
                    setSteps(sorted);
                })
                .catch((err) => console.error("Error fetching steps", err));
        }
    }, [id]);

    const extractYoutubeEmbed = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu.be\/)([a-zA-Z0-9_-]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-gray-100">
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-blue-700 text-center">
                    🧭 Onboarding Steps
                </h2>

                {steps.length === 0 ? (
                    <p className="text-center text-gray-400 italic">No steps available.</p>
                ) : (
                    <ul className="space-y-6">
                        {steps.map((step) => (
                            <li
                                key={step.id}
                                className="p-5 border border-gray-200 bg-gray-50 rounded-xl shadow-sm"
                            >
                                <p className="font-semibold text-indigo-700 text-lg mb-1">
                                    Step #{step.orderNumber}
                                </p>
                                <p className="text-gray-800">{step.description}</p>

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
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
