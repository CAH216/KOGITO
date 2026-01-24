import { Star, MapPin, GraduationCap, ArrowRight, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TutorsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Nos Tuteurs Experts</h1>
                <p className="text-xl text-slate-500 max-w-2xl">
                    Sélectionnés parmi les meilleures universités, formés à notre pédagogie.
                </p>
            </div>
            <div className="flex gap-4">
                 <Link href="/tutors/apply" className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-50 transition-colors">
                    Devenir tuteur
                </Link>
                <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Filter className="w-5 h-5" /> Filtrer
                </button>
            </div>
        </div>

        {/* Tutors Grid */}
        <div className="grid md:grid-cols-4 gap-6">
            
            <TutorCard 
                name="Sarah Tremblay"
                subject="Mathématiques"
                level="Université"
                rating="5.0"
                reviews="42"
                school="Polytechnique"
                image="https://randomuser.me/api/portraits/women/44.jpg"
                hourly="45"
            />
             <TutorCard 
                name="David Chen"
                subject="Physique"
                level="Cégep"
                rating="4.9"
                reviews="28"
                school="McGill"
                image="https://randomuser.me/api/portraits/men/32.jpg"
                hourly="40"
            />
             <TutorCard 
                name="Emma Wilson"
                subject="Anglais"
                level="Secondaire"
                rating="5.0"
                reviews="156"
                school="Concordia"
                image="https://randomuser.me/api/portraits/women/68.jpg"
                hourly="35"
            />
             <TutorCard 
                name="Karim Benali"
                subject="Chimie"
                level="Collégial"
                rating="4.8"
                reviews="19"
                school="UdeM"
                image="https://randomuser.me/api/portraits/men/86.jpg"
                hourly="38"
            />

             <TutorCard 
                name="Chloé Dubois"
                subject="Français"
                level="Primaire/Sec."
                rating="5.0"
                reviews="34"
                school="UQAM"
                image="https://randomuser.me/api/portraits/women/22.jpg"
                hourly="32"
            />
             <TutorCard 
                name="Lucas Martin"
                subject="Informatique"
                level="Université"
                rating="5.0"
                reviews="12"
                school="ETS"
                image="https://randomuser.me/api/portraits/men/11.jpg"
                hourly="50"
            />
             <TutorCard 
                name="Sofia Rodriguez"
                subject="Espagnol"
                level="Tous niveaux"
                rating="4.9"
                reviews="67"
                school="UdeM"
                image="https://randomuser.me/api/portraits/women/90.jpg"
                hourly="35"
            />
             <TutorCard 
                name="Thomas Gagné"
                subject="Histoire"
                level="Secondaire"
                rating="4.7"
                reviews="8"
                school="Laval"
                image="https://randomuser.me/api/portraits/men/54.jpg"
                hourly="30"
            />

        </div>

        <div className="mt-16 text-center">
            <p className="text-slate-500 mb-6">Affichage de 8 tuteurs sur 124 disponibles</p>
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                Charger plus de tuteurs
            </button>
        </div>

      </div>
    </main>
  );
}

function TutorCard({ name, subject, level, rating, reviews, school, image, hourly }: any) {
    return (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
            <div className="relative mb-4">
                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                    <Image src={image} alt={name} fill className="object-cover" />
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {rating} <span className="text-slate-400 font-normal">({reviews})</span>
                </div>
            </div>
            
            <div className="mb-4">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{name}</h3>
                <p className="text-indigo-600 font-medium text-sm mb-1">{subject}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {school}</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div>
                     <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Tarif</p>
                     <p className="text-slate-900 font-bold">{hourly}$<span className="text-xs font-normal text-slate-500">/h</span></p>
                </div>
                <Link href="#" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    )
}
