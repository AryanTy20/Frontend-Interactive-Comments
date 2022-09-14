export const useLocalStorage = () => {
  const getStorage = () => {
    const data = localStorage.getItem("data");
    return JSON.parse(data);
  };
  const setStorage = (data) => {
    localStorage.setItem("data", JSON.stringify(data));
  };
  return [getStorage, setStorage];
};
