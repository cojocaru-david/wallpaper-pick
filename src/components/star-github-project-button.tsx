"use client";
import { useEffect, useState } from "react";
import { GithubStarsButton } from "./ui/github-stars";

export default function StarGithubProjectButton() {
  const [numberOfStars, setNumberOfStars] = useState<number>(0);

  useEffect(() => {
    const apiGithub = "https://api.github.com/repos/cojocaru-david/wallpaper-pick";
    fetch(apiGithub)
      .then((res) => res.json())
      .then((data) => setNumberOfStars(data.stargazers_count ?? 0));
  }, []);

  return (
    <GithubStarsButton
      className="inline-flex h-fit"
      href="https://github.com/cojocaru-david/wallpaper-pick"
      title="Star Wallpaper Pick on GitHub"
      starNumber={numberOfStars}
    >
      Stars on GitHub
    </GithubStarsButton>
  );
}