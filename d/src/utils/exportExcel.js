import { parseTime } from "./index";

export function exportExcel(
  dataVal,
  tHeader,
  filterVal,
  filename,
  autoWidth = true,
  bookType = "xlsx"
) {
  import("@/vendor/Export_Excel").then(excel => {
    // const tHeader = ["Id", "Title", "Author", "Readings", "Date"];
    // const filterVal = ["id", "title", "author", "pageviews", "display_time"];
    const data = formatJson(filterVal, dataVal);
    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: parseTime(Date.now(), "{y}-{m}-{d}") + filename,
      autoWidth: autoWidth,
      bookType: bookType
    });
  });
}
function formatJson(filterVal, jsonData) {
  return jsonData.map(v =>
    filterVal.map(j => {
      if (j === "timestamp") {
        return parseTime(v[j]);
      } else {
        return v[j];
      }
    })
  );
}
