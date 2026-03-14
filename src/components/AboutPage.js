import React from 'react';
import BottomNav from './BottomNav';

const AboutPage = () => (
  <div className="page-content">
    <h2 style={{ fontSize: '1.4rem', marginBottom: '.25rem' }}>✦ À propos</h2>
    <p className="text-tiny" style={{ marginBottom: '1.5rem' }}>Bible Duo — L'histoire du projet</p>

    <div className="card" style={{ marginBottom: '1rem', background: 'rgba(201,168,76,.06)', borderColor: 'rgba(201,168,76,.2)' }}>
      <p style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)', fontSize: '.95rem', lineHeight: 1.6, margin: 0 }}>
        L'idée de Bible Duo est née d'une réflexion simple.
      </p>
    </div>

    {[
      "Beaucoup de personnes lisent la Bible, mais peu arrivent réellement à retenir les passages, à comprendre les liens entre les textes, ou à se souvenir des contextes. Ce n'est pas un problème d'intérêt, c'est souvent simplement une question de méthode.",
      "En parallèle, on sait que le jeu est un formidable outil d'apprentissage. Quand on joue, le cerveau s'implique différemment : on réfléchit, on teste, on fait des erreurs, on recommence… et surtout, on retient.",
      "C'est en partant de cette idée qu'est né Bible Duo.",
      "L'objectif n'était pas de créer un simple quiz biblique, mais de construire une expérience ludique et intelligente qui permette d'explorer les textes autrement. Des jeux de mémoire, des défis de réflexion, des énigmes autour des versets… chaque mécanisme est pensé pour aider à mieux comprendre et à mieux retenir.",
      "Le projet est développé de manière indépendante, étape par étape. Chaque nouvelle fonctionnalité, chaque nouveau jeu, est le résultat d'expérimentations, d'essais et parfois de quelques bugs inévitables. Mais c'est aussi ce qui rend le projet vivant.",
      "Bible Duo est encore en évolution. C'est pourquoi les retours des utilisateurs sont précieux : ils permettent d'améliorer l'application, d'ajouter de nouvelles idées et de construire une expérience toujours plus enrichissante.",
      "Si vous testez l'application et que vous souhaitez partager vos impressions, proposer des idées ou simplement suivre l'évolution du projet, vous êtes les bienvenus.",
    ].map((paragraph, i) => (
      <p key={i} style={{
        color: 'var(--gray-300)', fontSize: '.9rem', lineHeight: 1.75,
        marginBottom: '1rem',
        fontStyle: i === 2 ? 'italic' : 'normal',
        color: i === 2 ? 'var(--parch)' : 'var(--gray-300)',
      }}>
        {paragraph}
      </p>
    ))}

    <div style={{
      borderTop: '1px solid rgba(201,168,76,.2)',
      borderBottom: '1px solid rgba(201,168,76,.2)',
      padding: '1.25rem 0',
      margin: '1rem 0 1.5rem',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'var(--font-display)', color: 'var(--parch)',
        fontSize: '1rem', lineHeight: 1.8, margin: '0 0 .5rem',
      }}>
        Parce qu'un projet comme celui-ci ne se construit jamais seul.
      </p>
      <p style={{
        color: 'var(--gray-400)', fontSize: '.88rem', lineHeight: 1.7, margin: 0,
      }}>
        Il grandit grâce à celles et ceux qui prennent le temps de l'essayer,
        de le questionner… et de le faire vivre.
      </p>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '.5rem' }}>
      <a
        href="https://forms.gle/PLQSfC26NsA3Gn6d9"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
          background: 'rgba(30,58,95,.2)', border: '1px solid rgba(30,58,95,.4)',
          borderRadius: 10, padding: '.6rem 1rem', color: 'rgba(253,246,227,.6)',
          textDecoration: 'none', fontSize: '.85rem', fontFamily: 'var(--font-display)', fontWeight: 700,
        }}
      >
        💬 Partager mes impressions
      </a>
      <a
        href="https://ko-fi.com/liabalagnaranin"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
          background: 'rgba(255,94,91,.1)', border: '1px solid rgba(255,94,91,.25)',
          borderRadius: 10, padding: '.6rem 1rem', color: '#ff8a87',
          textDecoration: 'none', fontSize: '.85rem', fontFamily: 'var(--font-display)', fontWeight: 700,
        }}
      >
        ☕ Soutenir le projet
      </a>
    </div>

    <BottomNav />
  </div>
);

export default AboutPage;
