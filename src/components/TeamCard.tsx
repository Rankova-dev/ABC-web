'use client';
import { useState } from 'react';
import Image from 'next/image';

interface TeamCardProps {
  name: string;
  role: string;
  specialty: string;
  initials: string;
  bio?: string;
  color?: string;
  large?: boolean;
  photo?: string;
}

export default function TeamCard({ name, role, specialty, initials, bio, color = 'bg-teal/10', large = false, photo }: TeamCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`card flex flex-col gap-3 ${large ? 'border-t-4 border-teal' : ''}`}>
      <div className="flex gap-4 items-start">
        {photo ? (
          <div className={`${large ? 'w-16 h-16 rounded-2xl' : 'w-12 h-12 rounded-xl'} relative flex-shrink-0 overflow-hidden`}>
            <Image src={photo} alt={name} fill className="object-cover" sizes={large ? '64px' : '48px'} />
          </div>
        ) : (
          <div className={`${large ? 'w-16 h-16 rounded-2xl' : 'w-12 h-12 rounded-xl'} ${color} flex items-center justify-center flex-shrink-0`}>
            <span className={`font-outfit font-semibold text-white ${large ? 'text-xl' : 'text-sm'}`}>{initials}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className={`font-outfit font-semibold text-ink mb-0.5 ${large ? 'text-lg' : 'text-sm'}`}>{name}</h3>
          <p className={`font-semibold text-teal mb-1 ${large ? 'text-sm' : 'text-xs'}`}>{role}</p>
          <p className={`font-light text-gray leading-snug ${large ? 'text-sm' : 'text-xs'}`}>{specialty}</p>
        </div>
      </div>

      {bio && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="self-start text-xs font-semibold text-teal hover:underline transition-colors mt-1"
            aria-expanded={expanded}
          >
            {expanded ? 'Ver menos ↑' : 'Ver más →'}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <p className="text-xs font-light text-gray leading-relaxed border-t border-cream pt-3 italic">
              {bio}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
