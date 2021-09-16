window.onload = () => {
  setCurrentDate();
};

const setCurrentDate = () => {
  const day = new Date().getDay();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  document.getElementById('task-start-date').value = `${day}/${month}/${year}`;
}