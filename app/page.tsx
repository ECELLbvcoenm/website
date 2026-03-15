import { supabase } from '../lib/supabase'

export default async function Home() {
  // This tries to fetch from the 'members' table we planned earlier
  const { data: members, error } = await supabase.from('members').select('*')

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">E-Cell Connection Test</h1>

      {error && (
        <p className="text-red-500 mt-4"> Error: {error.message}</p>
      )}

      {!error && (
        <p className="text-green-500 mt-4">
          ✅ Supabase is connected! Found {members?.length || 0} members.
        </p>
      )}
    </main>
  )
}