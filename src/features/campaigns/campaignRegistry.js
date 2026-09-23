import { lazy } from "react";

const campaignRegistry = {
  "durga-puja-bengaluru-2026": lazy(
    () =>
      import(
        "./adCampaigns/durga-puja-bengaluru-2026/DurgaPujaBengaluru2026"
      ),
  ),
};

export { campaignRegistry };
