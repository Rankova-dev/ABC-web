'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
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
  collegiateNumber?: string;
}

export default function TeamCard({ name, role, specialty, initials, bio, color = 'bg-teal/10', large = false, photo, collegiateNumber }: TeamCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`card flex flex-col gap-3 ${large ? 'border-t-4 border-teal' : ''}`}>
        <div className="flex gap-4 items-start">
          {photo ? (
            <div className={`${large ? 'w-24 h-24 rounded-2xl' : 'w-20 h-20 rounded-xl'} relative flex-shrink-0 overflow-hidden`}>
              <Image src={photo} alt={name} fill className="object-cover object-top" sizes={large ? '96px' : '80px'} />
            </div>
          ) : (
            <div className={`${large ? 'w-24 h-24 rounded-2xl' : 'w-20 h-20 rounded-xl'} ${color} flex items-center justify-center flex-shrink-0`}>
              <span className={`font-outfit font-semibold text-white ${large ? 'text-2xl' : 'text-lg'}`}>{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className={`font-outfit font-semibold text-ink mb-0.5 ${large ? 'text-lg' : 'text-sm'}`}>{name}</h3>
            <p className={`font-semibold text-teal mb-1 ${large ? 'text-sm' : 'text-xs'}`}>{role}</p>
            <p className={`font-light text-gray leading-snug ${large ? 'text-sm' : 'text-xs'}`}>{specialty}</p>
            {collegiateNumber && (
              <p className={`font-light text-gray/70 mt-1 ${large ? 'text-xs' : 'text-[11px]'}`}>Nº Col. {collegiateNumber}</p>
            )}
          </div>
        </div>

        {bio && (
          <button
            onClick={() => setOpen(true)}
            className="self-start text-xs font-semibold text-teal hover:underline transition-colors mt-1"
          >
            Ver más →
          </button>
        )}
      </div>

      {bio && open && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {photo ? (
                <div className="w-full aspect-[3/4] relative">
                  <Image src={photo} alt={name} fill className="object-cover object-top rounded-t-2xl" sizes="512px" />
                </div>
              ) : (
                <div className={`w-full aspect-[3/4] rounded-t-2xl ${color} flex items-center justify-center`}>
                  <span className="font-outfit font-semibold text-white text-5xl">{initials}</span>
                </div>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-ink text-lg shadow"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <h3 className="font-outfit font-semibold text-ink text-xl mb-1">{name}</h3>
              <p className="font-semibold text-teal text-sm mb-1">{role}</p>
              <p className="font-light text-gray text-sm leading-snug">{specialty}</p>
              {collegiateNumber && (
                <p className="font-light text-gray/70 text-xs mt-1 mb-4">Nº Col. {collegiateNumber}</p>
              )}
              <p className={`text-sm font-light text-gray leading-relaxed border-t border-cream pt-4 ${collegiateNumber ? '' : 'mt-4'}`}>
                {bio}
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
