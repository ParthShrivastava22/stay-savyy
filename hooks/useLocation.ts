import { Country, State, City } from "country-state-city";

const useLocation = () => {
  const getCountryByCode = (countryCode: string) => {
    return Country.getAllCountries().find(
      (country) => country.isoCode === countryCode
    );
  };

  const getStateByCode = (stateCode: string) => {
    return State.getAllStates().find((state) => state.isoCode === stateCode);
  };

  const getCountryStates = (countryCode: string) => {
    return State.getAllStates().filter(
      (state) => state.countryCode === countryCode
    );
  };

  const getStateCities = (countryCode: string, stateCode: string) => {
    return City.getAllCities().filter(
      (city) => city.countryCode === countryCode && city.stateCode === stateCode
    );
  };

  return {
    getAllCountries: Country.getAllCountries,
    getCountryByCode,
    getCountryStates,
    getStateByCode,
    getStateCities,
  };
};

export default useLocation;
