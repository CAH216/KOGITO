import { getPendingTutors } from "@/actions/tutor-actions";
import VerificationList from "./VerificationList";

export default async function EmployeeTutorsVerificationPage() {
  let pendingTutors = [];
  try {
    pendingTutors = await getPendingTutors();
  } catch (err: any) {
    console.error("Failed to fetch pending tutors:", err);
    return (
        <div className="p-8 text-center text-red-600">
            Une erreur est survenue lors du chargement des tuteurs: {err.message}
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
         <h1 className="text-2xl font-bold text-slate-900">Vérification des Tuteurs</h1>
         <p className="text-slate-500 mt-2">
            Examinez les candidatures et validez les profils pour leur permettre d&apos;accéder à la plateforme.
         </p>
      </div>

      <VerificationList initialTutors={pendingTutors as any} />
    </div>
  );
}

