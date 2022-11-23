export class GithubUser {
  static search(username) {
    const endppoint = `https://api.github.com/users/${username}`

    return fetch(endppoint)
      .then(data => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers
      }))
  }
}
