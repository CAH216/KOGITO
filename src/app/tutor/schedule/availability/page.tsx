import { getMyAvailability } from '@/actions/schedule-actions';
import AvailabilityEditor from './AvailabilityEditor';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AvailabilityPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/auth/login');

    const availability = await getMyAvailability();

    // @ts-ignore
    return <AvailabilityEditor initialAvailability={availability} />;
}
