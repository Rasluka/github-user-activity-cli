interface ActivityResponse {
  id: number;
  type: string;
  repo: {
    name: string;
  };
}

const fetchUserActivity = async (username: string) => {
  const githubUrl = `https://api.github.com/users/${username}/events`;
  console.log(
    `We should be checking this user ${username}`,
    `at::: ${githubUrl}`
  );

  try {
    const res = await fetch(githubUrl);

    if (!res.ok) {
      throw new Error("User not found!");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
};

const reduceByType = (arr: any[]) => {
  return arr.reduce<Record<string, ActivityResponse[]>>(
    (acc, event: ActivityResponse) => {
      const currentType: string = event.type;

      if (!acc[currentType]) {
        acc[currentType] = [];
      }

      acc[currentType].push(event);

      return acc;
    },
    {}
  );
};

const activityCLI = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("No username was given!");
  } else {
    const githubUsername = args[0];
    try {
      const gitActivity = await fetchUserActivity(githubUsername);
      const groupedByType = reduceByType(gitActivity);

      for (const type in groupedByType) {
        const cleanType: string = type.slice(0, type.indexOf("Event"));
        const eventCounter = groupedByType[type].length;

        console.log(`- ${eventCounter} new ${cleanType} events in:`);

        groupedByType[type].forEach((event) => {
          const repoName = event.repo.name.slice(event.repo.name.indexOf("/"));
          console.log(`   ${repoName}`);
        });

        console.log();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error: User not found!");
      } else {
        console.error("An unknown error occurred.");
      }
    }
  }
};

activityCLI();
