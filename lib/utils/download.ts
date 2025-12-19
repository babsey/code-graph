// download.ts

import moment from "moment";

const filenamePrefix = "code-graph";

/*
 * Download data.
 */
export const download = (data: string, filename: string = "", format: string = "json"): void => {
  const element: HTMLAnchorElement = document.createElement("a");
  element.setAttribute("href", `data:text/${format};charset=UTF-8,${encodeURIComponent(data)}`);
  const now = moment().format("YYMMDD_HHMMSS");
  element.setAttribute("download", `${filenamePrefix}_${now}_${filename}.${format}`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/*
 * Upload data.
 */
export const upload = (format: string = "json"): HTMLInputElement => {
  const fileElem: HTMLInputElement = document.createElement("input");
  fileElem.setAttribute("type", "file");
  fileElem.setAttribute("id", "fileElem");
  fileElem.setAttribute("multiple", "true");
  fileElem.setAttribute("accept", `${format}/*`);
  fileElem.style.display = "none";
  document.body.appendChild(fileElem);
  fileElem.click();
  return fileElem;
};
