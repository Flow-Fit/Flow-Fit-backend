// 날짜를 YYYY-MM-DD 형식으로 변환
function formatDateToString(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
  
  // string을 date형식으로 반환
function formatStringToDate(string) {
  return new Date(string);
}

module.exports = { formatDateToString, formatStringToDate };