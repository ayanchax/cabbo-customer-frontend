
const useLocalStorage = () => {
  const setItem = (key, value) => {
    try {
      if (typeof value === "object") {
      localStorage.setItem(key, JSON.stringify(value));
      }
      else{
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`useLocalStorage.setItem: failed to set "${key}"`, error);
    }
  };

  const getItem = (key) => {
    try {
      const item = localStorage.getItem(key);
      if (typeof item === "string") {
        return item;
      }
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`useLocalStorage.getItem: failed to get "${key}"`, error);
      return null;
    }
  };

  const removeItem = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`useLocalStorage.removeItem: failed to remove "${key}"`, error);
    }
  };

  

  return { setItem, getItem, removeItem };
};

export { useLocalStorage };