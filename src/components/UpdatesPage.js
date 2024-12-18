import React from 'react';
import { Link } from 'react-router-dom';
import './UpdatesPage.css';

const UpdatesPage = () => {
  return (
    <div className="updates-container">
      <h2>Historique des Mises à Jour</h2>
      <ul>
        <li>✨ Ajout de la configuration initiale (nombre de questions, timer, catégorie).</li>
        <li>🔀 Possibilité de choisir entre "Questions", "Devinettes" ou "Mixte".</li>
        <li>⏱ Ajout du timer optionnel avec durée configurable par question.</li>
        <li>✅ Gestion des réponses vides : message "Veuillez choisir au moins une réponse".</li>
        <li>⏭ Ajout du bouton "Passer" pour sauter une question sans la compter.</li>
        <li>🎯 Amélioration de l'interface utilisateur avec des boutons stylisés.</li>
        <li>🛠 Organisation du code pour plus de clarté et modularité.</li>
        <li>📋 Mise à jour de la questionBank avec des devinettes supplémentaires</li>
        <li>🔄 Révision de l'affichage du quiz pour revenir à la version initiale</li>
        <li>❌ Ajout d'un bouton quitter</li>
      </ul>
      <Link to="/" className="back-button">Retour au Quiz</Link>
    </div>
  );
};

export default UpdatesPage;
