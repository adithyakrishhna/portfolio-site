// adapted from https://github.com/withastro/astro.build/blob/112bdc723b3ba305997c95d7ce02304624d0d3ce/src/data/showcase/index.ts

import type { Projects } from "~/types";
import sitesData from "./projects.json";

const allImages = import.meta.glob<ImageMetadata>("./images/*.{png,jpg,jpeg}", {
  eager: true,
  import: "default",
});

let _loadProjects: Promise<Array<Projects>>;

async function loadProjects(): Promise<Array<Projects>> {
  const sites = await Promise.all(
    sitesData.map(async (site) => {
      if (!(site.image in allImages)) {
        console.error(
          `Image for "${site.title}" not found (provided: "${site.image}")`
        );
      }

      const image = await allImages[site.image];

      return {
        ...site,
        image,
      };
    })
  );

  return sites;
}

export async function getProjects() {
  _loadProjects = _loadProjects || loadProjects();
  return _loadProjects;
}
