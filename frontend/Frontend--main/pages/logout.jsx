import { getSupabaseServerClient } from '../lib/supabaseServer'

export default function Logout() {
  return null
}

export const getServerSideProps = async (ctx) => {
  const supabase = getSupabaseServerClient(ctx)
  await supabase.auth.signOut()

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  }
}
