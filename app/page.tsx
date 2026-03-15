'use client' // We need this for the toggle state
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [members, setMembers] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    async function fetchData() {
      const { data: mems } = await supabase.from('members').select('*').order('rank', { ascending: true })
      const { data: evs } = await supabase.from('events').select('*').order('date', { ascending: false })
      setMembers(mems || [])
      setEvents(evs || [])
    }
    fetchData()
  }, [])

  // Filter logic: In a real app, compare event.date with today's date
  const filteredEvents = events.filter(event => {
    const isPast = new Date(event.date) < new Date()
    return filter === 'upcoming' ? !isPast : isPast
  })

  return (
    <main className="min-h-screen bg-black text-white p-8 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">

        {/* --- THE COUNCIL SECTION --- */}
        <header className="mb-12">
          <h1 className="text-6xl font-black tracking-tighter italic hover:text-blue-500 transition-colors cursor-default">THE COUNCIL.</h1>
          <p className="text-zinc-500 mt-2 text-lg font-medium uppercase tracking-[0.2em]">Architects of Innovation</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {members.map((member) => (
            <div key={member.id} className="group relative bg-zinc-900/30 border border-white/5 rounded-2xl p-6 transition-all duration-500 hover:border-blue-500/40">
              <div className="aspect-square w-full bg-zinc-800/50 rounded-xl mb-6 flex items-center justify-center text-4xl font-bold text-zinc-700 grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-500 overflow-hidden">
                {member.name[0]}
              </div>
              <h3 className="text-xl font-bold tracking-tight">{member.name}</h3>
              <p className="text-blue-500 text-xs font-black uppercase tracking-widest mt-1">{member.role}</p>
            </div>
          ))}
        </div>

        {/* --- DYNAMIC EVENTS SECTION --- */}
        <section className="relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold tracking-tighter">TIMELINE.</h2>
              <p className="text-zinc-500 text-sm mt-1">Our journey from ideas to ventures.</p>
            </div>

            {/* NEON TOGGLE - Fixed spacing and positioning */}
            <div className="flex bg-zinc-900/80 p-1 rounded-full border border-white/10 backdrop-blur-md w-fit">
              <button 
                onClick={() => setFilter('upcoming')}
                className={`px-6 py-2 rounded-full text-[10px] tracking-widest font-black transition-all ${
                  filter === 'upcoming' 
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)]' 
                  : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                TRENDING
              </button>
              <button 
                onClick={() => setFilter('past')}
                className={`px-6 py-2 rounded-full text-[10px] tracking-widest font-black transition-all ${
                  filter === 'past' 
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)]' 
                  : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                LEGACY
              </button>
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="flex gap-8 overflow-x-auto pb-12 pt-4 scrollbar-hide snap-x snap-mandatory px-2">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="min-w-[320px] md:min-w-[450px] snap-center bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-[2rem] p-10 relative group transition-all duration-700 hover:border-blue-500/50 hover:shadow-[0_0_50px_-20px_rgba(59,130,246,0.3)]"
                >
                  <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.3em] mb-4 block">
                    {event.category || 'Event'}
                  </span>
                  <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-8">{event.description}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-zinc-600 font-mono text-xs italic">{new Date(event.date).toDateString()}</span>
                    <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center border border-dashed border-white/5 rounded-[2rem]">
              <p className="text-zinc-700 italic font-mono tracking-tighter uppercase">
                // No {filter} events discovered in the logs...
              </p>
            </div>
          )}
        </section>

      </div>
    </main>
  )
}