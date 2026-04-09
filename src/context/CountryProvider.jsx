import { useEffect, useState } from "react";
import { fetchServerCountry, detectUserCountry } from "@/services";
import { resolveCountry } from "@/utils";
import { CountryContext } from "@/context";


export const CountryProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [serverCountry, setServerCountry] = useState(null);
  const [detectedCountry, setDetectedCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Check cache first
        const cached = localStorage.getItem("cabbo_country_config");
        if (cached) {
          const parsed = JSON.parse(cached);
          setServerCountry(parsed.serverCountry);
          setDetectedCountry(parsed.detectedCountry);
          setSelectedCountry(parsed.selectedCountry);
          setLoading(false);
          return;
        }

        // 2. Fetch fresh
        const server = await fetchServerCountry();
        const detected = await detectUserCountry(); //from browser

        const selected = resolveCountry(server);

        // 3. Cache
        localStorage.setItem(
          "cabbo_country_config",
          JSON.stringify({
            serverCountry: server,// from backend API, will be an object with details like country code, currency etc
            detectedCountry: detected, // from client browser, can be a string like "IN" or an object with more details in future
            selectedCountry: selected, // resolved country object based on server value, used for UI (flag, phone code etc)
          }),
        );

        // 4. Set state
        setServerCountry(server);
        setDetectedCountry(detected);
        setSelectedCountry(selected);
      } catch (err) {
        console.error("Country init failed", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <CountryContext.Provider
      value={{
        loading,
        serverCountry,
        detectedCountry,
        selectedCountry,
        isMismatch:
          serverCountry && detectedCountry && serverCountry !== detectedCountry,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};
