import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

const BookClient = dynamicImport(() => import('./BookClient'), { ssr: false });

export default function Page() {
  return <BookClient />;
}
