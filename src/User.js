class User {
  constructor(username) {
    this.username = username;
    this.xp = 0; // Les points d'expérience commencent à 0
  }

  addXP(points) {
    this.xp += points; // Ajouter des points d'expérience
    console.log(`${this.username} a maintenant ${this.xp} points d'expérience !`);
  }

  displayXP() {
    return `${this.username} a ${this.xp} points d'expérience.`;
  }
}

export default User;
