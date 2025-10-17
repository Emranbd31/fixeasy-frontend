import type { GetServerSideProps } from 'next';
import { getSupabaseServerClient } from '../lib/supabaseServer';

export default function Logout() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = getSupabaseServerClient(ctx);
  await supabase.auth.signOut();

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};
