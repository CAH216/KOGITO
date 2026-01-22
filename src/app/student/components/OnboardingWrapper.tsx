'use client';

import { useRouter } from 'next/navigation';
import OnboardingWizard from './OnboardingWizard';

export default function OnboardingWrapper({ 
    initialName,
    initialInterests,
    initialLearningStyle,
    initialStrengths,
    initialWeaknesses
}: { 
    initialName: string,
    initialInterests?: string[],
    initialLearningStyle?: string,
    initialStrengths?: string[],
    initialWeaknesses?: string[]
}) {
    const router = useRouter();

    const handleComplete = () => {
        router.refresh();
        // If we are in settings page, we might want to redirect to dashboard, or just refresh.
        // For now refresh is fine.
    };

    return (
        <OnboardingWizard 
            initialName={initialName} 
            initialInterests={initialInterests}
            initialLearningStyle={initialLearningStyle}
            initialStrengths={initialStrengths}
            initialWeaknesses={initialWeaknesses}
            onComplete={handleComplete} 
        />
    );
}