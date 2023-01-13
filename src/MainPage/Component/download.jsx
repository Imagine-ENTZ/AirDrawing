export function download(dataURL, filename) {
  const a = document.createElement("a");
  a.href = dataURL;
  a.setAttribute("download", filename);
  a.click();
}
