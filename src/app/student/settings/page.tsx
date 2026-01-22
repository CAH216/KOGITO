import { getStudentProfileStatus } from '@/app/actions/kogito-actions';
import OnboardingWrapper from '../components/OnboardingWrapper';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
    const profile = await getStudentProfileStatus();
    
    if (!profile) return redirect('/auth/login');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
             {/* Reuse the wizard but maybe we want a "Cancel" button? 
                 For now, the Wizard is full screen. That's fine for "Edit Profile" flow.
             */}
             <OnboardingWrapper 
                initialName={profile.name}
                initialInterests={profile.interests}
                initialLearningStyle={profile.learningStyle}
                initialStrengths={profile.strengths}
                initialWeaknesses={profile.weaknesses}
             />
        </div>
    );
}