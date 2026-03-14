import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

// Props :
//   onDone  : callback après sauvegarde
//   isEdit  : true = mode modification (profil existant) — affichage rassurant
const ProfileSetup = ({ onDone, isEdit = false }) => {
  const { saveProfile, profile, AVATARS } = useGame();
  const [name,   setName]   = useState(isEdit ? profile.name   : '');
  const [avatar, setAvatar] = useState(isEdit ? profile.avatar : '📖');

  const save = () => {
    saveProfile(name || profile.name, avatar);
    onDone?.();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,7,3,.95)', backdropFilter: 'blur(12px)',
      zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '.5rem' }}>{avatar}</div>
          {isEdit ? (
            <>
              <h2>Modifier ton profil</h2>
              <p className="text-small mt-1" style={{ color: 'var(--sage-light)' }}>
                ✅ Ta progression est conservée
              </p>
            </>
          ) : (
            <>
              <h2>Créer ton profil</h2>
              <p className="text-small mt-1">Pour sauvegarder ta progression</p>
            </>
          )}
        </div>

        {/* Nom */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="text-small" style={{ display: 'block', marginBottom: '.4rem' }}>
            {isEdit ? 'Nouveau pseudo' : 'Ton prénom ou pseudo'}
          </label>
          <input
            className="game-input"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            placeholder={isEdit ? profile.name : 'Ex: Samuel, Marie, Disciple42…'}
            maxLength={24}
            autoFocus
          />
        </div>

        {/* Avatar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="text-small" style={{ marginBottom: '.5rem' }}>Choisis ton avatar</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '.4rem' }}>
            {AVATARS.map(av => (
              <button key={av} onClick={() => setAvatar(av)} style={{
                fontSize: '1.5rem', padding: '.5rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: avatar === av ? 'rgba(201,168,76,.25)' : 'rgba(255,255,255,.05)',
                outline: avatar === av ? '2px solid var(--gold)' : 'none',
                transition: 'all .15s',
              }}>{av}</button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary w-full"
          style={{ padding: '1rem', fontSize: '1.1rem' }}
          onClick={save}
          disabled={!isEdit && !name.trim()}
        >
          {isEdit ? '💾 Enregistrer les modifications' : 'C\'est parti ! 🚀'}
        </button>

        {isEdit ? (
          <button className="btn btn-ghost w-full" style={{ marginTop: '.5rem', fontSize: '.85rem' }} onClick={onDone}>
            Annuler
          </button>
        ) : (
          <button className="btn btn-ghost w-full" style={{ marginTop: '.5rem', fontSize: '.85rem' }} onClick={onDone}>
            Continuer sans profil
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;
