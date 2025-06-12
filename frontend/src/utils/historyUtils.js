export const loadHistory = () => {
  const stored = localStorage.getItem("summaryHistory");
  return stored ? JSON.parse(stored) : [];
};

export const saveToHistory = (entry) => {
  const stored = loadHistory();
  stored.unshift(entry);
  localStorage.setItem("summaryHistory", JSON.stringify(stored));
};
