const args = process.argv.slice(2);

const fetchUserActivity = async (username: string) => {
  const githubUrl = `https://api.github.com/users/${username}/events`;
  console.log(
    `We should be checking this user ${username}`,
    `at::: ${githubUrl}`
  );

  try {
    const res = await fetch(githubUrl);

    if (!res.ok) {
      throw new Error("Could not fetch user activity!");
    }

    const data = await res.json();

    console.log("-------------------------------------------");
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

if (args.length === 0) {
  console.error("No username was given!");
} else {
  const githubUsername = args[0];
  fetchUserActivity(githubUsername);
}
